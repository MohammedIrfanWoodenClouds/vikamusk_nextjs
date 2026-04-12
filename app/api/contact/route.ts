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
    // In production, set these environment variables:
    // SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, CONTACT_EMAIL_TO
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: `"Vikamusk Website" <${process.env.SMTP_USER || 'noreply@vikamusk.com'}>`,
      to: process.env.CONTACT_EMAIL_TO || 'sales@vikamusk.com',
      replyTo: email,
      subject: `[Website Enquiry] ${subject} — ${fullName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #001f3f; padding: 24px 32px; border-radius: 8px 8px 0 0;">
            <h2 style="color: #f59e0b; margin: 0; font-size: 20px;">New Website Enquiry</h2>
            <p style="color: rgba(255,255,255,0.6); margin: 4px 0 0; font-size: 13px;">Vikamusk International</p>
          </div>
          <div style="background: #f8fafc; padding: 32px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 8px 8px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #001f3f; width: 120px; vertical-align: top;">Name:</td>
                <td style="padding: 8px 0; color: #334155;">${fullName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #001f3f; vertical-align: top;">Email:</td>
                <td style="padding: 8px 0;"><a href="mailto:${email}" style="color: #f59e0b;">${email}</a></td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #001f3f; vertical-align: top;">Phone:</td>
                <td style="padding: 8px 0; color: #334155;">${phone}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #001f3f; vertical-align: top;">Interest:</td>
                <td style="padding: 8px 0; color: #334155;">${subject}</td>
              </tr>
              ${message ? `
              <tr>
                <td colspan="2" style="padding: 16px 0 8px; font-weight: bold; color: #001f3f;">Message:</td>
              </tr>
              <tr>
                <td colspan="2" style="padding: 8px 16px; background: #ffffff; border-radius: 6px; color: #334155; line-height: 1.6; border: 1px solid #e2e8f0;">
                  ${message.replace(/\n/g, '<br>')}
                </td>
              </tr>` : ''}
            </table>
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;">
            <p style="color: #94a3b8; font-size: 12px; margin: 0;">
              This enquiry was submitted via vikamusk.com contact form.
            </p>
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
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to send message. Please try again or email us directly.' },
      { status: 500 }
    );
  }
}
