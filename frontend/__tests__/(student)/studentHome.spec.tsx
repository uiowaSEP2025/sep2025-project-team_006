import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import StudentHome from '@/app/(student)/studentHome/page';

jest.mock("next/link", () => ({
    __esModule: true,
    default: ({ href, children }: any) => <a href={href}>{children}</a>,
  }));
  

  jest.mock('@/components/HomeDashboard', () => {
    return (props: any) => (
      <div data-testid="home-dashboard">
        <h2>{props.title}</h2>
        <ul>
          {props.items.map((item: any) => (
            <li key={item.label}>{item.label}</li>
          ))}
        </ul>
      </div>
    );
  });

describe('StudentHome Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the main heading', () => {
    render(<StudentHome />);
    expect(
      screen.getByRole('heading', { level: 1, name: /STUDENT HOME PAGE/i })
    ).toBeInTheDocument();
  });

  it('renders three HomeDashboard sections with correct titles and items', () => {
    render(<StudentHome />);
    // Should render exactly three mocked dashboards
    const dashboards = screen.getAllByTestId('home-dashboard');
    expect(dashboards).toHaveLength(3);

    // Check each title and a sample item
    expect(screen.getByText('Admissions Information')).toBeInTheDocument();
    expect(screen.getByText('Graduate Form')).toBeInTheDocument();

    expect(screen.getByText('Student Sites')).toBeInTheDocument();
    expect(screen.getByText('UIOWA')).toBeInTheDocument();

    expect(screen.getByText('Finances')).toBeInTheDocument();
    expect(screen.getByText('Donations')).toBeInTheDocument();
  });

  it('renders Move back to Login link', () => {
    render(<StudentHome />);
    const link = screen.getByRole('link', { name: /Move back to Login/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/students');
  });
});
