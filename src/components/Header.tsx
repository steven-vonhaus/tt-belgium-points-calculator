import React from 'react';
import { Calculator } from 'lucide-react';

interface HeaderProps {
  currentPoints: string;
  onCurrentPointsChange: (value: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentPoints, onCurrentPointsChange }) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-3">
        <Calculator className="text-blue-600" size={32} />
        Calculateur de Classement Tennis de Table
      </h1>
      <p className="text-gray-600 mb-6">Saison 2025-2026 - Règlement AFTT</p>

      <div className="mb-6">
        <label htmlFor="current-points" className="block text-sm font-semibold text-gray-700 mb-2">
          Points actuels
        </label>
        <input
          id="current-points"
          type="number"
          value={currentPoints}
          onChange={(e) => onCurrentPointsChange(e.target.value)}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-lg"
          placeholder="Ex: 450"
        />
      </div>
    </div>
  );
};

