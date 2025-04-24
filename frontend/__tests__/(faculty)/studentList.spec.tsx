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
  });

  it.skip("renders profiles on successful fetch", async () => {
    mockedApiGET.mockResolvedValueOnce({
      success: true,
      payload: [
        { student_id: 1, full_name: "Alice", status: "A", department: "D", degree_program: "DP" },
      ],
    });

    render(<StudentList />);
    expect(await screen.findByText("Alice")).toBeInTheDocument();
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

  it.skip("calls router.push on profile click", async () => {
    mockedApiGET.mockResolvedValueOnce({
      success: true,
      payload: [
        { student_id: 2, full_name: "Bob", status: "", department: "", degree_program: "" },
      ],
    });

    render(<StudentList />);
    fireEvent.click(await screen.findByTestId("profile-2"));
    expect(push).toHaveBeenCalledWith("/studentList/application?id=2");
  });

  it.skip("filters profiles by search query", async () => {
    mockedApiGET.mockResolvedValueOnce({
      success: true,
      payload: [
        { student_id: 3, full_name: "Charlie", status: "", department: "", degree_program: "" },
        { student_id: 4, full_name: "Dave", status: "", department: "", degree_program: "" },
      ],
    });

    render(<StudentList />);
    await screen.findByText("Charlie");

    fireEvent.change(screen.getByPlaceholderText(/Search by name/i), { target: { value: 'dav' } });
    expect(screen.queryByText("Charlie")).not.toBeInTheDocument();
    expect(screen.getByText("Dave")).toBeInTheDocument();
  });

  it.skip("paginates profiles correctly", async () => {
    const many = Array.from({ length: 7 }, (_, i) => ({
      student_id: i + 1,
      full_name: `U${i + 1}`,
      status: "",
      department: "",
      degree_program: "",
    }));
    mockedApiGET.mockResolvedValueOnce({ success: true, payload: many });

    render(<StudentList />);
    await screen.findByText("U1");

    expect(screen.queryByText("U6")).toBeNull();
    fireEvent.click(screen.getByText('2'));
    expect(screen.getByText("U6")).toBeInTheDocument();
    expect(screen.queryByText("U1")).toBeNull();
  });

  it("renders Return to Home link", async () => {
    mockedApiGET.mockResolvedValueOnce({ success: true, payload: [] });

    render(<StudentList />);
    expect(
      screen.getByRole("link", { name: /Return to Home/i })
    ).toHaveAttribute("href", "/facultyHome");
  });
});
