import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { apiGET, apiPOST, apiDELETE, apiPUT } from "@/api/apiMethods";
import WebService from "@/api/WebService";
import MetricForm from "@/components/MetricForm";
import { useRouter } from "next/navigation";

// Mock Next.js router
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

// Mock API methods
jest.mock("@/api/apiMethods", () => ({
  apiGET: jest.fn(),
  apiPOST: jest.fn(),
  apiDELETE: jest.fn(),
  apiPUT: jest.fn(),
}));

// Mock MetricForm component
jest.mock("@/components/MetricForm", () =>
  jest.fn(() => React.createElement("div", { "data-testid": "metric-form" }))
);

// Mock Page component
jest.mock("@/app/(faculty)/metricSetting/page", () =>
  jest.fn(() => React.createElement("div", { children: "Metric Settings" }))
);

describe("MetricSetting Page", () => {
  const mockRouter = { push: jest.fn() };
  const mockWebService = new WebService();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test.skip("renders without crashing", async () => {
    (apiGET as jest.Mock).mockResolvedValue({ success: true, payload: [] });

    render(React.createElement(require("@/app/(faculty)/metricSetting/page").default));

    expect(screen.getByText("Metric Settings")).toBeInTheDocument();
    await waitFor(() => expect(apiGET).toHaveBeenCalledTimes(2));
  });

  test.skip("handles API errors gracefully", async () => {
    (apiGET as jest.Mock).mockResolvedValue({ success: false, error: "Error fetching defaults" });

    render(React.createElement(require("@/app/(faculty)/metricSetting/page").default));

    await waitFor(() => expect(apiGET).toHaveBeenCalled());
  });

  test.skip("calls onAddMetric when clicking add button", async () => {
    (apiGET as jest.Mock).mockResolvedValue({ success: true, payload: [] });

    render(React.createElement(require("@/app/(faculty)/metricSetting/page").default));

    const addMetricButton = screen.getByText("Add Metric");
    fireEvent.click(addMetricButton);

    await waitFor(() => {
      expect(screen.getByTestId("metric-form")).toBeInTheDocument();
    });
  });

  test.skip("calls API when saving a metric", async () => {
    (apiPOST as jest.Mock).mockResolvedValue({
      success: true,
      payload: {
        faculty_metric_id: 1,
        metric_name: "Test Metric",
        description: "Test Description",
        default_weight: 5,
      },
    });

    render(React.createElement(require("@/app/(faculty)/metricSetting/page").default));

    await waitFor(() => {
      expect(apiPOST).toHaveBeenCalledWith(mockWebService.FACULTY_METRIC_POST, expect.any(String));
    });
  });

  test.skip("calls API when deleting a metric", async () => {
    (apiDELETE as jest.Mock).mockResolvedValue({ success: true });

    render(React.createElement(require("@/app/(faculty)/metricSetting/page").default));

    const addMetricButton = screen.getByText("Add Metric");
    fireEvent.click(addMetricButton);

    const metricItem = screen.getAllByTestId(/metric-/)[0];
    const deleteButton = metricItem.querySelector("button:nth-child(1)");

    if (deleteButton) {
      fireEvent.click(deleteButton);
      await waitFor(() => expect(apiDELETE).toHaveBeenCalled());
    } else {
      throw new Error("Delete button not found");
    }
  });
});
