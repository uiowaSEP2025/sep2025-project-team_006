"use client";

import { useEffect, useState } from "react";
import WebService from "@/api/WebService";
import { apiGET, apiPOST, apiPUT, apiDELETE } from "@/api/apiMethods";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface TemplateMetric {
    template_metric_id: string;
    metric_name: string;
    description: string;
    metric_weight: string;
    isNew?: boolean; // flag for newly added metrics
}

interface Template {
    template_id: string;
    department: string;
    name: string;
    is_default: boolean;
    metrics: TemplateMetric[];
    isNew?: boolean; // flag for newly added templates
}

export default function TemplateSettings() {
    const webService = new WebService();
    const [templates, setTemplates] = useState<Template[]>([]);
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    // currentTemplateIndex controls which template is being shown
    const [currentTemplateIndex, setCurrentTemplateIndex] = useState<number>(0);

    useEffect(() => {
        const fetchTemplates = async () => {
            try {
                const response = await apiGET(webService.TEMPLATE);
                if (response.success) {
                    setTemplates(response.payload);
                } else {
                    console.error("Error fetching templates:", response.error);
                }
            } catch (error) {
                console.error("Unexpected error fetching templates:", error);
            }
        };

        fetchTemplates();
    }, [webService.TEMPLATE]);

    const toggleAdmin = () => {
        setIsAdmin((prev) => !prev);
    };

    /* --------------------
     * Template CRUD Handlers
     * -------------------- */
    const handleAddTemplate = () => {
        const newTemplate: Template = {
            template_id: Date.now().toString(),
            department: "",
            name: "",
            is_default: false,
            metrics: [],
            isNew: true,
        };
        setTemplates((prev) => [...prev, newTemplate]);
        // set current template to the new one
        setCurrentTemplateIndex(templates.length);
    };

    const handleSaveTemplate = async (template: Template) => {
        if (template.isNew) {
            console.log("Creating template:", template);
            // TODO: call apiPOST with webService.TEMPLATE and JSON.stringify({ ... })
        } else {
            console.log("Updating template:", template.template_id, template);
            // TODO: call apiPUT with webService.TEMPLATE_BY_ID, template.template_id and JSON.stringify({ ... })
        }
    };

    const handleDeleteTemplate = async (templateId: string) => {
        console.log("Deleting template:", templateId);
        // TODO: call apiDELETE if needed
        setTemplates((prev) => prev.filter((t) => t.template_id !== templateId));
        // adjust current index if needed
        setCurrentTemplateIndex((prevIndex) =>
            prevIndex > 0 ? prevIndex - 1 : 0
        );
    };

    /* --------------------
     * Template Metric CRUD Handlers
     * -------------------- */
    const handleAddMetric = (templateId: string) => {
        const newMetric: TemplateMetric = {
            template_metric_id: Date.now().toString(),
            metric_name: "",
            description: "",
            metric_weight: "0.0",
            isNew: true,
        };
        setTemplates((prevTemplates) =>
            prevTemplates.map((t) =>
                t.template_id === templateId
                    ? { ...t, metrics: [...t.metrics, newMetric] }
                    : t
            )
        );
    };

    const handleDeleteMetric = (templateId: string, metricId: string) => {
        console.log("Deleting metric:", metricId, "from template:", templateId);
        setTemplates((prevTemplates) =>
            prevTemplates.map((t) =>
                t.template_id === templateId
                    ? {
                        ...t,
                        metrics: t.metrics.filter(
                            (m) => m.template_metric_id !== metricId
                        ),
                    }
                    : t
            )
        );
    };

    /* --------------------
     * Render UI
     * -------------------- */
    // Show loading indicator if not loaded
    if (!templates.length) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Loading templates...</p>
            </div>
        );
    }

    // Current template being viewed
    const currentTemplate = templates[currentTemplateIndex];

    return (
        <div className="min-h-screen bg-gray-100 py-10">
            <div className="max-w-4xl mx-auto px-4">
                {/* Header & Admin Toggle */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Template Settings</h1>
                    <Button onClick={toggleAdmin}>
                        Toggle Admin ({isAdmin ? "ON" : "OFF"})
                    </Button>
                </div>

                {/* Template toggle buttons (swipe/toggle through templates) */}
                <div className="flex justify-center space-x-2 mb-6">
                    {templates.map((_, index) => (
                        <Button
                            key={index}
                            onClick={() => setCurrentTemplateIndex(index)}
                            variant={
                                index === currentTemplateIndex ? "default" : "outline"
                            }
                        >
                            {index + 1}
                        </Button>
                    ))}
                </div>

                {/* Display the currently selected template */}
                <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-6 border border-gray-200">
                    {/* Two-column layout for basic template properties */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block font-medium mb-1">
                                Department:
                            </label>
                            <input
                                type="text"
                                disabled={!isAdmin}
                                value={currentTemplate.department}
                                onChange={(e) => {
                                    if (!isAdmin) return;
                                    const val = e.target.value;
                                    setTemplates((prev) =>
                                        prev.map((t) =>
                                            t.template_id === currentTemplate.template_id
                                                ? { ...t, department: val }
                                                : t
                                        )
                                    );
                                }}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            />
                        </div>
                        <div>
                            <label className="block font-medium mb-1">Name:</label>
                            <input
                                type="text"
                                disabled={!isAdmin}
                                value={currentTemplate.name}
                                onChange={(e) => {
                                    if (!isAdmin) return;
                                    const val = e.target.value;
                                    setTemplates((prev) =>
                                        prev.map((t) =>
                                            t.template_id === currentTemplate.template_id
                                                ? { ...t, name: val }
                                                : t
                                        )
                                    );
                                }}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            />
                        </div>
                    </div>
                    {/* Default Template Checkbox */}
                    <div className="flex items-center mb-6">
                        <input
                            id={`default-${currentTemplate.template_id}`}
                            type="checkbox"
                            disabled={!isAdmin}
                            checked={currentTemplate.is_default}
                            onChange={(e) => {
                                if (!isAdmin) return;
                                setTemplates((prev) =>
                                    prev.map((t) =>
                                        t.template_id === currentTemplate.template_id
                                            ? { ...t, is_default: e.target.checked }
                                            : t
                                    )
                                );
                            }}
                            className="mr-2"
                        />
                        <label htmlFor={`default-${currentTemplate.template_id}`} className="font-medium">
                            Default Template
                        </label>
                    </div>

                    {/* Metrics List */}
                    <div className="mb-4">
                        <h2 className="font-bold text-lg mb-2">Metrics</h2>
                        {currentTemplate.metrics && currentTemplate.metrics.length > 0 ? (
                            currentTemplate.metrics.map((metric, idx) => (
                                <div key={metric.template_metric_id}>
                                    {/* Divider except for the first */}
                                    {idx > 0 && <hr className="my-3" />}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                                        <div>
                                            <label className="block font-medium mb-1">
                                                Name:
                                            </label>
                                            <input
                                                type="text"
                                                disabled={!isAdmin}
                                                value={metric.metric_name}
                                                onChange={(e) => {
                                                    if (!isAdmin) return;
                                                    const val = e.target.value;
                                                    setTemplates((prev) =>
                                                        prev.map((t) =>
                                                            t.template_id === currentTemplate.template_id
                                                                ? {
                                                                    ...t,
                                                                    metrics: t.metrics.map((m) =>
                                                                        m.template_metric_id ===
                                                                            metric.template_metric_id
                                                                            ? { ...m, metric_name: val }
                                                                            : m
                                                                    ),
                                                                }
                                                                : t
                                                        )
                                                    );
                                                }}
                                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block font-medium mb-1">
                                                Weight:
                                            </label>
                                            <input
                                                type="text"
                                                disabled={!isAdmin}
                                                value={metric.metric_weight}
                                                onChange={(e) => {
                                                    if (!isAdmin) return;
                                                    const val = e.target.value;
                                                    setTemplates((prev) =>
                                                        prev.map((t) =>
                                                            t.template_id === currentTemplate.template_id
                                                                ? {
                                                                    ...t,
                                                                    metrics: t.metrics.map((m) =>
                                                                        m.template_metric_id ===
                                                                            metric.template_metric_id
                                                                            ? { ...m, metric_weight: val }
                                                                            : m
                                                                    ),
                                                                }
                                                                : t
                                                        )
                                                    );
                                                }}
                                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                            />
                                        </div>
                                    </div>
                                    <div className="mb-2">
                                        <label className="block font-medium mb-1">
                                            Description:
                                        </label>
                                        <textarea
                                            disabled={!isAdmin}
                                            value={metric.description}
                                            onChange={(e) => {
                                                if (!isAdmin) return;
                                                const val = e.target.value;
                                                setTemplates((prev) =>
                                                    prev.map((t) =>
                                                        t.template_id === currentTemplate.template_id
                                                            ? {
                                                                ...t,
                                                                metrics: t.metrics.map((m) =>
                                                                    m.template_metric_id ===
                                                                        metric.template_metric_id
                                                                        ? { ...m, description: val }
                                                                        : m
                                                                ),
                                                            }
                                                            : t
                                                    )
                                                );
                                            }}
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                            rows={2}
                                        />
                                    </div>
                                    {isAdmin && (
                                        <div className="flex justify-end mb-2">
                                            <Button
                                                variant="destructive"
                                                onClick={() =>
                                                    handleDeleteMetric(
                                                        currentTemplate.template_id,
                                                        metric.template_metric_id
                                                    )
                                                }
                                            >
                                                Delete Metric
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-gray-500 italic">
                                No metrics available.
                            </p>
                        )}
                        {isAdmin && (
                            <Button
                                className="mt-3"
                                onClick={() => handleAddMetric(currentTemplate.template_id)}
                            >
                                Add Metric
                            </Button>
                        )}
                    </div>

                    {/* Save and Delete Template Buttons */}
                    {isAdmin && (
                        <div className="flex space-x-2">
                            <Button onClick={() => handleSaveTemplate(currentTemplate)}>
                                Save Template
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={() => handleDeleteTemplate(currentTemplate.template_id)}
                            >
                                Delete Template
                            </Button>
                        </div>
                    )}
                </div>

                {/* Add New Template Button */}
                {isAdmin && (
                    <div className="flex justify-center mb-6">
                        <Button onClick={handleAddTemplate}>Add New Template</Button>
                    </div>
                )}

                <div className="flex justify-center mt-6">
                    <Link href="/facultyHome">
                        <Button>Return to Home</Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
