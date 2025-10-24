import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useMatches } from '../useMatches';

describe('useMatches', () => {
  describe('addMatch', () => {
    it('should add a new match with default values when no previous matches exist', () => {
      const { result } = renderHook(() => useMatches());

      act(() => {
        result.current.addMatch();
      });

      expect(result.current.matches).toHaveLength(1);
      expect(result.current.matches[0]).toMatchObject({
        result: 'victory',
        competitionType: 'interclub',
        competition: 'Autres provinciales',
        opponentPoints: '',
        isComplete: false,
      });
      expect(result.current.editingId).toBe(result.current.matches[0].id);
    });

    it('should add a new match with previous match values', () => {
      const { result } = renderHook(() => useMatches());

      act(() => {
        result.current.addMatch();
      });

      const firstMatchId = result.current.matches[0].id;

      act(() => {
        result.current.updateMatch(firstMatchId, 'competitionType', 'tournament');
      });

      act(() => {
        result.current.updateMatch(firstMatchId, 'opponentPoints', '1000');
      });

      act(() => {
        result.current.completeMatch(firstMatchId);
      });

      act(() => {
        result.current.addMatch();
      });

      expect(result.current.matches).toHaveLength(2);
      expect(result.current.matches[1].competitionType).toBe('tournament');
      expect(result.current.matches[1].competition).toBe('Tournoi Série B & C');
    });

    it('should set the new match as editing', () => {
      const { result } = renderHook(() => useMatches());

      act(() => {
        result.current.addMatch();
      });

      const matchId = result.current.matches[0].id;
      expect(result.current.editingId).toBe(matchId);
    });
  });

  describe('removeMatch', () => {
    it('should remove a match by id', () => {
      const { result } = renderHook(() => useMatches());

      act(() => {
        result.current.addMatch();
      });

      const firstMatchId = result.current.matches[0].id;

      act(() => {
        result.current.updateMatch(firstMatchId, 'opponentPoints', '1000');
      });

      act(() => {
        result.current.completeMatch(firstMatchId);
      });

      act(() => {
        result.current.addMatch();
      });

      const secondMatchId = result.current.matches[1].id;

      act(() => {
        result.current.updateMatch(secondMatchId, 'opponentPoints', '1100');
      });

      act(() => {
        result.current.completeMatch(secondMatchId);
      });

      act(() => {
        result.current.removeMatch(firstMatchId);
      });

      expect(result.current.matches).toHaveLength(1);
      expect(result.current.matches[0].id).toBe(secondMatchId);
    });

    it('should clear editingId if removed match was being edited', () => {
      const { result } = renderHook(() => useMatches());

      act(() => {
        result.current.addMatch();
      });

      const matchId = result.current.matches[0].id;

      act(() => {
        result.current.removeMatch(matchId);
      });

      expect(result.current.editingId).toBeNull();
    });

    it('should not clear editingId if removed match was not being edited', () => {
      const { result } = renderHook(() => useMatches());

      // Add first match
      act(() => {
        result.current.addMatch();
      });

      const firstMatchId = result.current.matches[0].id;

      // Complete first match (which clears editingId)
      act(() => {
        result.current.updateMatch(firstMatchId, 'opponentPoints', '1000');
      });

      act(() => {
        result.current.completeMatch(firstMatchId);
      });

      expect(result.current.editingId).toBeNull();

      // Add second match (becomes the editing match)
      act(() => {
        result.current.addMatch();
      });

      const secondMatchId = result.current.matches[1].id;

      // Verify second match is being edited
      expect(result.current.editingId).toBe(secondMatchId);
      expect(result.current.matches).toHaveLength(2);

      // Remove the first match (not the one being edited)
      act(() => {
        result.current.removeMatch(firstMatchId);
      });

      // The second match should remain
      expect(result.current.matches).toHaveLength(1);
      expect(result.current.matches[0].id).toBe(secondMatchId);
      // editingId should still be on the second match
      expect(result.current.editingId).toBe(secondMatchId);
    });
  });

  describe('updateMatch', () => {
    it('should update match result', () => {
      const { result } = renderHook(() => useMatches());

      act(() => {
        result.current.addMatch();
      });

      const matchId = result.current.matches[0].id;

      act(() => {
        result.current.updateMatch(matchId, 'result', 'defeat');
      });

      expect(result.current.matches[0].result).toBe('defeat');
    });

    it('should update opponent points', () => {
      const { result } = renderHook(() => useMatches());

      act(() => {
        result.current.addMatch();
      });

      const matchId = result.current.matches[0].id;

      act(() => {
        result.current.updateMatch(matchId, 'opponentPoints', '1200');
      });

      expect(result.current.matches[0].opponentPoints).toBe('1200');
    });

    it('should update competition to default when changing to interclub', () => {
      const { result } = renderHook(() => useMatches());

      act(() => {
        result.current.addMatch();
      });

      const matchId = result.current.matches[0].id;

      act(() => {
        result.current.updateMatch(matchId, 'competitionType', 'tournament');
      });

      act(() => {
        result.current.updateMatch(matchId, 'competitionType', 'interclub');
      });

      expect(result.current.matches[0].competitionType).toBe('interclub');
      expect(result.current.matches[0].competition).toBe('Autres provinciales');
    });

    it('should update competition to default when changing to tournament', () => {
      const { result } = renderHook(() => useMatches());

      act(() => {
        result.current.addMatch();
      });

      const matchId = result.current.matches[0].id;

      act(() => {
        result.current.updateMatch(matchId, 'competitionType', 'tournament');
      });

      expect(result.current.matches[0].competitionType).toBe('tournament');
      expect(result.current.matches[0].competition).toBe('Tournoi Série B & C');
    });

    it('should not update non-existent match', () => {
      const { result } = renderHook(() => useMatches());

      act(() => {
        result.current.addMatch();
      });

      act(() => {
        result.current.updateMatch(99999, 'result', 'defeat');
      });

      expect(result.current.matches[0].result).toBe('victory');
    });
  });

  describe('completeMatch', () => {
    it('should mark match as complete when opponent points are provided', () => {
      const { result } = renderHook(() => useMatches());

      act(() => {
        result.current.addMatch();
      });

      const matchId = result.current.matches[0].id;

      act(() => {
        result.current.updateMatch(matchId, 'opponentPoints', '1000');
      });

      act(() => {
        result.current.completeMatch(matchId);
      });

      expect(result.current.matches[0].isComplete).toBe(true);
      expect(result.current.editingId).toBeNull();
    });

    it('should not complete match without opponent points', () => {
      const { result } = renderHook(() => useMatches());

      act(() => {
        result.current.addMatch();
      });

      const matchId = result.current.matches[0].id;

      act(() => {
        result.current.completeMatch(matchId);
      });

      expect(result.current.matches[0].isComplete).toBe(false);
      expect(result.current.editingId).toBe(matchId);
    });
  });

  describe('editMatch', () => {
    it('should set match as editing', () => {
      const { result } = renderHook(() => useMatches());

      act(() => {
        result.current.addMatch();
      });

      const matchId = result.current.matches[0].id;

      act(() => {
        result.current.updateMatch(matchId, 'opponentPoints', '1000');
      });

      act(() => {
        result.current.completeMatch(matchId);
      });

      act(() => {
        result.current.editMatch(matchId);
      });

      expect(result.current.editingId).toBe(matchId);
    });
  });

  describe('cancelEdit', () => {
    it('should remove incomplete match on cancel', () => {
      const { result } = renderHook(() => useMatches());

      act(() => {
        result.current.addMatch();
      });

      const matchId = result.current.matches[0].id;

      act(() => {
        result.current.cancelEdit(matchId);
      });

      expect(result.current.matches).toHaveLength(0);
      expect(result.current.editingId).toBeNull();
    });

    it('should just clear editing state for completed match on cancel', () => {
      const { result } = renderHook(() => useMatches());

      act(() => {
        result.current.addMatch();
      });

      const matchId = result.current.matches[0].id;

      act(() => {
        result.current.updateMatch(matchId, 'opponentPoints', '1000');
      });

      act(() => {
        result.current.completeMatch(matchId);
      });

      act(() => {
        result.current.editMatch(matchId);
      });

      act(() => {
        result.current.cancelEdit(matchId);
      });

      expect(result.current.matches).toHaveLength(1);
      expect(result.current.editingId).toBeNull();
    });
  });

  describe('integration scenarios', () => {
    it('should handle complete workflow: add, edit, complete, edit again', () => {
      const { result } = renderHook(() => useMatches());

      // Add match
      act(() => {
        result.current.addMatch();
      });

      expect(result.current.matches).toHaveLength(1);

      // Edit match
      const matchId = result.current.matches[0].id;

      act(() => {
        result.current.updateMatch(matchId, 'result', 'defeat');
      });

      act(() => {
        result.current.updateMatch(matchId, 'opponentPoints', '1500');
      });

      act(() => {
        result.current.completeMatch(matchId);
      });

      expect(result.current.matches[0].isComplete).toBe(true);
      expect(result.current.matches[0].result).toBe('defeat');

      // Edit again
      act(() => {
        result.current.editMatch(matchId);
      });

      act(() => {
        result.current.updateMatch(matchId, 'opponentPoints', '1600');
      });

      act(() => {
        result.current.completeMatch(matchId);
      });

      expect(result.current.matches[0].opponentPoints).toBe('1600');
    });

    it('should handle multiple matches', () => {
      const { result } = renderHook(() => useMatches());

      act(() => {
        result.current.addMatch();
      });

      const firstMatchId = result.current.matches[0].id;

      act(() => {
        result.current.updateMatch(firstMatchId, 'opponentPoints', '1000');
      });

      act(() => {
        result.current.completeMatch(firstMatchId);
      });

      act(() => {
        result.current.addMatch();
      });

      const secondMatchId = result.current.matches[1].id;

      act(() => {
        result.current.updateMatch(secondMatchId, 'opponentPoints', '1200');
      });

      act(() => {
        result.current.completeMatch(secondMatchId);
      });

      act(() => {
        result.current.addMatch();
      });

      expect(result.current.matches).toHaveLength(3);
      expect(result.current.matches[0].isComplete).toBe(true);
      expect(result.current.matches[1].isComplete).toBe(true);
      expect(result.current.matches[2].isComplete).toBe(false);
      expect(result.current.editingId).toBe(result.current.matches[2].id);
    });
  });
});

