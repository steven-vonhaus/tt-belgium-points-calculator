import React from 'react';

export const InfoPanel: React.FC = () => {
  return (
    <div className="mt-6 bg-blue-50 rounded-xl p-3 sm:p-4 text-xs sm:text-sm text-gray-700 leading-relaxed">
      <p className="font-semibold mb-2">ℹ️ Information:</p>
      <p>
        Ce calculateur utilise le système de classement numérique AFTT pour la saison 2025-2026.
        Les points sont calculés en fonction de la différence de points avec l'adversaire, du type
        de compétition et du coefficient associé.
      </p>
    </div>
  );
};
