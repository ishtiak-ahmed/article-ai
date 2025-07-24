// app/api/chat/route.ts (supports OpenAI and OpenRouter)
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { message } = await req.json()

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Invalid message' }, { status: 400 })
    }


    const messages = [
      { role: 'user', content: message },
    ]

    const models = [
      'deepseek/deepseek-chat-v3-0324:free',
      'deepseek/deepseek-r1:free',
      'google/gemini-2.0-flash-exp:free',
      'google/gemma-3-27b-it:free',
      'qwen/qwen3-14b:free',
    ]

    let lastError = null

    for (const model of models) {
      try {
        const res = await fetch(
          'https://openrouter.ai/api/v1/chat/completions',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
            },
            body: JSON.stringify({
              model,
              messages,
              max_tokens: 300,
            }),
          }
        )

        if (res.ok) {
          const data = await res.json()
          const reply = data?.choices?.[0]?.message?.content || 'No reply'
          return NextResponse.json({ reply, modelUsed: model })
        }

        const errorText = await res.text()
        console.warn(`⚠️ Model "${model}" failed:`, errorText)
        lastError = errorText
      } catch (err: any) {
        console.error(`❌ Model "${model}" exception:`, err.message)
        lastError = err.message
      }
    }

    return NextResponse.json(
      { error: 'All models failed', detail: lastError },
      { status: 500 }
    )
  } catch (err: any) {
    console.error('❌ API Chat Error:', err.message)
    return NextResponse.json(
      {
        error: 'Internal server error',
        detail: err.message,
      },
      { status: 500 }
    )
  }
}
