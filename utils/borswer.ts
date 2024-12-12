import puppeteer, { Browser } from 'puppeteer'

export namespace IBrowser {
  let browser: Browser | null = null
  export async function launchBrowser() {
    if (!browser) {
      browser = await puppeteer.launch()
    }
    return browser
  }
}
