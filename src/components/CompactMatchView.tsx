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
    <div className="border border-gray-200 rounded-lg p-3 hover:border-blue-300 transition-colors bg-gray-50">
      <div className="flex items-center justify-between">
        <div className="flex-1 flex items-center gap-4 text-sm">
          <span
            className={`px-3 py-1 rounded-full font-semibold ${
              match.result === 'victory'
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}
          >
            {match.result === 'victory' ? 'Victoire' : 'Défaite'}
          </span>
          <span className="text-gray-600">vs {match.opponentPoints} pts</span>
          <span className="text-gray-500 text-xs">{match.competition}</span>
          {result && (
            <span
              className={`font-semibold ${
                result.pointsChange >= 0 ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {result.pointsChange >= 0 ? '+' : ''}{result.pointsChange.toFixed(2)}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onEdit}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            aria-label="Modifier le match"
          >
            <Edit2 size={18} />
          </button>
          <button
            onClick={onRemove}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            aria-label="Supprimer le match"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

