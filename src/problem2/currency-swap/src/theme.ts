import { createTheme, type PaletteMode } from '@mui/material/styles'

export function getTheme(mode: PaletteMode) {
  return createTheme({
    palette: {
      mode,
      primary: { main: mode === 'dark' ? '#c084fc' : '#7c3aed' },
    },
    shape: { borderRadius: 16 },
    typography: {
      fontFamily: 'system-ui, "Segoe UI", Roboto, sans-serif',
    },
  })
}
