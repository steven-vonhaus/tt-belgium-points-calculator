import { describe, it, expect } from 'vitest';
import { calculatePointsForMatch } from '../pointsCalculator';
import type { Match } from '../../types/match';

describe('pointsCalculator', () => {
  describe('calculatePointsForMatch', () => {
    describe('Victory scenarios', () => {
      it('should calculate points for expected victory (favorite wins)', () => {
        const match: Match = {
          id: 1,
          result: 'victory',
          competitionType: 'interclub',
          competition: 'Autres provinciales',
          opponentPoints: '950',
          isComplete: true,
        };
        const currentPoints = 1000;

        const points = calculatePointsForMatch(match, currentPoints);

        // Point diff = 50, expected = 8, coef = 0.85
        expect(points).toBeCloseTo(6.8, 2);
      });

      it('should calculate points for unexpected victory (underdog wins)', () => {
        const match: Match = {
          id: 1,
          result: 'victory',
          competitionType: 'interclub',
          competition: 'Autres provinciales',
          opponentPoints: '1220',
          isComplete: true,
        };
        const currentPoints = 1004;

        const points = calculatePointsForMatch(match, currentPoints);

        // Point diff = 216, unexpected = 24, coef = 0.85
        expect(points).toBeCloseTo(20.4, 2);
      });

      it('should apply correct coefficient for tournament', () => {
        const match: Match = {
          id: 1,
          result: 'victory',
          competitionType: 'tournament',
          competition: 'Tournoi Série B & C',
          opponentPoints: '1250',
          isComplete: true,
        };
        const currentPoints = 1000;

        const points = calculatePointsForMatch(match, currentPoints);

        // Point diff = 250, unexpected = 24, coef = 1.0
        expect(points).toBeCloseTo(24, 2);
      });

      it('should handle large point differences (>400)', () => {
        const match: Match = {
          id: 1,
          result: 'victory',
          competitionType: 'interclub',
          competition: 'Autres provinciales',
          opponentPoints: '1500',
          isComplete: true,
        };
        const currentPoints = 1000;

        const points = calculatePointsForMatch(match, currentPoints);

        // Point diff = 500, unexpected = 40, coef = 0.85
        expect(points).toBeCloseTo(34, 2);
      });
    });

    describe('Defeat scenarios', () => {
      it('should calculate negative points for expected defeat (underdog loses)', () => {
        const match: Match = {
          id: 1,
          result: 'defeat',
          competitionType: 'interclub',
          competition: 'Autres provinciales',
          opponentPoints: '1200',
          isComplete: true,
        };
        const currentPoints = 1000;

        const points = calculatePointsForMatch(match, currentPoints);

        // Point diff = 200, expected = 4, defeatFactor = 0.8, coef = 0.85
        expect(points).toBeCloseTo(-2.72, 2);
      });

      it('should calculate negative points for unexpected defeat (favorite loses)', () => {
        const match: Match = {
          id: 1,
          result: 'defeat',
          competitionType: 'interclub',
          competition: 'Autres provinciales',
          opponentPoints: '800',
          isComplete: true,
        };
        const currentPoints = 1000;

        const points = calculatePointsForMatch(match, currentPoints);

        // Point diff = 200, unexpected = 20, defeatFactor = 0.8, coef = 0.85
        expect(points).toBeCloseTo(-13.6, 2);
      });

      it('should apply tournament defeat factor (0.5)', () => {
        const match: Match = {
          id: 1,
          result: 'defeat',
          competitionType: 'tournament',
          competition: 'Tournoi Série B & C',
          opponentPoints: '1100',
          isComplete: true,
        };
        const currentPoints = 1000;

        const points = calculatePointsForMatch(match, currentPoints);

        // Point diff = 100, expected = 6, defeatFactor = 0.5, coef = 1.0
        expect(points).toBeCloseTo(-3, 2);
      });
    });

    describe('Point difference ranges', () => {
      const testCases = [
        { diff: 10, expected: 9, unexpected: 10, label: '≤25' },
        { diff: 40, expected: 8, unexpected: 12, label: '≤50' },
        { diff: 60, expected: 7, unexpected: 14, label: '≤75' },
        { diff: 90, expected: 6, unexpected: 16, label: '≤100' },
        { diff: 130, expected: 5, unexpected: 18, label: '≤150' },
        { diff: 180, expected: 4, unexpected: 20, label: '≤200' },
        { diff: 230, expected: 3, unexpected: 24, label: '≤250' },
        { diff: 280, expected: 2, unexpected: 28, label: '≤300' },
        { diff: 350, expected: 1, unexpected: 32, label: '≤400' },
        { diff: 500, expected: 0, unexpected: 40, label: '>400' },
      ];

      testCases.forEach(({ diff, expected, unexpected, label }) => {
        it(`should use correct base points for difference ${label}`, () => {
          const matchFavorite: Match = {
            id: 1,
            result: 'victory',
            competitionType: 'interclub',
            competition: 'N1 & N2', // coef = 1
            opponentPoints: (1000 - diff).toString(),
            isComplete: true,
          };
          const matchUnderdog: Match = {
            id: 2,
            result: 'victory',
            competitionType: 'interclub',
            competition: 'N1 & N2',
            opponentPoints: (1000 + diff).toString(),
            isComplete: true,
          };

          const pointsFavorite = calculatePointsForMatch(matchFavorite, 1000);
          const pointsUnderdog = calculatePointsForMatch(matchUnderdog, 1000);

          expect(pointsFavorite).toBe(expected);
          expect(pointsUnderdog).toBe(unexpected);
        });
      });
    });

    describe('Competition coefficients', () => {
      it('should apply Super Division coefficient (2.2)', () => {
        const match: Match = {
          id: 1,
          result: 'victory',
          competitionType: 'interclub',
          competition: 'Super Division',
          opponentPoints: '950',
          isComplete: true,
        };

        const points = calculatePointsForMatch(match, 1000);

        // Point diff = 50, expected = 8, coef = 2.2
        expect(points).toBeCloseTo(17.6, 2);
      });

      it('should apply P1 coefficient (0.9)', () => {
        const match: Match = {
          id: 1,
          result: 'victory',
          competitionType: 'interclub',
          competition: 'P1',
          opponentPoints: '950',
          isComplete: true,
        };

        const points = calculatePointsForMatch(match, 1000);

        // Point diff = 50, expected = 8, coef = 0.9
        expect(points).toBeCloseTo(7.2, 2);
      });

      it('should apply tournament coefficient (1.5)', () => {
        const match: Match = {
          id: 1,
          result: 'victory',
          competitionType: 'tournament',
          competition: 'Tournoi Série A',
          opponentPoints: '950',
          isComplete: true,
        };

        const points = calculatePointsForMatch(match, 1000);

        // Point diff = 50, expected = 8, coef = 1.5
        expect(points).toBeCloseTo(12, 2);
      });
    });

    describe('Edge cases', () => {
      it('should handle exact same points', () => {
        const match: Match = {
          id: 1,
          result: 'victory',
          competitionType: 'interclub',
          competition: 'Autres provinciales',
          opponentPoints: '1000',
          isComplete: true,
        };

        const points = calculatePointsForMatch(match, 1000);

        // Point diff = 0, unexpected = 10, coef = 0.85 (not favorite when equal)
        expect(points).toBeCloseTo(8.5, 2);
      });

      it('should handle decimal current points', () => {
        const match: Match = {
          id: 1,
          result: 'victory',
          competitionType: 'interclub',
          competition: 'Autres provinciales',
          opponentPoints: '1000.5',
          isComplete: true,
        };

        const points = calculatePointsForMatch(match, 1050.5);

        // Point diff = 50, expected = 8, coef = 0.85
        expect(points).toBeCloseTo(6.8, 2);
      });

      it('should handle NaN point difference (invalid opponent points)', () => {
        const match: Match = {
          id: 1,
          result: 'victory',
          competitionType: 'interclub',
          competition: 'Autres provinciales',
          opponentPoints: 'invalid',
          isComplete: true,
        };

        const points = calculatePointsForMatch(match, 1000);

        // When opponent points is invalid, pointDiff becomes NaN
        // NaN <= any number is false, so no range is found, fallback to 0 expected, 40 unexpected
        // But NaN comparisons always return false, so this tests the fallback
        expect(isNaN(points)).toBe(false); // Should still return a valid number
      });
    });
  });
});

