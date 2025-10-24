import React from 'react';
import type { Match, CalculationSummary } from '../types/match';
import { CompactMatchView } from './CompactMatchView';
import { MatchEditor } from './MatchEditor';

interface MatchItemProps {
  match: Match;
  calculation: CalculationSummary | null;
  isEditing: boolean;
  onEdit: () => void;
  onRemove: () => void;
  onUpdate: (field: keyof Match, value: any) => void;
  onComplete: () => void;
  onCancel: () => void;
}

export const MatchItem: React.FC<MatchItemProps> = ({
  match,
  calculation,
  isEditing,
  onEdit,
  onRemove,
  onUpdate,
  onComplete,
  onCancel,
}) => {
  const result = calculation?.results.find(r => r.id === match.id);

  if (!isEditing && match.isComplete) {
    return (
      <CompactMatchView
        match={match}
        result={result}
        onEdit={onEdit}
        onRemove={onRemove}
      />
    );
  }

  return (
    <MatchEditor
      match={match}
      onUpdate={onUpdate}
      onComplete={onComplete}
      onCancel={onCancel}
    />
  );
};

