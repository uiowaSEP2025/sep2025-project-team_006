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
import { loadQsRankings } from "@/utils/qsRanking";
import LikeButton from "@/components/LikeButton";

interface DocumentInfo {
  document_id: string | null;
  document_type: string | null;
}

export default function StudentPageContent() {
  const searchParams = useSearchParams();
  const studentId = searchParams.get("id");
  const webService = new WebService();

  const [studentData, setStudentData] = useState<StudentData | null>(null);
  const [documentList, setDocumentList] = useState<DocumentInfo[]>([]);
  const [currentDocIndex, setCurrentDocIndex] = useState<number>(0);

  const [reviewMetrics, setReviewMetrics] = useState<MetricResponse[]>([]);
  const [comments, setComments] = useState<string>("");
  const [reviewExists, setReviewExists] = useState<boolean>(false);
  const [reviewSubmitted, setReviewSubmitted] = useState<boolean>(false);
  const [liked, setLiked] = useState<boolean>(false);
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

  const [qsRankings, setQsRankings] = useState<Record<string, string>>({});

  const currentDocument = documentList[currentDocIndex] || {};

  useEffect(() => {
    loadQsRankings()
      .then(setQsRankings)
      .catch((err) => {
        console.error("Failed to load QS rankings:", err);
      });
  }, []);

  useEffect(() => {
    const id = typeof window !== "undefined" ? window.__USER__?.id + "" : "";
    setFacultyId(id);

    if (!studentId) return;
    const fetchStudentInfo = async () => {
      try {
        const response = await apiGET(
          webService.STUDENTS_APPLICANT_INFO,
          studentId,
        );
        if (response.success) {
          setStudentData(response.payload);
          const apps = response.payload.applications || [];
          setDepartment(apps[0]?.department || "");

          const docs = apps[0]?.documents || [];
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

    fetchStudentInfo();
  }, [studentId]);

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
          console.log("Fetched review payload:", response.payload);
          console.log("Setting liked to:", response.payload.liked ?? false);
          setLiked(response.payload.liked ?? false);
        } else {
          console.error("Error fetching review metrics: ", response.error);
        }
      } catch (error) {
        console.error("An unexpected error occurred: ", error);
      }
    };
    fetchReviewMetrics();
  }, [studentData, faculty_id]);

  const handleStartReview = async () => {
    if (!studentData || !studentData.applications?.length) return;
    const applicationId = studentData.applications[0].application_id;
    try {
      const reviewPayload = {
        application_id: applicationId,
        faculty_id,
        department,
      };
      const response = await apiPOST(
        webService.REVIEW_CREATE_POST,
        JSON.stringify(reviewPayload),
      );
      if (response.success) {
        setReviewId(response.payload.review_id);
        setReviewMetrics(response.payload.review_metrics || []);
        setComments(response.payload.comments || "");
        setReviewExists(true);
      } else {
        console.error("Error creating review:", response.error);
      }
    } catch (error) {
      console.error("An unexpected error occurred:", error);
    }
  };

  const handleSaveReview = async () => {
    const EPSILON = 0.001;

    const totalWeight = reviewMetrics.reduce(
      (sum, m) => sum + m.selected_weight,
      0,
    );
    const validWeights = Math.abs(totalWeight - 1.0 ) < EPSILON;
    const validScores = reviewMetrics.every(
      (m) => m.value >= 0 && m.value <= 5,
    );

    if (!validWeights || !validScores) {
      let msg = "Fix the following before saving:\n";
      if (!validWeights) msg += "- Total weights must equal 1.00\n";
      if (!validScores) msg += "- Scores must be 0–5";
      alert(msg);
      return;
    }

    const payload = {
      comments,
      liked,
      review_metrics: reviewMetrics.map((m) => ({
        review_metric_id: m.review_metric_id,
        selected_weight: m.selected_weight,
        value: m.value,
      })),
      overall_score: null,
    };
    console.log("Saving review with payload:", payload);
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
        if (typeof response.payload.liked === "boolean") {
          setLiked(response.payload.liked);
        }
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
      const res = await apiPUT(webService.REVIEW_SUBMIT, reviewId.toString(), "{}");
      if (res.success) setReviewSubmitted(true);
    } catch (e) {
      console.error("Submit failed:", e);
    }
  };

  return (
    <div className="flex w-full h-screen">
      <div className="w-1/2 h-full border-r border-gray-300 p-6">
        {currentDocument.document_id &&
        currentDocument.document_type === "pdf" ? (
          <PdfViewer document_id={currentDocument.document_id} />
        ) : currentDocument.document_id &&
          currentDocument.document_type === "xlsx" ? (
          <ExcelViewer document_id={currentDocument.document_id} />
        ) : (
          <p className="h-full flex items-center justify-center text-gray-600">
            {currentDocument.document_type === "placeholder"
              ? "There will be a document here."
              : "No document available."}
          </p>
        )}
        <div className="mt-4 flex gap-2 justify-center">
          {documentList.map((_, i) => (
            <Button
              key={i}
              onClick={() => setCurrentDocIndex(i)}
              variant={i === currentDocIndex ? "default" : "outline"}
            >
              {i + 1}
            </Button>
          ))}
        </div>
      </div>

      <div className="w-1/2 h-full p-6 overflow-auto">
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">
            Review for {studentData?.first_name} {studentData?.last_name}
          </h1>

          {(studentData?.original_gpa !== undefined ||
            studentData?.standardized_gpa !== undefined ||
            studentData?.school) && (
            <div className="mb-4">
              {studentData.original_gpa !== undefined && (
                <p>
                  <span className="font-semibold">Original GPA:</span>{" "}
                  {studentData.original_gpa}
                </p>
              )}
              {studentData.standardized_gpa !== undefined && (
                <p>
                  <span className="font-semibold">Standardized GPA:</span>{" "}
                  {studentData.standardized_gpa.toFixed(2)} / 4.00
                </p>
              )}
              {studentData.school && (
                <>
                  <p>
                    <span className="font-semibold">School Attended:</span>{" "}
                    {studentData.school}
                  </p>
                  <p>
                    <span className="font-semibold">QS World Ranking:</span>{" "}
                    {qsRankings[studentData.school.toLowerCase()] ? (
                      <>#{qsRankings[studentData.school.toLowerCase()]}</>
                    ) : (
                      <>Not Ranked</>
                    )}
                  </p>
                </>
              )}
            </div>
          )}

          {!reviewExists ? (
            <div className="flex items-center justify-center h-96">
              <Button onClick={handleStartReview}>Start Review</Button>
            </div>
          ) : reviewSubmitted ? (
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
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  className="w-full h-32 bg-gray-50"
                />
              </div>

              <div className="flex items-center mb-4">
              {reviewId > 0 && (
                <LikeButton
                  reviewId={reviewId}
                  initialLiked={liked}
                  updateUrl={webService.REVIEW_LIKE_TOGGLE}
                  onToggle={(newLiked) => setLiked(newLiked)}
                />
              )}
                <span className="ml-2 text-sm text-gray-600">Mark as Liked</span>
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
