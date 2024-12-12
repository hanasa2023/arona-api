import { Hono } from 'hono'
import fs from 'fs'
import path from 'path'
import crypto from 'crypto'

const app = new Hono()

app.get('/:name', async (c) => {
  const { name } = c.req.param()
  const img = fs.readFileSync(
    path.join(process.cwd(), `/public/images/strategy/${name}.png`)
  )
  const hash = crypto.createHash('sha256').update(img).digest('hex')
  const data = new Uint8Array(img.buffer).buffer
  if (data instanceof ArrayBuffer) {
    return c.body(data, 200, {
      'Content-Type': 'image/png',
      'X-Image-Hash': hash,
    })
  }
  return c.notFound()
})

export default app
