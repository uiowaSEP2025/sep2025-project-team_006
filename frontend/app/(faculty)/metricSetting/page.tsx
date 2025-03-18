"use client";

import { useEffect, useState } from "react";
import ProfileList from "@/components/ProfileList";
import WebService from "@/api/WebService";
import { apiGET } from "@/api/apiMethods";
import { useRouter } from "next/navigation";

interface Metric {
    id: number;
    name: string;
    description: string;
    weight: number;
}

export default function Home() {
 const router = useRouter();
 const webService = new WebService();
 const [metrics, setMetrics] = useState<Metric[]>([]);

 useEffect(()=> {
    const fetchMetrics = async () => {
        try{
            const response = await apiGET(webService.FACULTY_METRIC_GET)
            if (response.success) {
                const fetchedMetrics: Metric[] = response.payload.map(
                    (metric: any) => ({
                        id: metric.id,
                        name: metric.name,
                        description: metric.description,
                        weight: metric.weight,
                    })
                );
                setMetrics(fetchedMetrics);
            } else{
                console.log("GET error: ", response.error);
            }
        } catch (error){
            console.log("An unexpected error occured: ", error)
        }
    }
    fetchMetrics()
 }, [webService.FACULTY_METRIC_GET]);
}