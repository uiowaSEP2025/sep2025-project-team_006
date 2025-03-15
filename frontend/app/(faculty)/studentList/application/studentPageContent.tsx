"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { apiGET } from "@/api/apiMethods";
import WebService from "@/api/WebService";
import PdfViewer from "@/components/PdfViewer";

interface StudentData {
  student_id: number;
  first_name: string;
  last_name: string;
  phone_number: string,
  address: string,
  applications: ApplicationData[]
}

interface ApplicationData {
  application_id: number,
  status: string,
  submission_date: Date,
  department: string,
  degree_program: string,
  documents: DocumentData[]
}

interface DocumentData {
  document_id: number,
  document_type: string
  file_path: string,
  uploaded_at: Date,
}

export default function StudentPageContent() {
  const searchParams = useSearchParams();
  const studentId = searchParams.get('id'); // will be a string or null
  const webService = new WebService();
  const [studentData, setStudentData] = useState<any>(null);
  const documentId =
    studentData &&
      studentData.applications &&
      studentData.applications.length > 0 &&
      studentData.applications[0].documents &&
      studentData.applications[0].documents.length > 0
      ? String(studentData.applications[0].documents[0].document_id)
      : null;

  const fetchStudentInfo = async (student_id: string) => {
    try {
      const response = await apiGET(webService.STUDENTS_APPLICANT_INFO, student_id);
      if (response.success) {
        setStudentData(response.payload);
      } else {
        console.error("GET error:", response.error);
      }
    } catch (error) {
      console.error("An unexpected error occurred:", error);
    }
  };

  useEffect(() => {
    if (!studentId) return;
    fetchStudentInfo(studentId);
  }, [studentId, webService.STUDENTS_APPLICANT_INFO]);

  return (
    <div className="flex w-full h-screen">
      {/* Left half: PDF Viewer */}
      <div className="w-1/2 h-full border-r border-gray-300 p-6">
        {documentId ? (
          <PdfViewer document_id={documentId} />
        ) : (
          <p className="h-full flex items-center justify-center text-center text-gray-600">
            No document available.
          </p>
        )}
      </div>

      {/* Right half: Other Content - This is where the review UI should be */}
      <div className="w-1/2 h-full p-6 overflow-auto">
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">
            Student Details for ID: {studentId}
          </h1>
          {studentData ? (
            <pre className="bg-gray-100 p-4 rounded shadow">
              {JSON.stringify(studentData, null, 2)}
            </pre>
          ) : (
            <p className="text-gray-600">Loading student data...</p>
          )}
        </div>
      </div>
    </div>
  );
}
