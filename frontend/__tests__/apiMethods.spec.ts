import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { apiDELETE, apiGET, apiPOST, apiPUT } from "../api/apiMethods";
import WebService from "../api/WebService";

const mock = new MockAdapter(axios);
const webService = new WebService();

describe("API Methods", () => {
  afterEach(() => {
    mock.reset();
  });

  it("should fetch data with GET", async () => {
    const mockData = [{ id: 1, message: "Hello World" }];
    mock.onGet(webService.TEST_GET).reply(200, mockData);

    const result = await apiGET(webService.TEST_GET);
    expect(result).toEqual(mockData);
  });

  it("should fetch data by ID with GET", async () => {
    const mockData = { id: 1, message: "Hello World" };
    const testId = "1";
    mock.onGet(webService.TEST_GET_ONE.replace(":id", testId)).reply(200, mockData);

    const result = await apiGET(webService.TEST_GET_ONE, testId);
    expect(result).toEqual(mockData);
  });

  it("should send a POST request", async () => {
    const mockResponse = { success: true };
    const testData = { message: "New Entry" };
    mock.onPost(webService.TEST_POST).reply(201, mockResponse);

    const result = await apiPOST(webService.TEST_POST, JSON.stringify(testData));
    expect(result).toEqual(mockResponse);
  });

  it("should send a PUT request", async () => {
    const mockResponse = { success: true };
    const testId = "1";
    const testData = { message: "Updated Entry" };
    mock.onPut(webService.TEST_PUT.replace(":id", testId)).reply(200, mockResponse);

    const result = await apiPUT(webService.TEST_PUT, testId, JSON.stringify(testData));
    expect(result).toEqual(mockResponse);
  });

  it("should send a DELETE request", async () => {
    const mockResponse = { success: true };
    const id = '1';
    const webServiceUrl = 'http://localhost:5000/api/faculty/metrics/:id';
    mock.onDelete(webServiceUrl.replace(":id", id)).reply(200, mockResponse);
    const result = await apiDELETE(webServiceUrl, id);
    expect(result).toEqual(mockResponse);
  });
});
