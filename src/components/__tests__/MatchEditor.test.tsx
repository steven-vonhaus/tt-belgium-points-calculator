import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MatchEditor } from '../MatchEditor';
import type { Match } from '../../types/match';

describe('MatchEditor', () => {
  const mockMatch: Match = {
    id: 1,
    result: 'victory',
    competitionType: 'interclub',
    competition: 'Autres provinciales',
    opponentPoints: '1200',
    isComplete: false,
  };

  const mockOnUpdate = vi.fn();
  const mockOnComplete = vi.fn();
  const mockOnCancel = vi.fn();

  beforeEach(() => {
    mockOnUpdate.mockClear();
    mockOnComplete.mockClear();
    mockOnCancel.mockClear();
  });

  describe('Rendering', () => {
    it('should render all form fields', () => {
      render(
        <MatchEditor
          match={mockMatch}
          onUpdate={mockOnUpdate}
          onComplete={mockOnComplete}
          onCancel={mockOnCancel}
        />
      );

      expect(screen.getByLabelText('Résultat')).toBeInTheDocument();
      expect(screen.getByLabelText('Type')).toBeInTheDocument();
      expect(screen.getByLabelText('Compétition')).toBeInTheDocument();
      expect(screen.getByLabelText('Points adversaire')).toBeInTheDocument();
    });

    it('should display current match values', () => {
      render(
        <MatchEditor
          match={mockMatch}
          onUpdate={mockOnUpdate}
          onComplete={mockOnComplete}
          onCancel={mockOnCancel}
        />
      );

      const resultSelect = screen.getByLabelText('Résultat') as HTMLSelectElement;
      const typeSelect = screen.getByLabelText('Type') as HTMLSelectElement;
      const competitionSelect = screen.getByLabelText('Compétition') as HTMLSelectElement;
      const opponentInput = screen.getByLabelText('Points adversaire') as HTMLInputElement;

      expect(resultSelect.value).toBe('victory');
      expect(typeSelect.value).toBe('interclub');
      expect(competitionSelect.value).toBe('Autres provinciales');
      expect(opponentInput.value).toBe('1200');
    });

    it('should render action buttons', () => {
      render(
        <MatchEditor
          match={mockMatch}
          onUpdate={mockOnUpdate}
          onComplete={mockOnComplete}
          onCancel={mockOnCancel}
        />
      );

      expect(screen.getByText('Annuler')).toBeInTheDocument();
      expect(screen.getByText('Valider')).toBeInTheDocument();
    });
  });

  describe('Result field', () => {
    it('should have victory and defeat options', () => {
      render(
        <MatchEditor
          match={mockMatch}
          onUpdate={mockOnUpdate}
          onComplete={mockOnComplete}
          onCancel={mockOnCancel}
        />
      );

      const select = screen.getByLabelText('Résultat');
      expect(select).toContainHTML('<option value="victory">Victoire</option>');
      expect(select).toContainHTML('<option value="defeat">Défaite</option>');
    });

    it('should call onUpdate when result changes', async () => {
      const user = userEvent.setup();
      render(
        <MatchEditor
          match={mockMatch}
          onUpdate={mockOnUpdate}
          onComplete={mockOnComplete}
          onCancel={mockOnCancel}
        />
      );

      const select = screen.getByLabelText('Résultat');
      await user.selectOptions(select, 'defeat');

      expect(mockOnUpdate).toHaveBeenCalledWith('result', 'defeat');
    });
  });

  describe('Competition type field', () => {
    it('should have interclub and tournament options', () => {
      render(
        <MatchEditor
          match={mockMatch}
          onUpdate={mockOnUpdate}
          onComplete={mockOnComplete}
          onCancel={mockOnCancel}
        />
      );

      const select = screen.getByLabelText('Type');
      expect(select).toContainHTML('<option value="interclub">Interclub</option>');
      expect(select).toContainHTML('<option value="tournament">Tournoi</option>');
    });

    it('should call onUpdate when competition type changes', async () => {
      const user = userEvent.setup();
      render(
        <MatchEditor
          match={mockMatch}
          onUpdate={mockOnUpdate}
          onComplete={mockOnComplete}
          onCancel={mockOnCancel}
        />
      );

      const select = screen.getByLabelText('Type');
      await user.selectOptions(select, 'tournament');

      expect(mockOnUpdate).toHaveBeenCalledWith('competitionType', 'tournament');
    });
  });

  describe('Competition field', () => {
    it('should display interclub competitions when type is interclub', () => {
      render(
        <MatchEditor
          match={mockMatch}
          onUpdate={mockOnUpdate}
          onComplete={mockOnComplete}
          onCancel={mockOnCancel}
        />
      );

      const select = screen.getByLabelText('Compétition');
      expect(select).toContainHTML('Super Division');
      expect(select).toContainHTML('Autres provinciales');
    });

    it('should display tournament competitions when type is tournament', () => {
      const tournamentMatch = { ...mockMatch, competitionType: 'tournament' as const };
      render(
        <MatchEditor
          match={tournamentMatch}
          onUpdate={mockOnUpdate}
          onComplete={mockOnComplete}
          onCancel={mockOnCancel}
        />
      );

      const select = screen.getByLabelText('Compétition');
      expect(select).toContainHTML('Tournoi Série A');
      expect(select).toContainHTML('Tournoi Série B &amp; C');
    });

    it('should call onUpdate when competition changes', async () => {
      const user = userEvent.setup();
      render(
        <MatchEditor
          match={mockMatch}
          onUpdate={mockOnUpdate}
          onComplete={mockOnComplete}
          onCancel={mockOnCancel}
        />
      );

      const select = screen.getByLabelText('Compétition');
      await user.selectOptions(select, 'Super Division');

      expect(mockOnUpdate).toHaveBeenCalledWith('competition', 'Super Division');
    });
  });

  describe('Opponent points field', () => {
    it('should be a number input', () => {
      render(
        <MatchEditor
          match={mockMatch}
          onUpdate={mockOnUpdate}
          onComplete={mockOnComplete}
          onCancel={mockOnCancel}
        />
      );

      const input = screen.getByLabelText('Points adversaire');
      expect(input).toHaveAttribute('type', 'number');
    });

    it('should have placeholder text', () => {
      render(
        <MatchEditor
          match={mockMatch}
          onUpdate={mockOnUpdate}
          onComplete={mockOnComplete}
          onCancel={mockOnCancel}
        />
      );

      const input = screen.getByLabelText('Points adversaire');
      expect(input).toHaveAttribute('placeholder', 'Ex: 500');
    });

    it('should call onUpdate when opponent points change', async () => {
      const user = userEvent.setup();
      const emptyMatch = { ...mockMatch, opponentPoints: '' };
      render(
        <MatchEditor
          match={emptyMatch}
          onUpdate={mockOnUpdate}
          onComplete={mockOnComplete}
          onCancel={mockOnCancel}
        />
      );

      const input = screen.getByLabelText('Points adversaire');
      await user.type(input, '1500');

      expect(mockOnUpdate).toHaveBeenCalled();
    });
  });

  describe('Action buttons', () => {
    it('should call onCancel when cancel button is clicked', async () => {
      const user = userEvent.setup();
      render(
        <MatchEditor
          match={mockMatch}
          onUpdate={mockOnUpdate}
          onComplete={mockOnComplete}
          onCancel={mockOnCancel}
        />
      );

      const cancelButton = screen.getByText('Annuler');
      await user.click(cancelButton);

      expect(mockOnCancel).toHaveBeenCalledTimes(1);
    });

    it('should call onComplete when validate button is clicked', async () => {
      const user = userEvent.setup();
      render(
        <MatchEditor
          match={mockMatch}
          onUpdate={mockOnUpdate}
          onComplete={mockOnComplete}
          onCancel={mockOnCancel}
        />
      );

      const validateButton = screen.getByText('Valider');
      await user.click(validateButton);

      expect(mockOnComplete).toHaveBeenCalledTimes(1);
    });

    it('should disable validate button when opponent points are empty', () => {
      const emptyMatch = { ...mockMatch, opponentPoints: '' };
      render(
        <MatchEditor
          match={emptyMatch}
          onUpdate={mockOnUpdate}
          onComplete={mockOnComplete}
          onCancel={mockOnCancel}
        />
      );

      const validateButton = screen.getByText('Valider');
      expect(validateButton).toBeDisabled();
    });

    it('should enable validate button when opponent points are provided', () => {
      render(
        <MatchEditor
          match={mockMatch}
          onUpdate={mockOnUpdate}
          onComplete={mockOnComplete}
          onCancel={mockOnCancel}
        />
      );

      const validateButton = screen.getByText('Valider');
      expect(validateButton).not.toBeDisabled();
    });
  });

  describe('Accessibility', () => {
    it('should have proper labels for all inputs', () => {
      render(
        <MatchEditor
          match={mockMatch}
          onUpdate={mockOnUpdate}
          onComplete={mockOnComplete}
          onCancel={mockOnCancel}
        />
      );

      expect(screen.getByLabelText('Résultat')).toBeInTheDocument();
      expect(screen.getByLabelText('Type')).toBeInTheDocument();
      expect(screen.getByLabelText('Compétition')).toBeInTheDocument();
      expect(screen.getByLabelText('Points adversaire')).toBeInTheDocument();
    });

    it('should have aria-label for cancel button', () => {
      render(
        <MatchEditor
          match={mockMatch}
          onUpdate={mockOnUpdate}
          onComplete={mockOnComplete}
          onCancel={mockOnCancel}
        />
      );

      const cancelButton = screen.getByLabelText('Annuler');
      expect(cancelButton).toBeInTheDocument();
    });

    it('should have aria-label for validate button', () => {
      render(
        <MatchEditor
          match={mockMatch}
          onUpdate={mockOnUpdate}
          onComplete={mockOnComplete}
          onCancel={mockOnCancel}
        />
      );

      const validateButton = screen.getByLabelText('Valider le match');
      expect(validateButton).toBeInTheDocument();
    });
  });
});

