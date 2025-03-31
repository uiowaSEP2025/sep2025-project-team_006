"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import WebService from "@/api/WebService";

interface ExcelViewerProps {
  document_id: string;
}

// Needed because typing is weird for this
/* eslint-disable */
export default function ExcelViewer({ document_id }: ExcelViewerProps) {
  const webService = new WebService();
  const [excelData, setExcelData] = useState<any[] | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchExcel = async () => {
      try {
        const url = webService.APPLICATION_DOCUMENT_GET.replace(
          ":id",
          document_id,
        );
        const response = await axios.get(url, {
          responseType: "blob", // retrieve the file as binary
          withCredentials: true,
        });

        // Check that the MIME type indicates an Excel file.
        const blobType = response.data.type;
        const isExcel =
          blobType ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
        if (!isExcel) {
          setErrorMessage("The fetched document is not a valid Excel file.");
          return;
        }

        const arrayBuffer = await response.data.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: "array" });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet, {
          header: 1,
        });
        setExcelData(jsonData);
      } catch (error) {
        console.error("Error fetching or parsing Excel file:", error);
        setErrorMessage("Failed to load Excel document.");
      }
    };

    fetchExcel();
  }, [document_id, webService.APPLICATION_DOCUMENT_GET]);

  if (errorMessage) {
    return <p className="text-red-600">{errorMessage}</p>;
  }

  if (!excelData) {
    return <p>Loading Excel data...</p>;
  }

  return (
    <div className="h-full w-full overflow-auto">
      <table className="min-w-full border-collapse">
        <thead>
          <tr>
            {excelData[0]?.map((header: any, index: number) => (
              <th key={index} className="border p-2 bg-gray-200">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {excelData.slice(1).map((row: any, rowIndex: number) => (
            <tr key={rowIndex}>
              {row.map((cell: any, cellIndex: number) => (
                <td key={cellIndex} className="border p-2">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
