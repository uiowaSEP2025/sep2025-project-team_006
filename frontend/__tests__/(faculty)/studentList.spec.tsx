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

import StudentList from "@/app/(faculty)/(lists)/studentList/page";

describe("StudentList", () => {
  const push = jest.fn();

  beforeAll(() => {
    (useRouter as jest.Mock).mockReturnValue({ push });
    // Stub current user
    // @ts-ignore
    window.__USER__ = { id: 123 };
  });

  beforeEach(() => {
    jest.clearAllMocks();
    // reset WebService endpoints
    MockedWebService.mockImplementation(() => ({
      STUDENTS_APPLICANT_LIST: "/students",
      REVIEW_SUBMITTED: "/reviews",
    } as unknown as WebService));
  });

  it("renders profiles on successful fetch", async () => {
    // First API returns one applicant, second returns no reviews
    mockedApiGET.mockResolvedValueOnce({
      success: true,
      payload: [
        { application_id: 11, student_id: 1, full_name: "Alice", status: "A", department: "D", degree_program: "DP" },
      ],
    });
    mockedApiGET.mockResolvedValueOnce({ success: true, payload: [] });

    render(<StudentList />);
    expect(await screen.findByText("Alice")).toBeInTheDocument();
  });

  it("filters out reviewed applicants", async () => {
    // applicant list has Bob and Carol; reviews list includes Carol
    mockedApiGET.mockResolvedValueOnce({
      success: true,
      payload: [
        { application_id: 21, student_id: 2, full_name: "Bob", status: "", department: "", degree_program: "" },
        { application_id: 22, student_id: 3, full_name: "Carol", status: "", department: "", degree_program: "" },
      ],
    });
    mockedApiGET.mockResolvedValueOnce({
      success: true,
      payload: [{ application: { application_id: 22 } }],
    });

    render(<StudentList />);
    // Bob should appear, Carol filtered out
    expect(await screen.findByText("Bob")).toBeInTheDocument();
    expect(screen.queryByText("Carol")).toBeNull();
  });

  it("handles fetch error gracefully", async () => {
    mockedApiGET.mockResolvedValueOnce({ success: false, error: "err" });
    render(<StudentList />);
    await waitFor(() => {
      expect(screen.queryByTestId("profile-1")).not.toBeInTheDocument();
    });
  });

  it("handles exception in fetch", async () => {
    mockedApiGET.mockRejectedValueOnce(new Error("fail"));
    render(<StudentList />);
    await waitFor(() => {
      expect(screen.queryByTestId("profile-1")).not.toBeInTheDocument();
    });
  });

  it("calls router.push on profile click", async () => {
    mockedApiGET.mockResolvedValueOnce({
      success: true,
      payload: [{ application_id: 31, student_id: 4, full_name: "Dave", status: "", department: "", degree_program: "" }],
    });
    mockedApiGET.mockResolvedValueOnce({ success: true, payload: [] });

    render(<StudentList />);
    fireEvent.click(await screen.findByTestId("profile-4"));
    expect(push).toHaveBeenCalledWith("/studentList/application?id=4");
  });

  it("filters profiles by search query", async () => {
    mockedApiGET.mockResolvedValueOnce({
      success: true,
      payload: [
        { application_id: 41, student_id: 5, full_name: "Eve", status: "", department: "", degree_program: "" },
        { application_id: 42, student_id: 6, full_name: "Frank", status: "", department: "", degree_program: "" },
      ],
    });
    mockedApiGET.mockResolvedValueOnce({ success: true, payload: [] });

    render(<StudentList />);
    await screen.findByText("Eve");
    fireEvent.change(screen.getByPlaceholderText(/Search by name/i), { target: { value: 'fra' } });
    expect(screen.queryByText("Eve")).toBeNull();
    expect(screen.getByText("Frank")).toBeInTheDocument();
  });

  it("paginates profiles correctly", async () => {
    const many = Array.from({ length: 7 }, (_, i) => ({ application_id: 50 + i, student_id: i + 1, full_name: `U${i + 1}`, status: "", department: "", degree_program: "" }));
    mockedApiGET.mockResolvedValueOnce({ success: true, payload: many });
    mockedApiGET.mockResolvedValueOnce({ success: true, payload: [] });

    render(<StudentList />);
    await screen.findByText("U1");
    expect(screen.queryByText("U6")).toBeNull();
    fireEvent.click(screen.getByText('2'));
    expect(screen.getByText("U6")).toBeInTheDocument();
    expect(screen.queryByText("U1")).toBeNull();
  });

  it("renders Return to Home link", async () => {
    mockedApiGET.mockResolvedValueOnce({ success: true, payload: [] });
    mockedApiGET.mockResolvedValueOnce({ success: true, payload: [] });

    render(<StudentList />);
    expect(
      screen.getByRole("link", { name: /Return to Home/i })
    ).toHaveAttribute("href", "/facultyHome");
  });
});
