import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import PdfViewer from '@/components/PdfViewer'
import { apiGETDocument } from '@/api/documentsApiMethods'

// Mock the API call module
jest.mock('@/api/documentsApiMethods', () => ({
  apiGETDocument: jest.fn()
}))

const fakePdfUrl = 'https://example.com/fake.pdf'

describe('PdfViewer', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('shows the loading message initially', async () => {
    // Set up the mock to resolve
    ; (apiGETDocument as jest.Mock).mockResolvedValueOnce(fakePdfUrl)
    render(<PdfViewer document_id="123" />)
    await waitFor(() => {
      expect(screen.getByText(/Loading PDF.../i)).toBeInTheDocument()
    })
  })

  it('renders an iframe with the correct src after fetching the PDF', async () => {
    ; (apiGETDocument as jest.Mock).mockResolvedValueOnce(fakePdfUrl)
    render(<PdfViewer document_id="123" />)
    const iframe = await screen.findByTitle('PDF Viewer')
    expect(iframe).toBeInTheDocument()
    expect(iframe).toHaveAttribute('src', fakePdfUrl)
  })

  it('logs an error and continues showing the loading message when fetching fails', async () => {
    const errorMessage = 'Fetch failed'
      ; (apiGETDocument as jest.Mock).mockRejectedValueOnce(new Error(errorMessage))
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => { })

    render(<PdfViewer document_id="123" />)

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error fetching PDF:',
        expect.any(Error)
      )
    })

    await waitFor(() => {
      expect(screen.getByText(/Loading PDF.../i)).toBeInTheDocument()
    })

    consoleErrorSpy.mockRestore()
  })
})
