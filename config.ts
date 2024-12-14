import { z } from 'zod'

const envSchema = z.object({
  BASE_URL: z.string().url(),
  PORT: z.string().min(1),
  OSS_ACCESS_KEY_ID: z.string().min(1),
  OSS_ACCESS_KEY_SECRET: z.string().min(1),
  OSS_REGION: z.string(),
  OSS_ENDPOINT: z.string(),
  BUCKET: z.string(),
})

const env = envSchema.parse({
  BASE_URL: process.env.BASE_URL,
  PORT: process.env.PORT,
  OSS_ACCESS_KEY_ID: process.env.OSS_ACCESS_KEY_ID,
  OSS_ACCESS_KEY_SECRET: process.env.OSS_ACCESS_KEY_SECRET,
  OSS_REGION: process.env.OSS_REGION,
  OSS_ENDPOINT: process.env.OSS_ENDPOINT,
  BUCKET: process.env.BUCKET,
})

export const config = {
  baseUrl: env.BASE_URL,
  port: env.PORT,
  ossAccessKeyId: env.OSS_ACCESS_KEY_ID,
  ossAccessKeySecret: env.OSS_ACCESS_KEY_SECRET,
  ossRegion: env.OSS_REGION,
  ossEndpoint: env.OSS_ENDPOINT,
  bucket: env.BUCKET,
} as const

export type Config = typeof config
