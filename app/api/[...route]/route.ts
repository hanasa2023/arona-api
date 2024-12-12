import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import { compress } from 'hono/compress'
import student from 'routes/student'
import strategy from 'routes/strategy'
import chapterMap from 'routes/chapter-map'

export const runtime = 'nodejs'

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

export const GET = handle(app)
export const POST = handle(app)
