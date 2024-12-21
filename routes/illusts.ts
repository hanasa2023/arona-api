import { config } from '@/config'
import { Database } from '@/db/database'
import { IRequest } from '@/types'
import { Hono } from 'hono'
import { validator } from 'hono/validator'

const app = new Hono()

app
  .post(
    '/getIllusts',
    validator('json', (value) => {
      return value
    }),
    async (c) => {
      const originalReq = await c.req.valid('json')
      const realReq: IRequest = {
        num: originalReq.num || 1,
        tags: originalReq.tags || [],
        isAI: originalReq.isAI || false,
        restrict: originalReq.restrict || 'safe',
      }

      const db = new Database(config.redisUrl)

      try {
        const illusts = await db.getIllusts(realReq)
        return c.json({
          code: 200,
          message: illusts.length === 0 ? '未找到符合条件的插画' : 'success',
          data: { illusts, total: illusts.length },
        })
      } catch (error) {
        console.error(error)
        return c.json(
          {
            code: 500,
            message: 'Internal Server Error',
          },
          { status: 500 }
        )
      }
    }
  )
  .post(
    '/setIllusts',
    validator('json', (value) => value),
    async (c) => {
      const { pid } = await c.req.valid('json')
      const db = new Database(config.redisUrl)
      try {
        const res = await db.setIllusts(pid.toString())
        return c.json({
          code: 200,
          message: res,
        })
      } catch (error) {
        console.error(error)
        return c.json(
          {
            code: 500,
            message: 'Internal Server Error',
          },
          { status: 500 }
        )
      }
    }
  )
  .get('/love/:type/:pid', async (c) => {
    const { pid, type } = c.req.param()
    const db = new Database(config.redisUrl)
    const result = await db.updateLoveMembers(pid, type)
    return c.json({
      code: 200,
      message: result,
    })
  })
  .get('/hate/:type/:pid', async (c) => {
    const { pid, type } = c.req.param()
    const db = new Database(config.redisUrl)
    const result = await db.updateHateMembers(pid, type)
    return c.json({
      code: 200,
      message: result,
    })
  })

export default app
