import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CompactMatchView } from '../CompactMatchView';
import type { Match, MatchCalculationResult } from '../../types/match';

describe('CompactMatchView', () => {
  const mockMatch: Match = {
    id: 1,
    result: 'victory',
    competitionType: 'interclub',
    competition: 'Autres provinciales',
    opponentPoints: '1200',
    isComplete: true,
  };

  const mockResult: MatchCalculationResult = {
    ...mockMatch,
    pointsBefore: 1000,
    pointsChange: 15.3,
    pointsAfter: 1015.3,
  };

  const mockOnEdit = vi.fn();
  const mockOnRemove = vi.fn();

  beforeEach(() => {
    mockOnEdit.mockClear();
    mockOnRemove.mockClear();
  });

  describe('Rendering', () => {
    it('should display victory badge', () => {
      render(
        <CompactMatchView
          match={mockMatch}
          result={mockResult}
          onEdit={mockOnEdit}
          onRemove={mockOnRemove}
        />
      );

      expect(screen.getByText('Victoire')).toBeInTheDocument();
    });

    it('should display defeat badge', () => {
      const defeatMatch = { ...mockMatch, result: 'defeat' as const };
      render(
        <CompactMatchView
          match={defeatMatch}
          onEdit={mockOnEdit}
          onRemove={mockOnRemove}
        />
      );

      expect(screen.getByText('Défaite')).toBeInTheDocument();
    });

    it('should display opponent points', () => {
      render(
        <CompactMatchView
          match={mockMatch}
          result={mockResult}
          onEdit={mockOnEdit}
          onRemove={mockOnRemove}
        />
      );

      expect(screen.getByText('vs 1200 pts')).toBeInTheDocument();
    });

    it('should display competition name', () => {
      render(
        <CompactMatchView
          match={mockMatch}
          result={mockResult}
          onEdit={mockOnEdit}
          onRemove={mockOnRemove}
        />
      );

      expect(screen.getByText('Autres provinciales')).toBeInTheDocument();
    });

    it('should display points change when result is provided', () => {
      render(
        <CompactMatchView
          match={mockMatch}
          result={mockResult}
          onEdit={mockOnEdit}
          onRemove={mockOnRemove}
        />
      );

      expect(screen.getByText('+15.30')).toBeInTheDocument();
    });

    it('should not display points change when result is not provided', () => {
      render(
        <CompactMatchView
          match={mockMatch}
          onEdit={mockOnEdit}
          onRemove={mockOnRemove}
        />
      );

      expect(screen.queryByText(/\+\d/)).not.toBeInTheDocument();
    });

    it('should display negative points change with minus sign', () => {
      const negativeResult = { ...mockResult, pointsChange: -10.5 };
      render(
        <CompactMatchView
          match={mockMatch}
          result={negativeResult}
          onEdit={mockOnEdit}
          onRemove={mockOnRemove}
        />
      );

      expect(screen.getByText('-10.50')).toBeInTheDocument();
    });
  });

  describe('Styling', () => {
    it('should apply green styling for victory', () => {
      render(
        <CompactMatchView
          match={mockMatch}
          result={mockResult}
          onEdit={mockOnEdit}
          onRemove={mockOnRemove}
        />
      );

      const badge = screen.getByText('Victoire');
      expect(badge).toHaveClass('bg-green-100', 'text-green-700');
    });

    it('should apply red styling for defeat', () => {
      const defeatMatch = { ...mockMatch, result: 'defeat' as const };
      render(
        <CompactMatchView
          match={defeatMatch}
          onEdit={mockOnEdit}
          onRemove={mockOnRemove}
        />
      );

      const badge = screen.getByText('Défaite');
      expect(badge).toHaveClass('bg-red-100', 'text-red-700');
    });

    it('should apply green color for positive points change', () => {
      render(
        <CompactMatchView
          match={mockMatch}
          result={mockResult}
          onEdit={mockOnEdit}
          onRemove={mockOnRemove}
        />
      );

      const pointsChange = screen.getByText('+15.30');
      expect(pointsChange).toHaveClass('text-green-600');
    });

    it('should apply red color for negative points change', () => {
      const negativeResult = { ...mockResult, pointsChange: -10.5 };
      render(
        <CompactMatchView
          match={mockMatch}
          result={negativeResult}
          onEdit={mockOnEdit}
          onRemove={mockOnRemove}
        />
      );

      const pointsChange = screen.getByText('-10.50');
      expect(pointsChange).toHaveClass('text-red-600');
    });
  });

  describe('Interactions', () => {
    it('should call onEdit when edit button is clicked', async () => {
      const user = userEvent.setup();
      render(
        <CompactMatchView
          match={mockMatch}
          result={mockResult}
          onEdit={mockOnEdit}
          onRemove={mockOnRemove}
        />
      );

      const editButton = screen.getByLabelText('Modifier le match');
      await user.click(editButton);

      expect(mockOnEdit).toHaveBeenCalledTimes(1);
    });

    it('should call onRemove when delete button is clicked', async () => {
      const user = userEvent.setup();
      render(
        <CompactMatchView
          match={mockMatch}
          result={mockResult}
          onEdit={mockOnEdit}
          onRemove={mockOnRemove}
        />
      );

      const deleteButton = screen.getByLabelText('Supprimer le match');
      await user.click(deleteButton);

      expect(mockOnRemove).toHaveBeenCalledTimes(1);
    });
  });

  describe('Accessibility', () => {
    it('should have accessible edit button', () => {
      render(
        <CompactMatchView
          match={mockMatch}
          result={mockResult}
          onEdit={mockOnEdit}
          onRemove={mockOnRemove}
        />
      );

      const editButton = screen.getByLabelText('Modifier le match');
      expect(editButton).toBeInTheDocument();
    });

    it('should have accessible delete button', () => {
      render(
        <CompactMatchView
          match={mockMatch}
          result={mockResult}
          onEdit={mockOnEdit}
          onRemove={mockOnRemove}
        />
      );

      const deleteButton = screen.getByLabelText('Supprimer le match');
      expect(deleteButton).toBeInTheDocument();
    });
  });
});

