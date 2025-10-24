import React, { useState } from 'react';
import { Header } from './components/Header';
import { SummaryPanel } from './components/SummaryPanel';
import { MatchList } from './components/MatchList';
import { InfoPanel } from './components/InfoPanel';
import { useMatches } from './hooks/useMatches';
import { useCalculation } from './hooks/useCalculation';

const TableTennisRankingCalculator: React.FC = () => {
  const [currentPoints, setCurrentPoints] = useState('');

  const {
    matches,
    editingId,
    addMatch,
    removeMatch,
    updateMatch,
    completeMatch,
    editMatch,
    cancelEdit,
  } = useMatches();

  const calculation = useCalculation(currentPoints, matches);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-5xl mx-auto">
        <Header currentPoints={currentPoints} onCurrentPointsChange={setCurrentPoints} />

        {calculation && <SummaryPanel calculation={calculation} />}

        <MatchList
          matches={matches}
          calculation={calculation}
          editingId={editingId}
          onAddMatch={addMatch}
          onEditMatch={editMatch}
          onRemoveMatch={removeMatch}
          onUpdateMatch={updateMatch}
          onCompleteMatch={completeMatch}
          onCancelEdit={cancelEdit}
        />

        <InfoPanel />
      </div>
    </div>
  );
};

export default TableTennisRankingCalculator;



