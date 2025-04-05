"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { apiDELETE, apiGET, apiPOST, apiPUT } from "@/api/apiMethods";
import WebService from "@/api/WebService";
import PdfViewer from "@/components/PdfViewer";
import { StudentData } from "@/types/StudentData";
import ExcelViewer from "@/components/ExcelViewer";
import ReviewForm from "@/components/ReviewForm";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { apiDoubleIdGET } from "@/api/methods";

interface Metric {
  id: number;
  name: string;
  description: string;
  weight: number;
  score: number;
}

interface DefaultMetricResponse {
  metric_name: string;
  description: string;
  default_weight: number;
}

interface FacultyMetricResponse {
  faculty_metric_id: number;
  metric_name: string;
  description: string;
  default_weight: number;
}

interface MetricResponse {
  review_metric_id: number;
  name: string;
  description: string;
  selected_weight: number;
  value: number;
}

interface DocumentInfo {
  document_id: string | null;
  document_type: string | null;
}

export default function StudentPageContent() {
  const searchParams = useSearchParams();
  const studentId = searchParams.get("id"); // will be a string or null
  const webService = new WebService();
  const [studentData, setStudentData] = useState<StudentData | null>(null); // Currently used just for first_name & last_name
  const [currentDocIndex, setCurrentDocIndex] = useState<number>(0);
  const [documentList, setDocumentList] = useState<DocumentInfo[]>([]);
  const [availableMetrics, setAvailableMetrics] = useState<Metric[]>([]);
  const [selectedMetricId, setSelectedMetricId] = useState<number | "">("");
  const [reviewMetrics, setReviewMetrics] = useState<MetricResponse[]>([]);
  const [comments, setComments] = useState<string>("");
  const [reviewExists, setReviewExists] = useState<boolean>(false);
  const [reviewId, setReviewId] = useState<number>(0);
  const currentDocument = documentList[currentDocIndex] || {};
  const faculty_id = localStorage.getItem("id") || "";

  /**
   * Calls the student applicant information
   */
  useEffect(() => {
    if (!studentId) return;
    const fetchStudentInfo = async (student_id: string) => {
      try {
        const response = await apiGET(
          webService.STUDENTS_APPLICANT_INFO,
          student_id,
        );
        if (response.success) {
          setStudentData(response.payload);
          const docs = response.payload.applications?.[0]?.documents || [];
          const formattedDocs = docs.map((doc: DocumentInfo) => ({
            document_id: String(doc.document_id),
            document_type: String(doc.document_type),
          }));
          setDocumentList([...formattedDocs]);
        } else {
          console.error("STUDENTS_APPLICANT_INFO error:", response.error);
        }
      } catch (error) {
        console.error("An unexpected error occurred:", error);
      }
    };

    fetchStudentInfo(studentId);
  }, [studentId, webService.STUDENTS_APPLICANT_INFO]);

  /**
   * Gets the default faculty metrics and the list of the faculty-specific metrics
   */
  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const [defaults, response] = await Promise.all([
          apiGET(webService.FACULTY_METRIC_DEFAULTS),
          apiGET(webService.FACULTY_METRIC_ID, faculty_id),
        ]);
        if (defaults.success && response.success) {
          const combinedMetrics = [
            ...defaults.payload.map(
              (metric: DefaultMetricResponse, index: number) => ({
                id: 1000 + index, // generate a unique id for default metrics
                name: metric.metric_name,
                description: metric.description,
                weight: metric.default_weight,
                score: 0,
                isDefault: true,
              }),
            ),
            ...response.payload.map((metric: FacultyMetricResponse) => ({
              id: metric.faculty_metric_id,
              name: metric.metric_name,
              description: metric.description,
              weight: metric.default_weight,
              score: 0,
              isDefault: false,
            })),
          ];
          setAvailableMetrics(combinedMetrics);
        } else {
          console.error("FACULTY_METRIC_DEFAULTS error:", defaults.error);
          console.error("FACULTY_METRIC_ID error:", response.error);
        }
      } catch (error) {
        console.log("An unexpected error occurred: ", error);
      }
    };
    fetchMetrics();
  }, [webService.FACULTY_METRIC_DEFAULTS, webService.FACULTY_METRIC_ID, faculty_id]);

  /**
   * Fetches any of the reviews the faculty has left previously (if any)
   */
  useEffect(() => {
    if (!studentData || !studentData.applications?.length) return;
    const applicationId = studentData.applications[0].application_id;
    const fetchReviewMetrics = async () => {
      try {
        const response = await apiDoubleIdGET(
          webService.REVIEW_METRICS_FOR_FACULTY,
          applicationId.toString(),
          faculty_id,
        );
        console.log("Review", response);
        if (response.success) {
          // will need to add check on UI for this part
          if (!response.payload.review_exists) {
            setReviewExists(false);
            return;
          }

          setReviewId(response.payload.review_id);
          setReviewExists(true);
          setReviewMetrics(response.payload.review_metrics);
          setComments(response.payload.comments || "");
        } else {
          console.error("Error fetching review metrics: ", response.error);
        }
      } catch (error) {
        console.error("An unexpected error occurred: ", error);
      }
    };
    fetchReviewMetrics();
  }, [studentData, webService.REVIEW_METRICS_FOR_FACULTY, faculty_id]);

  /**
   * Creates a new review from the button press
   */
  const handleStartReview = async () => {
    if (!studentData || !studentData.applications?.length) return;
    const applicationId = studentData.applications[0].application_id;
    try {
      const reviewPayload = {
        application_id: applicationId,
        faculty_id: faculty_id,
      };
      const data = JSON.stringify(reviewPayload);
      const response = await apiPOST(webService.REVIEW_CREATE_POST, data);
      if (response.success) {
        setReviewId(response.payload.review_id);
        setReviewMetrics(response.payload.review_metrics || []);
        setComments(response.payload.comments || "");
        setReviewExists(true);
      } else {
        console.error("Error creating review: ", response.error);
      }
    } catch (error) {
      console.error("An unexpected error occurred:", error);
    }
  };

  /**
   * Updates the comment fromt the text area
   */
  const handleCommentChange = async (newComment: string) => {
    setComments(newComment);
    try {
      // overall_score will eventually be tied into this, but for now we keep it null
      const data = JSON.stringify({
        comments: newComment,
        overall_score: null,
      });
      const id = reviewId.toString();
      const response = await apiPUT(webService.REVIEW_UPDATE_PUT, id, data);
      if (!response.success) {
        console.error("Error updating comment: ", response.error);
      }
    } catch (error) {
      console.error("An unexpected error occurred: ", error);
    }
  };

  /**
   * Adds a review metric to for the specific review
   */
  const handleAddReviewMetric = async () => {
    try {
      const metricToAdd = availableMetrics.find(
        (m) => m.id === selectedMetricId,
      );
      if (!metricToAdd) return;
      const data = JSON.stringify({
        review_id: reviewId,
        name: metricToAdd.name,
        description: metricToAdd.description,
        selected_weight: metricToAdd.weight,
        value: 0,
      });
      const response = await apiPOST(webService.REVIEW_METRIC_POST, data);
      if (response.success) {
        setReviewMetrics((prev) => [...prev, response.payload]);
      } else {
        console.error("Error creating review metric: ", response.error);
      }
    } catch (error) {
      console.error("An unexpected error occurred: ", error);
    }
  };

  // Handler to update a review metric (PUT)
  /**
   * Updates the parameters of the review metric
   * @param metric
   */
  const handleUpdateReviewMetric = async (metric: MetricResponse) => {
    try {
      const id = metric.review_metric_id;
      const data = JSON.stringify({
        name: metric.name,
        description: metric.description,
        selected_weight: metric.selected_weight,
        value: metric.value,
      });
      console.log(data);
      const response = await apiPUT(
        webService.REVIEW_METRIC_UPDATE,
        id.toString(),
        data,
      );
      if (response.success) {
        const updatedMetric = response.payload;
        setReviewMetrics((prevMetrics) =>
          prevMetrics.map((m) =>
            m.review_metric_id === id ? updatedMetric : m,
          ),
        );
      } else {
        console.error("Error updating review metric: ", response.error);
      }
    } catch (error) {
      console.error("An unexpected error occurred: ", error);
    }
  };

  /**
   * Deleted a review metric from the button click
   */
  const handleDeleteReviewMetric = async (id: number) => {
    try {
      const response = await apiDELETE(
        webService.REVIEW_METRIC_UPDATE,
        id.toString(),
      );
      if (response.success) {
        setReviewMetrics((prev) =>
          prev.filter((metric) => metric.review_metric_id !== id),
        );
      } else {
        console.error("Error deleting review metric: ", response.error);
      }
    } catch (error) {
      console.error("An unexpected error occurred: ", error);
    }
  };

  return (
    <div className="flex w-full h-screen">
      {/* Left half: File Viewer */}
      <div className="w-1/2 h-full border-r border-gray-300 p-6">
        {currentDocument.document_id &&
        currentDocument.document_type === "pdf" ? (
          <PdfViewer document_id={currentDocument.document_id} />
        ) : currentDocument.document_id &&
          currentDocument.document_type === "xlsx" ? (
          <ExcelViewer document_id={currentDocument.document_id} />
        ) : (
          <p className="h-full flex items-center justify-center text-center text-gray-600">
            {currentDocument.document_type === "placeholder"
              ? "There will be a document here."
              : "No document available."}
          </p>
        )}
        <div className="mt-4 flex gap-2 justify-center">
          {documentList.map((_, index) => (
            <Button
              key={index}
              onClick={() => setCurrentDocIndex(index)}
              variant={index === currentDocIndex ? "default" : "outline"}
            >
              {index + 1}
            </Button>
          ))}
        </div>
      </div>

      {/* Right half: Other Content - This is where the review UI should be */}

      <div className="w-1/2 h-full p-6 overflow-auto">
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">
            Review Details for {studentData?.first_name}{" "}
            {studentData?.last_name}
          </h1>

          {!reviewExists ? (
            // Center the "Start Review" button when no review exists
            <div className="flex items-center justify-center h-96">
              <Button onClick={handleStartReview}>Start Review</Button>
            </div>
          ) : (
            <>
              {/* Metric Dropdown and Add Button */}
              <div className="mb-4 flex gap-4 items-center">
                <select
                  value={selectedMetricId}
                  onChange={(e) => setSelectedMetricId(Number(e.target.value))}
                  className="p-2 border border-gray-300 rounded"
                >
                  <option value="">Select a metric to add...</option>
                  {availableMetrics.map((metric) => (
                    <option key={metric.id} value={metric.id}>
                      {metric.name}
                    </option>
                  ))}
                </select>
                <Button onClick={handleAddReviewMetric}>Add Metric</Button>
              </div>

              <ReviewForm
                metrics={reviewMetrics}
                onDeleteMetric={handleDeleteReviewMetric}
                onChangeMetric={handleUpdateReviewMetric}
              />

              <Textarea
                placeholder="Comments"
                value={comments}
                onChange={(e) => handleCommentChange(e.target.value)}
              />
            </>
          )}

          <Button asChild>
            <Link href="/studentList">Return to Student List</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
