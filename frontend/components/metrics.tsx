import React from "react";

interface Metric {
    id: number;
    label: string;
    description: string;
    weight: number;
  }


interface MetricInputProps {
    metric: Metric;
    onSave: (updatedMetric: Metric) => void;
}

