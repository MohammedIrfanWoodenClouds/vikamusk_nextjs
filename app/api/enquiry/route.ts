import { NextRequest, NextResponse } from 'next/server';
import { createEnquiry } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, product, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Name, email, and message are required.' }, { status: 400 });
    }

    const enquiry = await createEnquiry({
      name: String(name).trim(),
      email: String(email).trim().toLowerCase(),
      phone: phone ? String(phone).trim() : '',
      product: product ? String(product).trim() : '',
      message: String(message).trim(),
    });

    // Optional: send email notification (if SMTP configured)
    try {
      const nodemailer = await import('nodemailer');
      if (process.env.SMTP_USER && process.env.SMTP_PASS) {
        const transporter = nodemailer.default.createTransport({
          host: process.env.SMTP_HOST || 'smtp.gmail.com',
          port: Number(process.env.SMTP_PORT) || 587,
          secure: false,
          auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
        });
        await transporter.sendMail({
          from: `"Vikamusk Website" <${process.env.SMTP_USER}>`,
          to: process.env.ENQUIRY_EMAIL || 'sales@vikamusk.com',
          subject: product ? `Product Enquiry: ${product}` : `New Enquiry from ${name}`,
          html: `
            <h2>New Enquiry</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
            ${product ? `<p><strong>Product:</strong> ${product}</p>` : ''}
            <p><strong>Message:</strong></p>
            <p>${String(message).replace(/\n/g, '<br>')}</p>
          `,
        });
      }
    } catch {
      // Email failure is non-fatal — enquiry is already saved
    }

    return NextResponse.json({ success: true, enquiry }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Internal server error' }, { status: 500 });
  }
}
