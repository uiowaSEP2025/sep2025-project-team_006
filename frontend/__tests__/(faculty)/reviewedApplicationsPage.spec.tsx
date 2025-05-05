// __tests__/(faculty)/studentPage.spec.tsx
import React from "react";
import { render, screen } from "@testing-library/react";
import StudentPage from "@/app/(faculty)/(lists)/reviewedApplicants/application/page";
import '@testing-library/jest-dom';

jest.mock("@/app/(faculty)/(lists)/reviewedApplicants/application/studentPageContent", () => () => (
  <div data-testid="mocked-student-page-content">Loaded</div>
));

describe("StudentPage", () => {
  it("renders the fallback and lazy loads the component", async () => {
    render(<StudentPage />);
    expect(screen.getByTestId("mocked-student-page-content")).toBeInTheDocument();
  });
});
