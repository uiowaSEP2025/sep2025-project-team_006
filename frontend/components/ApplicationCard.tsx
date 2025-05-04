"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
  } from "@/components/ui/select";
import React, { useRef } from "react";

interface ApplicationCardProps {
    isSubmitted: boolean;
    applicationId?: number;
    successMessage?: string;
    department?: string;
    degreeProgram?: string;
    submittedAt?: string;
    onDepartmentChange?: (value: string) => void;
    onDegreeProgramChange?: (value: string) => void;
    onSubmit?: () => void;
    onUpload?: (file: File, applicationId?: number) => void;
  }

  export default function ApplicationCard({
    isSubmitted,
    applicationId,
    successMessage,
    department,
    degreeProgram,
    submittedAt,
    onDepartmentChange,
    onDegreeProgramChange,
    onSubmit,
    onUpload,
  }: ApplicationCardProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUploadClick = () => {
        fileInputRef.current?.click();
      };
    
      const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && isSubmitted && applicationId && onUpload) {
          onUpload(file, applicationId);
        } else {
            alert("Upload failed: Application must be submitted first.");
          }
      };

return (
    <div>
    <Card className="w-full max-w-xl shadow-xl">
        <CardHeader>
            <CardTitle className="text-3xl font-extrabold underline decoration-black underline-offset-4">
                {isSubmitted? "Submitted Application" : "Create Application"}
            </CardTitle>
        </CardHeader>

  <CardContent className="flex flex-col gap-4">
    <label className="font-medium mt-4">Department</label>
    <Select onValueChange={(value) => onDepartmentChange?.(value)} value={department} disabled={isSubmitted}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select Department" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="BME">Biomedical Engineering</SelectItem>
        <SelectItem value="CBE">Chemical and Biochemical Engineering </SelectItem>
        <SelectItem value="CEE">Civil and Environmental Engineering</SelectItem>
        <SelectItem value="ECE">Electrical and Computer Engineering</SelectItem>
        <SelectItem value="ISE">Industrial and Systems Engineering</SelectItem>
        <SelectItem value="ME">Mechanical Engineering</SelectItem>
      </SelectContent>
    </Select>

    <label className="font-medium mt-4">Degree Program</label>
    <Select onValueChange={(value) => onDegreeProgramChange?.(value)} value={degreeProgram} disabled={isSubmitted}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select Degree Program" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="MS">M.S.</SelectItem>
        <SelectItem value="MSMT">M.S. without Thesis</SelectItem>
        <SelectItem value="PHD">Ph.D</SelectItem>
      </SelectContent>
    </Select>
    {isSubmitted && applicationId ? (
            <>
              {/* Submitted date */}
              {submittedAt && (
                <p className="text-sm text-gray-600">
                  Submitted on: <strong>{new Date(submittedAt).toLocaleDateString()}</strong>
                </p>
              )}
    <input
      type="file"
      ref={fileInputRef}
      onChange={handleFileChange}
      className="hidden"
    />
    <Button className="bg-red-500 hover:bg-red-700" onClick={handleUploadClick}>
      Upload Document
    </Button>
        </>
    ) : (

    <Button className="bg-black hover:bg-green-700 text-white" onClick={onSubmit}>
      Submit Application
    </Button>
    )}
    
    {successMessage && (
            <div className="text-green-600 font-semibold">{successMessage}</div>
          )}
      </CardContent>
    </Card>
    </div>
);
}