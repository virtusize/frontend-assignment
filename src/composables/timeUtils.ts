/**
 * Returns ISO‑8601 formatted datetime with local timezone offset.
 * Example: "2025-08-05T15:30:45 -07:00"
 */
export function toIsoWithOffset(date: Date = new Date()): string {
  const pad = (n: number) => (n < 10 ? '0' : '') + n

  const year = date.getFullYear()
  const mo = pad(date.getMonth() + 1)
  const day = pad(date.getDate())
  const hr = pad(date.getHours())
  const min = pad(date.getMinutes())
  const sec = pad(date.getSeconds())

  // getTimezoneOffset returns minutes offset from UTC, positive if local is behind UTC
  const tzo = -date.getTimezoneOffset()
  const sign = tzo >= 0 ? '+' : '-'
  const absOffset = Math.abs(tzo)
  const offH = pad(Math.floor(absOffset / 60))
  const offM = pad(absOffset % 60)

  return `${year}-${mo}-${day}T${hr}:${min}:${sec} ${sign}${offH}:${offM}`
}

export function toLocaleFormattedString(date: string): string {
  return new Intl.DateTimeFormat(undefined).format(new Date(date.replace(' ', '')))
}
