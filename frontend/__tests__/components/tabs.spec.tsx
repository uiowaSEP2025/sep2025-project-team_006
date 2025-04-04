import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

describe('Tabs components', () => {
  it('renders Tabs with triggers and content', () => {
    render(
      <Tabs defaultValue="tab1" data-testid="tabs">
        <TabsList data-testid="tabs-list">
          <TabsTrigger value="tab1" data-testid="tab-trigger-tab1">
            Tab 1
          </TabsTrigger>
          <TabsTrigger value="tab2" data-testid="tab-trigger-tab2">
            Tab 2
          </TabsTrigger>
        </TabsList>
        <TabsContent value="tab1" data-testid="tab-content-tab1">
          Content 1
        </TabsContent>
        <TabsContent value="tab2" data-testid="tab-content-tab2">
          Content 2
        </TabsContent>
      </Tabs>
    )

    // Verify the TabsList is rendered
    expect(screen.getByTestId('tabs-list')).toBeInTheDocument()

    // Verify that the default tab's content is visible and the other is hidden
    const tab1Content = screen.getByTestId('tab-content-tab1')
    const tab2Content = screen.getByTestId('tab-content-tab2')
    
    // Depending on Radix implementation, inactive content might be hidden (using CSS) or not rendered.
    expect(tab1Content).toBeVisible()
    // Either assert that tab2 is not visible or not in the document.
    // Here we assume it is rendered but hidden.
    expect(tab2Content).not.toBeVisible()
  })

  it('switches tab content when a different trigger is clicked', () => {
    // ✅ Controlled Tabs using React state
    function TabsTestWrapper() {
      const [value, setValue] = React.useState('tab1')
      return (
        <Tabs value={value} onValueChange={setValue}>
          <TabsList>
            <TabsTrigger value="tab1" data-testid="tab-trigger-tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2" data-testid="tab-trigger-tab2">Tab 2</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1" data-testid="tab-content-tab1">Content 1</TabsContent>
          <TabsContent value="tab2" data-testid="tab-content-tab2">Content 2</TabsContent>
        </Tabs>
      )
    }

    render(<TabsTestWrapper />)

    const tab1Content = screen.getByTestId('tab-content-tab1')
    const tab2Content = screen.getByTestId('tab-content-tab2')

    expect(tab1Content).toBeVisible()
    expect(tab2Content).not.toBeVisible()

    fireEvent.click(screen.getByTestId('tab-trigger-tab2'))
    waitFor(() => expect(tab2Content).toBeVisible());
    waitFor(() => expect(tab1Content).not.toBeVisible());
  })
})
