import { NextRequest, NextResponse } from "next/server";
import { DbEnquiry, EnquiryMessage } from "@/types/admin";
import { isFirebaseConfigured, firestoreDb } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const fromEmail = (body.from || body.sender || "").trim().toLowerCase();
    const fromName = (body.fromName || body.senderName || fromEmail).trim();
    const subject = (body.subject || "").trim();
    const message = (body.text || body.message || body.body || "").trim();
    let enquiryId = (body.enquiryId || "").trim();

    // If enquiryId not explicitly provided, try to extract from subject: e.g. [PYM-123456]
    if (!enquiryId && subject) {
      const match = subject.match(/\[(PYM-\d+)\]/i) || subject.match(/(PYM-\d+)/i);
      if (match) {
        enquiryId = match[1].toUpperCase();
      }
    }

    if (!enquiryId) {
      return NextResponse.json(
        { success: false, error: "Could not identify enquiry ID in incoming message subject or payload." },
        { status: 400 }
      );
    }

    if (!message) {
      return NextResponse.json({ success: false, error: "Empty message body." }, { status: 400 });
    }

    const now = new Date().toISOString();
    const incomingMessage: EnquiryMessage = {
      id: "msg-" + Date.now(),
      enquiry_id: enquiryId,
      sender: "CUSTOMER",
      sender_name: fromName,
      sender_email: fromEmail,
      message,
      timestamp: now,
      delivery_status: "DELIVERED",
    };

    if (isFirebaseConfigured && firestoreDb) {
      const snap = await getDoc(doc(firestoreDb, "enquiries", enquiryId));
      if (snap.exists()) {
        const existing = snap.data() as DbEnquiry;
        const updatedConversation = [...(existing.conversation || []), incomingMessage];
        await setDoc(
          doc(firestoreDb, "enquiries", enquiryId),
          {
            conversation: updatedConversation,
            unread_by_admin: true,
            status: existing.status === "CLOSED" ? "IN_PROGRESS" : existing.status,
            updated_at: now,
          },
          { merge: true }
        );
      }
    }

    return NextResponse.json({
      success: true,
      message: `Incoming reply successfully attached to enquiry ${enquiryId}.`,
      enquiryId,
    });
  } catch (err: any) {
    console.error("Incoming reply webhook error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to process incoming reply." },
      { status: 500 }
    );
  }
}
