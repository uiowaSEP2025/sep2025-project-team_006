"use client";

import { useEffect, useState } from "react";
import ProfileList from "@/components/ProfileList";
import WebService from "@/api/WebService";
import { apiGET } from "@/api/apiMethods";
import { apiPOST } from "@/api/apiMethods";
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
            const response = await apiGET(webService.FACULTY_METRIC_DEFAULTS)
            if (response.success) {
                const fetchedMetrics: Metric[] = response.payload.map(
                    (metric: any) => ({
                        //id: metric.metric_id,
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
 }, [webService.FACULTY_METRIC_DEFAULTS]);

const handleOnAddMetric = () => {
    const newMetric: Metric = {
        id: Date.now(),
        name: "",
        description: "",
        weight: 0,
        isNew: true,
    };
    setMetrics((prevMetrics)=>[...prevMetrics, newMetric]);
}

const handleOnDeleteMetric = (id: number)=> {
    setMetrics ((prevMetrics) => prevMetrics.filter((metric)=> metric.id != id));
}

const handleOnChangeMetric = (id: number, field: keyof Metric, value: string | number) => {
    setMetrics((prevMetrics) => prevMetrics.map((metric)=>
        metric.id == id ? { ...metric, [field]: value } : metric)
    );
}

const handleOnSaveMetric = async (updatedMetric: Metric) => {
    const data = JSON.stringify({
        metric_name: updatedMetric.name,
        description: updatedMetric.description,
        default_weight: updatedMetric.weight,
        faculty_id: 1,
    })
    
    try{
        const response = await apiPOST(webService.FACULTY_METRIC_POST, data);

        if (!response.success) {
            throw new Error("Failed to save metric");
        }
        const savedMetric = response.payload;

        setMetrics((prevMetrics) => 
            prevMetrics.map((metric) =>
                metric.id === updatedMetric.id
                    ? { ...savedMetric, isNew: false }
                    : metric
        )
    );
        console.log("Metric saved successfully:", savedMetric);
    } catch(error){
        console.error("Error saving metric:", error);
    }

    
};

return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-4">Metric Settings</h1>
      <MetricForm metrics={metrics}
            onAddMetric={handleOnAddMetric}
            onDeleteMetric={handleOnDeleteMetric}
            onChangeMetric={handleOnChangeMetric}
            onSaveMetric={handleOnSaveMetric}
        />
      </div>
);

}