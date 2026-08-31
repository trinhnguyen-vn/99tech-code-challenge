import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import type { TokenPrice } from '../types'
import { SwapForm } from './SwapForm'

vi.mock('../utils/tokenIcons', () => ({
  getTokenIcon: () => undefined,
}))

const prices: TokenPrice[] = [
  { currency: 'ETH', price: 2000, date: '2024-01-01' },
  { currency: 'USDC', price: 1, date: '2024-01-01' },
]

const numberFormat = new Intl.NumberFormat(undefined, { maximumFractionDigits: 6 })

describe('SwapForm', () => {
  it('converts the default amount using the from/to prices', () => {
    render(<SwapForm prices={prices} />)

    expect(screen.getByDisplayValue(numberFormat.format(2000))).toBeInTheDocument()
    expect(screen.getByText(`1 ETH ≈ ${numberFormat.format(2000)} USDC`)).toBeInTheDocument()
  })

  it('recomputes the converted amount as the amount changes', async () => {
    const user = userEvent.setup()
    render(<SwapForm prices={prices} />)

    const amountInput = screen.getByDisplayValue('1')
    await user.clear(amountInput)
    await user.type(amountInput, '3')

    expect(screen.getByDisplayValue(numberFormat.format(6000))).toBeInTheDocument()
  })

  it('shows a validation error for a non-positive amount and does not submit', async () => {
    const user = userEvent.setup()
    render(<SwapForm prices={prices} />)

    const amountInput = screen.getByDisplayValue('1')
    await user.clear(amountInput)
    await user.type(amountInput, '0')
    await user.click(screen.getByRole('button', { name: /confirm swap/i }))

    expect(await screen.findByText(/enter a valid amount/i)).toBeInTheDocument()
    expect(screen.queryByText(/^Swapped/)).not.toBeInTheDocument()
  })

  it('flips the from/to currencies', async () => {
    const user = userEvent.setup()
    render(<SwapForm prices={prices} />)

    await user.click(screen.getByRole('button', { name: /swap currencies/i }))

    expect(
      screen.getByText(`1 USDC ≈ ${numberFormat.format(0.0005)} ETH`),
    ).toBeInTheDocument()
  })

  it('submits and shows a success message after the mock delay', async () => {
    const user = userEvent.setup()
    render(<SwapForm prices={prices} />)

    const submitButton = screen.getByRole('button', { name: /confirm swap/i })
    await user.click(submitButton)

    expect(submitButton).toBeDisabled()
    expect(
      await screen.findByText(
        `Swapped 1 ETH → ${numberFormat.format(2000)} USDC`,
        {},
        { timeout: 2000 },
      ),
    ).toBeInTheDocument()
  })
})
