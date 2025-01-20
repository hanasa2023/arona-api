import { config } from '@/config'
import * as Minio from 'minio'
import { bucket } from './constants'

export class IOSS {
  private static instance: Minio.Client | null = null
  static getClient() {
    if (!this.instance) {
      this.instance = new Minio.Client({
        endPoint: config.ossEndpoint,
        useSSL: true,
        accessKey: config.ossAccessKeyId,
        secretKey: config.ossAccessKeySecret,
      })
    }
    return this.instance
  }
  static async isObjectExist(name: string) {
    let isExist = false
    try {
      await IOSS.getClient().statObject(bucket, name)
      isExist = true
    } catch (e: any) {
      isExist = false
    } finally {
      return isExist
    }
  }
}
