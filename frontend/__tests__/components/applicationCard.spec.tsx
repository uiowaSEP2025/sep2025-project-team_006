// __tests__/components/applicationCard.spec.tsx

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ApplicationCard from '@/components/ApplicationCard';

describe('ApplicationCard — extra coverage', () => {
  const department = 'ECE';
  const degreeProgram = 'MS';
  const submittedAt = '2025-05-01T12:00:00.000Z';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('disables both selects when isSubmitted is true', () => {
    render(
      <ApplicationCard
        isSubmitted={true}
        applicationId={123}
        department={department}
        degreeProgram={degreeProgram}
        onUpload={jest.fn()}
      />
    );

    // Radix SelectTrigger exposes role="combobox"
    const combos = screen.getAllByRole('combobox');
    expect(combos).toHaveLength(2);
    combos.forEach(c => expect(c).toBeDisabled());
  });

  it('clicking "Upload Document" triggers the hidden file input click', () => {
    const onUpload = jest.fn();
    const { container } = render(
      <ApplicationCard
        isSubmitted={true}
        applicationId={456}
        department={department}
        degreeProgram={degreeProgram}
        submittedAt={submittedAt}
        onUpload={onUpload}
      />
    );

    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
    expect(fileInput).toBeInTheDocument();

    const clickSpy = jest.spyOn(fileInput, 'click');
    fireEvent.click(screen.getByRole('button', { name: /Upload Document/i }));
    expect(clickSpy).toHaveBeenCalled();
  });

  it('calls onUpload with (file, applicationId) when a file is chosen', () => {
    const onUpload = jest.fn();
    const { container } = render(
      <ApplicationCard
        isSubmitted={true}
        applicationId={789}
        department={department}
        degreeProgram={degreeProgram}
        submittedAt={submittedAt}
        onUpload={onUpload}
      />
    );

    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(['dummy'], 'doc.pdf', { type: 'application/pdf' });
    fireEvent.change(fileInput, { target: { files: [file] } });

    expect(onUpload).toHaveBeenCalledWith(file, 789);
  });

  it('alerts if you try to upload but no onUpload handler is provided', () => {
    jest.spyOn(window, 'alert').mockImplementation(() => {});
    const { container } = render(
      <ApplicationCard
        isSubmitted={true}
        applicationId={101}
        department={department}
        degreeProgram={degreeProgram}
        submittedAt={submittedAt}
        // omit onUpload to hit the alert path
      />
    );

    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
    expect(fileInput).toBeInTheDocument();

    const testFile = new File(['x'], 'foo.pdf', { type: 'application/pdf' });
    fireEvent.change(fileInput, { target: { files: [testFile] } });

    expect(window.alert).toHaveBeenCalledWith(
      'Upload failed: Application must be submitted first.'
    );
  });
});
