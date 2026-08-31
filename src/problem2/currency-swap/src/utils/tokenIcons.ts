const iconModules = import.meta.glob('../assets/tokens/*.svg', {
  eager: true,
  import: 'default',
  query: '?url',
}) as Record<string, string>

const iconByLowercaseSymbol = new Map<string, string>()

for (const [path, url] of Object.entries(iconModules)) {
  const fileName = path.split('/').pop() ?? ''
  const symbol = fileName.replace(/\.svg$/i, '')
  iconByLowercaseSymbol.set(symbol.toLowerCase(), url)
}

export function getTokenIcon(currency: string): string | undefined {
  return iconByLowercaseSymbol.get(currency.toLowerCase())
}
