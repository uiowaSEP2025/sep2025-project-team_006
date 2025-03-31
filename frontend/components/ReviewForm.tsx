import React, { useEffect, useState } from "react";

interface MetricResponse {
    review_metric_id: number;
    name: string;
    description: string;
    selected_weight: number;
    value: number;
}

interface ReviewFormProps {
    metrics: MetricResponse[];
    onChangeMetric: (updatedMetric: MetricResponse) => void;
    onDeleteMetric: (id: number) => void;
}


const ReviewForm: React.FC<ReviewFormProps> = ({ metrics, onChangeMetric, onDeleteMetric }) => {
    const [localMetrics, setLocalMetrics] = useState<MetricResponse[]>(metrics);

    // Update local state when the metrics prop changes
    useEffect(() => {
        setLocalMetrics(metrics);
    }, [metrics]);

    // Handler to update local state for a given metric field
    const handleFieldChange = (
        id: number,
        field: keyof MetricResponse,
        value: string | number
    ) => {
        setLocalMetrics((prev) =>
            prev.map((m) =>
                m.review_metric_id === id ? { ...m, [field]: value } : m
            )
        );
    };


    const handleSave = (id: number) => {
        const updatedMetric = localMetrics.find(
            (m) => m.review_metric_id === id
        );
        if (updatedMetric) {
            onChangeMetric(updatedMetric);
        }
    };


    return (
        <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-2xl p-6 border border-gray-200">
            <h2 className="text-2x1 font-bold text-black mb-4">Metrics</h2>

            {localMetrics.map((metric, index) => (
                <div key={index} className="bg-gray-100 p-4 rounded-lg shadow-md mb-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <input
                            type="text"
                            placeholder="Metric Name"
                            value={metric.name}
                            disabled={false}
                            onChange={(e) => handleFieldChange(metric.review_metric_id, "name", e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        />
                        <input
                            type="number"
                            placeholder="weight"
                            value={metric.selected_weight}
                            disabled={false}
                            onChange={(e) => handleFieldChange(metric.review_metric_id, "selected_weight", parseFloat(e.target.value))}
                            step="0.01"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        />
                        <input
                            type="number"
                            placeholder="Score"
                            value={metric.value}
                            disabled={false}
                            onChange={(e) => handleFieldChange(metric.review_metric_id, "value", parseInt(e.target.value))}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        />

                    </div>
                    <div>
                        <button
                            onClick={() => handleSave(metric.review_metric_id)}
                            className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
                        >
                            Save
                        </button>

                        <button
                            onClick={() => onDeleteMetric(metric.review_metric_id)}
                            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                        >
                            Delete
                        </button>

                    </div>

                </div>
            ))}
        </div>
    );
};


export default ReviewForm;