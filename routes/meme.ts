import { config } from '@/config'
import { IOSS } from '@/utils/oss'
import { createHash } from 'crypto'
import { Hono } from 'hono'

const app = new Hono()

app.get('/', async (c) => {
  const client = await IOSS.getClient()
  try {
    const files = (
      await client.list(
        {
          prefix: 'images/meme/',
          'max-keys': 1000,
        },
        {}
      )
    ).objects.map((file, index) => {
      const hash = createHash('sha256').update(file.lastModified).digest('hex')
      return {
        name: file.name,
        url: file.url.replace(
          'http://arona.oss-cn-shanghai.aliyuncs.com',
          config.baseUrl
        ),
        hash,
      }
    })
    return c.json({
      code: 200,
      message: 'success',
      data: files.slice(1),
    })
  } catch (e) {
    console.error(e)
  }
  return c.json(
    {
      code: 500,
      message: 'Internal Server Error',
      data: {},
    },
    500
  )
})

export default app
