import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { Textarea } from '@/components/ui/textarea'

describe('Textarea component', () => {
  it('renders with default classes', () => {
    render(<Textarea data-testid="textarea" />)
    const textarea = screen.getByTestId('textarea')
    expect(textarea).toBeInTheDocument()
    // Check for a few default classes from the cn utility
    expect(textarea.className).toMatch(/min-h-\[60px\]/)
    expect(textarea.className).toMatch(/rounded-md/)
    expect(textarea.className).toMatch(/border/)
  })

  it('renders with the correct placeholder', () => {
    render(<Textarea data-testid="textarea" placeholder="Enter your text here" />)
    const textarea = screen.getByTestId('textarea')
    expect(textarea).toHaveAttribute('placeholder', 'Enter your text here')
  })

  it('forwards additional props correctly', () => {
    render(<Textarea data-testid="textarea" disabled />)
    const textarea = screen.getByTestId('textarea')
    expect(textarea).toBeDisabled()
  })
})
