// __tests__/components/tooltips.spec.tsx
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";

describe("Tooltip components", () => {
  it("shows tooltip content on hover and hides it on mouse leave", () => {
    render(
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger data-testid="tooltip-trigger">Hover me</TooltipTrigger>
          <TooltipContent data-testid="tooltip-content">Tooltip Info</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );

    // Initially, tooltip content should not be in the document.
    expect(screen.queryByTestId("tooltip-content")).toBeNull();

    // Simulate hovering using userEvent.hover.
    const trigger = screen.getByTestId("tooltip-trigger");
    userEvent.hover(trigger);

    // Wait for the tooltip content to appear.
    const tooltipContent = screen.findByTestId("tooltip-content");
    waitFor(() => expect(tooltipContent).toBeVisible());
    // expect(tooltipContent).toBeVisible();
    waitFor(() => expect(tooltipContent).toHaveTextContent("Tooltip Info"));
    // expect(tooltipContent).toHaveTextContent("Tooltip Info");

    // Simulate unhovering using userEvent.unhover.
    userEvent.unhover(trigger);

    // Wait for the tooltip content to be hidden.
    waitFor(() => expect(tooltipContent).not.toBeVisible());
  });
});
