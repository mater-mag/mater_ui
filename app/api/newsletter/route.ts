import { NextRequest, NextResponse } from 'next/server'

const MAILCHIMP_API_KEY = process.env.MAILCHIMP_API_KEY!
const MAILCHIMP_AUDIENCE_ID = process.env.MAILCHIMP_AUDIENCE_ID!
const MAILCHIMP_DC = MAILCHIMP_API_KEY.split('-')[1] // e.g., 'us2'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Molimo unesite ispravnu email adresu.' },
        { status: 400 }
      )
    }

    const response = await fetch(
      `https://${MAILCHIMP_DC}.api.mailchimp.com/3.0/lists/${MAILCHIMP_AUDIENCE_ID}/members`,
      {
        method: 'POST',
        headers: {
          Authorization: `apikey ${MAILCHIMP_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email_address: email,
          status: 'subscribed',
        }),
      }
    )

    const data = await response.json()

    if (!response.ok) {
      // Handle already subscribed
      if (data.title === 'Member Exists') {
        return NextResponse.json(
          { error: 'Ova email adresa je već prijavljena na newsletter.' },
          { status: 400 }
        )
      }

      // Handle invalid email
      if (data.title === 'Invalid Resource') {
        return NextResponse.json(
          { error: 'Molimo unesite ispravnu email adresu.' },
          { status: 400 }
        )
      }

      console.error('Mailchimp error:', data)
      return NextResponse.json(
        { error: 'Došlo je do greške. Molimo pokušajte ponovno.' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Newsletter subscription error:', error)
    return NextResponse.json(
      { error: 'Došlo je do greške. Molimo pokušajte ponovno.' },
      { status: 500 }
    )
  }
}
