import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { Skeleton } from '@/components/ui/skeleton'

describe('Skeleton component', () => {
  it('renders with default classes', () => {
    render(<Skeleton data-testid="skeleton" />)
    const skeleton = screen.getByTestId('skeleton')
    expect(skeleton).toBeInTheDocument()
    // Check that default classes are applied
    expect(skeleton.className).toMatch(/animate-pulse/)
    expect(skeleton.className).toMatch(/rounded-md/)
    expect(skeleton.className).toMatch(/bg-primary\/10/)
  })

  it('applies additional custom classes', () => {
    render(<Skeleton data-testid="skeleton" className="custom-class" />)
    const skeleton = screen.getByTestId('skeleton')
    expect(skeleton).toHaveClass('custom-class')
  })
})
