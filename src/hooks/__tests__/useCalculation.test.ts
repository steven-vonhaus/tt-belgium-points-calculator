import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useCalculation } from '../useCalculation';
import { mockMatches } from '../../test/mockData';
import type { Match } from '../../types/match';

describe('useCalculation', () => {
  describe('Basic calculation', () => {
    it('should return null when currentPoints is empty', () => {
      const { result } = renderHook(() => useCalculation('', mockMatches));

      expect(result.current).toBeNull();
    });

    it('should return null when matches array is empty', () => {
      const { result } = renderHook(() => useCalculation('1000', []));

      expect(result.current).toBeNull();
    });

    it('should calculate points for completed matches only', () => {
      const matches = [
        {
          id: 1,
          result: 'victory' as const,
          competitionType: 'interclub' as const,
          competition: 'Autres provinciales',
          opponentPoints: '950',
          isComplete: true,
        },
        {
          id: 2,
          result: 'victory' as const,
          competitionType: 'interclub' as const,
          competition: 'Autres provinciales',
          opponentPoints: '1050',
          isComplete: false, // Not complete
        },
      ];

      const { result } = renderHook(() => useCalculation('1000', matches));

      expect(result.current).not.toBeNull();
      expect(result.current?.results).toHaveLength(1);
    });

    it('should skip matches without opponent points', () => {
      const matches = [
        {
          id: 1,
          result: 'victory' as const,
          competitionType: 'interclub' as const,
          competition: 'Autres provinciales',
          opponentPoints: '',
          isComplete: true,
        },
      ];

      const { result } = renderHook(() => useCalculation('1000', matches));

      expect(result.current).toBeNull();
    });
  });

  describe('Point accumulation', () => {
    it('should calculate cumulative points correctly', () => {
      const matches = [
        {
          id: 1,
          result: 'victory' as const,
          competitionType: 'interclub' as const,
          competition: 'N1 & N2', // coef = 1
          opponentPoints: '950',
          isComplete: true,
        },
        {
          id: 2,
          result: 'victory' as const,
          competitionType: 'interclub' as const,
          competition: 'N1 & N2',
          opponentPoints: '950',
          isComplete: true,
        },
      ];

      const { result } = renderHook(() => useCalculation('1000', matches));

      expect(result.current).not.toBeNull();
      expect(result.current?.results).toHaveLength(2);

      // First match: 1000 pts, diff=50, expected=8
      expect(result.current?.results[0].pointsBefore).toBe(1000);
      expect(result.current?.results[0].pointsChange).toBe(8);
      expect(result.current?.results[0].pointsAfter).toBe(1008);

      // Second match: 1008 pts, diff=58, expected=7 (falls in 51-75 range)
      expect(result.current?.results[1].pointsBefore).toBe(1008);
      expect(result.current?.results[1].pointsChange).toBe(7);
      expect(result.current?.results[1].pointsAfter).toBe(1015);
    });

    it('should handle mixed victories and defeats', () => {
      const matches = [
        {
          id: 1,
          result: 'victory' as const,
          competitionType: 'interclub' as const,
          competition: 'N1 & N2',
          opponentPoints: '900',
          isComplete: true,
        },
        {
          id: 2,
          result: 'defeat' as const,
          competitionType: 'interclub' as const,
          competition: 'N1 & N2',
          opponentPoints: '1100',
          isComplete: true,
        },
      ];

      const { result } = renderHook(() => useCalculation('1000', matches));

      expect(result.current?.results[0].pointsChange).toBeGreaterThan(0);
      expect(result.current?.results[1].pointsChange).toBeLessThan(0);
    });
  });

  describe('Summary calculations', () => {
    it('should calculate correct start and end points', () => {
      const matches = [
        {
          id: 1,
          result: 'victory' as const,
          competitionType: 'interclub' as const,
          competition: 'N1 & N2',
          opponentPoints: '950',
          isComplete: true,
        },
      ];

      const { result } = renderHook(() => useCalculation('1000', matches));

      expect(result.current?.startPoints).toBe(1000);
      expect(result.current?.endPoints).toBeGreaterThan(1000);
    });

    it('should calculate correct total change', () => {
      const matches = [
        {
          id: 1,
          result: 'victory' as const,
          competitionType: 'interclub' as const,
          competition: 'N1 & N2',
          opponentPoints: '950',
          isComplete: true,
        },
      ];

      const { result } = renderHook(() => useCalculation('1000', matches));

      const totalChange = result.current!.endPoints - result.current!.startPoints;
      expect(result.current?.totalChange).toBe(totalChange);
    });

    it('should filter out matches without opponent points', () => {
      const matches = [
        {
          id: 1,
          result: 'victory' as const,
          competitionType: 'interclub' as const,
          competition: 'Autres provinciales',
          opponentPoints: '',
          isComplete: true,
        },
      ];

      const { result } = renderHook(() => useCalculation('1000', matches));

      // Should return null when no valid matches exist
      expect(result.current).toBeNull();
    });
  });

  describe('Memoization', () => {
    it('should return same reference when inputs do not change', () => {
      const matches = [
        {
          id: 1,
          result: 'victory' as const,
          competitionType: 'interclub' as const,
          competition: 'Autres provinciales',
          opponentPoints: '1000',
          isComplete: true,
        },
      ];

      const { result, rerender } = renderHook(
        ({ currentPoints, matches }) => useCalculation(currentPoints, matches),
        { initialProps: { currentPoints: '1000', matches } }
      );

      const firstResult = result.current;

      rerender({ currentPoints: '1000', matches });

      expect(result.current).toBe(firstResult);
    });

    it('should recalculate when currentPoints changes', () => {
      const matches = [
        {
          id: 1,
          result: 'victory' as const,
          competitionType: 'interclub' as const,
          competition: 'Autres provinciales',
          opponentPoints: '1000',
          isComplete: true,
        },
      ];

      const { result, rerender } = renderHook(
        ({ currentPoints, matches }) => useCalculation(currentPoints, matches),
        { initialProps: { currentPoints: '1000', matches } }
      );

      const firstResult = result.current;

      rerender({ currentPoints: '1100', matches });

      expect(result.current).not.toBe(firstResult);
      expect(result.current?.startPoints).toBe(1100);
    });

    it('should recalculate when matches change', () => {
      const initialMatches: Match[] = [
        {
          id: 1,
          result: 'victory' as const,
          competitionType: 'interclub' as const,
          competition: 'Autres provinciales',
          opponentPoints: '1000',
          isComplete: true,
        },
      ];

      const { result, rerender } = renderHook(
        ({ currentPoints, matches }) => useCalculation(currentPoints, matches),
        { initialProps: { currentPoints: '1000', matches: initialMatches } }
      );

      const firstResult = result.current;

      const newMatches: Match[] = [
        ...initialMatches,
        {
          id: 2,
          result: 'defeat' as const,
          competitionType: 'interclub' as const,
          competition: 'Autres provinciales',
          opponentPoints: '1200',
          isComplete: true,
        },
      ];

      rerender({ currentPoints: '1000', matches: newMatches });

      expect(result.current).not.toBe(firstResult);
      expect(result.current?.results).toHaveLength(2);
    });
  });

  describe('Edge cases', () => {
    it('should handle decimal current points', () => {
      const matches = [
        {
          id: 1,
          result: 'victory' as const,
          competitionType: 'interclub' as const,
          competition: 'Autres provinciales',
          opponentPoints: '1000',
          isComplete: true,
        },
      ];

      const { result } = renderHook(() => useCalculation('1000.5', matches));

      expect(result.current?.startPoints).toBe(1000.5);
    });

    it('should handle large number of matches', () => {
      const matches = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        result: (i % 2 === 0 ? 'victory' : 'defeat') as 'victory' | 'defeat',
        competitionType: 'interclub' as const,
        competition: 'Autres provinciales',
        opponentPoints: '1000',
        isComplete: true,
      }));

      const { result } = renderHook(() => useCalculation('1000', matches));

      expect(result.current?.results).toHaveLength(50);
    });
  });
});

