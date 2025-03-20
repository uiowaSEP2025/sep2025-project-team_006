"use client";

import { useEffect, useState } from "react";
import ProfileList from "@/components/ProfileList";
import WebService from "@/api/WebService";
import { apiGET, apiPOST, apiDELETE } from "@/api/apiMethods";
import { useRouter } from "next/navigation";
import MetricForm from "@/components/MetricForm";

interface Metric {
    id: number;
    name: string;
    description: string;
    weight: number;
    isDefault: boolean;
    isNew: boolean;
}

export default function Home() {
 const router = useRouter();
 const webService = new WebService();
 const [metrics, setMetrics] = useState<Metric[]>([]);

 useEffect(()=> {
    const fetchMetrics = async () => {
        try{
            const [defaults, response] = await Promise.all([
                apiGET(webService.FACULTY_METRIC_DEFAULTS),
                apiGET(webService.FACULTY_METRIC_ID, "1")

            ]);

            let metrics: Metric[] = [];

            if(defaults.success) {
                metrics = [
                    ...metrics,
                    ...defaults.payload.map((metric: any) => ({
                        //id: metric.faculty_metric_id,
                        name: metric.metric_name,
                        description: metric.description,
                        weight: metric.default_weight,
                        isDefault: true,
                    }))
                ];
            } else {
                console.log("GET error for defaults: ", defaults.error);
            }

            if (response.success) {
                metrics = [
                    ...metrics,
                    ...response.payload.map((metric: any) => ({
                        id: metric.faculty_metric_id,
                        name: metric.metric_name,
                        description: metric.description,
                        weight: metric.default_weight,
                        isDefault: false,
                    }))
                ];
            } else {
                console.log("Get error for FacultyID Metrics: ", response.error);
            }
                setMetrics(metrics);
        } catch (error){
            console.log("An unexpected error occured: ", error)
        }
    }
    fetchMetrics()
 }, [webService.FACULTY_METRIC_DEFAULTS, webService.FACULTY_METRIC_ID]);

const handleOnAddMetric = () => {
    const newMetric: Metric = {
        id: Date.now(),
        name: "",
        description: "",
        weight: 0,
        isDefault: false,
        isNew: true
    };
    setMetrics((prevMetrics)=>[...prevMetrics, newMetric]);
}

const handleOnDeleteMetric = async (id: number, isNew: boolean)=> {
    if (isNew){
    setMetrics ((prevMetrics) => prevMetrics.filter((metric)=> metric.id != id));
    return;
    }

    try{
        const response = await apiDELETE(webService.FACULTY_METRIC_ID,id.toString());

        if (!response.success){
            throw new Error('Failed to delete metric');
        }
        setMetrics((prevMetrics) => prevMetrics.filter((metric) => metric.id !== id));

        console.log('Metric deleted successfully');
    } catch(error) {
        console.error("Error deleting metric:", error);
    }
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
                    ? { id: savedMetric.faculty_metric_id,
                        name: savedMetric.metric_name,
                        description: savedMetric.description,
                        weight: savedMetric.default_weight,
                        isDefault: false,
                        isNew: false }
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