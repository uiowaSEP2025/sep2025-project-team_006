import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Home from '@/app/(faculty)/faculty/page';

jest.mock('next/image', () => (props: any) => {
  // Simplified Image mock for testing
  return <img {...props} />;
});

jest.mock('next/link', () => {
  return ({ href, children }: any) => <a href={href}>{children}</a>;
});

jest.mock('@/components/Login', () => ({
  LoginForm: ({ showSignUpLink }: { showSignUpLink: boolean }) => (
    <div data-testid="login-form">LoginForm (SignUpLink: {`${showSignUpLink}`})</div>
  )
}));

describe('Home Page', () => {
  it('renders logo image', () => {
    render(<Home />);
    const logo = screen.getByAltText(/gap logo/i);
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('src', './GAPpaint.png');
  });

  it('renders the LoginForm with showSignUpLink=false', () => {
    render(<Home />);
    const loginForm = screen.getByTestId('login-form');
    expect(loginForm).toBeInTheDocument();
    expect(loginForm).toHaveTextContent('SignUpLink: false');
  });
});
