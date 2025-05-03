"use client";

import WebService from "@/api/WebService";
import { apiPOST } from "@/api/apiMethods";
import Link from "next/link";
import ApplicationCard from "@/components/ApplicationCard";
import { Button } from "@/components/ui/button";
import React, { useRef } from "react";
import { useState } from "react";
import { useEffect } from "react";

export default function CreateApplication() {
    const[isSubmitted, setSubmit] = useState<boolean>(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [department, setDepartment] = useState("");
    const [degreeProgram, setDegreeProgram] = useState("");
    const [studentID, setStudentId] = useState("");
    const webService = new WebService();

    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
      const id = window.__USER__?.id?.toString() ?? "";
      setStudentId(id);
      console.log("Student ID:", id);
    }, []);

    const handleSubmit = async () => {
            try {
              const applicationPayload = {
                department,
                degree_program: degreeProgram,
                student_id: studentID
              };
              const response = await apiPOST(
                webService.CREATE_APPLICATION,
                JSON.stringify(applicationPayload),
              );
              if (response.success) {
                console.log("Submitted:", { department, degreeProgram, studentID });
                setSubmit(true);
                setSuccessMessage("Application submitted successfully! You may now upload documents.");
              } else {
                console.error("Error creating review:", response.error);
              }
            } catch (error) {
              console.error("An unexpected error occurred:", error);
            }
          };

    const handleFileUpload = (file: File) => {
      console.log("Selected file:", file);
    };

  return (
    <div className="flex flex-col items-center min-h-screen p-6 sm:p-10 bg-gray-50 gap-4">
      <ApplicationCard
        isSubmitted={isSubmitted}
        successMessage={successMessage ?? undefined}
        department={department}
        degreeProgram={degreeProgram}
        onDepartmentChange={setDepartment}
        onDegreeProgramChange={setDegreeProgram}
        onSubmit={handleSubmit}
        onUpload={handleFileUpload}
      />
      <Button asChild>
        <Link href="/studentHome">Return to Home</Link>
      </Button>
    </div>
  );
}
