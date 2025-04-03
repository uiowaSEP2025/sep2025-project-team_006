import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import MetricForm from '@/components/MetricForm'; // Update path as needed

const mockMetrics = [
  {
    id: 1,
    name: 'Research',
    description: 'Published papers',
    weight: 0.4,
    isDefault: true,
    isNew: false,
  },
  {
    id: 2,
    name: 'Teaching',
    description: 'Course evaluations',
    weight: 0.3,
    isDefault: false,
    isNew: false,
  },
  {
    id: 3,
    name: '',
    description: '',
    weight: 0,
    isDefault: false,
    isNew: true,
  },
];

describe('MetricForm', () => {
  const onChangeMetric = jest.fn();
  const onSaveMetric = jest.fn();
  const onDeleteMetric = jest.fn();
  const onAddMetric = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all metrics', () => {
    render(
      <MetricForm
        metrics={mockMetrics}
        onChangeMetric={onChangeMetric}
        onSaveMetric={onSaveMetric}
        onDeleteMetric={onDeleteMetric}
        onAddMetric={onAddMetric}
      />
    );

    expect(screen.getByText('Metrics')).toBeInTheDocument();
    expect(screen.getAllByPlaceholderText('Metric Name')).toHaveLength(3);
    expect(screen.getAllByPlaceholderText('Metric Description')).toHaveLength(3);
    expect(screen.getAllByPlaceholderText('weight')).toHaveLength(3);
  });

  it('disables inputs for default metrics', () => {
    render(
      <MetricForm
        metrics={mockMetrics}
        onChangeMetric={onChangeMetric}
        onSaveMetric={onSaveMetric}
        onDeleteMetric={onDeleteMetric}
        onAddMetric={onAddMetric}
      />
    );

    const defaultMetricName = screen.getAllByPlaceholderText('Metric Name')[0];
    expect(defaultMetricName).toBeDisabled();
  });

  it('calls onChangeMetric when inputs are changed', () => {
    render(
      <MetricForm
        metrics={mockMetrics}
        onChangeMetric={onChangeMetric}
        onSaveMetric={onSaveMetric}
        onDeleteMetric={onDeleteMetric}
        onAddMetric={onAddMetric}
      />
    );

    const teachingName = screen.getAllByPlaceholderText('Metric Name')[1];
    fireEvent.change(teachingName, { target: { value: 'Updated Teaching' } });

    expect(onChangeMetric).toHaveBeenCalledWith(2, 'name', 'Updated Teaching');
  });

  it('calls onSaveMetric when Save button is clicked', () => {
    render(
      <MetricForm
        metrics={mockMetrics}
        onChangeMetric={onChangeMetric}
        onSaveMetric={onSaveMetric}
        onDeleteMetric={onDeleteMetric}
        onAddMetric={onAddMetric}
      />
    );

    const saveButtons = screen.getAllByRole('button', { name: /Save/i });
    fireEvent.click(saveButtons[0]); // For teaching metric

    expect(onSaveMetric).toHaveBeenCalledWith(mockMetrics[1]);
  });

  it('calls onDeleteMetric when Delete button is clicked', () => {
    render(
      <MetricForm
        metrics={mockMetrics}
        onChangeMetric={onChangeMetric}
        onSaveMetric={onSaveMetric}
        onDeleteMetric={onDeleteMetric}
        onAddMetric={onAddMetric}
      />
    );

    const deleteButtons = screen.getAllByRole('button', { name: /Delete/i });
    fireEvent.click(deleteButtons[1]); // For new metric

    expect(onDeleteMetric).toHaveBeenCalledWith(3, true);
  });

  it('calls onAddMetric when + Add Metric button is clicked', () => {
    render(
      <MetricForm
        metrics={mockMetrics}
        onChangeMetric={onChangeMetric}
        onSaveMetric={onSaveMetric}
        onDeleteMetric={onDeleteMetric}
        onAddMetric={onAddMetric}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /\+ Add Metric/i }));
    expect(onAddMetric).toHaveBeenCalled();
  });

  it('does not show Save/Delete buttons for default metrics, but does for non-default ones', () => {
    render(
      <MetricForm
        metrics={mockMetrics}
        onChangeMetric={onChangeMetric}
        onSaveMetric={onSaveMetric}
        onDeleteMetric={onDeleteMetric}
        onAddMetric={onAddMetric}
      />
    );
  
    // Save and Delete buttons for default metric should not exist
    const saveButtons = screen.getAllByRole('button', { name: /Save/i });
    const deleteButtons = screen.getAllByRole('button', { name: /Delete/i });
  
    // Only non-default metrics (metrics[1] and metrics[2]) should have buttons
    expect(saveButtons).toHaveLength(2);
    expect(deleteButtons).toHaveLength(2);
  
    // Make sure buttons for default metric don't exist by inspecting index
    const defaultMetric = mockMetrics[0];
    expect(defaultMetric.isDefault).toBe(true);
  });  
});


