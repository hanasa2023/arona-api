import { config } from '@/config'
import { Hono } from 'hono'

const studentsData = await fetch(`${config.baseUrl}/data/zh/students.json`)
  .then((res) => res.json())
  .catch((err) => {
    console.error('Failed to load students data:', err)
    return null
  })
const app = new Hono()

app
  .get('/', async (c) => {
    if (!studentsData) {
      return c.notFound()
    }
    return c.json({
      code: 200,
      message: 'success',
      data: studentsData,
    })
    return c.notFound()
  })
  .get('/:id', async (c) => {
    if (!studentsData) {
      return c.notFound()
    }
    const { id } = c.req.param()
    for (const student of studentsData) {
      if (student['Id'].toString() === id) {
        return c.json({
          code: 200,
          message: 'success',
          data: student,
        })
      }
    }
  })
  .get('/l2d/:id', async (c) => {
    if (!studentsData) {
      return c.notFound()
    }
    const { id } = c.req.param()
    const ids = await (await fetch(`${config.baseUrl}/data/ids.json`)).json()
    for (const iId of ids) {
      if (iId.toString() === id) {
        const img = await (
          await fetch(`${config.baseUrl}/images/student/l2d/${id}.webp`)
        ).arrayBuffer()
        if (img)
          return c.body(img, 200, {
            'Content-Type': 'image/webp',
          })
      }
    }
  })

export default app
