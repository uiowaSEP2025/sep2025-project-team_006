import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { Separator } from '@/components/ui/separator'

describe('Separator component', () => {
  it('renders as a horizontal separator by default', () => {
    render(<Separator data-testid="separator-horizontal" />)
    const separator = screen.getByTestId('separator-horizontal')
    expect(separator).toBeInTheDocument()
    expect(separator.className).toMatch(/h-\[1px\]/)
    expect(separator.className).toMatch(/w-full/)
    expect(separator.className).toMatch(/bg-border/)
  })

  it('renders as a vertical separator when orientation is set to vertical', () => {
    render(<Separator orientation="vertical" data-testid="separator-vertical" />)
    const separator = screen.getByTestId('separator-vertical')
    expect(separator).toBeInTheDocument()
    expect(separator.className).toMatch(/h-full/)
    expect(separator.className).toMatch(/w-\[1px\]/)
    expect(separator.className).toMatch(/bg-border/)
  })

  it('applies additional custom classes', () => {
    render(<Separator data-testid="separator-custom" className="custom-class" />)
    const separator = screen.getByTestId('separator-custom')
    expect(separator).toBeInTheDocument()
    expect(separator.className).toContain('custom-class')
  })
})
