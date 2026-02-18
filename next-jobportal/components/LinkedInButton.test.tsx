import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { LinkedInButton } from '../app/auth/linkedin/components/LinkedInButton';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe('LinkedInButton', () => {
  const mockOnClick = jest.fn();

  beforeEach(() => {
    mockOnClick.mockClear();
  });

  it('renders with default text', () => {
    render(<LinkedInButton onClick={mockOnClick} />);
    
    expect(screen.getByText('Continue with LinkedIn')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('renders with custom text', () => {
    render(<LinkedInButton onClick={mockOnClick} text="Custom LinkedIn Text" />);
    
    expect(screen.getByText('Custom LinkedIn Text')).toBeInTheDocument();
  });

  it('renders with employer variant', () => {
    render(<LinkedInButton onClick={mockOnClick} variant="employer" />);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-blue-700');
  });

  it('renders with full width', () => {
    render(<LinkedInButton onClick={mockOnClick} fullWidth />);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('w-full');
  });

  it('calls onClick when clicked', () => {
    render(<LinkedInButton onClick={mockOnClick} />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('displays LinkedIn icon', () => {
    render(<LinkedInButton onClick={mockOnClick} />);
    
    const svg = screen.getByRole('button').querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
  });
});
