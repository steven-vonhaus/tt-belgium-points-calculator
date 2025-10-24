import React from 'react';
import type { CalculationSummary } from '../types/match';

interface SummaryPanelProps {
  calculation: CalculationSummary;
}

export const SummaryPanel: React.FC<SummaryPanelProps> = ({ calculation }) => {
  return (
    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl p-6">
      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="text-sm opacity-90 mb-1">Points de départ</div>
          <div className="text-3xl font-bold">{calculation.startPoints.toFixed(2)}</div>
        </div>
        <div>
          <div className="text-sm opacity-90 mb-1">Évolution</div>
          <div
            className={`text-3xl font-bold ${
              calculation.totalChange >= 0 ? 'text-green-300' : 'text-red-300'
            }`}
          >
            {calculation.totalChange >= 0 ? '+' : ''}{calculation.totalChange.toFixed(2)}
          </div>
        </div>
        <div>
          <div className="text-sm opacity-90 mb-1">Points finaux</div>
          <div className="text-3xl font-bold">{calculation.endPoints.toFixed(2)}</div>
        </div>
      </div>
    </div>
  );
};

