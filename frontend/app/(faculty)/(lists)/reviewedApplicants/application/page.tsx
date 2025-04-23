"use client";

import React, { Suspense } from "react";
import StudentPageContent from "./studentPageContent";

export default function StudentPage() {
  return (
    <Suspense fallback={<div>Loading student data...</div>}>
      <StudentPageContent />
    </Suspense>
  );
}
