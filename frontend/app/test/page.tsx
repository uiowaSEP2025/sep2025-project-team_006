"use client";

import { apiGET, apiPUT, apiPOST } from "@/api/apiMethods";
import WebService from "@/api/WebService";
import { useState, useEffect } from "react";

/**
 * Job: used for a test between the frontend and the backend and the API calls we have; GET, PUT, POST
 *
 * Note: This doesn't use proper styling and the UI should not be modeled from this, use tailwind or material UI components
 */
export default function TestPage() {
  const webService = new WebService();
  const [message, setMessage] = useState<string | null>(null);
  const [postMessage, setPostMessage] = useState<string>("");
  const [putId, setPutId] = useState<string>("");
  const [putMessage, setPutMessage] = useState<string>("");

  useEffect(() => {
    const fetchTestData = async () => {
      try {
        const response = await apiGET(webService.TEST_GET);
        console.log("GET Response: ", response);
        setMessage(response[0].message);
      } catch (error) {
        setMessage(`Error fetching data; ${error}`);
      }
    };
    fetchTestData();
  }, [webService.TEST_GET]);

  const handlePutRequest = async () => {
    if (!putId || !putMessage) {
      setMessage("Please enter both ID and message for PUT request.");
      return;
    }
    try {
      const data = JSON.stringify({ message: putMessage });
      // note: the putId may not always be a string in actual code, but the input needs to be
      const response = await apiPUT(webService.TEST_PUT, `${putId}`, data);
      console.log("PUT Response: ", response);
      setMessage(`PUT Successful: ${response.updatedEntry.message}`);
    } catch (error) {
      setMessage(`Error sending PUT request; ${error}`);
    }
  };

  const handlePostRequest = async () => {
    try {
      const data = JSON.stringify({ message: postMessage });
      const response = await apiPOST(webService.TEST_POST, data);
      console.log("POST Response: ", response);
      setMessage(`POST Successful: ${response.newEntry.message}`);
    } catch (error) {
      setMessage(`Error sending POST request; ${error}`);
    }
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1>Test API Page</h1>
      <p>Fetching data from the backend...</p>
      <pre
        style={{
          background: "#f4f4f4",
          color: "#000000",
          padding: "10px",
          borderRadius: "5px",
          textAlign: "left",
          whiteSpace: "pre-wrap",
        }}
      >
        {message || "Loading..."}
      </pre>

      <div style={{ marginTop: "20px" }}>
        <h2>PUT Request</h2>
        <input
          type="text"
          color="#000000"
          placeholder="Enter ID"
          value={putId}
          onChange={(e) => setPutId(e.target.value)}
          style={{
            padding: "8px",
            marginRight: "10px",
            color: "#000000",
            backgroundColor: "#ffffff",
            border: "1px solid #ccc",
            borderRadius: "5px",
          }}
        />

        <input
          type="text"
          placeholder="Enter new message"
          value={putMessage}
          onChange={(e) => setPutMessage(e.target.value)}
          style={{
            padding: "8px",
            marginRight: "10px",
            color: "#000000",
            backgroundColor: "#ffffff",
            border: "1px solid #ccc",
            borderRadius: "5px",
          }}
        />
        <button
          onClick={handlePutRequest}
          style={{ padding: "8px 12px", cursor: "pointer" }}
        >
          Send PUT
        </button>
      </div>

      <div style={{ marginTop: "20px" }}>
        <h2>POST Request</h2>
        <input
          type="text"
          placeholder="Enter message"
          value={postMessage}
          onChange={(e) => setPostMessage(e.target.value)}
          style={{
            padding: "8px",
            marginRight: "10px",
            color: "#000000",
            backgroundColor: "#ffffff",
            border: "1px solid #ccc",
            borderRadius: "5px",
          }}
        />
        <button
          onClick={handlePostRequest}
          style={{ padding: "8px 12px", cursor: "pointer" }}
        >
          Send POST
        </button>
      </div>
    </div>
  );
}
