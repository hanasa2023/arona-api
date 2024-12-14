import { Hono } from 'hono'
import { IOSS } from '@/utils/oss'
import { config } from '@/config'
import { createHash } from 'crypto'

const app = new Hono()

app.get('/:name', async (c) => {
  const { name } = c.req.param()
  const imgPath = `/images/strategy/${name}.png`
  const isImgExist = await IOSS.isObjectExist(imgPath)
  if (isImgExist) {
    const head = (await IOSS.getClient().head(imgPath)) as {
      res: { headers: { date: string } }
    }
    const hash = createHash('sha256')
      .update(head.res.headers['date'])
      .digest('hex')
    return c.json({
      code: 200,
      message: 'success',
      data: {
        imgUrl: `${config.baseUrl}${imgPath}`,
        hash,
      },
    })
  }
  return c.json(
    {
      code: 500,
      message: 'Invalid strategy name',
      data: {},
    },
    500
  )
})

export default app
