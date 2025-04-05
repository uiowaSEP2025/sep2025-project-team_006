import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ReviewForm from '@/components/ReviewForm'; // adjust the import path as needed

const mockMetrics = [
  {
    review_metric_id: 101,
    name: 'Innovation',
    description: 'Original thinking',
    selected_weight: 0.2,
    value: 8,
  },
  {
    review_metric_id: 102,
    name: 'Teamwork',
    description: 'Collaboration skills',
    selected_weight: 0.3,
    value: 9,
  },
];

describe('ReviewForm', () => {
  const onChangeMetric = jest.fn();
  const onDeleteMetric = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all metrics with input fields', () => {
    render(
      <ReviewForm
        metrics={mockMetrics}
        onChangeMetric={onChangeMetric}
        onDeleteMetric={onDeleteMetric}
      />
    );

    expect(screen.getByText('Metrics')).toBeInTheDocument();
    expect(screen.getAllByPlaceholderText('Metric Name')).toHaveLength(2);
    expect(screen.getAllByPlaceholderText('weight')).toHaveLength(2);
    expect(screen.getAllByPlaceholderText('Score')).toHaveLength(2);
  });

  it('allows typing in the name, weight, and score fields', () => {
    render(
      <ReviewForm
        metrics={mockMetrics}
        onChangeMetric={onChangeMetric}
        onDeleteMetric={onDeleteMetric}
      />
    );

    const nameInput = screen.getAllByPlaceholderText('Metric Name')[0];
    const weightInput = screen.getAllByPlaceholderText('weight')[0];
    const scoreInput = screen.getAllByPlaceholderText('Score')[0];

    fireEvent.change(nameInput, { target: { value: 'Creativity' } });
    fireEvent.change(weightInput, { target: { value: '0.5' } });
    fireEvent.change(scoreInput, { target: { value: '10' } });

    // No expectations needed here; changes only affect local state
    // This verifies no crash and inputs are editable
    expect(nameInput).toHaveValue('Creativity');
    expect(weightInput).toHaveValue(0.5);
    expect(scoreInput).toHaveValue(10);
  });

  it('calls onChangeMetric when Save is clicked', () => {
    render(
      <ReviewForm
        metrics={mockMetrics}
        onChangeMetric={onChangeMetric}
        onDeleteMetric={onDeleteMetric}
      />
    );

    const saveButtons = screen.getAllByRole('button', { name: /Save/i });
    fireEvent.click(saveButtons[0]);

    expect(onChangeMetric).toHaveBeenCalledWith(expect.objectContaining({
      review_metric_id: 101,
      name: 'Innovation',
      selected_weight: 0.2,
      value: 8,
    }));
  });

  it('calls onDeleteMetric when Delete is clicked', () => {
    render(
      <ReviewForm
        metrics={mockMetrics}
        onChangeMetric={onChangeMetric}
        onDeleteMetric={onDeleteMetric}
      />
    );

    const deleteButtons = screen.getAllByRole('button', { name: /Delete/i });
    fireEvent.click(deleteButtons[1]);

    expect(onDeleteMetric).toHaveBeenCalledWith(102);
  });

  it('syncs with updated props via useEffect', () => {
    const { rerender } = render(
      <ReviewForm
        metrics={mockMetrics}
        onChangeMetric={onChangeMetric}
        onDeleteMetric={onDeleteMetric}
      />
    );

    const newMetrics = [
      {
        review_metric_id: 103,
        name: 'Leadership',
        description: 'Takes initiative',
        selected_weight: 0.4,
        value: 7,
      },
    ];

    rerender(
      <ReviewForm
        metrics={newMetrics}
        onChangeMetric={onChangeMetric}
        onDeleteMetric={onDeleteMetric}
      />
    );

    expect(screen.getByDisplayValue('Leadership')).toBeInTheDocument();
  });
});
