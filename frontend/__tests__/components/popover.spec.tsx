import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { Popover, PopoverTrigger, PopoverContent, PopoverAnchor } from '@/components/ui/popover'

describe('Popover components', () => {
    it('renders PopoverContent with children and default classes when open', () => {
        render(
            <Popover defaultOpen>
                <PopoverTrigger data-testid="popover-trigger">Open</PopoverTrigger>
                <PopoverContent data-testid="popover-content">
                    Popover Content
                </PopoverContent>
            </Popover>
        )
        // Since the popover is open by default, its content is rendered via the portal.
        const content = screen.getByTestId('popover-content')
        expect(content).toBeInTheDocument()
        expect(content).toHaveTextContent('Popover Content')
        expect(content.className).toMatch(/z-50/)
        expect(content.className).toMatch(/w-72/)
        expect(content.className).toMatch(/rounded-md/)
    })

    it('renders PopoverAnchor correctly', () => {
        render(
            <Popover defaultOpen>
                <PopoverAnchor data-testid="popover-anchor">Anchor</PopoverAnchor>
            </Popover>
        )
        const anchor = screen.getByTestId('popover-anchor')
        expect(anchor).toBeInTheDocument()
        expect(anchor).toHaveTextContent('Anchor')
    })
})
