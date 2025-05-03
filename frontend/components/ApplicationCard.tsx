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
    successMessage?: string;
    department?: string;
    degreeProgram?: string;
    onDepartmentChange?: (value: string) => void;
    onDegreeProgramChange?: (value: string) => void;
    onSubmit?: () => void;
    onUpload?: (file: File) => void;
  }

  export default function ApplicationCard({
    isSubmitted,
    successMessage,
    department,
    degreeProgram,
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
        if (file && onUpload) {
          onUpload(file);
        }
      };

return (
    <div>
    <Card className="w-full max-w-xl shadow-xl">
        <CardHeader>
            <CardTitle className="text-3xl font-extrabold underline decoration-black underline-offset-4">
                Create Application
            </CardTitle>
        </CardHeader>

  <CardContent className="flex flex-col gap-4">
    {!isSubmitted ? (
      <>
    <label className="font-medium mt-4">Department</label>
    <Select onValueChange={(value) => onDepartmentChange?.(value)} value={department}>
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
    <Select onValueChange={(value) => onDegreeProgramChange?.(value)} value={degreeProgram}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select Degree Program" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="MS">M.S.</SelectItem>
        <SelectItem value="MSMT">M.S. without Thesis</SelectItem>
        <SelectItem value="PHD">Ph.D</SelectItem>
      </SelectContent>
    </Select>

    <Button className="bg-black hover:bg-green-700 text-white" onClick={onSubmit}>
      Submit Application
    </Button>
    </>
    ) : (
      <>
      {successMessage && (
        <div className="text-green-600 font-semibold">{successMessage}</div>
      )}

    <Input
      type="file"
      ref={fileInputRef}
      onChange={handleFileChange}
      className="hidden"
    />
    <Button className="bg-red-500 hover:bg-red-700" onClick={handleUploadClick}>
      Upload Document
    </Button>
    </>
    )}
      </CardContent>
    </Card>
    </div>
);
}