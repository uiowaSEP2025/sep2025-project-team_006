import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ReviewForm from '@/components/ReviewForm';
import { MetricResponse } from '@/types/MetricData';

const mockMetrics = [
  {
    review_metric_id: 101,
    name: 'Innovation',
    selected_weight: 0.2,
    value: 8,
  },
  {
    review_metric_id: 102,
    name: 'Teamwork',
    selected_weight: 0.3,
    value: 9,
  },
] as MetricResponse[] ;

describe('ReviewForm', () => {
  const onChangeMetric = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all metrics with correct input fields', () => {
    render(
      <ReviewForm
        metrics={mockMetrics}
        onChangeMetric={onChangeMetric}
      />
    );

    // Verify title
    expect(screen.getByText('Metrics')).toBeInTheDocument();

    // There should be one "Metric Name", one "Selected Weight", and one "Value" input per metric.
    const nameInputs = screen.getAllByPlaceholderText('Metric Name');
    const weightInputs = screen.getAllByPlaceholderText('Selected Weight');
    const valueInputs = screen.getAllByPlaceholderText('Value');

    expect(nameInputs).toHaveLength(2);
    expect(weightInputs).toHaveLength(2);
    expect(valueInputs).toHaveLength(2);

    // Check that the Metric Name inputs are disabled
    nameInputs.forEach((input) => {
      expect(input).toBeDisabled();
    });
  });

  it('calls onChangeMetric when Selected Weight and Value fields are updated', () => {
    render(
      <ReviewForm
        metrics={mockMetrics}
        onChangeMetric={onChangeMetric}
      />
    );

    // Select the first metric's weight and value inputs.
    const weightInput = screen.getAllByPlaceholderText('Selected Weight')[0];
    const valueInput = screen.getAllByPlaceholderText('Value')[0];

    // Change weight input.
    fireEvent.change(weightInput, { target: { value: '0.5' } });
    expect(onChangeMetric).toHaveBeenCalledTimes(1);
    // The callback should be passed an updated metric array for the first metric
    expect(onChangeMetric.mock.calls[0][0]).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          review_metric_id: 101,
          selected_weight: 0.5, // parsed float
        }),
      ])
    );

    // Change value input.
    fireEvent.change(valueInput, { target: { value: '10' } });
    expect(onChangeMetric).toHaveBeenCalledTimes(2);
    expect(onChangeMetric.mock.calls[1][0]).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          review_metric_id: 101,
          value: 10, // parsed float value from parseFloat
        }),
      ])
    );
  });

  it('syncs with updated props via useEffect', () => {
    const { rerender } = render(
      <ReviewForm
        metrics={mockMetrics}
        onChangeMetric={onChangeMetric}
      />
    );

    // New metrics prop to simulate an update.
    const newMetrics = [
      {
        review_metric_id: 103,
        name: 'Leadership',
        selected_weight: 0.4,
        value: 7,
      },
    ] as MetricResponse[];

    rerender(
      <ReviewForm
        metrics={newMetrics}
        onChangeMetric={onChangeMetric}
      />
    );

    expect(screen.getByDisplayValue('Leadership')).toBeInTheDocument();
  });
});
