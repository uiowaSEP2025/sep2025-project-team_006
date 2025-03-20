import React, {useState} from "react";

interface Metric {
    id: number;
    name: string;
    description: string;
    weight: number;
    isDefault: boolean;
    isNew: boolean;
  }


interface MetricFormProps {
    metrics: Metric[];
    onChangeMetric: (id: number, field: keyof Metric, value: string | number) => void;
    onSaveMetric: (updatedMetric: Metric) => void;
    onDeleteMetric: (id: number, isNew: boolean) => void;
    onAddMetric: ()=> void;
}
const MetricForm: React.FC<MetricFormProps> = ({metrics, onChangeMetric, onSaveMetric,onDeleteMetric,onAddMetric}) => {
    return(
        <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-2xl p-6 border border-gray-200">
            <h2 className="text-2x1 font-bold text-black mb-4">Metrics</h2>

            {metrics.map((metric, index)=> (
                <div key={index} className="bg-gray-100 p-4 rounded-lg shadow-md mb-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <input
                    type="text"
                    placeholder="Metric Name"
                    value={metric.name}
                    disabled={metric.isDefault}
                    onChange={(e) => onChangeMetric(metric.id, "name", e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    />
                    <input
                    type="text"
                    placeholder="Metric Description"
                    value={metric.description}
                    disabled={metric.isDefault}
                    onChange={(e) => onChangeMetric(metric.id,"description",e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    />
                    <input
                    type="number"
                    placeholder="weight"
                    value={metric.weight}
                    disabled={metric.isDefault}
                    onChange={(e)=> onChangeMetric(metric.id, "weight",parseFloat(e.target.value))}
                    step="0.01"
                     className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    />
                    </div>

                    {!metric.isDefault && (
                    <div>
                        <button
                        onClick={() => onSaveMetric(metric)}
                        className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
                        >
                            Save
                        </button>
                    
                        <button
                        onClick={() => onDeleteMetric(metric.id, metric.isNew)}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                        >
                            Delete
                        </button>
                        
                    </div>
                    )}
                </div>
                ))}

                <button
                  onClick={onAddMetric}
                  className="w-full bg-yellow-500 text-black font-bold py-2 rounded-lg mt-4 hover:bg-yellow-400 transition"
                >
                  + Add Metric
                </button>
        </div>
    );
};


export default MetricForm;