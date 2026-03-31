import nodemailer from 'nodemailer'

// Configure nodemailer transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
})

interface EnquiryData {
  fullName: string
  email: string
  phone?: string
  company?: string
  message: string
  country?: string
  productInterest?: string[]
}

export async function sendEnquiryEmail(data: EnquiryData) {
  const {
    fullName,
    email,
    phone,
    company,
    message,
    country,
    productInterest,
  } = data

  const emailContent = `
    <h2>New Product Enquiry from Vikamusk Website</h2>
    <p><strong>Name:</strong> ${fullName}</p>
    <p><strong>Email:</strong> ${email}</p>
    ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
    ${company ? `<p><strong>Company:</strong> ${company}</p>` : ''}
    ${country ? `<p><strong>Country:</strong> ${country}</p>` : ''}
    ${productInterest && productInterest.length > 0 ? `<p><strong>Product Interest:</strong> ${productInterest.join(', ')}</p>` : ''}
    <p><strong>Message:</strong></p>
    <p>${message.replace(/\n/g, '<br>')}</p>
  `

  try {
    // Send email to admin
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL,
      subject: `New Enquiry from ${fullName} - Vikamusk`,
      html: emailContent,
      replyTo: email,
    })

    // Send confirmation email to customer
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: email,
      subject: 'We received your enquiry - Vikamusk',
      html: `
        <h2>Thank you for your enquiry!</h2>
        <p>Dear ${fullName},</p>
        <p>We have received your message and will get back to you soon with more information about our products.</p>
        <p>Best regards,<br>Vikamusk Team</p>
      `,
    })

    return { success: true }
  } catch (error) {
    console.error('Email sending failed:', error)
    throw new Error('Failed to send email')
  }
}
