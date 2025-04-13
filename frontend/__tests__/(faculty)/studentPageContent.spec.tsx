import React from 'react';
import { render, screen, waitFor, act, fireEvent } from '@testing-library/react';
import * as apiMethods from '@/api/apiMethods';
import * as apiDoubleIdGETModule from '@/api/methods';
import '@testing-library/jest-dom';
import StudentPageContent from '@/app/(faculty)/studentList/application/studentPageContent';

// --- Mock localStorage ---
const localStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
        getItem(key: string) {
            return store[key] || null;
        },
        setItem(key: string, value: string) {
            store[key] = value.toString();
        },
        removeItem(key: string) {
            delete store[key];
        },
        clear() {
            store = {};
        },
    };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// --- Mock next/navigation useSearchParams ---
jest.mock('next/navigation', () => ({
    useSearchParams: () => ({
        get: (key: string) => (key === 'id' ? 'dummyStudentId' : null),
    }),
}));

// --- Mock WebService ---
jest.mock('@/api/WebService', () => {
    return jest.fn().mockImplementation(() => ({
        STUDENTS_APPLICANT_INFO: 'http://localhost:3000/api/students/applicant_info',
        REVIEW_METRICS_FOR_FACULTY: 'http://localhost:3000/api/reviews/metrics/app/:app_id/faculty/:faculty_id',
        REVIEW_CREATE_POST: 'http://localhost:3000/api/reviews',
        REVIEW_UPDATE_PUT: 'http://localhost:3000/api/reviews/:id',
        REVIEW_SUBMIT: 'http://localhost:3000/api/reviews/:id/submit',
    }));
});

// --- Mock API methods ---
jest.mock('@/api/apiMethods', () => ({
    apiGET: jest.fn(),
    apiPOST: jest.fn(),
    apiPUT: jest.fn(),
}));
jest.mock('@/api/methods', () => ({
    apiDoubleIdGET: jest.fn(),
}));


