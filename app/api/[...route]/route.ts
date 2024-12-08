import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import student from 'routes/student'

export const runtime = 'edge'

const app = new Hono().basePath('/api')

app.get('/hello', (c) => {
  return c.json({
    message: 'Hello from Hono!',
  })
})

app.route('/students', student)

export const GET = handle(app)
