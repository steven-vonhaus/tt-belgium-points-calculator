import React from 'react';
import type { CalculationSummary } from '../types/match';

interface SummaryPanelProps {
  calculation: CalculationSummary;
}

export const SummaryPanel: React.FC<SummaryPanelProps> = ({ calculation }) => {
  return (
    <section
      className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl p-4 sm:p-6"
      aria-label="Résumé des points"
    >
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 text-center">
        <div className="py-2 sm:py-0" role="status" aria-label="Points de départ">
          <div className="text-xs sm:text-sm opacity-90 mb-1" id="start-points-label">Points de départ</div>
          <div className="text-2xl sm:text-3xl font-bold" aria-labelledby="start-points-label">{calculation.startPoints.toFixed(2)}</div>
        </div>
        <div className="py-2 sm:py-0 border-y sm:border-y-0 sm:border-x border-white/20" role="status" aria-label="Évolution">
          <div className="text-xs sm:text-sm opacity-90 mb-1" id="evolution-label">Évolution</div>
          <div
            className={`text-2xl sm:text-3xl font-bold ${
              calculation.totalChange >= 0 ? 'text-green-300' : 'text-red-300'
            }`}
            aria-labelledby="evolution-label"
          >
            {calculation.totalChange >= 0 ? '+' : ''}{calculation.totalChange.toFixed(2)}
          </div>
        </div>
        <div className="py-2 sm:py-0" role="status" aria-label="Points finaux">
          <div className="text-xs sm:text-sm opacity-90 mb-1" id="end-points-label">Points finaux</div>
          <div className="text-2xl sm:text-3xl font-bold" aria-labelledby="end-points-label">{calculation.endPoints.toFixed(2)}</div>
        </div>
      </div>
    </section>
  );
};
