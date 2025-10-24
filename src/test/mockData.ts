import type { Match } from '../types/match';

export const createMockMatch = (overrides: Partial<Match> = {}): Match => ({
  id: Date.now(),
  result: 'victory',
  competitionType: 'interclub',
  competition: 'Autres provinciales',
  opponentPoints: '1000',
  isComplete: false,
  ...overrides,
});

export const createCompletedMatch = (overrides: Partial<Match> = {}): Match => ({
  ...createMockMatch(overrides),
  isComplete: true,
});

export const mockMatches: Match[] = [
  {
    id: 1,
    result: 'victory',
    competitionType: 'interclub',
    competition: 'Autres provinciales',
    opponentPoints: '1000',
    isComplete: true,
  },
  {
    id: 2,
    result: 'defeat',
    competitionType: 'tournament',
    competition: 'Tournoi Série B & C',
    opponentPoints: '1200',
    isComplete: true,
  },
];

