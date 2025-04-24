import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import InformationPage from "@/app/(faculty)/informationPage/page";

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />,
}));

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}));

describe("InformationPage", () => {
  beforeEach(() => {
    render(<InformationPage />);
  });

  it("renders the main heading", () => {
    expect(
      screen.getByRole("heading", { level: 2, name: /Information on Metric Scoring/i })
    ).toBeInTheDocument();
  });

  it("renders the logo image", () => {
    const img = screen.getByAltText("GAP logo");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", expect.stringContaining("GAPpaint.png"));
  });

  it("renders four disabled metric inputs in the first grid", () => {
    const placeholders = ["Metric Name", "Description", "Weight", "Score"];
    placeholders.forEach((ph) => {
      const input = screen.getAllByPlaceholderText(ph)[0];
      expect(input).toBeDisabled();
    });
  });

  it("renders Save and Delete buttons", () => {
    expect(screen.getByRole("button", { name: /^Save$/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^Delete$/i })).toBeInTheDocument();
  });

  it("renders the metric description section", () => {
    expect(
      screen.getByRole("heading", { level: 3, name: /Metric Component Description/i })
    ).toBeInTheDocument();

    expect(
      screen.getByText(/Above is a the basic layout of a Metric/i)
    ).toBeInTheDocument();
    expect(screen.getAllByPlaceholderText("Metric Name")[1]).toBeDisabled();
    expect(screen.getByText(/Metric Name is used to provide a brief label/i)).toBeInTheDocument();
  });

  it("renders weight and score explanation", () => {
    expect(
      screen.getByText(/Weight is a percentage out of 100/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/SCORE is done on a rating of 1-5/i)
    ).toBeInTheDocument();
  });

  it("renders the Move to Faculty Home link button", () => {
    const link = screen.getByRole("link", { name: /Move to Faculty Home/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/facultyHome");
  });
});
