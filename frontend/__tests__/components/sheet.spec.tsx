import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import {
    Sheet,
    SheetTrigger,
    SheetContent,
    SheetHeader,
    SheetFooter,
    SheetTitle,
    SheetDescription,
} from '@/components/ui/sheet'

describe('Sheet components', () => {
    it('renders SheetContent with header, title, description, body, footer, and close button', () => {
        render(
            <Sheet open>
                <SheetTrigger>Open Sheet</SheetTrigger>
                <SheetContent data-testid="sheet-content">
                    <SheetHeader data-testid="sheet-header">
                        <SheetTitle data-testid="sheet-title">Test Sheet Title</SheetTitle>
                        <SheetDescription data-testid="sheet-description">
                            Test Sheet Description
                        </SheetDescription>
                    </SheetHeader>
                    <div data-testid="sheet-body">Sheet Body Content</div>
                    <SheetFooter data-testid="sheet-footer">
                        <button>Action</button>
                    </SheetFooter>
                </SheetContent>
            </Sheet>
        )

        const content = screen.getByTestId('sheet-content')
        expect(content).toBeInTheDocument()
        expect(content).toHaveTextContent('Sheet Body Content')

        expect(screen.getByTestId('sheet-header')).toBeInTheDocument()
        expect(screen.getByTestId('sheet-title')).toHaveTextContent('Test Sheet Title')
        expect(screen.getByTestId('sheet-description')).toHaveTextContent('Test Sheet Description')
        expect(screen.getByTestId('sheet-footer')).toBeInTheDocument()

        const closeButton = screen.getByRole('button', { name: /close/i })
        expect(closeButton).toBeInTheDocument()
    })

    it('calls onClose when SheetClose is clicked', () => {
        const onClose = jest.fn()

        const SheetTest = () => {
            const [open, setOpen] = React.useState(true)
            return (
                <Sheet open={open} onOpenChange={(isOpen) => {
                    setOpen(isOpen)
                    if (!isOpen) onClose()
                }}>
                    <SheetContent data-testid="sheet-content">
                        {/* Provide a SheetTitle to satisfy accessibility */}
                        <SheetTitle data-testid="sheet-title">Hidden Title</SheetTitle>
                        <SheetDescription>Description</SheetDescription>
                        <button>Test Button</button>
                    </SheetContent>
                </Sheet>
            )
        }

        render(<SheetTest />)
        const closeButton = screen.getByRole('button', { name: /close/i })
        fireEvent.click(closeButton)
        expect(onClose).toHaveBeenCalled()
    })
})
