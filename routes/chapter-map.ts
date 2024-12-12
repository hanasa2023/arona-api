import { config } from '@/config'
import { Hono } from 'hono'
import fs from 'fs'
import path from 'path'

const app = new Hono()

app.get('/:chapter', async (c) => {
  const { chapter } = c.req.param()
  const img = fs.readFileSync(
    path.join(process.cwd(), `/public/images/chapter-map/${chapter}.webp`)
  )
  const data = new Uint8Array(img).buffer
  if (data instanceof ArrayBuffer) {
    return c.body(data, 200, {
      'Content-Type': 'image/webp',
    })
  }
  return c.notFound()
})

export default app
