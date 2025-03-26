import React from "react";

interface Metric {
    id: number;
    name: string;
    description: string;
    weight: number;
    score: number;
  }


interface ReviewFormProps {
    metrics: Metric[];
    onChangeMetric: (id: number, field: keyof Metric, value: string | number) => void;
    onDeleteMetric: (id: number) => void;
}
const ReviewForm: React.FC<ReviewFormProps> = ({metrics, onChangeMetric,onDeleteMetric}) => {
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
                    disabled={true}
                    onChange={(e) => onChangeMetric(metric.id, "name", e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    />
                    <input
                    type="number"
                    placeholder="weight"
                    value={metric.weight}
                    disabled={false}
                    onChange={(e)=> onChangeMetric(metric.id, "weight",parseFloat(e.target.value))}
                    step="0.01"
                     className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    />
                    <input
                    type="number"
                    placeholder="Score"
                    value={metric.score}
                    disabled={false}
                    onChange={(e)=> onChangeMetric(metric.id, "score",parseInt(e.target.value))}
                     className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    />

                    </div>
                    <div>
                        <button
                        className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
                        >
                            Save
                        </button>
                    
                        <button
                        onClick={() => onDeleteMetric(metric.id)}
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