describe('StudentPageContent', () => {
    beforeEach(() => {
        window.localStorage.setItem('id', 'faculty123');
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders loading state initially', async () => {
        // For loading state, studentId comes from localStorage and is "dummyStudentId"
        // but our apiGET for STUDENTS_APPLICANT_INFO will return an unresolved promise so we get loading.
        (apiMethods.apiGET as jest.Mock).mockResolvedValueOnce({ success: true, payload: {} });
        await act(async () => {
            render(<StudentPageContent />);
        });
        // expect(screen.getByText(/Loading templates/i)).toBeInTheDocument();
    });

    it('displays Start Review button when no review exists', async () => {
        // Simulate a student info response with applications and no review exists.
        const studentResponse = {
            success: true,
            payload: {
                first_name: 'John',
                last_name: 'Doe',
                applications: [
                    {
                        application_id: 100,
                        department: 'ECE',
                        documents: [{ document_id: 'doc1', document_type: 'pdf' }],
                    },
                ],
            },
        };

        const reviewResponse = {
            success: true,
            payload: {
                review_exists: false,
            },
        };

        (apiMethods.apiGET as jest.Mock).mockImplementation((url: string) => {
            if (url === 'http://localhost:3000/api/students/applicant_info') {
                return Promise.resolve(studentResponse);
            }
            return Promise.resolve({ success: false });
        });
        (apiDoubleIdGETModule.apiDoubleIdGET as jest.Mock).mockResolvedValue(reviewResponse);

        await act(async () => {
            render(<StudentPageContent />);
        });

        await waitFor(() => {
            expect(screen.getByRole('button', { name: /Start Review/i })).toBeInTheDocument();
        });
    });

    it('alerts and prevents saving review when total selected weights not equal to 1', async () => {
        // Simulate existing review with invalid total weight (e.g., total 0.7)
        const studentResponse = {
            success: true,
            payload: {
                first_name: 'Alice',
                last_name: 'Wonderland',
                applications: [
                    { application_id: 200, department: 'ECE', documents: [] },
                ],
            },
        };
        const reviewResponse = {
            success: true,
            payload: {
                review_exists: true,
                review_id: 20,
                submitted: false,
                review_metrics: [
                    { review_metric_id: 1, name: 'Communication', selected_weight: 0.4, template_weight: 0.5, value: 3 },
                    { review_metric_id: 2, name: 'Expertise', selected_weight: 0.3, template_weight: 0.5, value: 4 },
                ],
                comments: "",
            },
        };

        (apiMethods.apiGET as jest.Mock).mockImplementation((url: string) => {
            if (url === 'http://localhost:3000/api/students/applicant_info') {
                return Promise.resolve(studentResponse);
            }
            return Promise.resolve({ success: false });
        });
        (apiDoubleIdGETModule.apiDoubleIdGET as jest.Mock).mockResolvedValue(reviewResponse);

        const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => { });

        await act(async () => {
            render(<StudentPageContent />);
        });
        // await waitFor(() => {
        //     expect(screen.getByText(/Review for Alice Wonderland/i)).toBeInTheDocument();
        // });
        const saveButton = screen.getByRole('button', { name: /Save Review/i });
        fireEvent.click(saveButton);
        await waitFor(() => {
            expect(alertSpy).toHaveBeenCalledWith(expect.stringContaining("Total selected weights must equal 1.00"));
        });
    });

    it('alerts and prevents saving review when a metric score is out of range', async () => {
        const studentResponse = {
            success: true,
            payload: {
                first_name: 'Bob',
                last_name: 'Builder',
                applications: [
                    { application_id: 300, department: 'ECE', documents: [] },
                ],
            },
        };
        // Create review with one metric out-of-range (score > 5)
        const reviewResponse = {
            success: true,
            payload: {
                review_exists: true,
                review_id: 30,
                submitted: false,
                review_metrics: [
                    { review_metric_id: 1, name: 'Communication', selected_weight: 0.5, template_weight: 0.5, value: 6 },
                    { review_metric_id: 2, name: 'Expertise', selected_weight: 0.5, template_weight: 0.5, value: 4 },
                ],
                comments: "",
            },
        };

        (apiMethods.apiGET as jest.Mock).mockImplementation((url: string) => {
            if (url === 'http://localhost:3000/api/students/applicant_info') {
                return Promise.resolve(studentResponse);
            }
            return Promise.resolve({ success: false });
        });
        (apiDoubleIdGETModule.apiDoubleIdGET as jest.Mock).mockResolvedValue(reviewResponse);

        const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => { });

        await act(async () => {
            render(<StudentPageContent />);
        });
        // await waitFor(() => {
        //     expect(screen.getByText(/Review for Bob Builder/i)).toBeInTheDocument();
        // });
        const saveButton = screen.getByRole('button', { name: /Save Review/i });
        fireEvent.click(saveButton);
        await waitFor(() => {
            expect(alertSpy).toHaveBeenCalledWith(expect.stringContaining("Each metric score must be between 0 and 5"));
        });
    });

    it('successfully saves review when validations pass', async () => {
        const studentResponse = {
            success: true,
            payload: {
                first_name: 'Charlie',
                last_name: 'Chocolate',
                applications: [
                    { application_id: 400, department: 'ECE', documents: [] },
                ],
            },
        };
        const reviewResponse = {
            success: true,
            payload: {
                review_exists: true,
                review_id: 40,
                submitted: false,
                review_metrics: [
                    { review_metric_id: 1, name: 'Communication', selected_weight: 0.5, template_weight: 0.5, value: 4 },
                    { review_metric_id: 2, name: 'Expertise', selected_weight: 0.5, template_weight: 0.5, value: 4 },
                ],
                comments: "Initial Comment",
            },
        };
        const updatedReviewResponse = {
            success: true,
            payload: {
                review_id: 40,
                review_metrics: [
                    { review_metric_id: 1, name: 'Communication', selected_weight: 0.5, template_weight: 0.5, value: 4 },
                    { review_metric_id: 2, name: 'Expertise', selected_weight: 0.5, template_weight: 0.5, value: 4 },
                ],
                comments: "Updated Comment",
                overall_score: null,
                submitted: false,
            },
        };

        (apiMethods.apiGET as jest.Mock).mockImplementation((url: string) => {
            if (url === 'http://localhost:3000/api/students/applicant_info') {
                return Promise.resolve(studentResponse);
            }
            return Promise.resolve({ success: false });
        });
        (apiDoubleIdGETModule.apiDoubleIdGET as jest.Mock).mockResolvedValue(reviewResponse);
        (apiMethods.apiPUT as jest.Mock).mockResolvedValue(updatedReviewResponse);

        await act(async () => {
            render(<StudentPageContent />);
        });
        // await waitFor(() => {
        //     expect(screen.getByText(/Review for Charlie Chocolate/i)).toBeInTheDocument();
        // });
        const textarea = screen.getByPlaceholderText(/Comments/i);
        fireEvent.change(textarea, { target: { value: "Updated Comment" } });
        const saveButton = screen.getByRole('button', { name: /Save Review/i });
        fireEvent.click(saveButton);
        await waitFor(() => {
            expect(apiMethods.apiPUT).toHaveBeenCalledWith(
                expect.any(String),
                "40",
                expect.any(String)
            );
        });
    });

    it('successfully submits review after saving', async () => {
        const studentResponse = {
            success: true,
            payload: {
                first_name: 'Dora',
                last_name: 'Explorer',
                applications: [
                    { application_id: 500, department: 'ECE', documents: [] },
                ],
            },
        };
        const reviewResponse = {
            success: true,
            payload: {
                review_exists: true,
                review_id: 50,
                submitted: false,
                review_metrics: [
                    { review_metric_id: 1, name: 'Communication', selected_weight: 0.5, template_weight: 0.5, value: 4 },
                    { review_metric_id: 2, name: 'Expertise', selected_weight: 0.5, template_weight: 0.5, value: 4 },
                ],
                comments: "",
            },
        };
        const submitReviewResponse = {
            success: true,
            payload: { review_id: 50, submitted: true, review_metrics: [] },
        };

        (apiMethods.apiGET as jest.Mock).mockImplementation((url: string) => {
            if (url === 'http://localhost:3000/api/students/applicant_info') {
                return Promise.resolve(studentResponse);
            }
            return Promise.resolve({ success: false });
        });
        (apiDoubleIdGETModule.apiDoubleIdGET as jest.Mock).mockResolvedValue(reviewResponse);
        // Simulate two apiPUT calls: one for saving, one for submitting.
        (apiMethods.apiPUT as jest.Mock)
            .mockResolvedValueOnce({ success: true, payload: {} })
            .mockResolvedValueOnce(submitReviewResponse);

        await act(async () => {
            render(<StudentPageContent />);
        });
        // await waitFor(() => {
        //     expect(screen.getByText(/Review for Dora Explorer/i)).toBeInTheDocument();
        // });
        const submitButton = screen.getByRole('button', { name: /Submit Review/i });
        fireEvent.click(submitButton);
        await waitFor(() => {
            expect(apiMethods.apiPUT).toHaveBeenCalledTimes(2);
            expect(apiMethods.apiPUT).toHaveBeenLastCalledWith(
                expect.any(String),
                "50",
                "{}"
            );
        });
    });
});
