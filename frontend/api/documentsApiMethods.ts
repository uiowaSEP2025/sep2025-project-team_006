import axios from "axios";
import WebService from "./WebService";

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

// Can be used to open file in new window, if needed.
// window.open(fileURL, "_blank"); 