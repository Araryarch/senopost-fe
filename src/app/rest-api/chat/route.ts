import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const response = await fetch(
      'https://senopati-elysia.vercel.app/api/chat',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      },
    )

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    return NextResponse.json(data)
  } catch (error) {
    console.error('API Proxy Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch from external API' },
      { status: 500 },
    )
  }
}

// Optional: Add GET method if needed
export async function GET() {
  return NextResponse.json({ message: 'Chat API endpoint' })
}
