import React from 'react';
import { Check, X } from 'lucide-react';
import type { Match, CompetitionType } from '../types/match';
import { COEFFICIENTS } from '../constants/competitions';

interface MatchEditorProps {
  match: Match;
  onUpdate: (field: keyof Match, value: any) => void;
  onComplete: () => void;
  onCancel: () => void;
}

export const MatchEditor: React.FC<MatchEditorProps> = ({
  match,
  onUpdate,
  onComplete,
  onCancel,
}) => {
  return (
    <div className="border-2 border-blue-300 rounded-xl p-4 bg-blue-50">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3">
        <div>
          <label
            htmlFor={`match-result-${match.id}`}
            className="block text-xs font-semibold text-gray-600 mb-1"
          >
            Résultat
          </label>
          <select
            id={`match-result-${match.id}`}
            value={match.result}
            onChange={(e) => onUpdate('result', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 bg-white"
          >
            <option value="victory">Victoire</option>
            <option value="defeat">Défaite</option>
          </select>
        </div>

        <div>
          <label
            htmlFor={`match-type-${match.id}`}
            className="block text-xs font-semibold text-gray-600 mb-1"
          >
            Type
          </label>
          <select
            id={`match-type-${match.id}`}
            value={match.competitionType}
            onChange={(e) => onUpdate('competitionType', e.target.value as CompetitionType)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 bg-white"
          >
            <option value="interclub">Interclub</option>
            <option value="tournament">Tournoi</option>
          </select>
        </div>

        <div>
          <label
            htmlFor={`match-competition-${match.id}`}
            className="block text-xs font-semibold text-gray-600 mb-1"
          >
            Compétition
          </label>
          <select
            id={`match-competition-${match.id}`}
            value={match.competition}
            onChange={(e) => onUpdate('competition', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 bg-white text-sm"
          >
            {Object.keys(COEFFICIENTS[match.competitionType]).map((comp) => (
              <option key={comp} value={comp}>
                {comp}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor={`match-opponent-${match.id}`}
            className="block text-xs font-semibold text-gray-600 mb-1"
          >
            Points adversaire
          </label>
          <input
            id={`match-opponent-${match.id}`}
            type="number"
            value={match.opponentPoints}
            onChange={(e) => onUpdate('opponentPoints', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 bg-white"
            placeholder="Ex: 500"
          />
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <button
          onClick={onCancel}
          className="flex items-center gap-1 px-3 py-1.5 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
          aria-label="Annuler"
        >
          <X size={16} />
          Annuler
        </button>
        <button
          onClick={onComplete}
          disabled={!match.opponentPoints}
          className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          aria-label="Valider le match"
        >
          <Check size={16} />
          Valider
        </button>
      </div>
    </div>
  );
};

