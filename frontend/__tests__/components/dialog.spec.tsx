import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import {
    Dialog,
    DialogTrigger,
    DialogClose,
    DialogContent,
    DialogHeader,
    DialogFooter,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog'

describe('Dialog components', () => {
    it('renders DialogContent with header, title, description, body, footer, and close button', () => {
        render(
            <Dialog open>
                <DialogTrigger>Open Dialog</DialogTrigger>
                <DialogContent data-testid="dialog-content">
                    <DialogHeader data-testid="dialog-header">
                        <DialogTitle data-testid="dialog-title">Test Title</DialogTitle>
                        <DialogDescription data-testid="dialog-description">
                            Test Description
                        </DialogDescription>
                    </DialogHeader>
                    <div data-testid="dialog-body">Dialog Body Content</div>
                    <DialogFooter data-testid="dialog-footer">
                        <button>Action</button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        )

        // Verify that the content and its parts are rendered.
        expect(screen.getByTestId('dialog-content')).toBeInTheDocument()
        expect(screen.getByTestId('dialog-header')).toBeInTheDocument()
        expect(screen.getByTestId('dialog-title')).toHaveTextContent('Test Title')
        expect(screen.getByTestId('dialog-description')).toHaveTextContent('Test Description')
        expect(screen.getByTestId('dialog-body')).toHaveTextContent('Dialog Body Content')
        expect(screen.getByTestId('dialog-footer')).toBeInTheDocument()

        // The close button is rendered inside DialogContent. Radix's Close is rendered as a button.
        const closeButton = screen.getByRole('button', { name: /close/i })
        expect(closeButton).toBeInTheDocument()
    })

    it('calls onClose when DialogClose is clicked', () => {
        const onClose = jest.fn()
        const DialogTest = () => {
            const [open, setOpen] = React.useState(true)
            return (
                <Dialog open={open} onOpenChange={(isOpen) => {
                    setOpen(isOpen)
                    if (!isOpen) onClose()
                }}>
                    <DialogContent data-testid="dialog-content">
                        {/* Add a dummy DialogTitle to satisfy accessibility requirements */}
                        <DialogTitle data-testid="dialog-title">Hidden Title</DialogTitle>
                        <DialogDescription data-testid="dialog-description">
                            Test Description
                        </DialogDescription>
                        <button>Test Button</button>
                        <DialogClose>Close</DialogClose>
                    </DialogContent>
                </Dialog>
            )
        }

        render(<DialogTest />)
        const closeButtons = screen.getAllByRole('button', { name: /close/i })
        fireEvent.click(closeButtons[1])
        expect(onClose).toHaveBeenCalled()
    })
})
