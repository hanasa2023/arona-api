import { Hono } from 'hono'

const data = await fetch('http://localhost:3000/data/zh/students.json')
const app = new Hono()

app
  .get('/', async (c) => {
    if (data) {
      const students = await data.json()
      return c.json({
        code: 200,
        message: 'success',
        data: students,
      })
    }
    return c.notFound()
  })
  .get('/:id', async (c) => {
    const { id } = c.req.param()
    if (data) {
      const students = await data.json()
      for (const student of students) {
        if (student['Id'].toString() === id) {
          return c.json({
            code: 200,
            message: 'success',
            data: student,
          })
        }
      }
    }

    return c.notFound()
  })
  .get('/l2d/:id', async (c) => {
    const {id} = c.req.param()
    
  })

export default app
