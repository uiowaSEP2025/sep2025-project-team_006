import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom';
import HomePage from '../app/page'

describe('HomePage', () => {
  it('renders the welcome message and description', () => {
    render(<HomePage />)
    expect(screen.getByRole('heading', { name: /Welcome to GAP/i })).toBeInTheDocument()
    expect(screen.getByText(/Your one-stop solution for graduate student management./i)).toBeInTheDocument()
  })

  it('renders Faculty and Students links with correct href attributes', () => {
    render(<HomePage />)
    const facultyLink = screen.getByRole('link', { name: /Faculty/i })
    const studentsLink = screen.getByRole('link', { name: /Students/i })
    
    expect(facultyLink).toHaveAttribute('href', '/faculty')
    expect(studentsLink).toHaveAttribute('href', '/students')
  })

  it('applies the background image style to the outer div', () => {
    const { container } = render(<HomePage />)
    const outerDiv = container.firstChild as HTMLElement
    expect(outerDiv).toHaveStyle("background-image: url('./background_image.jpg')")
  })
})
