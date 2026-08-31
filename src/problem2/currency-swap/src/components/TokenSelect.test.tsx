import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { TokenSelect } from './TokenSelect'

vi.mock('../utils/tokenIcons', () => ({
  getTokenIcon: (currency: string) => (currency === 'ZZZ' ? undefined : `${currency}-icon.svg`),
}))

describe('TokenSelect', () => {
  it('displays the currently selected currency', () => {
    render(
      <TokenSelect label="From currency" value="ETH" currencies={['ETH', 'USDC']} onChange={vi.fn()} />,
    )

    expect(screen.getByRole('combobox', { name: 'From currency' })).toHaveTextContent('ETH')
  })

  it('calls onChange with the newly picked currency', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()
    render(
      <TokenSelect
        label="From currency"
        value="ETH"
        currencies={['ETH', 'USDC']}
        onChange={handleChange}
      />,
    )

    await user.click(screen.getByRole('combobox', { name: 'From currency' }))
    await user.click(screen.getByRole('option', { name: 'USDC' }))

    expect(handleChange).toHaveBeenCalledWith('USDC')
  })

  it('falls back to the currency initials when no icon is available', () => {
    render(
      <TokenSelect label="To currency" value="ZZZ" currencies={['ZZZ']} onChange={vi.fn()} />,
    )

    expect(screen.getByText('ZZ')).toBeInTheDocument()
  })
})
