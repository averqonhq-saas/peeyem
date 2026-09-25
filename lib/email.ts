import nodemailer from "nodemailer";
import { DbEnquiry, EnquiryMessage } from "@/types/admin";
import { COMPANY_INFO } from "@/data/products";

// Initialize reusable nodemailer transport
function getMailTransporter() {
  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = parseInt(process.env.SMTP_PORT || "465", 10);
  const secure = process.env.SMTP_SECURE === "true" || port === 465;
  const user = process.env.SMTP_USER || "peeyemtraders16@gmail.com";
  const pass = (process.env.SMTP_PASS || "nadtivcpwikvqoja").replace(/\s+/g, "");

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
  });
}

const FROM_SENDER = `"Peeyem Traders" <${process.env.SMTP_USER || "peeyemtraders16@gmail.com"}>`;
const ADMIN_RECIPIENT = process.env.ADMIN_EMAIL || "peeyemtraders16@gmail.com";

// Verify SMTP connection
export async function testEmailConnection(): Promise<{ success: boolean; message: string }> {
  try {
    const transporter = getMailTransporter();
    await transporter.verify();
    return { success: true, message: "SMTP connection verified successfully." };
  } catch (err: any) {
    console.error("SMTP verify error:", err);
    return { success: false, message: err.message || "Failed to verify SMTP connection." };
  }
}

/**
 * 1. ADMIN NOTIFICATION EMAIL
 * Sent immediately to Peeyem Traders admin when a new customer enquiry is submitted
 */
