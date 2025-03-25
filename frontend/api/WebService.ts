/**
 * Job: This holds all API calls for our backend
 */
export default class WebService {
    // Prefix
    private isDev = process.env.NODE_ENV === 'development';
    private serverUrl = this.isDev ? "http://localhost:5000" : "http://3.87.63.34:5000"
    // Test API calls
    TEST_GET = `${this.serverUrl}/api/test`;
    TEST_GET_ONE = `${this.serverUrl}/api/test/:id`;
    TEST_PUT = `${this.serverUrl}/api/test/:id`;
    TEST_POST = `${this.serverUrl}/api/test`;
    // Authentication routes
    AUTH_STUDENT_REGISTER = `${this.serverUrl}/api/auth/student/register`; // POST
    AUTH_STUDENT_LOGIN = `${this.serverUrl}/api/auth/student/login`; // POST
    AUTH_INFO = `${this.serverUrl}/api/auth`; // GET
    AUTH_REFRESH = `${this.serverUrl}/api/auth`; // POST
    // API calls
    FACULTY_METRIC_ID = `${this.serverUrl}/api/faculty/metrics/:id`; // GET, PUT, DELETE
    FACULTY_METRIC_GET = `${this.serverUrl}/api/faculty/metrics`; // POST
    STUDENTS_APPLICANT_LIST = `${this.serverUrl}/api/students/applicants`; // GET
    STUDENTS_APPLICANT_INFO = `${this.serverUrl}/api/students/:id`; // GET
    APPLICATION_DOCUMENT_GET = `${this.serverUrl}/api/documents/:id` // GET
    APPLICATION_DOCUMENT_POST = `${this.serverUrl}/api/documents` // POST
}
