// __tests__/(student)/createApplication.spec.tsx

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import CreateApplication from '@/app/(student)/createApplicants/page';
import { apiGET, apiPOST } from '@/api/apiMethods';
import WebService from '@/api/WebService';

// Stub ApplicationCard to inspect props and drive callbacks
jest.mock('@/components/ApplicationCard', () => {
  return (props: React.ComponentProps<typeof import('@/components/ApplicationCard').default>) => (
    <div data-testid="card" data-props={JSON.stringify(props)}>
      {props.isSubmitted ? 'SUBMITTED' : 'CREATE'}
      {props.successMessage && <p>{props.successMessage}</p>}
      <button data-testid="submit" onClick={props.onSubmit}>
        Submit
      </button>
      <button
        data-testid="upload"
        onClick={() =>
          props.onUpload?.(
            new File([], 'report.pdf', { type: 'application/pdf' }),
            props.applicationId
          )
        }
      >
        Upload
      </button>
    </div>
  );
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

  it('fetchApplications success & renders cards', async () => {
    (apiGET as jest.Mock).mockResolvedValue({
      success: true,
      payload: [
        { application_id: 1, department: 'ECE', degree_program: 'PhD', submission_date: '' },
      ],
    });

    render(<CreateApplication />);
    await waitFor(() =>
      expect(apiGET).toHaveBeenCalledWith(GET_URL, '42')
    );

    const cards = await screen.findAllByTestId('card');
    expect(cards).toHaveLength(2);
    const props = JSON.parse(cards[1].getAttribute('data-props')!);
    expect(props.successMessage).toBe('Application to ECE - PhD');
  });

  it('fetchApplications failure logs error & shows only create card', async () => {
    const err = jest.spyOn(console, 'error').mockImplementation();
    (apiGET as jest.Mock).mockResolvedValue({ success: false, error: 'nope' });

    render(<CreateApplication />);
    await waitFor(() =>
      expect(err).toHaveBeenCalledWith(
        'GET_STUDENT_APPLICATIONS error:',
        'nope'
      )
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
    fireEvent.click(await screen.findByTestId('submit'));

    expect(apiPOST).toHaveBeenCalledWith(
      CREATE_URL,
      JSON.stringify({ department: '', degree_program: '', student_id: '42' })
    );

    await waitFor(() => expect(screen.getAllByTestId('card')).toHaveLength(2));
    expect(
      screen.getByText(
        'Application submitted successfully! You may now upload documents.'
      )
    ).toBeVisible();
  });

  it('handleSubmit failure logs error and does not add card', async () => {
    (apiGET as jest.Mock).mockResolvedValue({ success: true, payload: [] });
    (apiPOST as jest.Mock).mockResolvedValue({ success: false, error: 'fail!' });
    const err = jest.spyOn(console, 'error').mockImplementation();

    render(<CreateApplication />);
    fireEvent.click(await screen.findByTestId('submit'));

    await waitFor(() =>
      expect(err).toHaveBeenCalledWith(
        'Error creating review:',
        'fail!'
      )
    );
    expect(screen.getAllByTestId('card')).toHaveLength(1);
  });

  describe('handleFileUpload paths', () => {
    beforeEach(() => {
      (global.fetch as jest.Mock) = jest.fn();
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
      fireEvent.click(await screen.findByTestId('submit'));
      await waitFor(() => expect(screen.getAllByTestId('card')).toHaveLength(2));

      const uploadBtn = screen.getAllByTestId('upload')[1];
      fireEvent.click(uploadBtn);
      expect(global.fetch).toHaveBeenCalledWith(
        DOC_URL,
        expect.objectContaining({ method: 'POST', body: expect.any(FormData) })
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
      (global.fetch as jest.Mock).mockResolvedValue({ ok: false, json: async () => ({ message: 'oops' }) });

      render(<CreateApplication />);
      fireEvent.click(await screen.findByTestId('submit'));
      await waitFor(() => expect(screen.getAllByTestId('card')).toHaveLength(2));

      const uploadBtn = screen.getAllByTestId('upload')[1];
      fireEvent.click(uploadBtn);
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
      fireEvent.click(await screen.findByTestId('submit'));
      await waitFor(() => expect(screen.getAllByTestId('card')).toHaveLength(2));

      const uploadBtn = screen.getAllByTestId('upload')[1];
      fireEvent.click(uploadBtn);
      await waitFor(() =>
        expect(window.alert).toHaveBeenCalledWith(
          'Unexpected error occurred during upload.'
        )
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