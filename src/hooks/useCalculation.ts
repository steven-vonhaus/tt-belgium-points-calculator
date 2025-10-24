import { useMemo } from 'react';
import type { Match, CalculationSummary } from '../types/match';
import { calculatePointsForMatch } from '../utils/pointsCalculator';

export function useCalculation(currentPoints: string, matches: Match[]): CalculationSummary | null {
  return useMemo(() => {
    if (!currentPoints || matches.length === 0) return null;

    const startPoints = parseFloat(currentPoints);
    let runningPoints = startPoints;

    const results = matches
      .filter(m => m.isComplete && m.opponentPoints)
      .map(match => {
        const pointsChange = calculatePointsForMatch(match, runningPoints);
        const pointsBefore = runningPoints;
        runningPoints += pointsChange;

        return {
          ...match,
          pointsBefore,
          pointsChange,
          pointsAfter: runningPoints,
        };
      });

    // Return null if no valid matches
    if (results.length === 0) return null;

    return {
      startPoints,
      endPoints: runningPoints,
      totalChange: runningPoints - startPoints,
      results,
    };
  }, [currentPoints, matches]);
}

