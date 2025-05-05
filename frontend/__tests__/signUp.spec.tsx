import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SignUpForm } from '@/components/SignUp';
import WebService from '@/api/WebService';

jest.mock('@/api/apiMethods', () => ({
  apiPOST: jest.fn(),
}));

jest.mock('next/link', () => {
  return ({ href, children }: any) => <a href={href}>{children}</a>;
});

// required to avoid mysterious "invariant expected app router to be mounted" error
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    refresh: jest.fn(),
    prefetch: jest.fn(),
  }),
}));

// Mock localStorage and window.location.replace
const mockReplace = jest.fn();
const mockSetItem = jest.fn();

Object.defineProperty(window, 'location', {
  value: { replace: mockReplace },
  writable: true,
});

Object.defineProperty(window, 'localStorage', {
  value: {
    setItem: mockSetItem,
  },
  writable: true,
});

describe('SignUpForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders email, password, confirm password fields and submit button', () => {
    render(<SignUpForm />);
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Re-Enter Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign-Up/i })).toBeInTheDocument();
  });

  it('allows typing into email and password fields', () => {
    render(<SignUpForm />);
    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText('Password');
    const confirmPasswordInput = screen.getByLabelText('Re-Enter Password');

    fireEvent.change(emailInput, { target: { value: 'test@uiowa.edu' } });
    fireEvent.change(passwordInput, { target: { value: 'mypassword' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'mypassword' } });

    expect(emailInput).toHaveValue('test@uiowa.edu');
    expect(passwordInput).toHaveValue('mypassword');
    expect(confirmPasswordInput).toHaveValue('mypassword');
  });

  it('calls apiPOST and redirects on successful signup', () => { 
    const mockApiPOST = require('@/api/apiMethods').apiPOST;
    mockApiPOST.mockResolvedValue({
      success: true,
      payload: {
        token: 'signup-token',
        session: 'signup-session',
      },
    });

    const expectedUrl = new WebService().AUTH_STUDENT_REGISTER;

    render(<SignUpForm />);
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: 'newstudent@uiowa.edu' },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'newpassword' },
    });
    fireEvent.change(screen.getByLabelText('Re-Enter Password'), {
      target: { value: 'newpassword' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Sign-Up/i }));

    waitFor(() => {
      expect(mockApiPOST).toHaveBeenCalledWith(
        expectedUrl,
        JSON.stringify({
          email: 'newstudent@uiowa.edu',
          password: 'newpassword',
        })
      );
      expect(mockSetItem).toHaveBeenCalledWith('token', 'signup-token');
      expect(mockSetItem).toHaveBeenCalledWith('session', 'signup-session');
      expect(mockSetItem).toHaveBeenCalledWith('role', 'student');
      expect(mockReplace).toHaveBeenCalledWith('/studentHome');
    });
  });
});
