"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { apiGET } from "@/api/apiMethods";
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
import { ApplicationData } from "@/types/ApplicationData";

interface DocumentInfo {
  document_id: string | null;
  document_type: string | null;
}

export default function StudentPageContent() {
  const searchParams = useSearchParams();
  const applicationId = searchParams.get("id"); // will be a string or null
  const webService = new WebService();

  const [studentData, setStudentData] = useState<StudentData | null>(null);
  const [applicationData, setApplicationData] =
    useState<ApplicationData | null>();
  const [currentDocIndex, setCurrentDocIndex] = useState<number>(0);
  const [documentList, setDocumentList] = useState<DocumentInfo[]>([]);
  const [reviewMetrics, setReviewMetrics] = useState<MetricResponse[]>([]);
  const [comments, setComments] = useState<string>("");
  const [reviewExists, setReviewExists] = useState<boolean>(false);
  //const [reviewSubmitted, setReviewSubmitted] = useState<boolean>(false);
  const [reviewId, setReviewId] = useState<number>(0);
  const [liked, setLiked] = useState<boolean>(false);
  //const [department, setDepartment] = useState<string>("");
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

  /**
   * Calls the student applicant information
   */
  useEffect(() => {
    const id = window.__USER__?.id + "" || "";
    setFacultyId(id);
    if (!applicationId) return;

    const fetchStudentInfo = async (application_id: string) => {
      try {
        const appResponse = await apiGET(
          webService.APPLICATION_GET,
          application_id,
        );
        if (!appResponse.success)
          return console.error("APPLICATION_GET error:", appResponse.error);

        const app = appResponse.payload;
        setApplicationData(app);
        app.student.standardized_gpa ??= 0;
        setStudentData(app.student);
        //const apps = response.payload.applications || [];
        //setDepartment(app.department || "");
        //setStudentData(app.student);
        console.log("Showing review with payload:", appResponse.payload);

        const docs = app.documents || [];
        const formattedDocs = docs.map((doc: DocumentInfo) => ({
          document_id: String(doc.document_id),
          document_type: String(doc.document_type),
        }));
        //setDepartment(department);
        setDocumentList([...formattedDocs]);
      } catch (error) {
        console.error("An unexpected error occurred:", error);
      }
    };

    fetchStudentInfo(applicationId);
  }, [applicationId, webService.APPLICATION_GET]);

  /**
   * Fetches any of the reviews the faculty has left previously (if any)
   */
  useEffect(() => {
    if (!applicationData) return;
    const applicationId = applicationData.application_id;

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
            //setReviewSubmitted(false);
            return;
          }

          //setReviewId(response.payload.review_id);
          setReviewExists(true);
          //setReviewSubmitted(response.payload.submitted);
          setReviewMetrics(response.payload.review_metrics);
          setComments(response.payload.comments || "");
          setLiked(response.payload.liked ?? false);
          setReviewId(response.payload.review_id);

          const facultyScore = calculateFacultyScore(
            response.payload.review_metrics,
          );
          setReviewScores({
            overall_score: response.payload.overall_score,
            faculty_score: facultyScore,
          });
        } else {
          console.error("Error fetching review metrics: ", response.error);
        }
      } catch (error) {
        console.error("An unexpected error occurred: ", error);
      }
    };
    fetchReviewMetrics();
  }, [
    studentData,
    applicationData,
    webService.REVIEW_METRICS_FOR_FACULTY,
    faculty_id,
  ]);

  const calculateFacultyScore = (metrics: MetricResponse[]): number => {
    if (!metrics || metrics.length === 0) return 0;

    let faculty_score = 0;
    for (const metric of metrics) {
      faculty_score += metric.selected_weight * metric.value;
    }

    faculty_score = (faculty_score / 5) * 100;
    return Math.trunc(faculty_score);
  };

  /**
   * Save all review updates by sending the current comments and metrics back to the server.
   * This function acts as our overall save call.
   */

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
            Reviewed Application for {studentData?.first_name}{" "}
            {studentData?.last_name}
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
            <div className="flex items-center justify-center h-96"></div>
          ) : (
            <>
              <ReviewForm
                metrics={reviewMetrics}
                isReview={true}
                onChangeMetric={(updatedMetrics) =>
                  setReviewMetrics(updatedMetrics)
                }
              />
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

              <div className="gap-6 mb-4 mt-4">
                <h3 className="font-bold">Comments:</h3>
                <Textarea
                  placeholder="Comments"
                  value={comments}
                  disabled={true}
                  className="w-full h-32 bg-gray-50"
                />
              </div>

              <div className="flex items-center mb-4">
                <LikeButton
                  reviewId={reviewId}
                  initialLiked={liked}
                  updateUrl={webService.REVIEW_LIKE_TOGGLE}
                  onToggle={(newLiked) => setLiked(newLiked)}
                />
                <span className="ml-2 text-sm text-gray-600">
                  Mark as Liked
                </span>
              </div>
            </>
          )}
          <div className="w-48 flex flex-col gap-2">
            <Button asChild>
              <Link href="/reviewedApplicants">Return to Applicants</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
