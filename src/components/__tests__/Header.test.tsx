import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Header } from '../Header';

describe('Header', () => {
  const mockOnChange = vi.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  describe('Rendering', () => {
    it('should render the title', () => {
      render(<Header currentPoints="" onCurrentPointsChange={mockOnChange} />);

      expect(screen.getByText('Calculateur de Classement Tennis de Table')).toBeInTheDocument();
    });

    it('should render the season information', () => {
      render(<Header currentPoints="" onCurrentPointsChange={mockOnChange} />);

      expect(screen.getByText('Saison 2025-2026 - Règlement AFTT')).toBeInTheDocument();
    });

    it('should render the current points input', () => {
      render(<Header currentPoints="" onCurrentPointsChange={mockOnChange} />);

      expect(screen.getByLabelText('Points actuels')).toBeInTheDocument();
    });

    it('should render the calculator icon', () => {
      const { container } = render(
        <Header currentPoints="" onCurrentPointsChange={mockOnChange} />
      );

      const icon = container.querySelector('svg');
      expect(icon).toBeInTheDocument();
    });
  });

  describe('Input behavior', () => {
    it('should display the current points value', () => {
      render(<Header currentPoints="1234" onCurrentPointsChange={mockOnChange} />);

      const input = screen.getByLabelText('Points actuels') as HTMLInputElement;
      expect(input.value).toBe('1234');
    });

    it('should call onCurrentPointsChange when input changes', async () => {
      const user = userEvent.setup();
      render(<Header currentPoints="" onCurrentPointsChange={mockOnChange} />);

      const input = screen.getByLabelText('Points actuels');
      await user.type(input, '1000');

      expect(mockOnChange).toHaveBeenCalled();
    });

    it('should accept only numbers', () => {
      render(<Header currentPoints="" onCurrentPointsChange={mockOnChange} />);

      const input = screen.getByLabelText('Points actuels');
      expect(input).toHaveAttribute('type', 'number');
    });

    it('should have a placeholder', () => {
      render(<Header currentPoints="" onCurrentPointsChange={mockOnChange} />);

      const input = screen.getByLabelText('Points actuels');
      expect(input).toHaveAttribute('placeholder', 'Ex: 450');
    });
  });

  describe('Accessibility', () => {
    it('should have proper label association', () => {
      render(<Header currentPoints="" onCurrentPointsChange={mockOnChange} />);

      const input = screen.getByLabelText('Points actuels');
      expect(input).toHaveAttribute('id', 'current-points');
    });

    it('should have proper heading hierarchy', () => {
      render(<Header currentPoints="" onCurrentPointsChange={mockOnChange} />);

      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toHaveTextContent('Calculateur de Classement Tennis de Table');
    });
  });
});

