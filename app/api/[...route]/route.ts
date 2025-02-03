import { Hono } from 'hono'
import { compress } from 'hono/compress'
import { handle } from 'hono/vercel'
import chapterMap from 'routes/chapter-map'
import illusts from 'routes/illusts'
import meme from 'routes/meme'
import raid from 'routes/raid'
import strategy from 'routes/strategy'
import student from 'routes/student'

const app = new Hono().basePath('/api')
app.use(compress())

app.get('/hello', (c) => {
  return c.json({
    message: 'Hello from Hono!',
  })
})

app.route('/student', student)
app.route('/strategy', strategy)
app.route('/chapter-map', chapterMap)
app.route('/meme', meme)
app.route('/illusts', illusts)
app.route('/raid', raid)

export const GET = handle(app)
export const POST = handle(app)
