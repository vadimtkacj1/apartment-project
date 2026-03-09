import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: NextRequest) {
  try {
    // 1. Validate environment variables
    const {
      EMAIL_SERVER_HOST,
      EMAIL_SERVER_PORT,
      EMAIL_SERVER_USER,
      EMAIL_SERVER_PASSWORD,
      EMAIL_TO,
    } = process.env;

    if (!EMAIL_SERVER_HOST || !EMAIL_SERVER_PORT || !EMAIL_SERVER_USER || !EMAIL_SERVER_PASSWORD) {
      console.error("Missing email configuration env variables");
      return NextResponse.json(
        { error: "Email service not configured" },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { name, phone, message } = body;

    // 2. Input validation
    if (!name?.trim() || name.trim().length < 2) {
      return NextResponse.json(
        { error: "שם חייב להכיל לפחות 2 תווים" },
        { status: 400 }
      );
    }

    // Clean phone number and validate using Israeli regex
    const cleanPhone = phone?.replace(/[\s\-()]/g, "");

    // More flexible Israeli phone validation
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

    // 3. Transporter configuration (Optimized for Private Email / Titan)
    const transporter = nodemailer.createTransport({
      host: EMAIL_SERVER_HOST,
      port: Number(EMAIL_SERVER_PORT),
      // Use secure: true for port 465, false for 587
      secure: EMAIL_SERVER_PORT === "465",
      auth: {
        user: EMAIL_SERVER_USER,
        pass: EMAIL_SERVER_PASSWORD,
      },
      tls: {
        // Necessary for some Node.js environments to prevent certificate validation errors
        rejectUnauthorized: false,
      },
      debug: process.env.NODE_ENV === 'development',
      logger: process.env.NODE_ENV === 'development'
    });

    // 4. Verify transporter configuration
    try {
      await transporter.verify();
      console.log('✅ SMTP connection verified successfully');
    } catch (verifyError: any) {
      console.error('❌ SMTP verification failed:', {
        message: verifyError.message,
        code: verifyError.code,
        host: EMAIL_SERVER_HOST,
        port: EMAIL_SERVER_PORT,
        user: EMAIL_SERVER_USER
      });

      return NextResponse.json(
        {
          error: "שגיאה בהגדרת שרת המייל",
          details: "אנא בדוק את הגדרות SMTP או פנה למנהל המערכת"
        },
        { status: 500 }
      );
    }

    // 5. Email template configuration
    // EMAIL_TO can be a comma-separated list of emails
    const recipients = EMAIL_TO || "vadim.tkach1378@gmail.com,info@ram-haim.co.il";

    const mailOptions = {
      from: `"Ram Nekasim" <${EMAIL_SERVER_USER}>`,
      to: recipients,
      subject: `פנייה חדשה מהאתר: ${name}`,
      html: `
        <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee;">
          <div style="background-color: #1c3664; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">פנייה חדשה מהאתר</h1>
          </div>
          <div style="padding: 30px; background-color: #ffffff;">
            <p style="font-size: 18px;"><strong>פרטי הלקוח:</strong></p>
            <hr />
            <p><strong>שם מלא:</strong> ${name}</p>
            <p><strong>טלפון:</strong> <a href="tel:${cleanPhone}">${phone}</a></p>
            ${message ? `<p><strong>הודעה:</strong></p><p style="background-color: #f9f9f9; padding: 15px; border-radius: 5px;">${message}</p>` : '<p><em style="color: #999;">לא צוינה הודעה</em></p>'}
            <div style="margin-top: 30px; padding: 15px; background-color: #f9f9f9; border-radius: 5px;">
              <small style="color: #666;">
                This is an automated message from the contact form at ram-haim.co.il
              </small>
            </div>
          </div>
        </div>
      `,
    };

    // 6. Send the email
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: "Success" }, { status: 200 });

  } catch (error: any) {
    // Log detailed error info for debugging in the server console
    console.error("SMTP Error Details:", {
      message: error.message,
      code: error.code,
      command: error.command,
    });

    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
