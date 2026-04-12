import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Valid email required.' }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Vikamusk Website" <${process.env.SMTP_USER || 'noreply@vikamusk.com'}>`,
      to: process.env.CONTACT_EMAIL_TO || 'sales@vikamusk.com',
      replyTo: email,
      subject: '[Newsletter] New Subscriber',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto;">
          <div style="background:#001f3f; padding:20px 28px; border-radius:8px 8px 0 0;">
            <h2 style="color:#f59e0b; margin:0; font-size:18px;">New Newsletter Subscriber</h2>
            <p style="color:rgba(255,255,255,0.5); margin:4px 0 0; font-size:12px;">Vikamusk International</p>
          </div>
          <div style="background:#f8fafc; padding:28px; border:1px solid #e2e8f0; border-top:none; border-radius:0 0 8px 8px;">
            <p style="margin:0 0 8px; color:#334155; font-size:14px;">
              <strong>Email:</strong> <a href="mailto:${email}" style="color:#f59e0b;">${email}</a>
            </p>
            <hr style="border:none; border-top:1px solid #e2e8f0; margin:16px 0;">
            <p style="color:#94a3b8; font-size:11px; margin:0;">
              Submitted via vikamusk.com footer newsletter form.
            </p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    // Return success to avoid blocking UX — log the failure server-side
    return NextResponse.json({ success: true }, { status: 200 });
  }
}
