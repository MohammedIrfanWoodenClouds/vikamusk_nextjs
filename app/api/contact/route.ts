import { NextRequest, NextResponse } from 'next/server'
import { sendEnquiryEmail } from '@/lib/email'
import { sanityFetch } from '@/lib/sanity'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const { fullName, email, phone, company, message, country } = body

    // Basic validation
    if (!fullName || !email || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Send email notification
    try {
      await sendEnquiryEmail({
        fullName,
        email,
        phone,
        company,
        message,
        country,
      })
    } catch (emailError) {
      console.error('Email sending error:', emailError)
      // Continue even if email fails - form was still submitted
    }

    // Optionally save to Sanity (if desired)
    // await sanityFetch({
    //   query: `mutation {
    //     createEnquiry(
    //       fullName: "${fullName}",
    //       email: "${email}",
    //       phone: "${phone}",
    //       company: "${company}",
    //       message: "${message}",
    //       country: "${country}"
    //     ) {
    //       _id
    //     }
    //   }`
    // })

    return NextResponse.json(
      { success: true, message: 'Your enquiry has been received' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'An error occurred while processing your request' },
      { status: 500 }
    )
  }
}
