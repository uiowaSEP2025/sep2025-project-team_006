"use client";

import { useEffect, useState } from "react";
import ProfileList from "@/components/ProfileList";
import WebService from "@/api/WebService";
import { apiGET } from "@/api/apiMethods";
import { useRouter } from "next/navigation";
import MetricForm from "@/components/MetricForm";

interface Metric {
    id: number;
    name: string;
    description: string;
    weight: number;
    isNew: boolean;
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
                        id: metric.metric_id,
                        name: metric.metric_name,
                        description: metric.description,
                        weight: metric.default_weight,
                        isNew: false,
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

return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-4">Metric Settings</h1>
      <MetricForm metrics={metrics} 
            onChangeMetric={function (id: number, field: keyof Metric, value: string | number): void {
            throw new Error("Function not implemented.");
        } } onSaveMetric={function (updatedMetric: Metric): void {
            throw new Error("Function not implemented.");
        } } onDeleteMetric={function (id: number): void {
            throw new Error("Function not implemented.");
        } } onAddMetric={function (): void {
            throw new Error("Function not implemented.");
        } } />
      </div>
);

}