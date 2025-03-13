import axios from "axios";

export async function fetchDocument(documentId: string) {
  try {
    const response = await axios.get(`http://localhost:5000/api/documents/${documentId}`, {
      responseType: "blob", // expect binary data
      withCredentials: true,
    });
    // Create an object URL for the Blob and open it in a new tab/window
    const fileURL = URL.createObjectURL(response.data);
    window.open(fileURL, "_blank");
    return fileURL;
  } catch (error) {
    console.error("Error fetching document:", error);
    throw error;
  }
}