import Avatar from '@mui/material/Avatar'
import MenuItem from '@mui/material/MenuItem'
import Select, { type SelectChangeEvent } from '@mui/material/Select'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { getTokenIcon } from '../utils/tokenIcons'

function TokenIcon({ currency }: { currency: string }) {
  const icon = getTokenIcon(currency)
  if (icon) {
    return <Avatar src={icon} alt="" sx={{ width: 24, height: 24 }} />
  }
  return (
    <Avatar sx={{ width: 24, height: 24, fontSize: 11 }}>
      {currency.slice(0, 2).toUpperCase()}
    </Avatar>
  )
}

interface TokenSelectProps {
  label: string
  value: string
  currencies: string[]
  onChange: (currency: string) => void
}

export function TokenSelect({ label, value, currencies, onChange }: TokenSelectProps) {
  const handleChange = (event: SelectChangeEvent) => {
    onChange(event.target.value)
  }

  return (
    <Select
      value={value}
      onChange={handleChange}
      size="small"
      aria-label={label}
      renderValue={(selected) => (
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <TokenIcon currency={selected} />
          <Typography sx={{ fontWeight: 600 }}>{selected}</Typography>
        </Stack>
      )}
      sx={{
        minWidth: 140,
        borderRadius: 3,
        '& fieldset': { border: 'none' },
      }}
    >
      {currencies.map((currency) => (
        <MenuItem key={currency} value={currency}>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <TokenIcon currency={currency} />
            <Typography>{currency}</Typography>
          </Stack>
        </MenuItem>
      ))}
    </Select>
  )
}
