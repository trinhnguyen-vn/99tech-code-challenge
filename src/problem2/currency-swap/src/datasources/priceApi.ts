import rawPrices from './prices.json'
import type { TokenPrice } from '../types'

const FETCH_DELAY_MS = 700

function dedupeLatestByCurrency(entries: TokenPrice[]): TokenPrice[] {
  const latestByCurrency = new Map<string, TokenPrice>()

  for (const entry of entries) {
    const existing = latestByCurrency.get(entry.currency)
    if (!existing || new Date(entry.date) > new Date(existing.date)) {
      latestByCurrency.set(entry.currency, entry)
    }
  }

  return [...latestByCurrency.values()]
}

/** Simulates a network call to a price service backed by the local price snapshot. */
export function fetchTokenPrices(): Promise<TokenPrice[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const valid = (rawPrices as TokenPrice[]).filter(
        (entry) => Number.isFinite(entry.price) && entry.price > 0,
      )
      const deduped = dedupeLatestByCurrency(valid)
      deduped.sort((a, b) => a.currency.localeCompare(b.currency))
      resolve(deduped)
    }, FETCH_DELAY_MS)
  })
}
