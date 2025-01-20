import { config } from '@/config'
import { IBrowser } from '@/utils/borswer'
import { Hono } from 'hono'
import { raidServer } from '@/utils/constants'
import { iFetch } from '@/utils/ifetch'
import {
  DiffClearByTime,
  MemberChageData,
  RaidChartsData,
  SeasonData,
  TrophyCutByTime,
} from '@/types'
import * as echarts from 'echarts/core'
import { SVGRenderer } from 'echarts/renderers'
import { LineChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  GraphicComponent,
  TimelineComponent,
  LegendComponent,
} from 'echarts/components'
import {
  ComposeOption,
  GridComponentOption,
  LegendComponentOption,
  GraphicComponentOption,
  LineSeriesOption,
  TimelineComponentOption,
  TitleComponentOption,
  TooltipComponentOption,
} from 'echarts'
import sharp from 'sharp'
import { IOSS } from '@/utils/oss'
import { createHash } from 'crypto'
import { getJPRaidSeason } from '@/utils/tools'

type ECOption = ComposeOption<
  | LineSeriesOption
  | TitleComponentOption
  | GridComponentOption
  | TooltipComponentOption
  | TimelineComponentOption
  | LegendComponentOption
  | GraphicComponentOption
>

echarts.use([
  SVGRenderer,
  TitleComponent,
  LegendComponent,
  GridComponent,
  TooltipComponent,
  TimelineComponent,
  GraphicComponent,
  LineChart,
])

const app = new Hono()

