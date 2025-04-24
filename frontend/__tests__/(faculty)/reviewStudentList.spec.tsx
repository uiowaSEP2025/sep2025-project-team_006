import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";

jest.spyOn(global.console, "log").mockImplementation(() => {});
jest.spyOn(global.console, "error").mockImplementation(() => {});

import { apiGET } from "@/api/apiMethods";
jest.mock("@/api/apiMethods");
const mockedApiGET = apiGET as jest.MockedFunction<typeof apiGET>;

import WebService from "@/api/WebService";
jest.mock("@/api/WebService");
const MockedWebService = WebService as jest.MockedClass<typeof WebService>;

import { useRouter } from "next/navigation";
jest.mock("next/navigation");

jest.mock("next/link", () => ({
  __esModule: true,
  default: (props: { href: string; children: React.ReactNode }) => (
    <a href={props.href}>{props.children}</a>
  ),
}));

jest.mock("@/components/ProfileList", () => (props: any) => (
  <div data-testid="profile-list">
    {props.profiles.map((p: any) => (
      <button key={p.id} data-testid={`profile-${p.id}`} onClick={() => props.onProfileClick(p)}>
        {p.name}
      </button>
    ))}
  </div>
));

import ReviewedList from "@/app/(faculty)/(lists)/reviewedApplicants/page";

describe("ReviewedApplicantsList", () => {
  const push = jest.fn();

  beforeAll(() => {
    (useRouter as jest.Mock).mockReturnValue({ push });
    // no user context needed
  });

  beforeEach(() => {
    jest.clearAllMocks();
    MockedWebService.mockImplementation(() => ({
      REVIEW_SUBMITTED: "/reviews",
    } as unknown as WebService));
  });

  it("renders reviewed profiles on successful fetch", async () => {
    mockedApiGET.mockResolvedValueOnce({
      success: true,
      payload: [
        {
          application: {
            student: { student_id: 10, first_name: "John", last_name: "Doe" },
            status: "approved",
            department: "CS",
            degree_program: "MS",
          },
          overall_score: 4.5,
        },
      ],
    });

    render(<ReviewedList />);
    expect(await screen.findByText("John Doe")).toBeInTheDocument();
  });

  it("handles fetch error gracefully", async () => {
    mockedApiGET.mockResolvedValueOnce({ success: false, error: "err" });
    render(<ReviewedList />);
    await waitFor(() => {
      expect(screen.queryByTestId("profile-10")).not.toBeInTheDocument();
    });
  });

  it("handles exception in fetch", async () => {
    mockedApiGET.mockRejectedValueOnce(new Error("fail"));
    render(<ReviewedList />);
    await waitFor(() => {
      expect(screen.queryByTestId("profile-10")).not.toBeInTheDocument();
    });
  });

  it("calls router.push on profile click", async () => {
    mockedApiGET.mockResolvedValueOnce({
      success: true,
      payload: [
        {
          application: {
            student: { student_id: 20, first_name: "Jane", last_name: "Smith" },
            status: "reviewed",
            department: "Math",
            degree_program: "PhD",
          },
          overall_score: 3.2,
        },
      ],
    });

    render(<ReviewedList />);
    fireEvent.click(await screen.findByTestId("profile-20"));
    expect(push).toHaveBeenCalledWith(
      "/reviewedApplicants/application?id=20"
    );
  });

  it("filters profiles by search query", async () => {
    mockedApiGET.mockResolvedValueOnce({
      success: true,
      payload: [
        {
          application: {
            student: { student_id: 30, first_name: "Alice", last_name: "Wonder" },
            status: "ok",
            department: "Eng",
            degree_program: "BS",
          },
          overall_score: 5,
        },
        {
          application: {
            student: { student_id: 31, first_name: "Bob", last_name: "Builder" },
            status: "ok",
            department: "Eng",
            degree_program: "BS",
          },
          overall_score: 4,
        },
      ],
    });

    render(<ReviewedList />);
    await screen.findByText("Alice Wonder");
    fireEvent.change(screen.getByPlaceholderText(/Search by name/i), {
      target: { value: 'bob' },
    });
    expect(screen.queryByText("Alice Wonder")).toBeNull();
    expect(screen.getByText("Bob Builder")).toBeInTheDocument();
  });

//   it("paginates profiles correctly", async () => {
//     const many = Array.from({ length: 7 }, (_, i) => ({
//       application: { student: { student_id: i+1, first_name: `U${i+1}`, last_name: '' }, status: '', department: '', degree_program: '' },
//       overall_score: 1,
//     }));
//     mockedApiGET.mockResolvedValueOnce({ success: true, payload: many });

//     render(<ReviewedList />);
//     await screen.findByText("U1 ");
//     expect(screen.queryByText("U6 ")).toBeNull();
//     fireEvent.click(screen.getByText('2'));
//     expect(screen.getByText("U6 ")).toBeInTheDocument();
//     expect(screen.queryByText("U1 ")).toBeNull();
//   });

  it("renders Return to Home link", async () => {
    mockedApiGET.mockResolvedValueOnce({ success: true, payload: [] });
    render(<ReviewedList />);
    expect(
      screen.getByRole("link", { name: /Return to Home/i })
    ).toHaveAttribute("href", "/facultyHome");
  });
});
