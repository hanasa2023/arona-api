import { config } from '@/config'
import { Hono } from 'hono'
import puppeteer from 'puppeteer'

const studentsData = await fetch(`${config.baseUrl}/data/zh/students.min.json`)
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
  .get('/info/:id', async (c) => {
    const { id } = c.req.param()
    const url = `${config.baseUrl}/student/info/${id}`
    try {
      const browser = await puppeteer.launch()
      const page = await browser.newPage()
      await page.goto(url, { waitUntil: 'networkidle2' })
      const screenshotBuffer = await page.screenshot({
        fullPage: true,
        type: 'png',
      })
      await browser.close()
      const uint8Array = new Uint8Array(screenshotBuffer)
      return c.body(uint8Array.buffer, 200, {
        'Content-Type': 'image/png',
      })
    } catch (e) {
      console.error(e)
    }
  })

export default app
