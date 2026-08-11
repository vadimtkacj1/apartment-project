import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { prisma } from "@/lib/prisma";

// Escape user-supplied text before interpolating into the HTML email body,
// preventing HTML/markup injection into the message staff receive.
function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => {
    switch (char) {
      case "&": return "&amp;";
      case "<": return "&lt;";
      case ">": return "&gt;";
      case '"': return "&quot;";
      default: return "&#39;";
    }
  });
}

export async function POST(request: NextRequest) {
  try {
    // Rate limit by IP to curb contact-form spam / SMTP abuse.
    const limit = rateLimit(`contact:${getClientIp(request)}`, 5, 10 * 60 * 1000);
    if (!limit.ok) {
      return NextResponse.json(
        { error: "יותר מדי בקשות, נסה שוב מאוחר יותר" },
        { status: 429, headers: { "Retry-After": String(limit.retryAfter) } }
      );
    }

    const body = await request.json();
    const { name, phone, message, propertyId, source } = body;

    // 1. Input validation
    if (!name?.trim() || name.trim().length < 2) {
      return NextResponse.json(
        { error: "שם חייב להכיל לפחות 2 תווים" },
        { status: 400 }
      );
    }

    // Clean phone number and validate using Israeli regex
    const cleanPhone = phone?.replace(/[\s\-()]/g, "");

    // Accepts: 05XXXXXXXX, +97205XXXXXXXX, 97205XXXXXXXX, or other Israeli prefixes (2,3,4,5,7,8,9)
    const phoneRegex = /^(\+?972|0)?([2-9]\d{7,8})$/;

    if (!cleanPhone || cleanPhone.length < 9) {
      return NextResponse.json(
        { error: "מספר טלפון לא תקין - יש להזין לפחות 9 ספרות" },
        { status: 400 }
      );
    }

    if (!phoneRegex.test(cleanPhone)) {
      return NextResponse.json(
        { error: "מספר טלפון לא תקין - פורמט: 05XXXXXXXX או +97205XXXXXXXX" },
        { status: 400 }
      );
    }

    // 2. Persist the lead FIRST so it is never lost — even if SMTP is down or
    //    misconfigured. Managed afterwards in /admin/inquiries. Non-fatal: a DB
    //    hiccup must not stop the email notification below.
    try {
      await prisma.inquiry.create({
        data: {
          name: name.trim(),
          phone: phone ? String(phone).trim() : null,
          message: message ? String(message).trim() : null,
          source: typeof source === "string" && source ? source.slice(0, 60) : "contact_form",
          propertyId: Number.isInteger(propertyId) ? propertyId : null,
          status: "new",
        },
      });
    } catch (dbError) {
      console.error("Failed to persist inquiry:", dbError);
    }

    // 3. Email notification — best-effort. Failures are logged but NOT surfaced
    //    to the visitor, because the lead is already captured in the admin.
    try {
      const {
        EMAIL_SERVER_HOST,
        EMAIL_SERVER_PORT,
        EMAIL_SERVER_USER,
        EMAIL_SERVER_PASSWORD,
        EMAIL_TO,
      } = process.env;

      if (!EMAIL_SERVER_HOST || !EMAIL_SERVER_PORT || !EMAIL_SERVER_USER || !EMAIL_SERVER_PASSWORD) {
        console.error("Email not configured — inquiry saved, notification skipped");
      } else {
        // Transporter configuration (optimized for Private Email / Titan).
        const transporter = nodemailer.createTransport({
          host: EMAIL_SERVER_HOST,
          port: Number(EMAIL_SERVER_PORT),
          secure: EMAIL_SERVER_PORT === "465", // true for 465, false for 587
          auth: { user: EMAIL_SERVER_USER, pass: EMAIL_SERVER_PASSWORD },
          debug: process.env.NODE_ENV === "development",
          logger: process.env.NODE_ENV === "development",
        });

        await transporter.verify();

        // EMAIL_TO can be a comma-separated list of emails.
        const recipients = EMAIL_TO || "vadim.tkach1378@gmail.com,info@ram-haim.co.il";

        // Escape all user-controlled values before they enter the HTML body.
        const safeName = escapeHtml(name.trim());
        const safeSubjectName = name.trim().replace(/[\r\n]+/g, " ");
        const safePhone = escapeHtml(String(phone));
        const safeCleanPhone = encodeURIComponent(cleanPhone);
        const safeMessage = message ? escapeHtml(String(message)) : "";

        await transporter.sendMail({
          from: `"Ram Nekasim" <${EMAIL_SERVER_USER}>`,
          to: recipients,
          subject: `פנייה חדשה מהאתר: ${safeSubjectName}`,
          html: `
        <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee;">
          <div style="background-color: #1c3664; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">פנייה חדשה מהאתר</h1>
          </div>
          <div style="padding: 30px; background-color: #ffffff;">
            <p style="font-size: 18px;"><strong>פרטי הלקוח:</strong></p>
            <hr />
            <p><strong>שם מלא:</strong> ${safeName}</p>
            <p><strong>טלפון:</strong> <a href="tel:${safeCleanPhone}">${safePhone}</a></p>
            ${safeMessage ? `<p><strong>הודעה:</strong></p><p style="background-color: #f9f9f9; padding: 15px; border-radius: 5px;">${safeMessage}</p>` : '<p><em style="color: #999;">לא צוינה הודעה</em></p>'}
            <div style="margin-top: 30px; padding: 15px; background-color: #f9f9f9; border-radius: 5px;">
              <small style="color: #666;">
                This is an automated message from the contact form at ram-haim.co.il
              </small>
            </div>
          </div>
        </div>
      `,
        });
      }
    } catch (mailError: any) {
      // Lead is already saved — log the notification failure but don't fail the request.
      console.error("Inquiry email failed (lead still saved):", {
        message: mailError?.message,
        code: mailError?.code,
        command: mailError?.command,
      });
    }

    return NextResponse.json({ message: "Success" }, { status: 200 });
  } catch (error: any) {
    console.error("Contact route error:", { message: error?.message, code: error?.code });
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
