import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import StudentLogin from '@/app/(student)/students/page';

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />
}));

jest.mock("next/link", () => ({
    __esModule: true,
    default: ({ href, children }: any) => <a href={href}>{children}</a>,
}));

jest.mock('@/components/Login', () => ({
  LoginForm: () => <form data-testid="login-form">LoginFormMock</form>
}));

describe('StudentLogin Component', () => {
  beforeEach(() => jest.clearAllMocks());

  it('renders the GAP logo image', () => {
    render(<StudentLogin />);
    const logo = screen.getByAltText('GAP logo');
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('src', expect.stringContaining('GAPpaint.png'));
  });

  it('renders the LoginForm component', () => {
    render(<StudentLogin />);
    expect(screen.getByTestId('login-form')).toBeInTheDocument();
  });
});
