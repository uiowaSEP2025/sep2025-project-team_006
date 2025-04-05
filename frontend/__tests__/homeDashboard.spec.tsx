import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import HomeDashboard from '@/components/HomeDashboard'; // Adjust path if needed
import { useRouter } from 'next/router';

// Mock Next.js features
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />,
}));

jest.mock('next/link', () => {
  return ({ href, children }: any) => <a href={href}>{children}</a>;
});

describe('HomeDashboard', () => {
  const mockItems = [
    {
      label: 'Faculty Portal',
      href: '/faculty',
      image: '/faculty-icon.png',
    },
    {
      label: 'Student Hub',
      href: '/students',
    },
  ];

  it('renders the section title', () => {
    render(<HomeDashboard title="Main Dashboard" items={mockItems} />);
    expect(screen.getByRole('heading', { name: /Main Dashboard/i })).toBeInTheDocument();
  });

  it('renders all provided items with correct labels and links', () => {
    render(<HomeDashboard title="Main Dashboard" items={mockItems} />);

    const facultyLink = screen.getByRole('link', { name: /Faculty Portal/i });
    const studentLink = screen.getByRole('link', { name: /Student Hub/i });

    expect(facultyLink).toHaveAttribute('href', '/faculty');
    expect(studentLink).toHaveAttribute('href', '/students');

    expect(screen.getByText('Faculty Portal')).toBeInTheDocument();
    expect(screen.getByText('Student Hub')).toBeInTheDocument();
  });

  it('renders image if present in item', () => {
    render(<HomeDashboard title="Main Dashboard" items={mockItems} />);
    const image = screen.getByAltText('Faculty Portal');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', '/faculty-icon.png');
  });

  it('does not render an image if item has no image prop', () => {
    render(<HomeDashboard title="Main Dashboard" items={mockItems} />);
    // There should only be one image (Faculty Portal)
    const images = screen.getAllByRole('img');
    expect(images.length).toBe(1);
  });
});
