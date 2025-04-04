import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import FacultyHome from '@/app/(faculty)/facultyHome/page'; // Adjust path if needed

jest.mock('next/link', () => {
  return ({ href, children }: any) => <a href={href}>{children}</a>;
});

jest.mock('@/components/HomeDashboard', () => {
  return ({ title, items }: { title: string; items: any[] }) => (
    <div data-testid="home-dashboard">
      <h2>{title}</h2>
      {items.map((item, idx) => (
        <div key={idx} data-testid="dashboard-item">
          {item.label}
        </div>
      ))}
    </div>
  );
});

describe('FacultyHome Page', () => {
  it('renders the main heading', () => {
    render(<FacultyHome />);
    expect(screen.getByRole('heading', { name: /faculty home page/i })).toBeInTheDocument();
  });

  it('renders all HomeDashboard sections', () => {
    render(<FacultyHome />);
    const sections = [
      'Development Links',
      'Admissions Information',
      'Faculty Learning',
      'Faculty Information',
      'Faculty Involvement and Support',
    ];

    for (const section of sections) {
      expect(screen.getByText(section)).toBeInTheDocument();
    }

    expect(screen.getAllByTestId('home-dashboard')).toHaveLength(5);
  });

  it('renders the back to login link', () => {
    render(<FacultyHome />);
    const link = screen.getByRole('link', { name: /move back to login/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/faculty');
  });

  it('renders specific dashboard items', () => {
    render(<FacultyHome />);
    expect(screen.getByText(/Student List/i)).toBeInTheDocument();
    expect(screen.getByText(/Metric Settings/i)).toBeInTheDocument();
    expect(screen.getByText(/ICON/i)).toBeInTheDocument();
    expect(screen.getByText(/TestTwo/i)).toBeInTheDocument();
  });
});
