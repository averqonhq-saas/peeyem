import { NextRequest, NextResponse } from "next/server";
import { DbEnquiry, EnquiryMessage } from "@/types/admin";
import { sendAdminEnquiryNotification, sendCustomerConfirmation } from "@/lib/email";
import { isFirebaseConfigured, firestoreDb } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";

// Simple in-memory rate limiting: 5 requests per IP per 10 minutes
const rateLimitMap = new Map<string, { count: number; firstRequestTime: number }>();
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 5;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  if (!record) {
    rateLimitMap.set(ip, { count: 1, firstRequestTime: now });
    return true;
  }
  if (now - record.firstRequestTime > RATE_LIMIT_WINDOW_MS) {
    rateLimitMap.set(ip, { count: 1, firstRequestTime: now });
    return true;
  }
  if (record.count >= MAX_REQUESTS) {
    return false;
  }
  record.count += 1;
  return true;
}

export async function POST(req: NextRequest) {
  try {
    // 1. Rate Limiting Check
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "anonymous";
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        {
          success: false,
          error: "Too many enquiries submitted from this IP. Please wait a few minutes or call us directly.",
        },
        { status: 429 }
      );
    }

    // 2. Parse & Sanitize Request Body
    const body = await req.json();
    const name = (body.name || "").trim();
    const email = (body.email || "").trim().toLowerCase();
    const phone = (body.phone || "").trim();
    const company = (body.company || "").trim();
    const subject = (body.subject || "Industrial Conveyor Product Inquiry").trim();
    const message = (body.message || "").trim();
    const source = (body.source || "Website Contact Form").trim();

    // 3. Validation
    if (!name || name.length < 2) {
      return NextResponse.json({ success: false, error: "Please enter your full name." }, { status: 400 });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json({ success: false, error: "Please provide a valid email address." }, { status: 400 });
    }
    if (!phone || phone.replace(/[^0-9]/g, "").length < 7) {
      return NextResponse.json({ success: false, error: "Please provide a valid contact phone number." }, { status: 400 });
    }
    if (!message || message.length < 5) {
      return NextResponse.json({ success: false, error: "Please enter your enquiry requirements or message." }, { status: 400 });
    }

    // 4. Generate Unique Enquiry ID (Format: PYM-XXXXXX)
    const randomDigits = Math.floor(100000 + Math.random() * 900000);
    const enquiryId = `PYM-${randomDigits}`;
    const now = new Date().toISOString();

    const initialMessage: EnquiryMessage = {
      id: "msg-" + Date.now(),
      enquiry_id: enquiryId,
      sender: "CUSTOMER",
      sender_name: name,
      sender_email: email,
      message,
      timestamp: now,
      delivery_status: "DELIVERED",
    };

    const newEnquiry: DbEnquiry = {
      id: enquiryId,
      name,
      email,
      phone,
      company: company || undefined,
      subject,
      message,
      source,
      status: "NEW",
      conversation: [initialMessage],
      unread_by_admin: true,
      created_at: now,
      updated_at: now,
      email_delivery_status: "PENDING",
    };

    // 5. Save to Firestore if configured
    if (isFirebaseConfigured && firestoreDb) {
      try {
        await setDoc(doc(firestoreDb, "enquiries", enquiryId), newEnquiry);
      } catch (dbErr) {
        console.warn("Firestore save warning in submit API:", dbErr);
      }
    }

    // 6. Send Transactional Emails Asynchronously
    // Note: Per user requirement, email failure does NOT break the submission
    let emailStatus: "SENT" | "FAILED" = "SENT";
    try {
      const baseUrl = req.nextUrl.origin || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

      const [adminResult, customerResult] = await Promise.allSettled([
        sendAdminEnquiryNotification({ enquiry: newEnquiry, baseUrl }),
        sendCustomerConfirmation({ enquiry: newEnquiry }),
      ]);

      if (adminResult.status === "rejected" || (adminResult.status === "fulfilled" && !adminResult.value.success)) {
        console.error("Admin notification failure:", adminResult);
        emailStatus = "FAILED";
      }
      if (customerResult.status === "rejected" || (customerResult.status === "fulfilled" && !customerResult.value.success)) {
        console.error("Customer confirmation failure:", customerResult);
      }
    } catch (mailErr) {
      console.error("Transactional mail error during enquiry submission:", mailErr);
      emailStatus = "FAILED";
    }

    newEnquiry.email_delivery_status = emailStatus;

    // Update delivery status in Firestore if needed
    if (isFirebaseConfigured && firestoreDb && emailStatus === "SENT") {
      try {
        await setDoc(doc(firestoreDb, "enquiries", enquiryId), { email_delivery_status: "SENT" }, { merge: true });
      } catch (e) {
        // ignore
      }
    }

    return NextResponse.json({
      success: true,
      enquiryId,
      enquiry: newEnquiry,
      message: "Enquiry submitted successfully. A confirmation email has been sent to your inbox.",
    });
  } catch (error: any) {
    console.error("Enquiry submission unexpected error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "An unexpected error occurred while processing your enquiry. Please try again.",
      },
      { status: 500 }
    );
  }
}