export async function sendAdminEnquiryNotification(params: {
  enquiry: DbEnquiry;
  baseUrl?: string;
}): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const { enquiry } = params;
  const baseUrl = params.baseUrl || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const adminUrl = `${baseUrl}/admin/enquiries?id=${enquiry.id}`;

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>New Industrial Enquiry - ${enquiry.id}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f1f5f9; margin: 0; padding: 24px; color: #1e293b; }
    .container { max-width: 620px; margin: 0 auto; background: #ffffff; border-radius: 14px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 12px rgba(0,0,0,0.06); }
    .header { background: linear-gradient(135deg, #0e1720 0%, #1e293b 100%); padding: 28px 32px; border-bottom: 3px solid #ff8d28; color: #ffffff; }
    .brand { font-size: 13px; font-weight: 800; letter-spacing: 1.5px; text-transform: uppercase; color: #ff8d28; }
    .title { font-size: 22px; font-weight: 800; margin: 6px 0 0 0; color: #ffffff; }
    .badge { display: inline-block; background: #ff8d28; color: #0a0f14; font-size: 11px; font-weight: 800; padding: 3px 8px; border-radius: 4px; margin-top: 8px; font-family: monospace; }
    .content { padding: 32px; }
    .meta-table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
    .meta-table td { padding: 10px 12px; border-bottom: 1px solid #f1f5f9; font-size: 14px; }
    .meta-table td.label { font-weight: 700; color: #64748b; width: 35%; text-transform: uppercase; font-size: 11px; letter-spacing: 0.5px; }
    .meta-table td.value { font-weight: 600; color: #0f172a; }
    .message-box { background: #f8fafc; border: 1px solid #e2e8f0; border-left: 4px solid #ff8d28; border-radius: 8px; padding: 18px 20px; font-size: 14px; line-height: 1.6; color: #334155; white-space: pre-wrap; margin-bottom: 28px; }
    .cta-row { text-align: center; margin: 30px 0 20px 0; }
    .btn { display: inline-block; background: #ff8d28; color: #0f172a !important; font-weight: 800; font-size: 14px; text-decoration: none; padding: 14px 28px; border-radius: 8px; box-shadow: 0 4px 10px rgba(255,141,40,0.3); }
    .footer { background: #f8fafc; padding: 20px 32px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="brand">Peeyem Traders Coimbatore</div>
      <div class="title">New Customer Enquiry Received</div>
      <div class="badge">ENQUIRY ID: ${enquiry.id}</div>
    </div>
    <div class="content">
      <p style="font-size: 15px; margin-top: 0; color: #334155;">
        A new customer enquiry has been submitted through the Peeyem Traders website.
      </p>

      <table class="meta-table">
        <tr>
          <td class="label">Customer Name</td>
          <td class="value">${escapeHtml(enquiry.name)}</td>
        </tr>
        <tr>
          <td class="label">Phone / WhatsApp</td>
          <td class="value"><a href="tel:${enquiry.phone}" style="color: #0f172a; text-decoration: none; font-weight: 700;">${escapeHtml(enquiry.phone)}</a> (<a href="https://wa.me/${enquiry.phone.replace(/[^0-9]/g, "")}" style="color: #10b981; font-weight: 600;">WhatsApp</a>)</td>
        </tr>
        <tr>
          <td class="label">Email Address</td>
          <td class="value"><a href="mailto:${enquiry.email}" style="color: #0284c7;">${escapeHtml(enquiry.email)}</a></td>
        </tr>
        <tr>
          <td class="label">Company / Plant</td>
          <td class="value">${escapeHtml(enquiry.company || "Not Specified")}</td>
        </tr>
        <tr>
          <td class="label">Subject / Product</td>
          <td class="value">${escapeHtml(enquiry.subject || "General Industrial Inquiry")}</td>
        </tr>
        <tr>
          <td class="label">Lead Source</td>
          <td class="value">${escapeHtml(enquiry.source || "Website Form")}</td>
        </tr>
        <tr>
          <td class="label">Date &amp; Time</td>
          <td class="value">${new Date(enquiry.created_at).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST</td>
        </tr>
      </table>

      <div style="font-weight: 700; font-size: 12px; text-transform: uppercase; color: #64748b; margin-bottom: 8px; letter-spacing: 0.5px;">Customer Message:</div>
      <div class="message-box">${escapeHtml(enquiry.message)}</div>

      <div class="cta-row">
        <a href="${adminUrl}" class="btn">View &amp; Reply in Admin Panel →</a>
      </div>
    </div>
    <div class="footer">
      This is an automated operational notification generated by Peeyem Traders Portal.<br>
      Depot: 16, M.M.A. Market, South Ukkadam, Coimbatore, Tamil Nadu – 641001.
    </div>
  </div>
</body>
</html>
  `;

  try {
    const transporter = getMailTransporter();
    const info = await transporter.sendMail({
      from: FROM_SENDER,
      to: ADMIN_RECIPIENT,
      replyTo: `"${enquiry.name}" <${enquiry.email}>`,
      subject: `[New Enquiry ${enquiry.id}] ${enquiry.subject || "Customer Inquiry"} - ${enquiry.name}`,
      html,
    });
    return { success: true, messageId: info.messageId };
  } catch (err: any) {
    console.error("sendAdminEnquiryNotification failed:", err);
    return { success: false, error: err.message || "Failed to send admin email notification." };
  }
}

/**
 * 2. CUSTOMER CONFIRMATION EMAIL
 * Sent immediately to the customer confirming their enquiry was received
 */
export async function sendCustomerConfirmation(params: {
  enquiry: DbEnquiry;
}): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const { enquiry } = params;

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Thank you for contacting Peeyem Traders</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #1e293b; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 14px; overflow: hidden; border: 1px solid #e2e8f0; }
    .header { background: #0e1720; padding: 28px 32px; border-bottom: 3px solid #ff8d28; color: #ffffff; }
    .brand { font-size: 13px; font-weight: 800; letter-spacing: 1.5px; text-transform: uppercase; color: #ff8d28; }
    .title { font-size: 20px; font-weight: 800; margin: 6px 0 0 0; color: #ffffff; }
    .content { padding: 32px; font-size: 14px; line-height: 1.6; color: #334155; }
    .enquiry-badge { background: #f1f5f9; border: 1px dashed #cbd5e1; border-radius: 8px; padding: 12px 16px; margin: 20px 0; font-family: monospace; font-size: 13px; color: #0f172a; }
    .summary-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 18px 0; }
    .contact-card { background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 10px; padding: 18px 20px; margin-top: 24px; color: #1e3a8a; }
    .footer { background: #f8fafc; padding: 20px 32px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="brand">Peeyem Traders</div>
      <div class="title">We Received Your Industrial Enquiry</div>
    </div>
    <div class="content">
      <p style="margin-top: 0;">Dear <strong>${escapeHtml(enquiry.name)}</strong>,</p>

      <p>
        Thank you for reaching out to <strong>Peeyem Traders</strong>. We have received your technical inquiry and our industrial material handling specialist is reviewing your specifications.
      </p>

      <div class="enquiry-badge">
        <strong>Reference ID:</strong> ${enquiry.id}<br>
        <strong>Subject:</strong> ${escapeHtml(enquiry.subject || "Industrial Product Quotation")}
      </div>

      <div class="summary-card">
        <div style="font-weight: 700; font-size: 12px; text-transform: uppercase; color: #64748b; margin-bottom: 6px;">Your Submitted Message:</div>
        <div style="color: #475569; font-size: 13px; white-space: pre-wrap;">${escapeHtml(enquiry.message)}</div>
      </div>

      <p>
        Our technical team will provide you with pricing, grade availability, and delivery lead times within <strong>2 to 4 business hours</strong>.
      </p>

      <div class="contact-card">
        <div style="font-weight: 800; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px;">Need Urgent Assistance?</div>
        <div>Direct Call / WhatsApp: <strong><a href="tel:${COMPANY_INFO.phoneRaw}" style="color: #1e3a8a; text-decoration: none;">${COMPANY_INFO.phone}</a></strong></div>
        <div>Email: <a href="mailto:${COMPANY_INFO.email}" style="color: #1e3a8a;">${COMPANY_INFO.email}</a></div>
        <div style="font-size: 12px; margin-top: 6px; color: #3b82f6;">Warehouse: 16, M.M.A. Market, South Ukkadam, Coimbatore, Tamil Nadu – 641001</div>
      </div>
    </div>
    <div class="footer">
      © Peeyem Traders. All Rights Reserved.<br>
      High-Tensile Conveyor Belts • Chevron Belts • Rubber Sheeting • Fasteners
    </div>
  </div>
</body>
</html>
  `;

  try {
    const transporter = getMailTransporter();
    const info = await transporter.sendMail({
      from: FROM_SENDER,
      to: enquiry.email,
      replyTo: ADMIN_RECIPIENT,
      subject: `Enquiry Received [Ref: ${enquiry.id}] - Peeyem Traders Coimbatore`,
      html,
    });
    return { success: true, messageId: info.messageId };
  } catch (err: any) {
    console.error("sendCustomerConfirmation failed:", err);
    return { success: false, error: err.message || "Failed to send customer confirmation email." };
  }
}

/**
 * 3. ADMIN REPLY TO CUSTOMER
 * Sent when admin replies to an enquiry from inside the Admin Panel
 */
export async function sendAdminReplyToCustomer(params: {
  enquiry: DbEnquiry;
  replyMessage: string;
  adminName?: string;
}): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const { enquiry, replyMessage } = params;
  const adminName = params.adminName || "Peeyem Traders Support";

  const threadSubject = enquiry.subject?.startsWith("Re:")
    ? enquiry.subject
    : `Re: [${enquiry.id}] ${enquiry.subject || "Industrial Product Enquiry"}`;

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>${escapeHtml(threadSubject)}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #1e293b; }
    .container { max-width: 620px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; }
    .header { background: #0e1720; padding: 24px 30px; border-bottom: 3px solid #ff8d28; color: #ffffff; }
    .brand { font-size: 13px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase; color: #ff8d28; }
    .title { font-size: 18px; font-weight: 700; margin: 4px 0 0 0; color: #ffffff; }
    .content { padding: 30px; font-size: 15px; line-height: 1.6; color: #1e293b; }
    .reply-body { font-size: 15px; line-height: 1.7; color: #0f172a; white-space: pre-wrap; margin-bottom: 28px; }
    .original-thread { background: #f8fafc; border-left: 3px solid #cbd5e1; padding: 14px 18px; font-size: 12px; color: #64748b; margin-top: 24px; border-radius: 0 6px 6px 0; }
    .sig { border-top: 1px solid #e2e8f0; padding-top: 18px; margin-top: 24px; font-size: 13px; color: #475569; }
    .footer { background: #f8fafc; padding: 18px 30px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="brand">Peeyem Traders</div>
      <div class="title">${escapeHtml(threadSubject)}</div>
    </div>
    <div class="content">
      <p style="margin-top: 0;">Dear <strong>${escapeHtml(enquiry.name)}</strong>,</p>

      <div class="reply-body">${escapeHtml(replyMessage)}</div>

      <div class="sig">
        <strong>Warm regards,</strong><br>
        <strong>${escapeHtml(adminName)}</strong><br>
        Peeyem Traders — Industrial Conveyor &amp; Rubber Solutions<br>
        Phone: <a href="tel:${COMPANY_INFO.phoneRaw}" style="color: #0284c7; text-decoration: none;">${COMPANY_INFO.phone}</a> | 
        WhatsApp: <a href="https://wa.me/${COMPANY_INFO.phoneRaw.replace(/[^0-9]/g, "")}" style="color: #10b981; text-decoration: none;">+91 93633 10787</a><br>
        Email: <a href="mailto:${COMPANY_INFO.email}" style="color: #0284c7;">${COMPANY_INFO.email}</a><br>
        16, M.M.A. Market, South Ukkadam, Coimbatore, Tamil Nadu – 641001
      </div>

      <div class="original-thread">
        <div style="font-weight: 700; margin-bottom: 4px;">--- Original Enquiry (${enquiry.id}) ---</div>
        <div><strong>Date:</strong> ${new Date(enquiry.created_at).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST</div>
        <div><strong>Subject:</strong> ${escapeHtml(enquiry.subject || "Industrial Product Enquiry")}</div>
        <div style="margin-top: 6px; white-space: pre-wrap;">${escapeHtml(enquiry.message)}</div>
      </div>
    </div>
    <div class="footer">
      You can reply directly to this email to continue the conversation with our technical team.
    </div>
  </div>
</body>
</html>
  `;

  try {
    const transporter = getMailTransporter();
    const info = await transporter.sendMail({
      from: FROM_SENDER,
      to: enquiry.email,
      replyTo: ADMIN_RECIPIENT,
      subject: threadSubject,
      html,
      headers: {
        "In-Reply-To": `<${enquiry.id}@peeyemtraders.com>`,
        "References": `<${enquiry.id}@peeyemtraders.com>`,
      },
    });
    return { success: true, messageId: info.messageId };
  } catch (err: any) {
    console.error("sendAdminReplyToCustomer failed:", err);
    return { success: false, error: err.message || "Failed to send email reply to customer." };
  }
}

// Utility HTML escape
function escapeHtml(text: string): string {
  if (!text) return "";
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
