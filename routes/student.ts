import { config } from '@/config'
import { Hono } from 'hono'
import { IBrowser } from '@/utils/borswer'
import { IOSS } from '@/utils/oss'
import { createHash } from 'crypto'

const studentsData = await (
  await fetch(`${config.baseUrl}/data/zh/students.min.json`)
).json()

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
    const imgPath = `/images/student/l2d/${id}.webp`
    const isImgExist = await IOSS.isObjectExist(imgPath)
    const head = (await IOSS.getClient().head(imgPath)) as {
      res: { headers: { date: string } }
    }
    const hash = createHash('sha256')
      .update(head.res.headers['date'])
      .digest('hex')
    if (isImgExist) {
      return c.json({
        code: 200,
        message: 'success',
        data: {
          imgPath: `${config.baseUrl}${imgPath}`,
          hash,
        },
      })
    }
    return c.json(
      {
        code: 500,
        message: 'Invalid id',
        data: {},
      },
      500
    )
  })
  .get('/info/:id', async (c) => {
    const { id } = c.req.param()
    const imgPath = `/images/student-info/${id}.png`
    const client = IOSS.getClient()
    const isImgExist = await IOSS.isObjectExist(imgPath)
    try {
      if (!isImgExist) {
        const url = `http://localhost:${config.port}/student/info/${id}`
        console.info(url)
        const browser = await IBrowser.launchBrowser()
        const page = await browser.newPage()
        await page.setViewportSize({
          width: 1920,
          height: 1080,
        })
        await page.goto(url, { waitUntil: 'networkidle' })
        const card = await page.$('#info-card')
        if (!card) throw new Error('Card element not found')
        const screenshot = await card.screenshot({
          type: 'png',
        })
        const data = Buffer.from(screenshot)
        await client.put(imgPath, data)
      }
      return c.json({
        code: 200,
        message: 'success',
        data: {
          imgUrl: `${config.baseUrl}${imgPath}`,
        },
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
    const imgPath = `/images/student-info/${id}_${level}.png`
    const client = IOSS.getClient()
    const isImgExist = await IOSS.isObjectExist(imgPath)
    try {
      if (!isImgExist) {
        const url = `http://localhost:${config.port}/student/info/${id}/${
          Number(level) + 10
        }`
        const browser = await IBrowser.launchBrowser()
        const page = await browser.newPage()
        await page.setViewportSize({
          width: 1920,
          height: 1080,
        })
        await page.goto(url, { waitUntil: 'networkidle' })
        const card = await page.$('#info-card')
        if (!card) throw new Error('Card element not found')
        const screenshot = await card.screenshot({
          type: 'png',
        })
        const data = Buffer.from(screenshot)
        await client.put(imgPath, data)
      }
      return c.json({
        code: 200,
        message: 'success',
        data: {
          imgUrl: `${config.baseUrl}${imgPath}`,
        },
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
    const imgPath = `/images/student-skills/${id}.png`
    const client = await IOSS.getClient()
    const isImgExist = await IOSS.isObjectExist(imgPath)
    try {
      if (!isImgExist) {
        const url = `http://localhost:${config.port}/student/info/skills/${id}`
        const browser = await IBrowser.launchBrowser()
        const page = await browser.newPage()
        await page.setViewportSize({
          width: 1920,
          height: 1080,
        })
        await page.goto(url, { waitUntil: 'networkidle' })
        const card = await page.$('#skill-card')
        if (!card) throw new Error('Card element not found')
        const screenshot = await card.screenshot({
          type: 'png',
        })
        const data = Buffer.from(screenshot)
        await client.put(imgPath, data)
      }
      return c.json({
        code: 200,
        message: 'success',
        data: {
          imgUrl: `${config.baseUrl}${imgPath}`,
        },
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
