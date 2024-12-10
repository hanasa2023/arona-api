import { z } from 'zod'

const envSchema = z.object({
  NEXT_PUBLIC_BASE_URL: z.string().url(),
})

const env = envSchema.parse({
  NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
})

export const config = {
  baseUrl: env.NEXT_PUBLIC_BASE_URL,
} as const

export type Config = typeof config
