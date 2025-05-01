"use client";

import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import React, { useRef } from "react";

export default function CreateApplication() {
    const fileInputRef = useRef<HTMLInputElement>(null);

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
    <div className="grid grid-rows-[20px_1fr_20px] items-start justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <h1 className="text-4xl md:text-6xl font-extrabold mb-6 underline underline-offset-4 decoration-black">
        Create Application{" "}
      </h1>
      <main className="flex flex-col row-start-2 items-center sm:items-start gap-4">
        

      <Input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />
        <Button onClick={handleUploadClick}>
          Upload Document
        </Button>

        <Button asChild>
          <Link href="/studentHome">Return to Home</Link>
        </Button>
      </main>
    </div>
  );
}
