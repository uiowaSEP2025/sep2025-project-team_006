import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable'

describe('Resizable components', () => {
    it('renders ResizablePanelGroup with default classes', () => {
        render(
            <ResizablePanelGroup data-testid="panel-group" direction={'horizontal'}>
                <ResizablePanel data-testid="panel">Panel Content</ResizablePanel>
            </ResizablePanelGroup>
        )
        const panelGroup = screen.getByTestId('panel-group')
        expect(panelGroup).toBeInTheDocument()
        expect(panelGroup.className).toMatch(/flex/)
        expect(panelGroup.className).toMatch(/h-full/)
        expect(panelGroup.className).toMatch(/w-full/)
    })

    it('renders ResizablePanel with children', () => {
        render(
            <ResizablePanelGroup direction={'horizontal'}>
                <ResizablePanel data-testid="panel">Panel Content</ResizablePanel>
            </ResizablePanelGroup>
        )
        const panel = screen.getByTestId('panel')
        expect(panel).toBeInTheDocument()
        expect(panel).toHaveTextContent('Panel Content')
    })

    it('renders ResizableHandle without grip icon when withHandle is false', () => {
        render(
            <ResizablePanelGroup direction={'horizontal'}>
                <ResizableHandle data-testid="resize-handle" />
            </ResizablePanelGroup>
        )
        const handle = screen.getByTestId('resize-handle')
        expect(handle).toBeInTheDocument()
        const svg = handle.querySelector('svg')
        expect(svg).not.toBeInTheDocument()
    })

    it('renders ResizableHandle with grip icon when withHandle is true', () => {
        render(
            <ResizablePanelGroup direction={'horizontal'}>
                <ResizableHandle data-testid="resize-handle" withHandle />
            </ResizablePanelGroup>
        )
        const handle = screen.getByTestId('resize-handle')
        expect(handle).toBeInTheDocument()
        const svg = handle.querySelector('svg')
        expect(svg).toBeInTheDocument()
    })
})
