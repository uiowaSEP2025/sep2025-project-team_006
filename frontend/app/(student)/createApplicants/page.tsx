"use client";

import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
  } from "@/components/ui/select";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardFooter,
  } from "@/components/ui/card";
import React, { useRef } from "react";
import { useState } from "react";

export default function CreateApplication() {
    const [department, setDepartment] = useState("");
    const [degreeProgram, setDegreeProgram] = useState("");

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSubmit = () => {
        console.log("Submitted:", { department, degreeProgram });
        // Send to backend or form handler here
      };    

    const handleUploadClick = () => {
        fileInputRef.current?.click();
      };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
        console.log("Selected file:", file);
          // Upload logic goes here
        }
    };

  return (
    <div className="flex flex-col items-center min-h-screen p-6 sm:p-10 bg-gray-50 gap-4">
    <Card className="w-full max-w-xl shadow-xl">
      <CardHeader>
        <CardTitle className="text-3xl font-extrabold underline decoration-black underline-offset-4">
          Create Application
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        <label className="font-medium mt-4">Department</label>
        <Select onValueChange={setDepartment}>
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
        <Select onValueChange={setDegreeProgram}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Degree Program" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="M.S.">MS</SelectItem>
            <SelectItem value="M.S. without thesis">MS w/o Thesis</SelectItem>
            <SelectItem value="Ph.D">PhD</SelectItem>
          </SelectContent>
        </Select>

        <Input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />

        <Button className="bg-red-500 hover:bg-red-700" onClick={handleUploadClick}>
          Upload Document
        </Button>
        <Button className="bg-black hover:bg-green-700 text-white" onClick={handleSubmit}>
          Submit Application
        </Button>
        </CardContent>
        </Card>

        <Button asChild>
          <Link href="/studentHome">Return to Home</Link>
        </Button>
    </div>
  );
}
