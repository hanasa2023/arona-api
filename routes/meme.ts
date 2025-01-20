import { config } from '@/config'
import { bucket } from '@/utils/constants'
import { IOSS } from '@/utils/oss'
import { createHash } from 'crypto'
import { Hono } from 'hono'

const app = new Hono()

app.get('/', async (c) => {
  const client = IOSS.getClient()
  const stream = client.extensions.listObjectsV2WithMetadata(
    bucket,
    'images/meme/',
  )

  const files: {}[] = []

  await new Promise((resolve, reject) => {
    stream.on('data', (obj) => {
      const hash = createHash('sha256')
        .update(obj.lastModified?.toTimeString() ?? '')
        .digest('hex')
      files.push({
        name: obj.name,
        url: `${config.baseUrl}/${config.bucket}/objects/download?prefix=${obj.name}`,
        hash,
      })
    })

    stream.on('error', (err) => {
      console.info(err)
      reject(
        c.json(
          {
            code: 500,
            message: 'Internal Server Error',
          },
          { status: 500 },
        ),
      )
    })

    stream.on('end', () => {
      resolve(null)
    })
  })

  return c.json({
    code: 200,
    message: 'success',
    data: files.slice(1),
  })
})

export default app
