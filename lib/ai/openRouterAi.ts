export async function getResponseFromAi(message: string) {
  const messages = [{ role: 'user', content: message }]

  try {
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
          const reply: string = data?.choices?.[0]?.message?.content || 'No reply'
          return { reply, modelUsed: model, success: true }
        }

        const errorText = await res.text()
        console.warn(`⚠️ Model "${model}" failed:`, errorText)
        lastError = errorText
      } catch (err: any) {
        console.error(`❌ Model "${model}" exception:`, err.message)
        lastError = err.message
      }
    }

    return { error: 'All models failed', detail: lastError, success: false }
  } catch (err: any) {
    console.error('❌ Summarization Error:', err.message)
    return { error: 'Internal server error', detail: err.message, success: false }
  }
}
