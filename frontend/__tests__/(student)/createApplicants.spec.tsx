// __tests__/(student)/createApplicants.spec.tsx

import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import CreateApplication from '@/app/(student)/createApplicants/page';
import { apiGET, apiPOST } from '@/api/apiMethods';
import WebService from '@/api/WebService';

let capturedOnSubmit: (() => void) | null = null;
let capturedOnUpload: ((file: File, applicationId?: number) => void) | null = null;

jest.mock('@/components/ApplicationCard', () => {
  return (props: any) => {
    capturedOnSubmit = props.onSubmit;
    capturedOnUpload = props.onUpload;
    return <div data-testid="card" data-props={JSON.stringify(props)} />;
  };
});

jest.mock('@/api/apiMethods', () => ({
  apiGET: jest.fn(),
  apiPOST: jest.fn(),
}));

describe('CreateApplication page', () => {
  const GET_URL = new WebService().GET_STUDENT_APPLICATIONS;
  const CREATE_URL = new WebService().CREATE_APPLICATION;
  const DOC_URL = new WebService().APPLICATION_DOCUMENT_POST;

  beforeEach(() => {
    jest.clearAllMocks();
    (window as any).__USER__ = { id: '42' };
    jest.spyOn(window, 'alert').mockImplementation();
  });

  it('fetchApplications success & renders 2 cards', async () => {
    (apiGET as jest.Mock).mockResolvedValue({
      success: true,
      payload: [
        { application_id: 1, department: 'ECE', degree_program: 'PhD', submission_date: '' },
      ],
    });

    render(<CreateApplication />);
    await waitFor(() => expect(apiGET).toHaveBeenCalledWith(GET_URL, '42'));

    const cards = await screen.findAllByTestId('card');
    expect(cards).toHaveLength(2);

    const props = JSON.parse(cards[1].getAttribute('data-props')!);
    expect(props.successMessage).toBe('Application to ECE - PhD');
  });

  it('fetchApplications failure logs error & shows only create card', async () => {
    const errSpy = jest.spyOn(console, 'error').mockImplementation();
    (apiGET as jest.Mock).mockResolvedValue({ success: false, error: 'nope' });

    render(<CreateApplication />);
    await waitFor(() =>
      expect(errSpy).toHaveBeenCalledWith('GET_STUDENT_APPLICATIONS error:', 'nope')
    );

    expect(screen.getAllByTestId('card')).toHaveLength(1);
  });

  it('handleSubmit success path', async () => {
    (apiGET as jest.Mock)
      .mockResolvedValueOnce({ success: true, payload: [] })
      .mockResolvedValueOnce({
        success: true,
        payload: [
          { application_id: 99, department: 'ECE', degree_program: 'PhD', submission_date: '' },
        ],
      });
    (apiPOST as jest.Mock).mockResolvedValue({ success: true, payload: { application_id: 99 } });

    render(<CreateApplication />);
    expect(capturedOnSubmit).toBeDefined();
    capturedOnSubmit!();

    expect(apiPOST).toHaveBeenCalledWith(
      CREATE_URL,
      JSON.stringify({ department: '', degree_program: '', student_id: '42' })
    );

    await waitFor(() => expect(screen.getAllByTestId('card')).toHaveLength(2));
    const cards = screen.getAllByTestId('card');
    const successProps = JSON.parse(cards[0].getAttribute('data-props')!);
    expect(successProps.successMessage).toBe(
      'Application submitted successfully! You may now upload documents.'
    );
  });

  it('handleSubmit failure logs error only', async () => {
    (apiGET as jest.Mock).mockResolvedValue({ success: true, payload: [] });
    (apiPOST as jest.Mock).mockResolvedValue({ success: false, error: 'fail!' });
    const errSpy = jest.spyOn(console, 'error').mockImplementation();

    render(<CreateApplication />);
    expect(capturedOnSubmit).toBeDefined();
    capturedOnSubmit!();

    await waitFor(() =>
      expect(errSpy).toHaveBeenCalledWith('Error creating review:', 'fail!')
    );
    expect(screen.getAllByTestId('card')).toHaveLength(1);
  });

  describe('handleFileUpload paths', () => {
    beforeEach(() => {
      jest.spyOn(window, 'alert').mockImplementation();
      (global.fetch as any) = jest.fn();
    });

    it('uploads PDF successfully after submit', async () => {
      (apiGET as jest.Mock)
        .mockResolvedValueOnce({ success: true, payload: [] })
        .mockResolvedValueOnce({
          success: true,
          payload: [
            { application_id: 5, department: 'ECE', degree_program: 'PhD', submission_date: '' },
          ],
        });
      (apiPOST as jest.Mock).mockResolvedValue({ success: true, payload: { application_id: 5 } });
      (global.fetch as jest.Mock).mockResolvedValue({ ok: true, json: async () => ({}) });

      render(<CreateApplication />);
      expect(capturedOnSubmit).toBeDefined();
      capturedOnSubmit!();

      await waitFor(() => expect(screen.getAllByTestId('card')).toHaveLength(2));

      const file = new File([], 'doc.pdf', { type: 'application/pdf' });
      expect(capturedOnUpload).toBeDefined();
      capturedOnUpload!(file, 5);

      expect(global.fetch).toHaveBeenCalledWith(
        DOC_URL,
        expect.objectContaining({ body: expect.any(FormData), method: 'POST' })
      );
      await waitFor(() =>
        expect(window.alert).toHaveBeenCalledWith('Document uploaded successfully!')
      );
    });

    it('handles server error on upload', async () => {
      (apiGET as jest.Mock)
        .mockResolvedValueOnce({ success: true, payload: [] })
        .mockResolvedValueOnce({
          success: true,
          payload: [
            { application_id: 5, department: 'ECE', degree_program: 'PhD', submission_date: '' },
          ],
        });
      (apiPOST as jest.Mock).mockResolvedValue({ success: true, payload: { application_id: 5 } });
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        json: async () => ({ message: 'oops' }),
      });

      render(<CreateApplication />);
      expect(capturedOnSubmit).toBeDefined();
      capturedOnSubmit!();

      await waitFor(() => expect(screen.getAllByTestId('card')).toHaveLength(2));

      const file = new File([], 'doc.pdf', { type: 'application/pdf' });
      expect(capturedOnUpload).toBeDefined();
      capturedOnUpload!(file, 5);

      await waitFor(() =>
        expect(window.alert).toHaveBeenCalledWith('Upload failed: oops')
      );
    });

    it('handles network error on upload', async () => {
      (apiGET as jest.Mock)
        .mockResolvedValueOnce({ success: true, payload: [] })
        .mockResolvedValueOnce({
          success: true,
          payload: [
            { application_id: 7, department: 'ECE', degree_program: 'PhD', submission_date: '' },
          ],
        });
      (apiPOST as jest.Mock).mockResolvedValue({ success: true, payload: { application_id: 7 } });
      (global.fetch as jest.Mock).mockRejectedValue(new Error('network'));

      render(<CreateApplication />);
      expect(capturedOnSubmit).toBeDefined();
      capturedOnSubmit!();

      await waitFor(() => expect(screen.getAllByTestId('card')).toHaveLength(2));

      const file = new File([], 'doc.pdf', { type: 'application/pdf' });
      expect(capturedOnUpload).toBeDefined();
      capturedOnUpload!(file, 7);

      await waitFor(() =>
        expect(window.alert).toHaveBeenCalledWith('Unexpected error occurred during upload.')
      );
    });
  });

  it('renders Return to Home link', () => {
    render(<CreateApplication />);
    expect(
      screen.getByRole('link', { name: /Return to Home/i })
    ).toHaveAttribute('href', '/studentHome');
  });
});
