// __tests__/components/label.spec.tsx
import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { Label } from '@/components/ui/label'

describe('Label component', () => {
  it('renders correctly with given text', () => {
    render(<Label data-testid="label">Test Label</Label>)
    const labelElement = screen.getByTestId('label')
    expect(labelElement).toBeInTheDocument()
    expect(labelElement).toHaveTextContent('Test Label')
  })

  it('applies custom classes', () => {
    render(<Label data-testid="label" className="custom-class" />)
    const labelElement = screen.getByTestId('label')
    expect(labelElement).toHaveClass('custom-class')
  })

  it('has default styling classes', () => {
    render(<Label data-testid="label">Test Label</Label>)
    const labelElement = screen.getByTestId('label')
    expect(labelElement.className).toMatch(/text-sm/)
    expect(labelElement.className).toMatch(/font-medium/)
    expect(labelElement.className).toMatch(/leading-none/)
  })
})
