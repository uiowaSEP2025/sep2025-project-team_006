import axios from "axios";

// Note: This can be used to open file in new window, if needed.
// window.open(fileURL, "_blank"); 

/**
 * Special API GET method with the purpose of fetching documents that are ready to download/view.
 * 
 * @param webService API link from `WebService.ts`
 * @param document_id identifier token of the document to be fetched
 * @returns fileURL to use for download or display
 */
export async function apiGETDocument(webService: string, document_id: string) {
  const formatted_url = webService.replace(":id", document_id);
  try {
    const response = await axios.get(formatted_url, {
      responseType: "blob", // expect binary data
      withCredentials: true,
    });
    const fileURL = URL.createObjectURL(response.data);
    return fileURL;
  } catch (error) {
    console.error("Error fetching document:", error);
    throw error;
  }
}

/**
 * Special API POST method for uploading a document (e.g., PDF or Excel file).
 * 
 * @param webService API link from `WebService.ts`
 * @param file The File object to upload.
 * @param documentType The type of document ("pdf" or "xlsx").
 * @param applicationId The ID of the application to which this document belongs.
 * @returns The server response as JSON.
 */
export async function apiPOSTDocument(
  webService: string,
  file: File,
  documentType: string,
  applicationId: number
) {
  const formData = new FormData();
  formData.append("file", file); // the file upload field
  formData.append("document_type", documentType);
  formData.append("application_id", String(applicationId));

  try {
    const response = await axios.post(webService, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error uploading document:", error);
    throw error;
  }
}
