import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { LoginForm } from '@/components/Login';
import WebService from '@/api/WebService';

jest.mock('@/api/apiMethods', () => ({
  apiPOST: jest.fn(),
}));

jest.mock('next/link', () => {
  return ({ href, children }: any) => <a href={href}>{children}</a>;
});

// we're required to mock the router for login pages.
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    refresh: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    prefetch: jest.fn(),
  }),
}));

// ...fetch too.
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ success: true }),
  })
);

// Mock localStorage and location.replace
const mockReplace = jest.fn();
const mockSetItem = jest.fn();

Object.defineProperty(window, 'location', {
  value: { pathname: '/students', replace: mockReplace },
  writable: true,
});

Object.defineProperty(window, 'localStorage', {
  value: {
    setItem: mockSetItem,
  },
  writable: true,
});

describe('LoginForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders login form fields and buttons', () => {
    render(<LoginForm />);
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();

    const buttons = screen.getAllByRole('button');
    const loginButton = buttons.find(btn => btn.textContent?.trim() === 'Login');
    const outlookButton = buttons.find(btn => btn.textContent?.includes('Login with Microsoft'));

    expect(loginButton).toBeInTheDocument();
    expect(outlookButton).toBeInTheDocument();
  });

  it('allows user to type in email and password', () => {
    render(<LoginForm />);
    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Password/i);

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'securepass' } });

    expect(emailInput).toHaveValue('test@example.com');
    expect(passwordInput).toHaveValue('securepass');
  });

  it('calls apiPOST and redirects on successful login', async () => {
    const mockApiPOST = require('@/api/apiMethods').apiPOST;
    mockApiPOST.mockResolvedValue({
      success: true,
      payload: {
        token: 'test-token',
        session: 'test-session',
      },
    });

    const webService = new WebService();
    const expectedUrl = webService.AUTH_STUDENT_LOGIN;

    render(<LoginForm />);
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: 'password123' },
    });

    const loginButton = screen.getAllByRole('button').find(btn => btn.textContent?.trim() === 'Login');
    fireEvent.click(loginButton!);

    await waitFor(() => {
      expect(mockApiPOST).toHaveBeenCalledWith(
        expectedUrl,
        JSON.stringify({ email: 'test@example.com', password: 'password123' })
      );
      expect(mockSetItem).toHaveBeenCalledWith('token', 'test-token');
      expect(mockReplace).toHaveBeenCalledWith('/studentHome');
    });
  });

  it('renders the sign-up link when showSignUpLink is true (default)', () => {
    render(<LoginForm />);
    expect(screen.getByText(/Sign up/i)).toBeInTheDocument();
  });

  it('does not render the sign-up link when showSignUpLink is false', () => {
    render(<LoginForm showSignUpLink={false} />);
    expect(screen.queryByText(/Sign up/i)).not.toBeInTheDocument();
  });
});
