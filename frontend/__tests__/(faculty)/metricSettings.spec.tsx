import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";

jest.spyOn(global.console, "log").mockImplementation(() => {});
jest.spyOn(global.console, "error").mockImplementation(() => {});

jest.mock("@/api/apiMethods", () => ({
  apiGET: jest.fn(),
  apiPOST: jest.fn(),
  apiDELETE: jest.fn(),
  apiPUT: jest.fn(),
}));
import { apiGET, apiPOST, apiDELETE, apiPUT } from "@/api/apiMethods";


jest.mock("@/api/WebService", () => {
  return jest.fn().mockImplementation(() => ({
    FACULTY_METRIC_DEFAULTS: "/defaults",
    FACULTY_METRIC_ID: "/byId",
    FACULTY_METRIC_POST: "/post",
  }));
});

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ href, children }: any) => <a href={href}>{children}</a>,
}));

jest.mock("@/components/MetricForm", () => {
  return ({
    metrics,
    onAddMetric,
    onDeleteMetric,
    onChangeMetric,
    onSaveMetric,
  }: any) => (
    <div data-testid="metric-form">
      <pre data-testid="metrics-json">{JSON.stringify(metrics)}</pre>
      <button data-testid="btn-add" onClick={onAddMetric}>
        Add
      </button>
      {metrics.length > 0 && (
        <button
          data-testid="btn-delete"
          onClick={() => {
            const m = metrics[0];
            onDeleteMetric(m.id, !!m.isNew);
          }}
        >
          Delete
        </button>
      )}
      {metrics.length > 0 && (
        <button
          data-testid="btn-change"
          onClick={() => {
            const m = metrics[0];
            onChangeMetric(m.id, "name", "CHANGED");
          }}
        >
          Change
        </button>
      )}
      {metrics.length > 0 && (
        <button
          data-testid="btn-save"
          onClick={() => {
            onSaveMetric(metrics[0]);
          }}
        >
          Save
        </button>
      )}
    </div>
  );
});

import MetricSetting from "@/app/(faculty)/metricSetting/page";

