"use client";

import { useState, useEffect } from "react";
import axios from "axios";

interface PdfViewerProps {
    documentId: string; // The document id you want to fetch
}

export default function PdfViewer({ documentId }: PdfViewerProps) {
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);

    useEffect(() => {
        const fetchPdf = async () => {
            try {
                // TODO _ extract this and clean this file up
                const response = await axios.get(`http://localhost:5000/api/documents/${documentId}`, {
                    responseType: "blob", // expect binary data
                    withCredentials: true,
                });
                // Create an object URL for the Blob and open it in a new tab/window
                const fileURL = URL.createObjectURL(response.data);
                setPdfUrl(fileURL);
            } catch (error) {
                console.error("Error fetching PDF:", error);
            }
        };

        fetchPdf();
    }, [documentId]);

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
