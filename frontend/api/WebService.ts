/**
 * Job: This holds all API calls for our backend
 */
export default class WebService {
    // Prefix
    private serverUrl = "http://localhost:5000"
    // Test API calls
    TEST_GET = `${this.serverUrl}/api/test/get`;
    TEST_PUT = `${this.serverUrl}/api/test/:id`;
    TEST_POST = `${this.serverUrl}/api/test/post`;
    // API calls
}
