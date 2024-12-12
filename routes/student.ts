import { config } from '@/config'
import { Hono } from 'hono'
import puppeteer from 'puppeteer'
import fs from 'fs'
import path from 'path'

const studentsData = JSON.parse(
  fs.readFileSync(
    path.join(process.cwd(), '/public/data/zh/students.min.json'),
    { encoding: 'utf-8' }
  )
)

// await fetch(`${config.baseUrl}/data/zh/students.min.json`)
//   .then((res) => res.json())
//   .catch((err) => {
//     console.error('Failed to load students data:', err)
//     return null
//   })
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
    // const ids = await (await fetch(`${config.baseUrl}/data/ids.json`)).json()
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
      await page.setViewport({
        width: 1920,
        height: 1080,
      })
      await page.goto(url, { waitUntil: 'networkidle2' })
      const card = await page.$('#info-card')
      if (!card) throw new Error('Card element not found')
      const screenshot = await card.screenshot({
        type: 'webp',
      })
      await browser.close()
      const data = new Uint8Array(screenshot)
      return c.body(data.buffer, 200, {
        'Content-Type': 'image/webp',
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
    const url = `${config.baseUrl}/student/info/${id}/${Number(level) + 10}`
    try {
      const browser = await puppeteer.launch()
      const page = await browser.newPage()
      await page.setViewport({
        width: 1920,
        height: 1080,
      })
      await page.goto(url, { waitUntil: 'networkidle2' })
      const card = await page.$('#info-card')
      if (!card) throw new Error('Card element not found')
      const screenshot = await card.screenshot({
        type: 'png',
      })
      await browser.close()
      const data = new Uint8Array(screenshot)
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
  .get('/info/skill/:id', async (c) => {
    const { id } = c.req.param()
    const url = `${config.baseUrl}/student/info/skills/${id}`
    try {
      const browser = await puppeteer.launch()
      const page = await browser.newPage()
      await page.setViewport({
        width: 1920,
        height: 1080,
      })
      await page.goto(url, { waitUntil: 'networkidle2' })
      const card = await page.$('#skill-card')
      if (!card) throw new Error('Card element not found')
      const screenshot = await card.screenshot({
        type: 'webp',
      })
      await browser.close()
      const data = new Uint8Array(screenshot)
      return c.body(data.buffer, 200, {
        'Content-Type': 'image/webp',
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
