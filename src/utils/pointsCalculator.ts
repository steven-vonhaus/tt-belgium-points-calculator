import type { Match } from '../types/match';
import { COEFFICIENTS } from '../constants/competitions';

interface PointRange {
  max: number;
  expected: number;
  unexpected: number;
}

const POINT_RANGES: PointRange[] = [
  { max: 25, expected: 9, unexpected: 10 },
  { max: 50, expected: 8, unexpected: 12 },
  { max: 75, expected: 7, unexpected: 14 },
  { max: 100, expected: 6, unexpected: 16 },
  { max: 150, expected: 5, unexpected: 18 },
  { max: 200, expected: 4, unexpected: 20 },
  { max: 250, expected: 3, unexpected: 24 },
  { max: 300, expected: 2, unexpected: 28 },
  { max: 400, expected: 1, unexpected: 32 },
  { max: Infinity, expected: 0, unexpected: 40 },
];

const DEFEAT_FACTOR_INTERCLUB = 0.8;
const DEFEAT_FACTOR_TOURNAMENT = 0.5;

function getPointsFromRange(pointDiff: number): { expected: number; unexpected: number } {
  const range = POINT_RANGES.find(r => pointDiff <= r.max);
  return {
    expected: range?.expected ?? 0,
    unexpected: range?.unexpected ?? 40,
  };
}

function calculateBasePoints(
  pointDiff: number,
  isVictory: boolean,
  isFavorite: boolean,
  isInterclub: boolean
): number {
  const { expected, unexpected } = getPointsFromRange(pointDiff);
  const defeatFactor = isInterclub ? DEFEAT_FACTOR_INTERCLUB : DEFEAT_FACTOR_TOURNAMENT;

  if (isVictory) {
    return isFavorite ? expected : unexpected;
  }

  return (isFavorite ? unexpected : expected) * defeatFactor;
}

export function calculatePointsForMatch(match: Match, currentPoints: number): number {
  const opponentPoints = parseFloat(match.opponentPoints);
  const pointDiff = Math.abs(currentPoints - opponentPoints);
  const isVictory = match.result === 'victory';
  const isInterclub = match.competitionType === 'interclub';
  const isFavorite = currentPoints > opponentPoints;

  const basePoints = calculateBasePoints(pointDiff, isVictory, isFavorite, isInterclub);
  const competitionConfig = COEFFICIENTS[match.competitionType][match.competition];
  const finalPoints = basePoints * competitionConfig.coef;

  return isVictory ? finalPoints : -finalPoints;
}

