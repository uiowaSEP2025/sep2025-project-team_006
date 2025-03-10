"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { apiGETbyId } from "@/api/apiMethods";
import WebService from "@/api/WebService";

interface StudentData {
  student_id: number;
  first_name: string;
  last_name: string;
  phone_number: string,
  address: string,
  // etc.. will flesh this out more when its needed.
}

export default function StudentPage() {
  const searchParams = useSearchParams();
  const studentId = searchParams.get('id'); // will be a string or null
  const [studentData, setStudentData] = useState<StudentData | null>(null);
  const webService = new WebService();

  useEffect(() => {
    if (!studentId) return;
    const fetchStudentInfo = async () => {
      try {
        const response = await apiGETbyId(webService.STUDENTS_APPLICANT_INFO, studentId);
        if (response.success) {
          // this will be expanded upon later.
          setStudentData(response.payload);
        } else {
          console.error("GET error:", response.error);
        }
      } catch (error) {
        console.error("An unexpected error occurred:", error);
      }
    };
    fetchStudentInfo();
  }, [studentId, webService.STUDENTS_APPLICANT_INFO]);

  // UI will be developed more in sprint 3.
  return (
    <div className="p-6">
      <h1>Student Details for ID: {studentId}</h1>
      {studentData ? (
        <pre>{JSON.stringify(studentData, null, 2)}</pre>
      ) : (
        <p>Loading student data...</p>
      )}
    </div>
  );
}
