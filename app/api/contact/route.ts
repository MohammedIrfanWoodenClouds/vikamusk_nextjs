import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fullName, email, phone, subject, message } = body;

    // Validation
    if (!fullName || !email || !phone) {
      return NextResponse.json(
        { error: 'Name, email, and phone are required.' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }

    // Configure transporter
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.error('SMTP credentials missing in environment variables');
      return NextResponse.json(
        { error: 'Server configuration error. Please contact us directly.' },
        { status: 500 }
      );
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: `"Vikamusk Website" <${process.env.SMTP_USER}>`,
      to: process.env.CONTACT_EMAIL_TO || 'sales@vikamusk.com',
      replyTo: email,
      subject: `[Website Enquiry] ${subject} — ${fullName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #334155;">
          <div style="background: #001f3f; padding: 24px 32px; border-radius: 8px 8px 0 0;">
            <h2 style="color: #f59e0b; margin: 0; font-size: 20px;">New Website Enquiry</h2>
            <p style="color: rgba(255,255,255,0.6); margin: 4px 0 0; font-size: 13px;">Vikamusk International</p>
          </div>
          <div style="background: #f8fafc; padding: 32px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 8px 8px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px 0; font-weight: bold; color: #001f3f; width: 120px; vertical-align: top;">Name:</td>
                <td style="padding: 10px 0;">${fullName}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; font-weight: bold; color: #001f3f; vertical-align: top;">Email:</td>
                <td style="padding: 10px 0;"><a href="mailto:${email}" style="color: #f59e0b; text-decoration: none; font-weight: 500;">${email}</a></td>
              </tr>
              <tr>
                <td style="padding: 10px 0; font-weight: bold; color: #001f3f; vertical-align: top;">Phone:</td>
                <td style="padding: 10px 0;">${phone}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; font-weight: bold; color: #001f3f; vertical-align: top;">Interest:</td>
                <td style="padding: 10px 0;">${subject}</td>
              </tr>
              ${message ? `
              <tr>
                <td colspan="2" style="padding: 20px 0 10px; font-weight: bold; color: #001f3f; border-top: 1px solid #e2e8f0; margin-top: 10px;">Message:</td>
              </tr>
              <tr>
                <td colspan="2" style="padding: 16px; background: #ffffff; border-radius: 8px; border: 1px solid #e2e8f0; line-height: 1.6;">
                  ${message.replace(/\n/g, '<br>')}
                </td>
              </tr>` : ''}
            </table>
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; text-align: center;">
              <p style="color: #94a3b8; font-size: 12px; margin: 0;">
                This enquiry was submitted via the vikamusk.com contact form.
              </p>
            </div>
          </div>
        </div>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { success: true, message: 'Enquiry submitted successfully.' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Contact form error details:', {
      message: error.message,
      code: error.code,
      command: error.command,
    });
    return NextResponse.json(
      { error: 'Failed to send message. Please try again or email us directly.' },
      { status: 500 }
    );
  }
}
