import React from 'react';
import { Plus } from 'lucide-react';
import type { Match, CalculationSummary } from '../types/match';
import { MatchItem } from './MatchItem';

interface MatchListProps {
  matches: Match[];
  calculation: CalculationSummary | null;
  editingId: number | null;
  onAddMatch: () => void;
  onEditMatch: (id: number) => void;
  onRemoveMatch: (id: number) => void;
  onUpdateMatch: (id: number, field: keyof Match, value: any) => void;
  onCompleteMatch: (id: number) => void;
  onCancelEdit: (id: number) => void;
}

export const MatchList: React.FC<MatchListProps> = ({
  matches,
  calculation,
  editingId,
  onAddMatch,
  onEditMatch,
  onRemoveMatch,
  onUpdateMatch,
  onCompleteMatch,
  onCancelEdit,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-5 sm:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-0 justify-between mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Matchs</h2>
        <button
          onClick={onAddMatch}
          className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-3 sm:py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors w-full sm:w-auto text-sm sm:text-base"
          aria-label="Ajouter un match"
          type="button"
        >
          <Plus size={20} aria-hidden="true" />
          <span>Ajouter un match</span>
        </button>
      </div>

      {matches.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p className="text-base sm:text-lg">Aucun match ajouté</p>
          <p className="text-xs sm:text-sm mt-2">Cliquez sur "Ajouter un match" pour commencer</p>
        </div>
      ) : (
        <ul className="space-y-3" role="list" aria-label="Liste des matchs">
          {matches.map((match) => (
            <li key={match.id}>
              <MatchItem
                match={match}
                calculation={calculation}
                isEditing={editingId === match.id}
                onEdit={() => onEditMatch(match.id)}
                onRemove={() => onRemoveMatch(match.id)}
                onUpdate={(field, value) => onUpdateMatch(match.id, field, value)}
                onComplete={() => onCompleteMatch(match.id)}
                onCancel={() => onCancelEdit(match.id)}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
