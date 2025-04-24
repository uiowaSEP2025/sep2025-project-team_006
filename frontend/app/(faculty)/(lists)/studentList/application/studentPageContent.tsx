"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { apiGET, apiPOST, apiPUT } from "@/api/apiMethods";
import WebService from "@/api/WebService";
import PdfViewer from "@/components/PdfViewer";
import { StudentData } from "@/types/StudentData";
import ExcelViewer from "@/components/ExcelViewer";
import ReviewForm from "@/components/ReviewForm";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { apiDoubleIdGET } from "@/api/methods";
import { MetricResponse } from "@/types/MetricData";
import React from "react";

interface DocumentInfo {
  document_id: string | null;
  document_type: string | null;
}

export default function StudentPageContent() {
  const searchParams = useSearchParams();
  const studentId = searchParams.get("id"); // will be a string or null
  const webService = new WebService();
  const [studentData, setStudentData] = useState<StudentData | null>(null);
  const [currentDocIndex, setCurrentDocIndex] = useState<number>(0);
  const [documentList, setDocumentList] = useState<DocumentInfo[]>([]);
  const [reviewMetrics, setReviewMetrics] = useState<MetricResponse[]>([]);
  const [comments, setComments] = useState<string>("");
  const [reviewExists, setReviewExists] = useState<boolean>(false);
  const [reviewSubmitted, setReviewSubmitted] = useState<boolean>(false);
  const [reviewId, setReviewId] = useState<number>(0);
  const [department, setDepartment] = useState<string>("");
  const [faculty_id, setFacultyId] = useState<string>("");
  const [reviewScores, setReviewScores] = useState<{
    overall_score: number | null;
    faculty_score: number | null;
  }>({
    overall_score: null,
    faculty_score: null,
  });

  const currentDocument = documentList[currentDocIndex] || {};

  /**
   * Calls the student applicant information
   */
  useEffect(() => {
    const id = window.__USER__?.id + "" || "";
    setFacultyId(id);

    if (!studentId) return;
    const fetchStudentInfo = async (student_id: string) => {
      try {
        const response = await apiGET(
          webService.STUDENTS_APPLICANT_INFO,
          student_id,
        );
        if (response.success) {
          setStudentData(response.payload);
          const applications = response.payload.applications;
          const department = applications?.[0]?.department || "";
          const docs = applications?.[0]?.documents || [];
          const formattedDocs = docs.map((doc: DocumentInfo) => ({
            document_id: String(doc.document_id),
            document_type: String(doc.document_type),
          }));
          setDepartment(department);
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
        if (response.success) {
          if (!response.payload.review_exists) {
            setReviewExists(false);
            setReviewSubmitted(false);
            return;
          }

          setReviewId(response.payload.review_id);
          setReviewExists(true);
          setReviewSubmitted(response.payload.submitted);
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
        department,
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
  };

  /**
   * Save all review updates by sending the current comments and metrics back to the server.
   * This function acts as our overall save call.
   */
  const handleSaveReview = async () => {
    const EPSILON = 0.001;

    const totalWeight = reviewMetrics.reduce(
      (sum, metric) => sum + metric.selected_weight,
      0,
    );
    const validWeights = Math.abs(totalWeight - 1.0 ) < EPSILON;
    const validScores = reviewMetrics.every(
      (metric) => metric.value >= 0 && metric.value <= 5,
    );

    if (!validWeights || !validScores) {
      let errorMessage = "Please fix the following before saving:";
      if (!validWeights) {
        errorMessage += "\n- Total selected weights must equal 1.00.";
      }
      if (!validScores) {
        errorMessage += "\n- Each metric score must be between 0 and 5.";
      }
      alert(errorMessage);
      return;
    }
    const payload = {
      comments,
      review_metrics: reviewMetrics.map((metric) => ({
        review_metric_id: metric.review_metric_id,
        selected_weight: metric.selected_weight,
        value: metric.value,
      })),
      // overall_score can be computed on the backend based on weights & values.
      overall_score: null,
    };
    const data = JSON.stringify(payload);
    try {
      const response = await apiPUT(
        webService.REVIEW_UPDATE_PUT,
        reviewId.toString(),
        data,
      );
      if (!response.success) {
        console.error("Error updating review: ", response.error);
      } else {
        console.log("Review saved successfully:", response.payload);
        await fetchReviewScores();
      }
    } catch (error) {
      console.error("An unexpected error occurred while saving review:", error);
    }
  };

  const fetchReviewScores = async () => {
    try {
      const url = webService.REVIEW_GET_SCORES.replace(":id", reviewId.toString());
      const response = await apiGET(url);
      if (response.success) {
        setReviewScores({
          overall_score: response.payload.overall_score ?? null,
          faculty_score: response.payload.faculty_score ?? null,
        });
      } else {
        console.error("Failed to fetch scores:", response.error);
      }
    } catch (error) {
      console.error("Unexpected error fetching scores:", error);
    }
  };

  /**
   * Submits a review by marking it as submitted
   */
  const handleSubmitReview = async () => {
    try {
      await handleSaveReview();

      const response = await apiPUT(
        webService.REVIEW_SUBMIT,
        reviewId.toString(),
        "{}",
      );
      if (response.success) {
        setReviewSubmitted(true);
      } else {
        console.error("Error submitting review: ", response.error);
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
            Review for {studentData?.first_name} {studentData?.last_name}
          </h1>

          {!reviewExists ? (
            // Center the "Start Review" button when no review exists
            <div className="flex items-center justify-center h-96">
              <Button onClick={handleStartReview}>Start Review</Button>
            </div>
          ) : reviewSubmitted ? ( // NEW: If review is submitted, show message
            <div className="flex items-center justify-center h-96">
              <p className="text-xl text-green-700">
                You have already submitted a review for this applicant.
              </p>
            </div>
          ) : (
            <>
              <ReviewForm
                metrics={reviewMetrics}
                isReview={false}
                onChangeMetric={(updatedMetrics) =>
                  setReviewMetrics(updatedMetrics)
                }
              />
              <div className="gap-6 mb-4 mt-4">
                <h3 className="font-bold">Comments:</h3>
                <Textarea
                  placeholder="Comments"
                  value={comments}
                  onChange={(e) => handleCommentChange(e.target.value)}
                  className="w-full h-32 bg-gray-50"
                />
              </div>

              <div className="mt-6 mb-4">
                <h3 className="text-lg font-semibold mb-2">Score Breakdown:</h3>
                  <div className="p-4 border rounded-lg shadow-sm bg-gray-50">
                    <p className="font-medium">Overall Score</p>
                    <p className="text-xl font-bold text-black">
                      {reviewScores.overall_score !== null
                      ? reviewScores.overall_score.toFixed(2)
                      : "—"}
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg shadow-sm bg-gray-50">
                    <p className="font-medium">Faculty Score</p>
                    <p className="text-xl font-bold text-red-800">
                      {reviewScores.faculty_score !== null
                      ? reviewScores.faculty_score.toFixed(2)
                      : "—"}
                    </p>
                  </div>
              </div>

              <div className="w-48 flex flex-col gap-2 mb-4">
                <Button onClick={handleSaveReview}>Save Review</Button>
              </div>
            </>
          )}
          <div className="w-48 flex flex-col gap-2">
            <Button
              disabled={!reviewExists || reviewSubmitted}
              className="bg-black hover:bg-green-700 text-white"
              onClick={handleSubmitReview}
            >
              Submit Review
            </Button>
            <Button asChild>
              <Link href="/studentList">Return to Student List</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
