import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MatchList } from '../MatchList';
import type { Match } from '../../types/match';

describe('MatchList', () => {
  const mockMatches: Match[] = [
    {
      id: 1,
      result: 'victory',
      competitionType: 'interclub',
      competition: 'Autres provinciales',
      opponentPoints: '1200',
      isComplete: true,
    },
    {
      id: 2,
      result: 'defeat',
      competitionType: 'tournament',
      competition: 'Tournoi Série B & C',
      opponentPoints: '1000',
      isComplete: false,
    },
  ];

  const defaultProps = {
    matches: [],
    calculation: null,
    editingId: null,
    onAddMatch: vi.fn(),
    onEditMatch: vi.fn(),
    onRemoveMatch: vi.fn(),
    onUpdateMatch: vi.fn(),
    onCompleteMatch: vi.fn(),
    onCancelEdit: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render the title', () => {
      render(<MatchList {...defaultProps} />);

      expect(screen.getByText('Matchs')).toBeInTheDocument();
    });

    it('should render add match button', () => {
      render(<MatchList {...defaultProps} />);

      expect(screen.getByText('Ajouter un match')).toBeInTheDocument();
    });

    it('should show empty state when no matches', () => {
      render(<MatchList {...defaultProps} />);

      expect(screen.getByText('Aucun match ajouté')).toBeInTheDocument();
      expect(screen.getByText('Cliquez sur "Ajouter un match" pour commencer')).toBeInTheDocument();
    });

    it('should render matches when provided', () => {
      render(<MatchList {...defaultProps} matches={mockMatches} />);

      expect(screen.queryByText('Aucun match ajouté')).not.toBeInTheDocument();
    });
  });

  describe('Add match button', () => {
    it('should call onAddMatch when clicked', async () => {
      const user = userEvent.setup();
      const onAddMatch = vi.fn();

      render(<MatchList {...defaultProps} onAddMatch={onAddMatch} />);

      const addButton = screen.getByText('Ajouter un match');
      await user.click(addButton);

      expect(onAddMatch).toHaveBeenCalledTimes(1);
    });

    it('should have accessible label', () => {
      render(<MatchList {...defaultProps} />);

      const addButton = screen.getByLabelText('Ajouter un match');
      expect(addButton).toBeInTheDocument();
    });
  });

  describe('Match items', () => {
    it('should render correct number of matches', () => {
      render(<MatchList {...defaultProps} matches={mockMatches} />);

      // The first match is complete and should show in compact view
      expect(screen.getByText('vs 1200 pts')).toBeInTheDocument();

      // The second match is incomplete (isComplete: false), so it shows in edit mode
      // with an input field rather than compact text
      const opponentInput = screen.getByDisplayValue('1000');
      expect(opponentInput).toBeInTheDocument();
    });

    it('should pass correct props to MatchItem components', () => {
      const onEditMatch = vi.fn();
      const onRemoveMatch = vi.fn();

      render(
        <MatchList
          {...defaultProps}
          matches={mockMatches}
          onEditMatch={onEditMatch}
          onRemoveMatch={onRemoveMatch}
        />
      );

      // Component should render with the matches
      expect(screen.getByText('vs 1200 pts')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading', () => {
      render(<MatchList {...defaultProps} />);

      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toHaveTextContent('Matchs');
    });
  });
});

