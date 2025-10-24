import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SummaryPanel } from '../SummaryPanel';
import type { CalculationSummary } from '../../types/match';

describe('SummaryPanel', () => {
  const mockCalculation: CalculationSummary = {
    startPoints: 1000,
    endPoints: 1024,
    totalChange: 24,
    results: [],
  };

  describe('Rendering', () => {
    it('should display start points', () => {
      render(<SummaryPanel calculation={mockCalculation} />);

      expect(screen.getByText('Points de départ')).toBeInTheDocument();
      expect(screen.getByText('1000.00')).toBeInTheDocument();
    });

    it('should display end points', () => {
      render(<SummaryPanel calculation={mockCalculation} />);

      expect(screen.getByText('Points finaux')).toBeInTheDocument();
      expect(screen.getByText('1024.00')).toBeInTheDocument();
    });

    it('should display total change with plus sign for positive', () => {
      render(<SummaryPanel calculation={mockCalculation} />);

      expect(screen.getByText('Évolution')).toBeInTheDocument();
      expect(screen.getByText('+24.00')).toBeInTheDocument();
    });

    it('should display total change without plus sign for negative', () => {
      const negativeCalculation: CalculationSummary = {
        ...mockCalculation,
        endPoints: 980,
        totalChange: -20,
      };

      render(<SummaryPanel calculation={negativeCalculation} />);

      expect(screen.getByText('-20.00')).toBeInTheDocument();
    });

    it('should format numbers to 2 decimal places', () => {
      const decimalCalculation: CalculationSummary = {
        startPoints: 1000.556,
        endPoints: 1024.889,
        totalChange: 24.333,
        results: [],
      };

      render(<SummaryPanel calculation={decimalCalculation} />);

      expect(screen.getByText('1000.56')).toBeInTheDocument();
      expect(screen.getByText('1024.89')).toBeInTheDocument();
      expect(screen.getByText('+24.33')).toBeInTheDocument();
    });
  });

  describe('Styling', () => {
    it('should apply green color class for positive change', () => {
      render(<SummaryPanel calculation={mockCalculation} />);

      const changeElement = screen.getByText('+24.00');
      expect(changeElement).toHaveClass('text-green-300');
    });

    it('should apply red color class for negative change', () => {
      const negativeCalculation: CalculationSummary = {
        ...mockCalculation,
        endPoints: 980,
        totalChange: -20,
      };

      render(<SummaryPanel calculation={negativeCalculation} />);

      const changeElement = screen.getByText('-20.00');
      expect(changeElement).toHaveClass('text-red-300');
    });

    it('should apply green color class for zero change', () => {
      const zeroCalculation: CalculationSummary = {
        startPoints: 1000,
        endPoints: 1000,
        totalChange: 0,
        results: [],
      };

      render(<SummaryPanel calculation={zeroCalculation} />);

      const changeElement = screen.getByText('+0.00');
      expect(changeElement).toHaveClass('text-green-300');
    });
  });
});

