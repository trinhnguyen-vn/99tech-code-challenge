import { useMemo, useState, type FormEvent } from 'react'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import SwapVertRoundedIcon from '@mui/icons-material/SwapVertRounded'
import type { TokenPrice } from '../types'
import { TokenSelect } from './TokenSelect'

const SUBMIT_DELAY_MS = 900

const numberFormat = new Intl.NumberFormat(undefined, { maximumFractionDigits: 6 })

interface SwapFormProps {
  prices: TokenPrice[]
}

export function SwapForm({ prices }: SwapFormProps) {
  const currencies = useMemo(() => prices.map((p) => p.currency), [prices])
  const priceByCurrency = useMemo(
    () => new Map(prices.map((p) => [p.currency, p.price])),
    [prices],
  )

  const [fromCurrency, setFromCurrency] = useState("ETH")
  const [toCurrency, setToCurrency] = useState("USD")
  const [amount, setAmount] = useState('1')
  const [amountTouched, setAmountTouched] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const amountNumber = Number(amount)
  const isAmountValid = amount.trim() !== '' && Number.isFinite(amountNumber) && amountNumber > 0
  const amountError = amountTouched && !isAmountValid

  const fromPrice = priceByCurrency.get(fromCurrency) ?? 0
  const toPrice = priceByCurrency.get(toCurrency) ?? 0
  const rate = toPrice > 0 ? fromPrice / toPrice : 0
  const convertedAmount = isAmountValid ? amountNumber * rate : 0

  const fromOptions = currencies.filter((c) => c !== toCurrency)
  const toOptions = currencies.filter((c) => c !== fromCurrency)

  const handleFlip = () => {
    setFromCurrency(toCurrency)
    setToCurrency(fromCurrency)
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    setAmountTouched(true)
    if (!isAmountValid || submitting) return

    setSubmitting(true)
    setTimeout(() => {
      setSubmitting(false)
      setSuccessMessage(
        `Swapped ${numberFormat.format(amountNumber)} ${fromCurrency} → ${numberFormat.format(convertedAmount)} ${toCurrency}`,
      )
    }, SUBMIT_DELAY_MS)
  }

  return (
    <>
      <Stack component="form" spacing={2} onSubmit={handleSubmit}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
        >
          <Stack spacing={1} sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="caption" color="text.secondary">
              Amount to send
            </Typography>
            <TextField
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              onBlur={() => setAmountTouched(true)}
              error={amountError}
              helperText={amountError ? 'Enter a valid amount. Amount must be greater than 0 and contain only numbers.' : ' '}
              size="small"
              fullWidth
              inputMode="decimal"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <TokenSelect
                        label="From currency"
                        value={fromCurrency}
                        currencies={fromOptions}
                        onChange={setFromCurrency}
                      />
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Stack>

          <IconButton
            onClick={handleFlip}
            size="small"
            aria-label="Swap currencies"
            sx={{
              alignSelf: 'center',
              border: '1px solid',
              borderColor: 'divider',
              transition: 'transform 0.25s ease',
              '&:hover': { transform: 'rotate(180deg)' },
            }}
          >
            <SwapVertRoundedIcon fontSize="small" sx={{ transform: { sm: 'rotate(90deg)' } }} />
          </IconButton>

          <Stack spacing={1} sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="caption" color="text.secondary">
              Amount to receive
            </Typography>
            <TextField
              value={isAmountValid ? numberFormat.format(convertedAmount) : ''}
              placeholder="0"
              size="small"
              fullWidth
              helperText=" "
              slotProps={{
                input: {
                  readOnly: true,
                  startAdornment: (
                    <InputAdornment position="start">
                      <TokenSelect
                        label="To currency"
                        value={toCurrency}
                        currencies={toOptions}
                        onChange={setToCurrency}
                      />
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Stack>
        </Stack>

        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
          1 {fromCurrency} ≈ {numberFormat.format(rate)} {toCurrency}
        </Typography>

        <Button type="submit" variant="contained" size="large" loading={submitting}>
          Confirm Swap
        </Button>
      </Stack>

      <Snackbar
        open={successMessage !== null}
        autoHideDuration={4000}
        onClose={() => setSuccessMessage(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="success" variant="filled" onClose={() => setSuccessMessage(null)}>
          {successMessage}
        </Alert>
      </Snackbar>
    </>
  )
}
