import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { Input } from '@/components/ui/input'

describe('Input component', () => {
  it('renders correctly with given placeholder', () => {
    render(<Input data-testid="input" placeholder="Enter text" />)
    const inputElement = screen.getByTestId('input')
    expect(inputElement).toBeInTheDocument()
    expect(inputElement).toHaveAttribute('placeholder', 'Enter text')
  })

  it('applies additional classes', () => {
    render(<Input data-testid="input" className="custom-class" />)
    const inputElement = screen.getByTestId('input')
    expect(inputElement).toBeInTheDocument()
    expect(inputElement.className).toContain('custom-class')
  })

  it('respects the type attribute', () => {
    render(<Input data-testid="input" type="email" />)
    const inputElement = screen.getByTestId('input')
    expect(inputElement).toBeInTheDocument()
    expect(inputElement).toHaveAttribute('type', 'email')
  })
})
