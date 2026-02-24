import { Hono } from 'hono'

const app = new Hono()

// CORS 허용
app.use('*', async (c, next) => {
  c.header('Access-Control-Allow-Origin', '*')
  c.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
  c.header('Access-Control-Allow-Headers', 'Content-Type')
  await next()
})

// OPTIONS 처리
app.options('*', (c) => {
  return c.text('OK')
})

// Gemini 프록시 엔드포인트
app.post('/generate', async (c) => {
  const { prompt } = await c.req.json()

  const apiKey = c.env.GEMINI_API_KEY

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }]
          }
        ]
      })
    }
  )

  const data = await response.json()

  return c.json(data)
})

export default app
