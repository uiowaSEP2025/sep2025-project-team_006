import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProfileList from '../../frontend/components/ProfileList';

const mockProfiles = [
  {
    id: 1,
    name: 'Alice Johnson',
    status: 'Active',
    department: 'Computer Science',
    degree_program: 'PhD',
    image: '/alice.jpg',
  },
  {
    id: 2,
    name: 'Bob Smith',
    status: 'Graduated',
    department: 'Mathematics',
    degree_program: 'MS',
    image: '/bob.jpg',
  },
];

describe('ProfileList', () => {
  it('renders a list of profiles with name and details', () => {
    render(<ProfileList profiles={mockProfiles} onProfileClick={() => {}} />);

    // Check for both names and some content from status/department/program
    expect(screen.getByText('Alice Johnson')).toBeInTheDocument();
    expect(screen.getByText(/Active – Computer Science – PhD/i)).toBeInTheDocument();

    expect(screen.getByText('Bob Smith')).toBeInTheDocument();
    expect(screen.getByText(/Graduated – Mathematics – MS/i)).toBeInTheDocument();
  });

  it('calls onProfileClick with the correct profile when clicked', () => {
    const handleClick = jest.fn();
    render(<ProfileList profiles={mockProfiles} onProfileClick={handleClick} />);

    const aliceButton = screen.getByRole('button', { name: /Alice Johnson/i });
    fireEvent.click(aliceButton);

    expect(handleClick).toHaveBeenCalledTimes(1);
    expect(handleClick).toHaveBeenCalledWith(mockProfiles[0]);
  });

  it('renders profile images with correct alt text', () => {
    render(<ProfileList profiles={mockProfiles} onProfileClick={() => {}} />);

    const image = screen.getByAltText('Alice Johnson');
    expect(image).toBeInTheDocument();
  });
});
