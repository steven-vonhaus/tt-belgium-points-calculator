export type CompetitionType = 'interclub' | 'tournament';
export type MatchResult = 'victory' | 'defeat';

export interface Match {
  id: number;
  result: MatchResult;
  competitionType: CompetitionType;
  competition: string;
  opponentPoints: string;
  isComplete: boolean;
}

export interface MatchCalculationResult extends Match {
  pointsBefore: number;
  pointsChange: number;
  pointsAfter: number;
}

export interface CalculationSummary {
  startPoints: number;
  endPoints: number;
  totalChange: number;
  results: MatchCalculationResult[];
}

