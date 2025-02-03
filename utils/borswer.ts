import Chromium from '@sparticuz/chromium'
import puppeteer, { Browser } from 'puppeteer-core'

export namespace IBrowser {
  let browser: Browser | null = null
  export async function launchBrowser() {
    if (!browser) {
      Chromium.setGraphicsMode = false
      browser = await puppeteer.launch({
        args: Chromium.args,
        defaultViewport: Chromium.defaultViewport,
        executablePath: await Chromium.executablePath(),
        headless: Chromium.headless === 'shell' ? 'shell' : true,
      })
    }
    return browser
  }

  export async function closeBrowser() {
    if (browser) {
      await browser.close()
      browser = null
    }
  }
}
