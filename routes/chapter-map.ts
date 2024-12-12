import { config } from '@/config'
import { Hono } from 'hono'

const app = new Hono()

app.get('/:chapter', async (c) => {
  const { chapter } = c.req.param()
  const img = await (
    await fetch(`${config.baseUrl}/images/chapter-map/${chapter}.webp`)
  ).arrayBuffer()
  if (img) {
    return c.body(img, 200, {
      'Content-Type': 'image/webp',
    })
  }
  return c.notFound()
})

export default app
