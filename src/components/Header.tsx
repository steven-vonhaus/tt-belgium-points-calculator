import React from 'react';
import { Calculator } from 'lucide-react';

interface HeaderProps {
  currentPoints: string;
  onCurrentPointsChange: (value: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentPoints, onCurrentPointsChange }) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-5 sm:p-8 mb-6">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2 flex flex-wrap items-center gap-3">
        <Calculator className="text-blue-600 shrink-0" size={32} />
        <span className="leading-snug">Calculateur de Points AFTT</span>
      </h1>
      <p className="text-gray-600 mb-5 text-sm sm:text-base">Saison 2025-2026</p>

      <div className="mb-4 sm:mb-6">
        <label htmlFor="current-points" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
          Points actuels
        </label>
        <input
          id="current-points"
          type="number"
          inputMode="numeric"
          pattern="[0-9]*"
          min="0"
          value={currentPoints}
          onChange={(e) => onCurrentPointsChange(e.target.value)}
          className="w-full px-3 py-2 sm:px-4 sm:py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 text-base sm:text-lg"
          placeholder="Ex: 450"
          aria-describedby="current-points-hint"
          autoComplete="off"
        />
        <p id="current-points-hint" className="sr-only">
          Entrez vos points de classement actuels
        </p>
      </div>
    </div>
  );
};
