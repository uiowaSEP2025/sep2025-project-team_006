import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import axios from 'axios'
import * as XLSX from 'xlsx'
import ExcelViewer from '@/components/ExcelViewer'

// Mock axios
jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

// Mock XLSX functions
jest.mock('xlsx', () => ({
  read: jest.fn(),
  utils: {
    sheet_to_json: jest.fn()
  }
}))

describe('ExcelViewer', () => {
  const document_id = '123'
  const validMimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('shows the loading message initially', async () => {
    // Return a pending promise for axios.get
    mockedAxios.get.mockReturnValue(new Promise(() => {}))
    render(<ExcelViewer document_id={document_id} />)
    expect(screen.getByText(/Loading Excel data.../i)).toBeInTheDocument()
  })

  it('renders an error message when the fetched file is not a valid Excel file', async () => {
    // Create a fake blob with a wrong MIME type.
    const fakeBlob = {
      type: 'text/plain',
      arrayBuffer: async () => new ArrayBuffer(8)
    }
    mockedAxios.get.mockResolvedValueOnce({ data: fakeBlob })

    render(<ExcelViewer document_id={document_id} />)

    await waitFor(() => {
      expect(screen.getByText(/The fetched document is not a valid Excel file./i)).toBeInTheDocument()
    })
  })

  it('renders an error message when axios.get fails', async () => {
    const errorMsg = 'Network Error'
    mockedAxios.get.mockRejectedValueOnce(new Error(errorMsg))

    // Spy on console.error to suppress the error output in test logs.
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

    render(<ExcelViewer document_id={document_id} />)

    await waitFor(() => {
      expect(screen.getByText(/Failed to load Excel document./i)).toBeInTheDocument()
    })

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Error fetching or parsing Excel file:',
      expect.any(Error)
    )

    consoleErrorSpy.mockRestore()
  })

  it('renders a table with Excel data when the file is valid', async () => {
    // Prepare fake Blob data
    const fakeArrayBuffer = new ArrayBuffer(8)
    const fakeBlob = {
      type: validMimeType,
      arrayBuffer: async () => fakeArrayBuffer
    }
    mockedAxios.get.mockResolvedValueOnce({ data: fakeBlob })

    // Prepare fake workbook and Excel data
    const fakeSheetName = 'Sheet1'
    const fakeWorksheet = { A1: 'Header1', B1: 'Header2' }
    const fakeExcelData = [
      ['Header1', 'Header2'],
      ['Row1Cell1', 'Row1Cell2'],
      ['Row2Cell1', 'Row2Cell2']
    ]
    // Mock XLSX.read to return a fake workbook
    ;(XLSX.read as jest.Mock).mockReturnValue({
      SheetNames: [fakeSheetName],
      Sheets: {
        [fakeSheetName]: fakeWorksheet
      }
    })
    // Mock sheet_to_json to return fakeExcelData
    ;(XLSX.utils.sheet_to_json as jest.Mock).mockReturnValue(fakeExcelData)

    render(<ExcelViewer document_id={document_id} />)

    // Wait for the iframe (in this case, the table) to be rendered after data is loaded.
    await waitFor(() => {
      // Check that the header cells are rendered
      expect(screen.getByText('Header1')).toBeInTheDocument()
      expect(screen.getByText('Header2')).toBeInTheDocument()
      // Check one cell from the body
      expect(screen.getByText('Row1Cell1')).toBeInTheDocument()
      expect(screen.getByText('Row2Cell2')).toBeInTheDocument()
    })
  })
})
