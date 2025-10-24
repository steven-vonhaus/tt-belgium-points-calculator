import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';

describe('App Integration Tests', () => {
  describe('Initial state', () => {
    it('should render the application', () => {
      render(<App />);

      expect(screen.getByText('Calculateur de Classement Tennis de Table')).toBeInTheDocument();
    });

    it('should render header with points input', () => {
      render(<App />);

      expect(screen.getByLabelText('Points actuels')).toBeInTheDocument();
    });

    it('should render empty match list initially', () => {
      render(<App />);

      expect(screen.getByText('Aucun match ajouté')).toBeInTheDocument();
    });

    it('should render info panel', () => {
      render(<App />);

      expect(screen.getByText(/ℹ️ Information:/)).toBeInTheDocument();
    });

    it('should not show summary panel initially', () => {
      render(<App />);

      expect(screen.queryByText('Points de départ')).not.toBeInTheDocument();
    });
  });

  describe('Adding current points', () => {
    it('should allow entering current points', async () => {
      const user = userEvent.setup();
      render(<App />);

      const input = screen.getByLabelText('Points actuels');
      await user.type(input, '1000');

      expect(input).toHaveValue(1000);
    });
  });

  describe('Match management workflow', () => {
    it('should add a new match when clicking add button', async () => {
      const user = userEvent.setup();
      render(<App />);

      const addButton = screen.getByText('Ajouter un match');
      await user.click(addButton);

      expect(screen.getByLabelText('Résultat')).toBeInTheDocument();
      expect(screen.getByLabelText('Points adversaire')).toBeInTheDocument();
    });

    it('should complete a match and show in list', async () => {
      const user = userEvent.setup();
      render(<App />);

      // Add current points
      const pointsInput = screen.getByLabelText('Points actuels');
      await user.type(pointsInput, '1000');

      // Add a match
      const addButton = screen.getByText('Ajouter un match');
      await user.click(addButton);

      // Fill in opponent points
      const opponentInput = screen.getByLabelText('Points adversaire');
      await user.type(opponentInput, '1200');

      // Complete the match
      const validateButton = screen.getByText('Valider');
      await user.click(validateButton);

      // Should show completed match
      expect(screen.getByText('vs 1200 pts')).toBeInTheDocument();
      expect(screen.getByText('Victoire')).toBeInTheDocument();
    });

    it('should show summary panel after completing a match', async () => {
      const user = userEvent.setup();
      render(<App />);

      // Add current points
      const pointsInput = screen.getByLabelText('Points actuels');
      await user.type(pointsInput, '1000');

      // Add and complete a match
      await user.click(screen.getByText('Ajouter un match'));
      await user.type(screen.getByLabelText('Points adversaire'), '1200');
      await user.click(screen.getByText('Valider'));

      // Summary should appear
      expect(screen.getByText('Points de départ')).toBeInTheDocument();
      expect(screen.getByText('Évolution')).toBeInTheDocument();
      expect(screen.getByText('Points finaux')).toBeInTheDocument();
    });

    it('should allow editing a completed match', async () => {
      const user = userEvent.setup();
      render(<App />);

      // Setup and complete a match
      await user.type(screen.getByLabelText('Points actuels'), '1000');
      await user.click(screen.getByText('Ajouter un match'));
      await user.type(screen.getByLabelText('Points adversaire'), '1200');
      await user.click(screen.getByText('Valider'));

      // Edit the match
      const editButton = screen.getByLabelText('Modifier le match');
      await user.click(editButton);

      // Should show editor again
      expect(screen.getByLabelText('Points adversaire')).toHaveValue(1200);
    });

    it('should remove a match when delete is clicked', async () => {
      const user = userEvent.setup();
      render(<App />);

      // Setup and complete a match
      await user.type(screen.getByLabelText('Points actuels'), '1000');
      await user.click(screen.getByText('Ajouter un match'));
      await user.type(screen.getByLabelText('Points adversaire'), '1200');
      await user.click(screen.getByText('Valider'));

      // Delete the match
      const deleteButton = screen.getByLabelText('Supprimer le match');
      await user.click(deleteButton);

      // Should show empty state
      expect(screen.getByText('Aucun match ajouté')).toBeInTheDocument();
    });
  });

  describe('Multiple matches workflow', () => {
    it('should handle multiple completed matches', async () => {
      const user = userEvent.setup();
      render(<App />);

      await user.type(screen.getByLabelText('Points actuels'), '1000');

      // Add first match
      await user.click(screen.getByText('Ajouter un match'));
      await user.type(screen.getByLabelText('Points adversaire'), '1200');
      await user.click(screen.getByText('Valider'));

      // Add second match
      await user.click(screen.getByText('Ajouter un match'));
      const inputs = screen.getAllByLabelText('Points adversaire');
      await user.type(inputs[inputs.length - 1], '900');
      await user.click(screen.getByText('Valider'));

      // Should show both matches
      expect(screen.getByText('vs 1200 pts')).toBeInTheDocument();
      expect(screen.getByText('vs 900 pts')).toBeInTheDocument();
    });

    it('should use previous match competition type for new matches', async () => {
      const user = userEvent.setup();
      render(<App />);

      await user.type(screen.getByLabelText('Points actuels'), '1000');

      // Add first match and change to tournament
      await user.click(screen.getByText('Ajouter un match'));
      const typeSelect = screen.getByLabelText('Type');
      await user.selectOptions(typeSelect, 'tournament');
      await user.type(screen.getByLabelText('Points adversaire'), '1200');
      await user.click(screen.getByText('Valider'));

      // Add second match
      await user.click(screen.getByText('Ajouter un match'));

      // Should default to tournament
      const newTypeSelect = screen.getByLabelText('Type');
      expect(newTypeSelect).toHaveValue('tournament');
    });
  });

  describe('Cancel workflow', () => {
    it('should remove new incomplete match when cancelled', async () => {
      const user = userEvent.setup();
      render(<App />);

      await user.click(screen.getByText('Ajouter un match'));

      // Should show editor
      expect(screen.getByLabelText('Points adversaire')).toBeInTheDocument();

      await user.click(screen.getByText('Annuler'));

      // Should show empty state
      expect(screen.getByText('Aucun match ajouté')).toBeInTheDocument();
    });

    it('should keep completed match when edit is cancelled', async () => {
      const user = userEvent.setup();
      render(<App />);

      // Complete a match
      await user.type(screen.getByLabelText('Points actuels'), '1000');
      await user.click(screen.getByText('Ajouter un match'));
      await user.type(screen.getByLabelText('Points adversaire'), '1200');
      await user.click(screen.getByText('Valider'));

      // Edit and cancel
      await user.click(screen.getByLabelText('Modifier le match'));
      await user.click(screen.getByText('Annuler'));

      // Should still show completed match
      expect(screen.getByText('vs 1200 pts')).toBeInTheDocument();
    });
  });
});

