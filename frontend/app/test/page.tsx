"use client";

import { apiGET } from "@/api/apiMethods";
import WebService from "@/api/WebService";
import { useState, useEffect } from "react";

export default function TestPage() {

    const webService = new WebService();
    const [message, setMessage] = useState<string | null>(null);

    useEffect(() => {
        const fetchTestData = async () => {
            try {
                console.log("Test calling")
                const response = await apiGET(webService.TEST_GET)
                console.log(response[0])
                setMessage(response[0].message)
            } catch (error) {
                setMessage("Error fetching data")
            }
        }
        fetchTestData()
    }, []);

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
        </div>
    );
}
