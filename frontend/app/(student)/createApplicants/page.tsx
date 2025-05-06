"use client";

import WebService from "@/api/WebService";
import { apiGET, apiPOST } from "@/api/apiMethods";
import Link from "next/link";
import ApplicationCard from "@/components/ApplicationCard";
import { Button } from "@/components/ui/button";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";

export default function CreateApplication() {
    const[isSubmitted, setSubmit] = useState<boolean>(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [department, setDepartment] = useState("");
    const [degreeProgram, setDegreeProgram] = useState("");
    const [studentID, setStudentId] = useState("");
    const [appId, setAppId] = useState<number | null>(null);
    const [applications, setApplications] = useState<any[]>([]);
    const webService = new WebService();

    useEffect(() => {
      const id = (window.__USER__?.id + "") || "";
      setStudentId(id);
      console.log("Student ID:", id);
      if(id){
        fetchApplications(id);
      }
    }, []);

    const fetchApplications = async (id:string) => {
      try {
        const response = await apiGET(webService.GET_STUDENT_APPLICATIONS, id);
        console.log("Fetched Applications:", response);
        if(response.success && Array.isArray(response.payload)){

          setApplications(response.payload);
        }else{
          console.error("GET_STUDENT_APPLICATIONS error:", response.error)
          setApplications([]);
        }
        } catch (error) {
        console.error("An unexpected error occurred:", error);
        setApplications([]);
        }
      };

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
                const createdApp = response.payload as { application_id: number };
                setAppId(createdApp.application_id);
                setSubmit(true);
                setSuccessMessage("Application submitted successfully! You may now upload documents.");
                fetchApplications(studentID);
              } else {
                console.error("Error creating review:", response.error);
              }
            } catch (error) {
              console.error("An unexpected error occurred:", error);
            }
          };

    const handleFileUpload = async (file: File, applicationId?: number) => {
      if (!file || !applicationId) return;
      
      const extension = file.name.split('.').pop()?.toLowerCase();
      let documentType: string;
    
      if (extension === "pdf") {
        documentType = "pdf";
      } else if (extension === "xlsx") {
        documentType = "xlsx";
      } else {
        alert("Unsupported file type. Only PDF and XLSX are allowed.");
        return;
      }
      
      const formData = new FormData();

      formData.append("file", file);
      formData.append("document_type", documentType); 
      formData.append("application_id", applicationId.toString());

      try {
        const response = await fetch(webService.APPLICATION_DOCUMENT_POST, {
          method: "POST",
          body: formData,
        });

      if (response.ok) {
        const result = await response.json();
        console.log("Document uploaded:", result);
        alert("Document uploaded successfully!");
      } else {
        const error = await response.json();
        console.error("Upload failed:", error);
        alert("Upload failed: " + error.message);
      }
    } catch (err) {
      console.error("Error uploading file:", err);
      alert("Unexpected error occurred during upload.");
    }
    };

  return (
    <div className="flex flex-col items-center min-h-screen p-6 sm:p-10 bg-gray-50 gap-4">
      <ApplicationCard
        isSubmitted={isSubmitted}
        applicationId={appId ?? undefined}
        successMessage={successMessage ?? undefined}
        department={department}
        degreeProgram={degreeProgram}
        onDepartmentChange={setDepartment}
        onDegreeProgramChange={setDegreeProgram}
        onSubmit={handleSubmit}
        onUpload={handleFileUpload}
      />

      {applications.map((app, index) => (
        <ApplicationCard
          key={index}
          isSubmitted={true}
          applicationId={app.application_id}
          successMessage={`Application to ${app.department} - ${app.degree_program}`}
          department={app.department}
          degreeProgram={app.degree_program}
          onDepartmentChange={() => {}}
          onDegreeProgramChange={() => {}}
          submittedAt={app.submission_date}
          onUpload={handleFileUpload}
        />
      ))}
      <Button asChild>
        <Link href="/studentHome">Return to Home</Link>
      </Button>
    </div>
  );
}
