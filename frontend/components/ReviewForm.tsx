import { MetricResponse } from "@/types/MetricData";
import React, { useEffect, useState } from "react";

interface ReviewFormProps {
  metrics: MetricResponse[];
  onChangeMetric: (updatedMetrics: MetricResponse[]) => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ metrics, onChangeMetric }) => {
  const [localMetrics, setLocalMetrics] = useState<MetricResponse[]>(metrics);

  // Update local state when the incoming metrics prop changes.
  useEffect(() => {
    setLocalMetrics(metrics);
  }, [metrics]);

  // Handler to update a metric field in local state and notify parent
  const handleFieldChange = (
    id: number,
    field: keyof MetricResponse,
    value: string | number,
  ) => {
    const updatedMetrics = localMetrics.map((m) =>
      m.review_metric_id === id ? { ...m, [field]: value } : m,
    );
    setLocalMetrics(updatedMetrics);
    onChangeMetric(updatedMetrics);
  };

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-2xl p-6 border border-gray-200">
      <h2 className="text-2xl font-bold text-black mb-4">Metrics</h2>
      {localMetrics.map((metric) => (
        <div
          key={metric.review_metric_id}
          className="bg-gray-100 p-4 rounded-lg shadow-md mb-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Metric Name"
              value={metric.name}
              disabled={true} // Name comes from template, not modifiable
              className="w-full px-4 py-2 border rounded-lg"
            />
            <input
              type="number"
              placeholder="Selected Weight"
              value={metric.selected_weight}
              onChange={(e) =>
                handleFieldChange(
                  metric.review_metric_id,
                  "selected_weight",
                  parseFloat(e.target.value),
                )
              }
              step="0.01"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
            <input
              type="number"
              placeholder="Value"
              value={metric.value}
              onChange={(e) =>
                handleFieldChange(
                  metric.review_metric_id,
                  "value",
                  parseFloat(e.target.value),
                )
              }
              step="0.01"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReviewForm;
