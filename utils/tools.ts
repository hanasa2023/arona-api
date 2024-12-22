export function getRandomSamples<T>(array: T[], num: number): T[] {
  if (num >= array.length) {
    num = array.length
  }
  const result = [...array]
  for (let i = 0; i < num; i++) {
    const randomIndex = Math.floor(Math.random() * (array.length - i)) + i
    ;[result[i], result[randomIndex]] = [result[randomIndex], result[i]]
  }
  return result.slice(0, num)
}

export function parseRedisHash<T>(hash: Record<string, string>): T {
  const parsedData = Object.entries(hash).reduce((acc, [field, value]) => {
    const parsedValue = isNaN(Number(value)) ? value : Number(value)
    acc[field as keyof T] = parsedValue as T[keyof T]
    return acc
  }, {} as T)

  return parsedData
}

export function formatTime(milliseconds: number): string {
  const totalSeconds = Math.floor(milliseconds / 1000)

  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60

  const remainingMilliseconds = milliseconds % 1000

  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(
    seconds
  ).padStart(2, '0')}.${String(remainingMilliseconds).padStart(3, '0')}`

  return formattedTime
}
