"use client";
import React from 'react'
import { useState, useEffect } from "react";
import { apiGETDocument } from "@/api/documentsApiMethods";
import WebService from "@/api/WebService";

interface PdfViewerProps {
  document_id: string;
}

/**
 * NOTE: If the file type is a .xlsx file then it will just download the file and not show anything
 */
export default function PdfViewer({ document_id }: PdfViewerProps) {
  const webService = new WebService();
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchPdf = async () => {
      try {
        const fileURL = await apiGETDocument(
          webService.APPLICATION_DOCUMENT_GET,
          document_id,
        );
        setPdfUrl(fileURL);
      } catch (error) {
        console.error("Error fetching PDF:", error);
      }
    };

    fetchPdf();
  }, [document_id, webService.APPLICATION_DOCUMENT_GET]);

  return (
    <div className="h-full w-full">
      {pdfUrl ? (
        <iframe
          src={pdfUrl}
          width="100%"
          height="100%"
          title="PDF Viewer"
          style={{ border: "none" }}
        />
      ) : (
        <p>Loading PDF...</p>
      )}
    </div>
  );
}
