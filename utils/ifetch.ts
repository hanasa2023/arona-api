import { config } from '@/config'

export async function iFetch(
  url: string,
  body: any,
  method: 'POST' | 'GET' = 'POST'
  // referer: string = 'https://arona.icu'
): Promise<any> {
  try {
    if (method === 'POST') {
      const response = await fetch(url, {
        method: 'POST',
        headers: new Headers({
          // Referer: referer,
          'Content-Type': 'application/json',
          Authorization: 'ba-token uuz:uuz',
        }),
        body: JSON.stringify(body),
      })

      return response.json()
    } else {
      const response = await fetch(url, {
        method: 'GET',
        headers: new Headers({
          Referer: 'https://arona.icu',
          'Content-Type': 'application/json',
          Authorization: config.aronaIcuToken,
        }),
      })

      return response.json()
    }
  } catch (e) {
    console.error(e)
  }
}
