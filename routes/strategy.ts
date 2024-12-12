import { config } from '@/config'
import { Hono } from 'hono'

const app = new Hono()

app.get('/:name', async (c) => {
  const { name } = c.req.param()
  const img = await (
    await fetch(`${config.baseUrl}/images/strategy/${name}.png`)
  ).arrayBuffer()
  if (img) {
    return c.body(img, 200, {
      'Content-Type': 'image/png',
    })
  }
  return c.notFound()
})

export default app
