import { useEffect, useMemo, useState } from 'react'
import CssBaseline from '@mui/material/CssBaseline'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { ThemeProvider } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import { fetchTokenPrices } from './datasources/priceApi'
import type { TokenPrice } from './types/price'
import { getTheme } from './theme'
import { SwapForm } from './components/SwapForm'
import { SwapFormSkeleton } from './components/SwapFormSkeleton'

function App() {
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)')
  const theme = useMemo(() => getTheme(prefersDark ? 'dark' : 'light'), [prefersDark])

  const [prices, setPrices] = useState<TokenPrice[] | null>(null)

  useEffect(() => {
    fetchTokenPrices().then(setPrices)
  }, [])

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Stack sx={{ minHeight: '100svh', alignItems: 'center', justifyContent: 'center', p: 2 }}>
        <Card sx={{ width: { xs: 360, sm: 800 }, maxWidth: '100%' }} elevation={4}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
              Currency Swap
            </Typography>
            {prices ? <SwapForm prices={prices} /> : <SwapFormSkeleton />}
          </CardContent>
        </Card>
      </Stack>
    </ThemeProvider>
  )
}

export default App
