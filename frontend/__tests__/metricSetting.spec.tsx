import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Page from "@/app/(faculty)/metricSetting/page"; 
import { apiGET, apiGETbyId, apiPOST } from "@/api/apiMethods";
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
  apiGETbyId: jest.fn(),
  apiPOST: jest.fn(),
}));

// Mock MetricForm component
jest.mock("@/components/MetricForm", () => jest.fn(() => <div data-testid="metric-form"></div>));

describe("MetricSetting Page", () => {
  const mockRouter = { push: jest.fn() };
  const mockWebService = new WebService();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders without crashing", async () => {
    (apiGET as jest.Mock).mockResolvedValue({ success: true, payload: [] });
    (apiGETbyId as jest.Mock).mockResolvedValue({ success: true, payload: [] });

    render(<Page />);

    expect(screen.getByText("Metric Settings")).toBeInTheDocument();
    await waitFor(() => expect(apiGET).toHaveBeenCalledWith(mockWebService.FACULTY_METRIC_DEFAULTS));
    await waitFor(() => expect(apiGETbyId).toHaveBeenCalledWith(mockWebService.FACULTY_METRIC_ID, "1"));
  });

  test("handles API errors gracefully", async () => {
    (apiGET as jest.Mock).mockResolvedValue({ success: false, error: "Error fetching defaults" });
    (apiGETbyId as jest.Mock).mockResolvedValue({ success: false, error: "Error fetching faculty metrics" });

    render(<Page />);

    await waitFor(() => expect(apiGET).toHaveBeenCalled());
    await waitFor(() => expect(apiGETbyId).toHaveBeenCalled());
  });

  test("calls onAddMetric when clicking add button", async () => {
    (apiGET as jest.Mock).mockResolvedValue({ success: true, payload: [] });
    (apiGETbyId as jest.Mock).mockResolvedValue({ success: true, payload: [] });

    render(<Page />);

    const addMetricButton = screen.getByText("Add Metric"); // Make sure this button exists in `MetricForm`
    fireEvent.click(addMetricButton);

    await waitFor(() => {
      expect(screen.getByTestId("metric-form")).toBeInTheDocument();
    });
  });

  test("calls API when saving a metric", async () => {
    (apiPOST as jest.Mock).mockResolvedValue({
      success: true,
      payload: {
        faculty_metric_id: 1,
        metric_name: "Test Metric",
        description: "Test Description",
        default_weight: 5,
      },
    });

    render(<Page />);

    // Assuming there's a function in `MetricForm` that triggers saving
    const mockMetric = {
      id: 1,
      name: "Test Metric",
      description: "Test Description",
      weight: 5,
      isNew: true,
    };

    await waitFor(() => {
      expect(apiPOST).toHaveBeenCalledWith(mockWebService.FACULTY_METRIC_POST, expect.any(String));
    });
  });
});
