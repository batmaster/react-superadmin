import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../../ui/Button';

describe('Button', () => {
  const defaultProps = {
    children: 'Click me',
    onClick: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render with default variant', () => {
    render(<Button {...defaultProps} />);
    const button = screen.getByRole('button');

    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Click me');
    expect(button).toHaveClass('bg-primary-600');
  });

  it('should render with different variants', () => {
    render(<Button {...defaultProps} variant="outline" />);
    const button = screen.getByRole('button');

    expect(button).toHaveClass('border', 'border-gray-300', 'bg-white');
  });

  it('should render with different sizes', () => {
    render(<Button {...defaultProps} size="sm" />);
    const button = screen.getByRole('button');

    expect(button).toHaveClass('px-3', 'py-1.5', 'text-sm');
  });

  it('should handle click events', () => {
    const onClick = jest.fn();
    render(<Button {...defaultProps} onClick={onClick} />);

    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('should show loading state', () => {
    render(<Button {...defaultProps} loading={true} />);
    const button = screen.getByRole('button');

    expect(button).toBeDisabled();
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('should be disabled when loading', () => {
    render(<Button {...defaultProps} loading={true} />);
    const button = screen.getByRole('button');

    expect(button).toBeDisabled();
  });

  it('should apply custom className', () => {
    render(<Button {...defaultProps} className="custom-class" />);
    const button = screen.getByRole('button');

    expect(button).toHaveClass('custom-class');
  });

  it('should handle different button types', () => {
    render(<Button {...defaultProps} type="submit" />);
    const button = screen.getByRole('button');

    expect(button).toHaveAttribute('type', 'submit');
  });

  it('should render with danger variant', () => {
    render(<Button {...defaultProps} variant="danger" />);
    const button = screen.getByRole('button');

    expect(button).toHaveClass('bg-red-600', 'hover:bg-red-700');
  });

  it('should render with success variant', () => {
    render(<Button {...defaultProps} variant="success" />);
    const button = screen.getByRole('button');

    expect(button).toHaveClass('bg-green-600', 'hover:bg-green-700');
  });

  it('should render with warning variant', () => {
    render(<Button {...defaultProps} variant="warning" />);
    const button = screen.getByRole('button');

    expect(button).toHaveClass('bg-yellow-600', 'hover:bg-yellow-700');
  });

  it('should render with secondary variant', () => {
    render(<Button {...defaultProps} variant="secondary" />);
    const button = screen.getByRole('button');

    expect(button).toHaveClass('bg-gray-600', 'hover:bg-gray-700');
  });
});
