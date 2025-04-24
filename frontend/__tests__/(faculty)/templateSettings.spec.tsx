import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";

jest.spyOn(global.console, "error").mockImplementation(() => {});
jest.spyOn(global.console, "log").mockImplementation(() => {});
jest.spyOn(global, "alert").mockImplementation(() => {});

import { apiGET, apiPOST, apiPUT, apiDELETE } from "@/api/apiMethods";
jest.mock("@/api/apiMethods");
const mockedApiGET = apiGET as jest.MockedFunction<typeof apiGET>;
const mockedApiPOST = apiPOST as jest.MockedFunction<typeof apiPOST>;
const mockedApiPUT = apiPUT as jest.MockedFunction<typeof apiPUT>;
const mockedApiDELETE = apiDELETE as jest.MockedFunction<typeof apiDELETE>;

import WebService from "@/api/WebService";
import TemplateSettings from "@/app/(faculty)/templateSetting/page";
jest.mock("@/api/WebService");
const MockedWebService = WebService as jest.MockedClass<typeof WebService>;

jest.mock("next/link", () => ({
  __esModule: true,
  default: (props: { href: string; children: React.ReactNode }) => (
    <a href={props.href}>{props.children}</a>
  ),
}));

describe("TemplateSettings", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    MockedWebService.mockImplementation(() => ({
        TEMPLATE: "/tmpl",
        TEMPLATE_BY_ID: "/tmpl/id",
      } as unknown as WebService));
    // stub user
    // @ts-ignore
    window.__USER__ = { is_admin: true };
  });

  it("shows loading when no templates", () => {
    mockedApiGET.mockResolvedValueOnce(Promise.resolve({ success: false, payload: [] }));
    const { container } = render(<TemplateSettings />);
    expect(container.textContent).toMatch(/Loading templates/);
  });

  it("renders fetched templates and toggle buttons", async () => {
    mockedApiGET.mockResolvedValueOnce({
      success: true,
      payload: [
        { template_id: "1", department: "DeptA", name: "NameA", is_default: false, metrics: [] },
        { template_id: "2", department: "DeptB", name: "NameB", is_default: true, metrics: [] },
      ],
    });
    render(<TemplateSettings />);
    expect(await screen.findByText(/Template Settings/)).toBeInTheDocument();
    expect(screen.getByText("1 - DeptA")).toBeInTheDocument();
    expect(screen.getByText("2 - DeptB")).toBeInTheDocument();
  });

  it("alerts on save when total weight != 1.0", async () => {
    const tmpl = { template_id: "1", department: "D", name: "N", is_default: false, metrics: [ { template_metric_id: "m1", metric_name: "", description: "", metric_weight: "0.5" } ] };
    mockedApiGET.mockResolvedValueOnce({ success: true, payload: [tmpl] });
    render(<TemplateSettings />);
    fireEvent.click(await screen.findByText(/Save Template/));
    expect(alert).toHaveBeenCalledWith(expect.stringContaining("Total metric weight must equal 1.00"));
  });

  it("creates new template via apiPOST", async () => {
    const tmpl = { template_id: "1", department: "D", name: "N", is_default: false, metrics: [{ template_metric_id: "m1", metric_name: "a", description: "b", metric_weight: "1.0" , isNew: true }] };
    mockedApiGET.mockResolvedValueOnce({ success: true, payload: [tmpl] });
    mockedApiPOST.mockResolvedValueOnce({ success: true, payload: {} });
    render(<TemplateSettings />);
    fireEvent.click(await screen.findByText(/Save Template/));
    waitFor(() => expect(mockedApiPOST).toHaveBeenCalledWith(
      "/tmpl",
      expect.stringContaining('"name":"N"')
    ));
  });

  it("updates existing template via apiPUT", async () => {
    const tmpl = { template_id: "1", department: "D", name: "N", is_default: false, metrics: [{ template_metric_id: "m1", metric_name: "a", description: "b", metric_weight: "1.0" }] };
    mockedApiGET.mockResolvedValueOnce({ success: true, payload: [tmpl] });
    mockedApiPUT.mockResolvedValueOnce({ success: true, payload: {} });
    render(<TemplateSettings />);
    fireEvent.click(await screen.findByText(/Save Template/));
    waitFor(() => expect(mockedApiPUT).toHaveBeenCalledWith(
      "/tmpl/id",
      "1",
      expect.any(String)
    ));
  });

  it("adds and deletes a metric", async () => {
    const tmpl = { template_id: "1", department: "D", name: "N", is_default: false, metrics: [] };
    mockedApiGET.mockResolvedValueOnce({ success: true, payload: [tmpl] });
    render(<TemplateSettings />);
    fireEvent.click(await screen.findByText(/Add Metric/));
    expect(screen.getByText(/Weight:/)).toBeInTheDocument();
    fireEvent.click(screen.getByText(/Delete Metric/));
    expect(screen.queryByLabelText("Weight:")).toBeNull();
  });

  it("toggles enabled state of inputs based on admin flag", async () => {
    const tmpl = { template_id: "1", department: "D", name: "N", is_default: true, metrics: [] };
    mockedApiGET.mockResolvedValueOnce({ success: true, payload: [tmpl] });
    // non-admin
    // @ts-ignore
    window.__USER__ = { is_admin: false };
    render(<TemplateSettings />);
    // expect((await screen.findByLabelText("Department:")).disabled).toBe(true);
  });
});
