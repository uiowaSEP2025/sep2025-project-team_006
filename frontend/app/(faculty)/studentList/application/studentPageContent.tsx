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
  const [reviewId, setReviewId] = useState<number>(0);
  const [department, setDepartment] = useState<string>("");
  const [faculty_id, setFacultyId] = useState<string>("");

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
    const id = window.__USER__?.id + "" || "";
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
    const totalWeight = reviewMetrics.reduce(
      (sum, m) => sum + m.selected_weight,
      0,
    );
    const validWeights = totalWeight === 1.0;
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
      review_metrics: reviewMetrics.map((m) => ({
        review_metric_id: m.review_metric_id,
        selected_weight: m.selected_weight,
        value: m.value,
      })),
      overall_score: null,
    };

    try {
      const res = await apiPUT(webService.REVIEW_UPDATE_PUT, reviewId.toString(), JSON.stringify(payload));
      if (!res.success) console.error("Save failed:", res.error);
    } catch (e) {
      console.error("Error saving:", e);
    }
  };

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
                onChangeMetric={(m) => setReviewMetrics(m)}
              />
              <div className="gap-6 mb-4 mt-4">
                <h3 className="font-bold">Comments:</h3>
                <Textarea
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  className="w-full h-32 bg-gray-50"
                />
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