describe("MetricSetting (100% coverage)", () => {
  beforeAll(() => {
    // stub a logged‑in user
    // @ts-ignore
    window.__USER__ = { id: 77 };
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("handles failed fetchMetrics (both calls fail)", async () => {
    (apiGET as jest.Mock).mockResolvedValue({ success: false, error: "uh oh" });
    render(<MetricSetting />);

    await waitFor(() => {
      const json = screen.getByTestId("metrics-json").textContent!;
      expect(JSON.parse(json)).toEqual([]); // never populated
    });
  });

  it("handles successful defaults + successful byId", async () => {
    (apiGET as jest.Mock).mockImplementation((url: string) => {
      if (url === "/defaults") {
        return Promise.resolve({
          success: true,
          payload: [
            {
              faculty_metric_id: 1,
              metric_name: "D1",
              description: "Desc1",
              default_weight: 11,
            },
          ],
        });
      } else {
        return Promise.resolve({
          success: true,
          payload: [
            {
              faculty_metric_id: 2,
              metric_name: "C1",
              description: "Desc2",
              default_weight: 22,
            },
          ],
        });
      }
    });

    render(<MetricSetting />);
    await waitFor(() => {
      const json = screen.getByTestId("metrics-json").textContent!;
      const metrics = JSON.parse(json);
      // one default (no id field) + one custom (has id = 2)
      expect(metrics).toHaveLength(2);
      expect(metrics[0]).toMatchObject({
        name: "D1",
        description: "Desc1",
        weight: 11,
        isDefault: true,
      });
      expect(metrics[1]).toMatchObject({
        id: 2,
        name: "C1",
        description: "Desc2",
        weight: 22,
        isDefault: false,
      });
    });
  });

  it("handleOnAddMetric adds a new blank metric", async () => {
    // start with no metrics
    (apiGET as jest.Mock).mockResolvedValue({ success: true, payload: [] });
    render(<MetricSetting />);
    await waitFor(() => {
      expect(screen.getByTestId("metrics-json").textContent).toBe("[]");
    });

    userEvent.click(screen.getByTestId("btn-add"));
    await waitFor(() => {
      const arr = JSON.parse(screen.getByTestId("metrics-json").textContent!);
      expect(arr).toHaveLength(1);
      expect(arr[0]).toMatchObject({
        name: "",
        description: "",
        weight: 0,
        isDefault: false,
        isNew: true,
      });
    });
  });

  it("handleOnDeleteMetric removes a NEW metric without hitting apiDELETE", async () => {
    // prepare one new metric via API stub
    (apiGET as jest.Mock).mockResolvedValue({ success: true, payload: [] });
    render(<MetricSetting />);
    await waitFor(() => userEvent.click(screen.getByTestId("btn-add")));

    // delete it
    userEvent.click(screen.getByTestId("btn-delete"));
    await waitFor(() => {
      expect(JSON.parse(screen.getByTestId("metrics-json").textContent!)).toHaveLength(0);
    });

    expect(apiDELETE).not.toHaveBeenCalled();
  });

  it("handleOnChangeMetric updates a field", async () => {
    (apiGET as jest.Mock).mockResolvedValue({ success: true, payload: [] });
    render(<MetricSetting />);
    await waitFor(() => userEvent.click(screen.getByTestId("btn-add")));

    userEvent.click(screen.getByTestId("btn-change"));
    await waitFor(() => {
      const arr = JSON.parse(screen.getByTestId("metrics-json").textContent!);
      expect(arr[0].name).toBe("CHANGED");
    });
  });

  it("handleOnSaveMetric for NEW metric calls apiPOST and replaces it", async () => {
    (apiGET as jest.Mock).mockResolvedValue({ success: true, payload: [] });
    render(<MetricSetting />);
    await waitFor(() => userEvent.click(screen.getByTestId("btn-add")));

    (apiPOST as jest.Mock).mockResolvedValue({
      success: true,
      payload: {
        faculty_metric_id: 55,
        metric_name: "SAVED",
        description: "D",
        default_weight: 5,
      },
    });

    userEvent.click(screen.getByTestId("btn-save"));
    await waitFor(() => {
      expect(apiPOST).toHaveBeenCalledWith(
        "/post",
        expect.stringContaining(`"metric_name":"",`)
      );
      const arr = JSON.parse(screen.getByTestId("metrics-json").textContent!);
      expect(arr[0]).toMatchObject({
        id: 55,
        name: "SAVED",
        description: "D",
        weight: 5,
        isNew: false,
      });
    });
  });

  it("handleOnDeleteMetric for EXISTING metric calls apiDELETE and removes it", async () => {
    // 1) stub defaults empty, byId returns one metric
    (apiGET as jest.Mock).mockImplementation((url: string) =>
      Promise.resolve(
        url === "/defaults"
          ? { success: true, payload: [] }
          : {
              success: true,
              payload: [
                {
                  faculty_metric_id: 99,
                  metric_name: "X",
                  description: "x",
                  default_weight: 1,
                },
              ],
            }
      )
    );
    (apiDELETE as jest.Mock).mockResolvedValue({ success: true });

    render(<MetricSetting />);
    // wait for the Delete button to appear
    const btn = await screen.findByTestId("btn-delete");
    userEvent.click(btn);

    await waitFor(() => {
      expect(apiDELETE).toHaveBeenCalledWith("/byId", "99");
      const metrics = JSON.parse(screen.getByTestId("metrics-json").textContent!);
      expect(metrics).toHaveLength(0);
    });
  });

  it("handleOnSaveMetric for EXISTING metric calls apiPUT and replaces it", async () => {
    // 1) same stub: no defaults, one existing metric
    (apiGET as jest.Mock).mockImplementation((url: string) =>
      Promise.resolve(
        url === "/defaults"
          ? { success: true, payload: [] }
          : {
              success: true,
              payload: [
                {
                  faculty_metric_id: 66,
                  metric_name: "X",
                  description: "x",
                  default_weight: 1,
                },
              ],
            }
      )
    );
    render(<MetricSetting />);

    // wait for Save button
    const saveBtn = await screen.findByTestId("btn-save");

    (apiPUT as jest.Mock).mockResolvedValue({
      success: true,
      payload: {
        faculty_metric_id: 66,
        metric_name: "UPDATED",
        description: "new",
        default_weight: 7,
      },
    });

    userEvent.click(saveBtn);
    await waitFor(() => {
      expect(apiPUT).toHaveBeenCalledWith(
        "/byId",
        "66",
        expect.stringContaining(`"faculty_id":"77"`)
      );
      const metrics = JSON.parse(screen.getByTestId("metrics-json").textContent!);
      expect(metrics[0]).toMatchObject({
        id: 66,
        name: "UPDATED",
        description: "new",
        weight: 7,
      });
    });
  });
});
