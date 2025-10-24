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
    <div className="border-2 border-blue-300 rounded-xl p-4 sm:p-5 bg-blue-50" role="form" aria-label="Édition du match">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 md:gap-4 mb-3">
        <div>
          <label
            htmlFor={`match-result-${match.id}`}
            className="block text-[10px] sm:text-xs font-semibold text-gray-600 mb-1 tracking-wide"
          >
            Résultat
          </label>
          <select
            id={`match-result-${match.id}`}
            value={match.result}
            onChange={(e) => onUpdate('result', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 bg-white text-sm"
            aria-label="Résultat du match"
          >
            <option value="victory">Victoire</option>
            <option value="defeat">Défaite</option>
          </select>
        </div>

        <div>
          <label
            htmlFor={`match-type-${match.id}`}
            className="block text-[10px] sm:text-xs font-semibold text-gray-600 mb-1 tracking-wide"
          >
            Type
          </label>
          <select
            id={`match-type-${match.id}`}
            value={match.competitionType}
            onChange={(e) => onUpdate('competitionType', e.target.value as CompetitionType)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 bg-white text-sm"
            aria-label="Type de compétition"
          >
            <option value="interclub">Interclub</option>
            <option value="tournament">Tournoi</option>
          </select>
        </div>

        <div>
          <label
            htmlFor={`match-competition-${match.id}`}
            className="block text-[10px] sm:text-xs font-semibold text-gray-600 mb-1 tracking-wide"
          >
            Compétition
          </label>
          <select
            id={`match-competition-${match.id}`}
            value={match.competition}
            onChange={(e) => onUpdate('competition', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 bg-white text-xs sm:text-sm"
            aria-label="Nom de la compétition"
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
            className="block text-[10px] sm:text-xs font-semibold text-gray-600 mb-1 tracking-wide"
          >
            Points adversaire
          </label>
          <input
            id={`match-opponent-${match.id}`}
            type="number"
            inputMode="numeric"
            pattern="[0-9]*"
            min="0"
            value={match.opponentPoints}
            onChange={(e) => onUpdate('opponentPoints', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 bg-white text-sm"
            placeholder="Ex: 500"
            aria-label="Points de l'adversaire"
            autoComplete="off"
            required
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-end gap-2">
        <button
          onClick={onCancel}
          className="flex items-center justify-center gap-1 px-3 py-1.5 text-gray-600 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 rounded-lg transition-colors text-sm"
          aria-label="Annuler la modification"
          type="button"
        >
          <X size={16} aria-hidden="true" />
          Annuler
        </button>
        <button
          onClick={onComplete}
          disabled={!match.opponentPoints}
          className="flex items-center justify-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-60 text-sm"
          aria-label="Valider le match"
          type="button"
        >
          <Check size={16} aria-hidden="true" />
          Valider
        </button>
      </div>
    </div>
  );
};
