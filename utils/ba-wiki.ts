export class BAWiki {
  baseUrl: string = 'https://gamekee.com/bawiki'
  async getMainUrlFromTitle(title: string) {
    const res = await fetch(`${this.baseUrl}`)
    if (res.ok) {
    }
  }
}
