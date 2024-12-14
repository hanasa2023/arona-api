import { config } from '@/config'
import OSS from 'ali-oss'

export class IOSS {
  private static instance: OSS | null = null
  static getClient() {
    if (!this.instance) {
      this.instance = new OSS({
        region: config.ossRegion,
        accessKeyId: config.ossAccessKeyId,
        accessKeySecret: config.ossAccessKeySecret,
        endpoint: config.ossEndpoint,
        bucket: config.bucket,
      })
    }
    return this.instance
  }
  static async isObjectExist(name: string) {
    let isExist = false
    try {
      await IOSS.getClient().head(name)
      isExist = true
    } catch (e: any) {
      if (e.code === 'NoSuchKey') {
        isExist = false
      }
    } finally {
      return isExist
    }
  }
}
