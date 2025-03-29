/**
 * Job: This holds all API calls for our backend
 */
export default class WebService {
    // Prefix
    private isDev = process.env.NODE_ENV === 'development';
    private serverUrl = this.isDev ? "http://localhost:5000" : "http://3.87.63.34:5000"
    // Test API calls - these do not exist anymore
    TEST_GET = `${this.serverUrl}/api/test`;
    TEST_GET_ONE = `${this.serverUrl}/api/test/:id`;
    TEST_PUT = `${this.serverUrl}/api/test/:id`;
    TEST_POST = `${this.serverUrl}/api/test`;
    // API calls
    FACULTY_METRIC_ID = `${this.serverUrl}/api/faculty/metrics/:id`; // GET, PUT, DELETE
    FACULTY_METRIC_POST = `${this.serverUrl}/api/faculty/metrics`; // POST
    FACULTY_METRIC_DEFAULTS = `${this.serverUrl}/api/faculty/metrics/default` // GET
    STUDENTS_APPLICANT_LIST = `${this.serverUrl}/api/students/applicants`; // GET
    STUDENTS_APPLICANT_INFO = `${this.serverUrl}/api/students/:id`; // GET
    APPLICATION_DOCUMENT_GET = `${this.serverUrl}/api/documents/:id` // GET
    APPLICATION_DOCUMENT_POST = `${this.serverUrl}/api/documents` // POST
    REVIEW_CREATE_POST = `${this.serverUrl}/api/reviews`; // POST
    REVIEW_UPDATE_PUT = `${this.serverUrl}/api/reviews/:id`; // PUT
    REVIEW_METRICS_FOR_FACULTY = `${this.serverUrl}/api/reviews/metrics/app/:id1/faculty/:id2`; // GET
    REVIEW_METRIC_POST = `${this.serverUrl}/api/reviews/metrics`; // POST
    REVIEW_METRIC_UPDATE = `${this.serverUrl}/api/reviews/metrics/:id`; // PUT, DELETE
}
