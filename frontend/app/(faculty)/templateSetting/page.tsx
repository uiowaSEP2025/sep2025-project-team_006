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

  /**
   * Handles Adding a new template
   */
  const handleAddTemplate = () => {
    const newTemplate: Template = {
      template_id: Date.now().toString(),
      department: "",
      name: "",
      is_default: false,
      metrics: [],
      isNew: true,
    };
    setTemplates((prev) => {
      // Insert new template at the end and update index to point to it
      const updated = [...prev, newTemplate];
      setCurrentTemplateIndex(updated.length - 1);
      return updated;
    });
  };

  /**
   * Handles saving/updating a template through API calls.
   */
  const handleSaveTemplate = async (template: Template) => {
    const data = JSON.stringify({
      department: template.department,
      name: template.name,
      is_default: template.is_default,
      metrics: template.metrics.map((m) => ({
        metric_name: m.metric_name,
        description: m.description,
        // the backend expects "metric_weight" as a string, might change to a float later
        metric_weight: m.metric_weight,
      })),
    });
    try {
      if (template.isNew) {
        console.log("Creating template:", data);
        const response = await apiPOST(webService.TEMPLATE, data);
        if (!response.success) {
          console.error("Error saving template:", response.error);
        }
      } else {
        console.log("Updating template:", template.template_id, template);
        const response = await apiPUT(
          webService.TEMPLATE_BY_ID,
          template.template_id,
          data,
        );
        if (!response.success) {
          console.error("Error saving template:", response.error);
        }
      }
    } catch (error) {
      console.error("Unexpected error saving template:", error);
    }
  };

  /**
   * Handles deleting a template.
   * After deletion, adjusts currentTemplateIndex so that it remains valid.
   */
  const handleDeleteTemplate = async (templateId: string) => {
    try {
      const response = await apiDELETE(webService.TEMPLATE_BY_ID, templateId);
      if (response.success) {
        setTemplates((prev) => {
          const updatedTemplates = prev.filter(
            (t) => t.template_id !== templateId,
          );
          if (updatedTemplates.length === 0) {
            setCurrentTemplateIndex(0);
          } else if (currentTemplateIndex >= updatedTemplates.length) {
            setCurrentTemplateIndex(updatedTemplates.length - 1);
          }
          return updatedTemplates;
        });
        console.log("Template deleted successfully:", templateId);
      } else {
        console.error("Error deleting template:", response.error);
      }
    } catch (error) {
      console.error("Unexpected error deleting template:", error);
    }
  };

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
          : t,
      ),
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
                (m) => m.template_metric_id !== metricId,
              ),
            }
          : t,
      ),
    );
  };

  if (!templates.length) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading templates...</p>
      </div>
    );
  }

  // Safely retrieve the current template
  const currentTemplate = templates[currentTemplateIndex] || templates[0];

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header & Admin Toggle */}
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-2xl font-bold">Template Settings</h1>
          <div className="flex items-center justify-between gap-4">
            {isAdmin && (
              <Button onClick={handleAddTemplate}>Add New Template</Button>
            )}
            <Link href="/facultyHome">
              <Button>Return to Home</Button>
            </Link>
            {/* TODO: Remove once admin role is implemented */}
            <Button onClick={toggleAdmin}>
              Toggle Admin ({isAdmin ? "ON" : "OFF"})
            </Button>
          </div>
        </div>

        {/* Template toggle buttons */}
        <div className="flex justify-center space-x-2 mb-6">
          {templates.map((_, index) => (
            <Button
              key={index}
              onClick={() => setCurrentTemplateIndex(index)}
              variant={index === currentTemplateIndex ? "default" : "outline"}
            >
              {index + 1}
            </Button>
          ))}
        </div>

        {/* Display current template */}
        <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-6 border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Department */}
            <div>
              <label className="block font-medium mb-1">Department:</label>
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
                        : t,
                    ),
                  );
                }}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>
            {/* Name */}
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
                        : t,
                    ),
                  );
                }}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>
          </div>
          {/* Default Checkbox */}
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
                      : t,
                  ),
                );
              }}
              className="mr-2"
            />
            <label
              htmlFor={`default-${currentTemplate.template_id}`}
              className="font-medium"
            >
              Default Template
            </label>
          </div>

          {/* Metrics List */}
          <div className="mb-4">
            <h2 className="font-bold text-lg mb-2">Metrics</h2>
            {currentTemplate.metrics && currentTemplate.metrics.length > 0 ? (
              currentTemplate.metrics.map((metric, idx) => (
                <div key={metric.template_metric_id}>
                  {idx > 0 && <hr className="my-3" />}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                    <div>
                      <label className="block font-medium mb-1">Name:</label>
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
                                        : m,
                                    ),
                                  }
                                : t,
                            ),
                          );
                        }}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      />
                    </div>
                    <div>
                      <label className="block font-medium mb-1">Weight:</label>
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
                                        : m,
                                    ),
                                  }
                                : t,
                            ),
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
                                      : m,
                                  ),
                                }
                              : t,
                          ),
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
                            metric.template_metric_id,
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
                onClick={() =>
                  handleDeleteTemplate(currentTemplate.template_id)
                }
              >
                Delete Template
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
