import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { InfoPanel } from '../InfoPanel';

describe('InfoPanel', () => {
  describe('Rendering', () => {
    it('should render the info panel', () => {
      render(<InfoPanel />);

      expect(screen.getByText(/ℹ️ Information:/)).toBeInTheDocument();
    });

    it('should display information about the calculator', () => {
      render(<InfoPanel />);

      expect(
        screen.getByText(/Ce calculateur utilise le système de classement numérique AFTT/)
      ).toBeInTheDocument();
    });

    it('should mention the season', () => {
      render(<InfoPanel />);

      expect(screen.getByText(/2025-2026/)).toBeInTheDocument();
    });

    it('should explain the calculation method', () => {
      render(<InfoPanel />);

      expect(
        screen.getByText(/Les points sont calculés en fonction de la différence de points/)
      ).toBeInTheDocument();
    });
  });

  describe('Styling', () => {
    it('should have proper info styling', () => {
      const { container } = render(<InfoPanel />);

      const panel = container.firstChild;
      expect(panel).toHaveClass('bg-blue-50');
    });
  });
});