app
  .get('/line/:server', async (c) => {
    const { server } = c.req.param()
    if (server !== '1' && server !== '2' && server !== '3') {
      return c.json(
        {
          code: 400,
          message: '暂不支持的服务器',
        },
        { status: 400 },
      )
    }
    const imgPath = `/images/raid-line/${server}.png`
    const isImgExist = await IOSS.isObjectExist(imgPath)
    try {
      if (!isImgExist) {
        const client = IOSS.getClient()
        const url = `http://localhost:${config.port}/raid/line/${server}`
        console.info(url)
        const browser = await IBrowser.launchBrowser()
        const page = await browser.newPage()
        await page.setViewportSize({
          width: 1920,
          height: 1080,
        })
        await page.goto(url, { waitUntil: 'networkidle' })
        const card = await page.$('#card')
        if (!card) throw new Error('Card element not found')
        const screenshot = await card.screenshot({
          type: 'jpeg',
          omitBackground: true,
          quality: 80,
        })
        await client.putObject(config.bucket, imgPath, screenshot)
      }
      const head = await IOSS.getClient().statObject(config.bucket, imgPath)
      const hash = createHash('sha256')
        .update(head.lastModified.toTimeString())
        .digest('hex')
      return c.json({
        code: 200,
        message: 'success',
        data: {
          imgUrl: `${config.baseUrl}/${config.bucket}/objects/downloads?prefix=${imgPath}`,
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
  .get('/line/:server/:season', async (c) => {
    const { server, season } = c.req.param()
    if (server !== '1' && server !== '2' && server !== '3') {
      return c.json(
        {
          code: 400,
          message: '暂不支持的服务器',
        },
        { status: 400 },
      )
    }
    try {
      const url = `http://localhost:${config.port}/raid/line/${server}/${season}`
      const browser = await IBrowser.launchBrowser()
      const page = await browser.newPage()
      await page.setViewportSize({
        width: 1920,
        height: 1080,
      })
      await page.goto(url, { waitUntil: 'networkidle' })
      const card = await page.$('#card')
      if (!card) throw new Error('Card element not found')
      const screenshot = await card.screenshot({
        type: 'png',
        omitBackground: true,
      })
      const data = Buffer.from(screenshot)
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
        500,
      )
    }
  })
  .get('/lineChange/:server', async (c) => {
    const { server } = c.req.param()
    if (server !== '1' && server !== '2' && server !== '3') {
      return c.json(
        {
          code: 400,
          message: '暂不支持的服务器',
        },
        { status: 400 },
      )
    }

    try {
      const height = 600
      const width = 900
      const chart = echarts.init(null, 'dark', {
        renderer: 'svg',
        ssr: true,
        width: width,
        height: height,
      })

      if (server === '1' || server === '2') {
        const url = `${raidServer}/api/v2/rank/new/charts`
        const seasonList: SeasonData[] = (
          await iFetch(`${raidServer}/api/season/list`, { server })
        )['data'].reverse()
        const season = seasonList[seasonList.length - 1].season
        const data: RaidChartsData = (await iFetch(url, { server, season }))[
          'data'
        ]

        const xData = data.time.map((timestamp: number) => {
          const date = new Date(timestamp)
          return date
            .toLocaleString('zh-CN', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              hour12: false,
            })
            .replace(/\//g, '-')
        })
        chart.setOption<ECOption>({
          animation: false,
          title: {
            text: '总力战分数变化',
            top: 25,
            left: 25,
          },
          legend: {
            top: 25,
            data: ['1', '1000', '2000', '3000', '4000', '8000', '20000'],
            right: 30,
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true,
          },
          xAxis: {
            data: xData,
            type: 'category',
          },
          yAxis: {
            type: 'value',
            scale: true,
          },
          graphic: [
            {
              type: 'text',
              right: '10%',
              bottom: '10%',
              z: 10,
              style: {
                fill: '#fff',
                text: '数据来源: arona.icu',
                font: '20px sans-serif',
              },
            },
          ],
          series: [
            {
              name: '1',
              data: data.data['1'],
              type: 'line',
              showSymbol: false,
              smooth: true,
            },
            {
              name: '1000',
              data: data.data['1000'],
              type: 'line',
              showSymbol: false,
              smooth: true,
            },
            {
              name: '2000',
              data: data.data['2000'],
              type: 'line',
              showSymbol: false,
              smooth: true,
            },
            {
              name: '3000',
              data: data.data['3000'],
              type: 'line',
              showSymbol: false,
              smooth: true,
            },
            {
              name: '4000',
              data: data.data['4000'],
              type: 'line',
              showSymbol: false,
              smooth: true,
            },
            {
              name: '8000',
              data: data.data['8000'],
              type: 'line',
              showSymbol: false,
              smooth: true,
            },
            {
              name: '20000',
              data: data.data['20000'],
              type: 'line',
              showSymbol: false,
              smooth: true,
            },
          ],
        })
      } else {
        const season = await getJPRaidSeason()
        const url = `https://media.arona.ai/data/v3/raid/${season}/total`
        const data: TrophyCutByTime = (await iFetch(url, null, 'GET'))[
          'trophyCutByTime'
        ]

        const xData = data.id.map((timestamp: number) => {
          const date = new Date(timestamp)
          return date
            .toLocaleString('zh-CN', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              hour12: false,
            })
            .replace(/\//g, '-')
        })

        chart.setOption<ECOption>({
          animation: false,
          title: {
            text: '总力战分数变化',
            top: 25,
            left: 25,
          },
          graphic: [
            {
              type: 'text',
              right: '10%',
              bottom: '10%',
              z: 10,
              style: {
                fill: '#fff',
                text: '数据来源: arona.ai',
                font: '20px sans-serif',
              },
            },
          ],
          legend: {
            top: 25,
            data: ['一档', '二档', '三档'],
            right: 30,
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true,
          },
          xAxis: {
            data: xData,
            type: 'category',
          },
          yAxis: {
            type: 'value',
            scale: true,
          },
          series: [
            {
              name: '一档',
              data: data.platinum,
              type: 'line',
              smooth: true,
            },
            {
              name: '二档',
              data: data.gold,
              type: 'line',
              smooth: true,
            },
            {
              name: '三档',
              data: data.silver,
              type: 'line',
              smooth: true,
            },
          ],
        })
      }
      const img = Buffer.from(
        await sharp(Buffer.from(chart.renderToSVGString())).png().toBuffer(),
      )
      return c.body(img.buffer, 200, {
        'Content-Type': 'image/png',
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
  .get('/memberChange/:server', async (c) => {
    const { server } = c.req.param()
    if (server !== '1' && server !== '2' && server !== '3') {
      return c.json(
        {
          code: 400,
          message: '暂不支持的服务器',
        },
        { status: 400 },
      )
    }

    try {
      const height = 600
      const width = 900
      const chart = echarts.init(null, 'light', {
        renderer: 'svg',
        ssr: true,
        width: width,
        height: height,
      })

      if (server === '1' || server === '2') {
        const seasonList: SeasonData[] = (
          await iFetch(`${raidServer}/api/season/list`, { server })
        )['data'].reverse()
        const season = seasonList[seasonList.length - 1].season
        const totalMember: MemberChageData = (
          await iFetch(`${raidServer}/api/v2/rank/season/lastRank/charts`, {
            server,
            season,
          })
        )['data']

        const xData = totalMember.key.map((timestamp: number) => {
          const date = new Date(timestamp)
          return date
            .toLocaleString('zh-CN', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              hour12: false,
            })
            .replace(/\//g, '-')
        })

        const deltaY = totalMember.value.map((v, i) =>
          i === 0 ? 0 : v - totalMember.value[i - 1],
        )

        chart.setOption<ECOption>({
          animation: false,
          title: {
            text: '参与人数变化',
            top: 25,
            left: 25,
          },
          graphic: [
            {
              type: 'text',
              right: '10%',
              bottom: '10%',
              z: 10,
              style: {
                fill: '#fff',
                text: '数据来源: arona.icu',
                font: '20px sans-serif',
              },
            },
          ],
          legend: {
            top: 25,
            data: ['参与人数', '增长量'],
            right: 30,
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true,
          },
          xAxis: {
            data: xData,
            type: 'category',
          },
          yAxis: [
            {
              type: 'value',
              scale: true,
            },
            {
              type: 'value',
              scale: true,
              splitLine: {
                show: false,
              },
              position: 'right',
              axisLine: {
                show: true,
              },
            },
          ],
          series: [
            {
              name: '参与人数',
              data: totalMember.value,
              type: 'line',
              smooth: true,
              yAxisIndex: 0,
            },
            {
              name: '增长量',
              data: deltaY,
              type: 'line',
              smooth: true,
              yAxisIndex: 1,
            },
          ],
        })
      } else {
        const season = await getJPRaidSeason()
        const url = `https://media.arona.ai/data/v3/raid/${season}/total`
        const diffClearByTime: DiffClearByTime = (
          await iFetch(url, null, 'GET')
        )['diffClearByTime']

        const xData = diffClearByTime.id.map((timestamp: number) => {
          const date = new Date(timestamp)
          return date
            .toLocaleString('zh-CN', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              hour12: false,
            })
            .replace(/\//g, '-')
        })

        chart.setOption<ECOption>({
          animation: false,
          title: {
            text: '不同难度人数变化',
            top: 25,
            left: 25,
          },
          graphic: [
            {
              type: 'text',
              right: '10%',
              bottom: '10%',
              z: 10,
              style: {
                fill: '#fff',
                text: '数据来源: arona.ai',
                font: '20px sans-serif',
              },
            },
          ],
          legend: {
            top: 25,
            data: ['NM', 'HD', 'VH', 'HC', 'EX', 'INS', 'TM'],
            right: 30,
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true,
          },
          xAxis: {
            data: xData,
            type: 'category',
          },
          yAxis: {
            type: 'value',
            scale: true,
          },
          series: [
            {
              name: 'NM',
              data: diffClearByTime.lasts.map((last) => last[0]),
              type: 'line',
              smooth: true,
            },
            {
              name: 'HD',
              data: diffClearByTime.lasts.map((last) => last[1]),
              type: 'line',
              smooth: true,
            },
            {
              name: 'VH',
              data: diffClearByTime.lasts.map((last) => last[2]),
              type: 'line',
              smooth: true,
            },
            {
              name: 'HC',
              data: diffClearByTime.lasts.map((last) => last[3]),
              type: 'line',
              smooth: true,
            },
            {
              name: 'EX',
              data: diffClearByTime.lasts.map((last) => last[4]),
              type: 'line',
              smooth: true,
            },
            {
              name: 'INS',
              data: diffClearByTime.lasts.map((last) => last[5]),
              type: 'line',
              smooth: true,
            },
            {
              name: 'TM',
              data: diffClearByTime.lasts.map((last) => last[6]),
              type: 'line',
              smooth: true,
            },
          ],
        })
      }
      const img = Buffer.from(
        await sharp(Buffer.from(chart.renderToSVGString())).png().toBuffer(),
      )
      return c.body(img.buffer, 200, {
        'Content-Type': 'image/png',
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
  .get('/calculate/score/:server/:bossId/:time/:hard', async (c) => {
    const { server, bossId, time, hard } = c.req.param()
    if (!['1', '2', '3'].includes(server)) {
      return c.json(
        {
          code: 400,
          message: '暂不支持的服务器',
        },
        { status: 400 },
      )
    }
    try {
      const score: number = (
        await iFetch(
          `${raidServer}/raids/calculate_time/${server}?bossId=${bossId}&time=${time}&hard=${hard}`,
          null,
          'GET',
        )
      )['data']
      return c.json({
        code: 200,
        message: 'success',
        data: {
          score,
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
  .get('/calculate/point/:server/:bossId/:point', async (c) => {
    const { server, bossId, point } = c.req.param()
    if (!['1', '2', '3'].includes(server)) {
      return c.json(
        {
          code: 400,
          message: '暂不支持的服务器',
        },
        { status: 400 },
      )
    }
    try {
      const time: number = (
        await iFetch(
          `${raidServer}/raids/calculate/${server}?bossId=${bossId}&point=${point}`,
          null,
          'GET',
        )
      )['data']
      return c.json({
        code: 200,
        message: 'success',
        data: { time },
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
  .get('/update', async (c) => {
    const client = IOSS.getClient()
    const info = []
    // 更新总力战档线
    for (const server of [1, 2, 3]) {
      const imgPath = `/images/raid-line/${server}.png`
      try {
        const url = `http://localhost:${config.port}/raid/line/${server}`
        console.info(url)
        const browser = await IBrowser.launchBrowser()
        const page = await browser.newPage()
        await page.setViewportSize({
          width: 1920,
          height: 1080,
        })
        await page.goto(url, { waitUntil: 'networkidle' })
        const card = await page.$('#card')
        if (!card) throw new Error('Card element not found')
        const screenshot = await card.screenshot({
          type: 'png',
          omitBackground: true,
        })
        const data = Buffer.from(screenshot)
        await client.putObject(config.bucket, imgPath, data)
        info.push(`更新${server}成功`)
      } catch (e) {
        console.error(e)
        info.push(`更新${server}失败`)
      }
    }
    return c.json({
      code: 200,
      message: 'success',
      data: info,
    })
  })

export default app
