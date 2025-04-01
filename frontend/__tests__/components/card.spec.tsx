import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card'

describe('Card component', () => {
  it('renders the Card with provided className', () => {
    const { getByTestId } = render(
      <Card className="custom-class" data-testid="card" />
    )
    const cardElement = getByTestId('card')
    expect(cardElement).toBeInTheDocument()
    expect(cardElement).toHaveClass(
      'rounded-xl',
      'border',
      'bg-card',
      'text-card-foreground',
      'shadow',
      'custom-class'
    )
  })

  it('renders CardHeader with children and correct classes', () => {
    const headerText = 'Card Header'
    const { getByTestId } = render(
      <CardHeader data-testid="card-header">{headerText}</CardHeader>
    )
    const headerEl = getByTestId('card-header')
    expect(headerEl).toBeInTheDocument()
    expect(headerEl).toHaveClass('flex', 'flex-col', 'space-y-1.5', 'p-6')
  })

  it('renders CardTitle with children and correct classes', () => {
    const titleText = 'Card Title'
    const { getByTestId } = render(
      <CardTitle data-testid="card-title">{titleText}</CardTitle>
    )
    const titleEl = getByTestId('card-title')
    expect(titleEl).toBeInTheDocument()
    expect(titleEl).toHaveClass('font-semibold', 'leading-none', 'tracking-tight')
  })

  it('renders CardDescription with children and correct classes', () => {
    const descriptionText = 'Card description goes here'
    const { getByTestId } = render(
      <CardDescription data-testid="card-description">{descriptionText}</CardDescription>
    )
    const descriptionEl = getByTestId('card-description')
    expect(descriptionEl).toBeInTheDocument()
    expect(descriptionEl).toHaveClass('text-sm', 'text-muted-foreground')
  })

  it('renders CardContent with children and correct classes', () => {
    const contentText = 'Main card content'
    const { getByTestId } = render(
      <CardContent data-testid="card-content">{contentText}</CardContent>
    )
    const contentEl = getByTestId('card-content')
    expect(contentEl).toBeInTheDocument()
    expect(contentEl).toHaveClass('p-6', 'pt-0')
  })

  it('renders CardFooter with children and correct classes', () => {
    const footerText = 'Footer content'
    const { getByTestId } = render(
      <CardFooter data-testid="card-footer">{footerText}</CardFooter>
    )
    const footerEl = getByTestId('card-footer')
    expect(footerEl).toBeInTheDocument()
    expect(footerEl).toHaveClass('flex', 'items-center', 'p-6', 'pt-0')
  })
})
