import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import {
  SidebarProvider,
  Sidebar,
  SidebarTrigger,
  SidebarContent,
} from '@/components/ui/sidebar'

// Simulate a desktop viewport
beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
      matches: query.includes('min-width: 768px'),
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
});

describe('Sidebar components (desktop)', () => {
  it('renders the sidebar content with provided children', () => {
    render(
      <SidebarProvider>
        <Sidebar data-testid="sidebar">
          <SidebarContent data-testid="sidebar-content">
            Sidebar Content
          </SidebarContent>
        </Sidebar>
      </SidebarProvider>
    );
    const sidebar = screen.getByTestId('sidebar');
    const content = screen.getByTestId('sidebar-content');
    expect(sidebar).toBeInTheDocument();

    waitFor(() => expect(sidebar.dataset.state).toBe("expanded"));
    expect(content).toHaveTextContent('Sidebar Content');
  });

  it('toggles sidebar state when SidebarTrigger is clicked', () => {
    render(
      <SidebarProvider>
        <SidebarTrigger data-testid="sidebar-trigger" />
        <Sidebar data-testid="sidebar">
          <SidebarContent data-testid="sidebar-content">
            Sidebar Content
          </SidebarContent>
        </Sidebar>
      </SidebarProvider>
    );
    const trigger = screen.getByTestId('sidebar-trigger');
    const sidebar = screen.getByTestId('sidebar');

    waitFor(() => expect(sidebar.dataset.state).toBe("expanded"));
    fireEvent.click(trigger);
    waitFor(() => expect(sidebar.dataset.state).toBe("collapsed"));
  });
});
