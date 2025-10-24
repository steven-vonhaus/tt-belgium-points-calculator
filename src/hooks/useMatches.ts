import { useState, useCallback } from 'react';
import type { Match } from '../types/match';
import { DEFAULT_COMPETITION, DEFAULT_COMPETITION_TYPE, DEFAULT_TOURNAMENT_COMPETITION } from '../constants/competitions';

export function useMatches() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [nextId, setNextId] = useState(1);

  const addMatch = useCallback(() => {
    setMatches(prev => {
      const previousMatch = prev[prev.length - 1];
      const competitionType = previousMatch?.competitionType ?? DEFAULT_COMPETITION_TYPE;
      const competition = previousMatch?.competition ?? DEFAULT_COMPETITION;

      const newMatch: Match = {
        id: nextId,
        result: 'victory',
        competitionType,
        competition,
        opponentPoints: '',
        isComplete: false,
      };

      setNextId(nextId + 1);
      setEditingId(newMatch.id);
      return [...prev, newMatch];
    });
  }, [nextId]);

  const removeMatch = useCallback((id: number) => {
    // Preserve editingId before state updates
    setEditingId(prev => prev === id ? null : prev);
    setMatches(prev => prev.filter(m => m.id !== id));
  }, []);

  const updateMatch = useCallback((id: number, field: keyof Match, value: any) => {
    setMatches(prev => prev.map(match => {
      if (match.id !== id) return match;

      const updated = { ...match, [field]: value };

      // Auto-update competition when type changes
      if (field === 'competitionType') {
        updated.competition = value === 'interclub'
          ? DEFAULT_COMPETITION
          : DEFAULT_TOURNAMENT_COMPETITION;
      }

      return updated;
    }));
  }, []);

  const completeMatch = useCallback((id: number) => {
    setMatches(prev => {
      const match = prev.find(m => m.id === id);
      if (!match?.opponentPoints) return prev;

      setEditingId(null);
      return prev.map(m => m.id === id ? { ...m, isComplete: true } : m);
    });
  }, []);

  const editMatch = useCallback((id: number) => {
    setEditingId(id);
  }, []);

  const cancelEdit = useCallback((id: number) => {
    setMatches(prev => {
      const match = prev.find(m => m.id === id);
      if (match && !match.isComplete) {
        setEditingId(null);
        return prev.filter(m => m.id !== id);
      }
      setEditingId(null);
      return prev;
    });
  }, []);

  return {
    matches,
    editingId,
    addMatch,
    removeMatch,
    updateMatch,
    completeMatch,
    editMatch,
    cancelEdit,
  };
}

