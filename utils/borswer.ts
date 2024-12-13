import { chromium, Browser } from 'playwright'

export namespace IBrowser {
  let browser: Browser | null = null
  export async function launchBrowser() {
    if (!browser) {
      browser = await chromium.launch()
    }
    return browser
  }
}
