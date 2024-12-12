import { Hono } from 'hono'
import fs from 'fs'
import path from 'path'

const app = new Hono()

app.get('/:name', async (c) => {
  const { name } = c.req.param()
  const img = fs.readFileSync(
    path.join(process.cwd(), `/public/images/strategy/${name}.png`)
  )
  const data = new Uint8Array(img.buffer).buffer
  if (data instanceof ArrayBuffer) {
    return c.body(data, 200, {
      'Content-Type': 'image/png',
    })
  }
  return c.notFound()
})

export default app
