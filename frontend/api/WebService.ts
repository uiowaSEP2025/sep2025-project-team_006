/**
 * Job: This holds all API calls for our backend
 */
export default class WebService {
  // Prefix
  private isDev = process.env.NODE_ENV === "development";
  private serverUrl = this.isDev
    ? "http://localhost:5000"
    : `https://${process.env.BACKEND_API_DOMAIN}`;
  // Test API calls - these do not exist anymore, but are used for unit testing
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
  FACULTY_METRIC_POST = `${this.serverUrl}/api/faculty/metrics`; // POST
  FACULTY_METRIC_DEFAULTS = `${this.serverUrl}/api/faculty/metrics/default`; // GET
  STUDENTS_APPLICANT_LIST = `${this.serverUrl}/api/students/applicants`; // GET
  STUDENTS_APPLICANT_INFO = `${this.serverUrl}/api/students/:id`; // GET
  APPLICATION_DOCUMENT_GET = `${this.serverUrl}/api/documents/:id`; // GET
  APPLICATION_DOCUMENT_POST = `${this.serverUrl}/api/documents`; // POST
  // These might have to change slightly for the template migration
  REVIEW_CREATE_POST = `${this.serverUrl}/api/reviews`; // POST
  REVIEW_UPDATE_PUT = `${this.serverUrl}/api/reviews/:id`; // PUT
  REVIEW_SUBMIT = `${this.serverUrl}/api/reviews/:id/submit`; // PUT
  REVIEW_METRICS_FOR_FACULTY = `${this.serverUrl}/api/reviews/metrics/app/:id1/faculty/:id2`; // GET
  TEMPLATE = `${this.serverUrl}/api/templates`; // POST, GET
  TEMPLATE_GET_BY_DEPARTMENT = `${this.serverUrl}/api/templates/department/:id`; // GET, unused
  TEMPLATE_BY_ID = `${this.serverUrl}/api/templates/:id`; // GET, PUT, DELETE
}
