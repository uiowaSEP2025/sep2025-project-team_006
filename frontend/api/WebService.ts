/**
 * Job: This holds all API calls for our backend
 */
export default class WebService {
    // Prefix
    // private isDev = process.env.NODE_ENV === 'development';
    private serverUrl = "https://www.gradappsite.tech"
    // Test API calls
    TEST_GET = `${this.serverUrl}/api/test`;
    TEST_GET_ONE = `${this.serverUrl}/api/test/:id`;
    TEST_PUT = `${this.serverUrl}/api/test/:id`;
    TEST_POST = `${this.serverUrl}/api/test`;
    // API calls
}
