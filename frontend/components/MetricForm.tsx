import React, {useState} from "react";

interface Metric {
    id: number;
    name: string;
    description: string;
    weight: number;
  }


interface MetricFormProps {
    metrics: Metric[];
    onChangeMetric: (id: number, field: keyof Metric, value: string | number) => void;
    onSaveMetric: (updatedMetric: Metric) => void;
    onDeleteMetric: (id: number) => void;
    onAddMetric: ()=> void;
}
const MetricForm: React.FC<MetricFormProps> = ({metrics, onChangeMetric, onSaveMetric,onDeleteMetric,onAddMetric}) => {
    return(
        <div>
            {metrics.map((metric)=> (
                <div key={metric.id}>
                    <input
                    type="text"
                    placeholder="Metric Name"
                    value={metric.name}
                    onChange={(e) => onChangeMetric(metric.id, "name", e.target.value)}
                    />
                    <input
                    type="text"
                    placeholder="Metric Description"
                    value={metric.description}
                    onChange={(e) => onChangeMetric(metric.id,"description",e.target.value)}
                    />
                    <input
                    type="number"
                    placeholder="weight"
                    value={metric.weight}
                    onChange={(e)=> onChangeMetric(metric.id, "weight",parseFloat(e.target.value))}
                    step="0.02"
                    />
                </div>
                ))}
        
        </div>
    );
};


export default MetricForm;