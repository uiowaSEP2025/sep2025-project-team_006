import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import StudentPageContent from "@/app/(faculty)/(lists)/reviewedApplicants/application/studentPageContent";

// Mock dependencies
jest.mock("next/navigation", () => ({
  useSearchParams: () => ({
    get: () => "123", // studentId
  }),
}));

jest.mock("@/api/apiMethods", () => ({
  apiGET: jest.fn(),
  apiPUT: jest.fn(),
}));
jest.mock("@/api/methods", () => ({
  apiDoubleIdGET: jest.fn(),
}));

jest.mock("@/utils/qsRanking", () => ({
  loadQsRankings: jest.fn(() => Promise.resolve({ "test university": "50" })),
}));

jest.mock("@/components/ReviewForm", () => () => (
  <div data-testid="review-form">Mock Review Form</div>
));
jest.mock("@/components/LikeButton", () => () => (
  <div data-testid="like-button">Mock Like Button</div>
));
jest.mock("@/components/PdfViewer", () => () => (
  <div data-testid="pdf-viewer">PDF Viewer</div>
));
jest.mock("@/components/ExcelViewer", () => () => (
  <div data-testid="excel-viewer">Excel Viewer</div>
));

// Setup test imports
import { apiGET as realApiGET } from "@/api/apiMethods";
import { apiDoubleIdGET as realApiDoubleIdGET } from "@/api/methods";

// Explicitly cast to mocked functions
const apiGET = realApiGET as jest.Mock;
const apiDoubleIdGET = realApiDoubleIdGET as jest.Mock;

describe("StudentPageContent", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders student data and review when available", async () => {
    const fakeStudent = {
      first_name: "Jane",
      last_name: "Doe",
      original_gpa: 9.0,
      standardized_gpa: 3.6,
      school: "Test University",
      applications: [
        {
          application_id: 101,
          department: "CS",
          documents: [
            { document_id: "doc123", document_type: "pdf" },
          ],
        },
      ],
    };

    const reviewResponse = {
      review_exists: true,
      review_id: 55,
      review_metrics: [{ review_metric_id: 1, selected_weight: 0.5, value: 4 }],
      comments: "Looks good.",
      liked: true,
      overall_score: 3.7,
    };

    apiGET.mockResolvedValueOnce({ success: true, payload: fakeStudent });
    apiDoubleIdGET.mockResolvedValueOnce({ success: true, payload: reviewResponse });

    render(<StudentPageContent />);

    expect(await screen.findByText(/Review for/i)).toBeInTheDocument();
    expect(
        screen.getByText((_, element) =>
          element?.textContent?.replace(/\s+/g, " ").trim() ===
          "Reviewed Application for Jane Doe"
        )
      ).toBeInTheDocument();       
    expect(screen.getByText(/Original GPA:/)).toBeInTheDocument();
    expect(screen.getByText(/Standardized GPA:/)).toBeInTheDocument();
    expect(screen.getByText(/School Attended:/)).toBeInTheDocument();
    expect(screen.getByText(/QS World Ranking:/)).toBeInTheDocument();
    expect(screen.getByTestId("pdf-viewer")).toBeInTheDocument();
    await waitFor(() => {
    expect(screen.getByTestId("review-form")).toBeInTheDocument();
    });
    expect(screen.getByTestId("like-button")).toBeInTheDocument();
    expect(screen.getByText("Return to Applicants")).toHaveAttribute("href", "/reviewedApplicants");
  });
});
