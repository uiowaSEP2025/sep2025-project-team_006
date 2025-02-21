import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { apiGET, apiGETbyId, apiPOST, apiPUT } from "../api/apiMethods";
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

    const result = await apiGETbyId(webService.TEST_GET_ONE, testId);
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
});
