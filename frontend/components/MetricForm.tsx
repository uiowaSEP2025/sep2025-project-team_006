import React, {useState} from "react";

interface Metric {
    id: number;
    name: string;
    description: string;
    weight: number;
  }


interface MetricFormProps {
    metric: Metric;
    onSave: (updatedMetric: Metric) => void;
}
const MetricForm: React.FC = () => {
    
}