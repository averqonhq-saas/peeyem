import { NextRequest, NextResponse } from "next/server";
import { DbEnquiry, EnquiryMessage, EnquiryStatus } from "@/types/admin";
import { sendAdminReplyToCustomer } from "@/lib/email";
import { isFirebaseConfigured, firestoreDb } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const enquiryId = (body.enquiryId || "").trim();
    const replyMessage = (body.replyMessage || body.message || "").trim();
    const isInternal = Boolean(body.isInternal || body.isInternalNote);
    const newStatus: EnquiryStatus | undefined = body.newStatus;
    const adminName = (body.adminName || "Peeyem Traders Operations").trim();

    if (!enquiryId) {
      return NextResponse.json({ success: false, error: "Missing enquiry ID." }, { status: 400 });
    }
    if (!replyMessage || replyMessage.length < 2) {
      return NextResponse.json({ success: false, error: "Please enter a message or note." }, { status: 400 });
    }

    const now = new Date().toISOString();
    let enquiry: DbEnquiry | null = null;

    // 1. Fetch current enquiry from Firestore if available
    if (isFirebaseConfigured && firestoreDb) {
      try {
        const snap = await getDoc(doc(firestoreDb, "enquiries", enquiryId));
        if (snap.exists()) {
          enquiry = { id: snap.id, ...snap.data() } as DbEnquiry;
        }
      } catch (err) {
        console.warn("Firestore fetch enquiry error in reply route:", err);
      }
    }

    // Fallback object if not in Firestore (e.g. client storage mode)
    if (!enquiry) {
      enquiry = {
        id: enquiryId,
        name: body.customerName || "Valued Customer",
        email: body.customerEmail || "",
        phone: body.customerPhone || "",
        subject: body.subject || "Industrial Product Quotation",
        message: body.originalMessage || "",
        status: newStatus || "CONTACTED",
        created_at: now,
        updated_at: now,
      };
    }

    let emailDeliveryStatus: "SENT" | "FAILED" | "PENDING" | undefined = undefined;
    let emailMessageId: string | undefined = undefined;
    let emailError: string | undefined = undefined;

    // 2. If it is NOT an internal note, send the email reply to the customer
    if (!isInternal) {
      if (!enquiry.email) {
        return NextResponse.json(
          { success: false, error: "Cannot send email reply: customer email address is missing." },
          { status: 400 }
        );
      }

      const emailResult = await sendAdminReplyToCustomer({
        enquiry,
        replyMessage,
        adminName,
      });

      if (emailResult.success) {
        emailDeliveryStatus = "SENT";
        emailMessageId = emailResult.messageId;
      } else {
        emailDeliveryStatus = "FAILED";
        emailError = emailResult.error;
      }
    }

    // 3. Construct the message item
    const newMessage: EnquiryMessage = {
      id: "msg-" + Date.now(),
      enquiry_id: enquiryId,
      sender: "ADMIN",
      sender_name: adminName,
      sender_email: process.env.ADMIN_EMAIL || "peeyemtraders16@gmail.com",
      message: replyMessage,
      is_internal: isInternal,
      timestamp: now,
      delivery_status: isInternal ? undefined : emailDeliveryStatus,
      email_message_id: emailMessageId,
      error_message: emailError,
    };

    // 4. Update Firestore if configured
    if (isFirebaseConfigured && firestoreDb) {
      try {
        const updatedConversation = [...(enquiry.conversation || []), newMessage];
        const updates: Partial<DbEnquiry> = {
          conversation: updatedConversation,
          updated_at: now,
          last_reply_at: now,
        };
        if (newStatus) {
          updates.status = newStatus;
        } else if (!isInternal && enquiry.status === "NEW") {
          updates.status = "CONTACTED";
        }
        await setDoc(doc(firestoreDb, "enquiries", enquiryId), updates, { merge: true });
      } catch (dbErr) {
        console.warn("Firestore update enquiry error in reply route:", dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: isInternal
        ? "Internal note saved successfully."
        : emailDeliveryStatus === "SENT"
        ? "Reply emailed to customer successfully."
        : "Reply recorded, but customer email sending reported an issue.",
      newMessage,
      emailSent: !isInternal && emailDeliveryStatus === "SENT",
      emailDeliveryStatus,
      error: emailError,
    });
  } catch (error: any) {
    console.error("Admin reply API unexpected error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to process reply." },
      { status: 500 }
    );
  }
}
