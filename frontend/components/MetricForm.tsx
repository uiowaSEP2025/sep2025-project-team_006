import React, {useState} from "react";

interface Metric {
    id: number;
    name: string;
    description: string;
    weight: number;
  }


interface MetricFormProps {
    metrics: Metric[];
    onChange: (id: number, field: keyof Metric, value: string | number) => void;
    onSave: (updatedMetric: Metric) => void;
    onDelete: (id: number) => void;
    onAdd: ()=> void;
}
const MetricForm: React.FC = (MetricFormProps) = ({metrics, onChange, onSave,onDelete,onAdd}) => {

};


export default MetricForm;