import { config } from '@/config'
import { Hono } from 'hono'
import fs from 'fs'
import path from 'path'
import { IBrowser } from '@/utils/borswer'

const studentsData = JSON.parse(
  fs.readFileSync(
    path.join(process.cwd(), '/public/data/zh/students.min.json'),
    { encoding: 'utf-8' }
  )
)

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
    const ids = JSON.parse(
      fs.readFileSync(path.join(process.cwd(), '/public/data/ids.json'), {
        encoding: 'utf-8',
      })
    )
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
    const imgPath = path.join(
      process.cwd(),
      `/public/images/student-info/${id}.png`
    )
    try {
      if (!fs.existsSync(imgPath)) {
        const url = `${config.baseUrl}/student/info/${id}`
        const browser = await IBrowser.launchBrowser()
        const page = await browser.newPage()
        await page.setViewportSize({
          width: 1920,
          height: 1080,
        })
        await page.goto(url, { waitUntil: 'networkidle' })
        const card = await page.$('#info-card')
        if (!card) throw new Error('Card element not found')
        await card.screenshot({
          type: 'png',
          path: imgPath,
        })
      }
      const data = new Uint8Array(fs.readFileSync(imgPath))
      return c.body(data.buffer, 200, {
        'Content-Type': 'image/png',
      })
    } catch (e) {
      console.error(e)
      return c.json(
        {
          code: 500,
          message: 'Internal server error',
        },
        500
      )
    }
  })
  .get('/info/:id/:level', async (c) => {
    const { id, level } = c.req.param()
    if (Number(level) > 90 || Number(level) < 1) {
      return c.json(
        {
          code: 500,
          message: 'Invalid level',
        },
        500
      )
    }
    const imgPath = path.join(
      process.cwd(),
      `/public/images/student-info/${id}_${level}.png`
    )
    try {
      if (!fs.existsSync(imgPath)) {
        const url = `${config.baseUrl}/student/info/${id}/${Number(level) + 10}`
        const browser = await IBrowser.launchBrowser()
        const page = await browser.newPage()
        await page.setViewportSize({
          width: 1920,
          height: 1080,
        })
        await page.goto(url, { waitUntil: 'networkidle' })
        const card = await page.$('#info-card')
        if (!card) throw new Error('Card element not found')
        await card.screenshot({
          type: 'png',
          path: imgPath,
        })
      }
      const data = new Uint8Array(fs.readFileSync(imgPath))
      return c.body(data.buffer, 200, {
        'Content-Type': 'image/png',
      })
    } catch (e) {
      console.error(e)
      return c.json(
        {
          code: 500,
          message: 'Internal server error',
        },
        500
      )
    }
  })
  .get('/skills/:id', async (c) => {
    const { id } = c.req.param()
    const imgPath = path.join(
      process.cwd(),
      `/public/images/student-skills/${id}.png`
    )
    try {
      if (!fs.existsSync(imgPath)) {
        const url = `${config.baseUrl}/student/info/skills/${id}`
        const browser = await IBrowser.launchBrowser()
        const page = await browser.newPage()
        await page.setViewportSize({
          width: 1920,
          height: 1080,
        })
        await page.goto(url, { waitUntil: 'networkidle' })
        const card = await page.$('#skill-card')
        if (!card) throw new Error('Card element not found')
        await card.screenshot({
          type: 'png',
          path: imgPath,
        })
      }
      const data = new Uint8Array(fs.readFileSync(imgPath))
      return c.body(data.buffer, 200, {
        'Content-Type': 'image/png',
      })
    } catch (e) {
      console.error(e)
      return c.json(
        {
          code: 500,
          message: 'Internal server error',
        },
        500
      )
    }
  })

export default app
