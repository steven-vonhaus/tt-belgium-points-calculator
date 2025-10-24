import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import type { Match, MatchCalculationResult } from '../types/match';

interface CompactMatchViewProps {
  match: Match;
  result?: MatchCalculationResult;
  onEdit: () => void;
  onRemove: () => void;
}

export const CompactMatchView: React.FC<CompactMatchViewProps> = ({
  match,
  result,
  onEdit,
  onRemove,
}) => {
  return (
    <div className="border border-gray-200 rounded-lg p-3 sm:p-4 hover:border-blue-300 transition-colors bg-gray-50" role="article" aria-label="Match completé">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        {/* Main content area */}
        <div className="flex-1 flex flex-col gap-2">
          {/* Result badge, opponent points, and points change */}
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`px-3 py-1 rounded-full font-semibold text-xs sm:text-sm whitespace-nowrap ${
                match.result === 'victory'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700'
              }`}
            >
              {match.result === 'victory' ? 'Victoire' : 'Défaite'}
            </span>
            <span className="text-gray-600 text-sm sm:text-base whitespace-nowrap font-medium">
              vs {match.opponentPoints} pts
            </span>
            {result && (
              <span
                className={`font-bold text-sm sm:text-base whitespace-nowrap ${
                  result.pointsChange >= 0 ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {result.pointsChange >= 0 ? '+' : ''}{result.pointsChange.toFixed(2)}
              </span>
            )}
          </div>

          {/* Competition name */}
          <div className="text-gray-500 text-xs sm:text-sm">
            {match.competition}
          </div>
        </div>

        {/* Action buttons - mobile: full width with labels, desktop: compact icons */}
        <div className="flex gap-2 pt-3 border-t border-gray-200 sm:border-t-0 sm:pt-0">
          <button
            onClick={onEdit}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 sm:p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 sm:bg-transparent sm:hover:bg-blue-50 rounded-lg transition-colors font-medium sm:font-normal text-sm"
            aria-label="Modifier le match"
            type="button"
          >
            <Edit2 size={16} className="sm:w-[18px] sm:h-[18px]" aria-hidden="true" />
            <span className="sm:hidden">Modifier</span>
          </button>
          <button
            onClick={onRemove}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 sm:p-2 text-red-600 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 sm:bg-transparent sm:hover:bg-red-50 rounded-lg transition-colors font-medium sm:font-normal text-sm"
            aria-label="Supprimer le match"
            type="button"
          >
            <Trash2 size={16} className="sm:w-[18px] sm:h-[18px]" aria-hidden="true" />
            <span className="sm:hidden">Supprimer</span>
          </button>
        </div>
      </div>
    </div>
  );
};
