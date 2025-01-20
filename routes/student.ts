import { config } from '@/config'
import { Hono } from 'hono'
import { IBrowser } from '@/utils/borswer'
import { IOSS } from '@/utils/oss'
import { createHash } from 'crypto'
import * as echarts from 'echarts/core'
import { SVGRenderer } from 'echarts/renderers'
import { HeatmapChart } from 'echarts/charts'
import {
  CalendarComponent,
  VisualMapComponent,
  TitleComponent,
  TooltipComponent,
} from 'echarts/components'
import {
  ComposeOption,
  CalendarComponentOption,
  HeatmapSeriesOption,
  TooltipComponentOption,
  VisualMapComponentOption,
  TitleComponentOption,
} from 'echarts'
import sharp from 'sharp'

type ECOption = ComposeOption<
  | CalendarComponentOption
  | TooltipComponentOption
  | VisualMapComponentOption
  | HeatmapSeriesOption
  | TitleComponentOption
>

echarts.use([
  SVGRenderer,
  CalendarComponent,
  TitleComponent,
  TooltipComponent,
  VisualMapComponent,
  HeatmapChart,
])

const studentsData: any[] = await (
  await fetch(
    `${config.baseUrl}/${config.bucket}/objects/download?preview=true&prefix=data/zh/students.min.json`,
  )
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
      res: { headers: { 'last-modified': string } }
    }
    const hash = createHash('sha256')
      .update(head.res.headers['last-modified'])
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
      500,
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
      const head = (await IOSS.getClient().head(imgPath)) as {
        res: { headers: { 'last-modified': string } }
      }
      const hash = createHash('sha256')
        .update(head.res.headers['last-modified'])
        .digest('hex')
      return c.json({
        code: 200,
        message: 'success',
        data: {
          imgUrl: `${config.baseUrl}${imgPath}`,
          hash,
        },
      })
    } catch (e) {
      console.error(e)
      return c.json(
        {
          code: 500,
          message: 'Internal server error',
        },
        500,
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
        500,
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
      const head = (await IOSS.getClient().head(imgPath)) as {
        res: { headers: { 'last-modified': string } }
      }
      const hash = createHash('sha256')
        .update(head.res.headers['last-modified'])
        .digest('hex')
      return c.json({
        code: 200,
        message: 'success',
        data: {
          imgUrl: `${config.baseUrl}${imgPath}`,
          hash,
        },
      })
    } catch (e) {
      console.error(e)
      return c.json(
        {
          code: 500,
          message: 'Internal server error',
        },
        500,
      )
    }
  })
  .get('/skills/:id', async (c) => {
    const { id } = c.req.param()
    const imgPath = `/images/student-skills/${id}.png`
    const client = IOSS.getClient()
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
      const head = (await IOSS.getClient().head(imgPath)) as {
        res: { headers: { 'last-modified': string } }
      }
      const hash = createHash('sha256')
        .update(head.res.headers['last-modified'])
        .digest('hex')
      return c.json({
        code: 200,
        message: 'success',
        data: {
          imgUrl: `${config.baseUrl}${imgPath}`,
          hash,
        },
      })
    } catch (e) {
      console.error(e)
      return c.json(
        {
          code: 500,
          message: 'Internal server error',
        },
        500,
      )
    }
  })
  .get('/birthday/distribution', async (c) => {
    const imgPath = '/images/student-birthday/distribution.png'
    const client = IOSS.getClient()
    const isImgExist = await IOSS.isObjectExist(imgPath)
    try {
      if (!isImgExist) {
        const height = 360
        const width = 1200
        const chart = echarts.init(null, 'light', {
          renderer: 'svg',
          ssr: true,
          width: width,
          height: height,
        })
        const birthdays = new Map<number, number>()
        studentsData.forEach((studentData: any) => {
          const birthdayString = studentData['BirthDay'].replace('/', '-')
          const date = +echarts.time.parse('2024-' + birthdayString)
          if (date) {
            if (birthdays.has(date)) {
              birthdays.set(date, birthdays.get(date)! + 1)
            } else {
              birthdays.set(date, 0)
            }
          }
        })

        const getVirtualData = (year: string) => {
          const date = +echarts.time.parse(year + '-01-01')
          const end = +echarts.time.parse(+year + 1 + '-01-01')
          const dayTime = 3600 * 24 * 1000
          const data: [string, number][] = []
          for (let time = date; time < end; time += dayTime) {
            data.push([
              echarts.time.format(time, '{yyyy}-{MM}-{dd}', false),
              birthdays.get(time) ?? 0,
            ])
          }
          return data
        }

        chart.setOption<ECOption>({
          title: {
            text: '学生生日分布图',
            top: 25,
            left: 'center',
          },
          visualMap: {
            min: 0,
            max: 3,
            calculable: true,
            orient: 'horizontal',
            left: 'center',
            top: 50,
          },
          calendar: [
            {
              orient: 'horizontal',
              range: '2024',
              top: 120,
              yearLabel: { show: false },
            },
          ],
          series: [
            {
              type: 'heatmap',
              coordinateSystem: 'calendar',
              data: getVirtualData('2024'),
            },
          ],
        })
        const img = await sharp(Buffer.from(chart.renderToSVGString()))
          .png()
          .toBuffer()
        await client.put(imgPath, img)
      }
      const head = (await IOSS.getClient().head(imgPath)) as {
        res: { headers: { 'last-modified': string } }
      }
      const hash = createHash('sha256')
        .update(head.res.headers['last-modified'])
        .digest('hex')
      return c.json({
        code: 200,
        message: 'success',
        data: {
          imgUrl: `${config.baseUrl}${imgPath}`,
          hash,
        },
      })
    } catch (e) {
      console.error(e)
      return c.json(
        {
          code: 500,
          message: 'Internal server error',
        },
        500,
      )
    }
  })
  .get('/all/update', async (c) => {
    const client = IOSS.getClient()
    const info = []
    // // 更新学生信息
    for (const [index, s] of studentsData.entries()) {
      const imgPath = `/images/student-info/${s.Id}.png`
      try {
        const url = `http://localhost:${config.port}/student/info/${s.Id}`
        console.info(`更新${s.Id}(${index + 1}/${studentsData.length})`)
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
          omitBackground: true,
        })
        const data = Buffer.from(screenshot)
        await client.put(imgPath, data)
        info.push(`更新${s.Name}信息成功`)
      } catch (e) {
        console.error(e)
        info.push(`更新${s.Name}信息失败`)
      }
    }
    // 更新学生技能信息
    for (const [index, s] of studentsData.entries()) {
      const imgPath = `/images/student-skills/${s.Id}.png`
      try {
        const url = `http://localhost:${config.port}/student/info/skills/${s.Id}`
        console.info(`更新${s.Id}(${index + 1}/${studentsData.length})`)
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
          omitBackground: true,
        })
        const data = Buffer.from(screenshot)
        await client.put(imgPath, data)
        info.push(`更新${s.Name}技能成功`)
      } catch (e) {
        console.error(e)
        info.push(`更新${s.Name}技能失败`)
      }
    }
    return c.json({
      code: 200,
      message: 'success',
      data: info,
    })
  })

export default app
