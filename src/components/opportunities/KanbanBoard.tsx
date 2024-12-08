import React from 'react';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { PlacementOpportunity } from '../../types/opportunity';
import KanbanColumn from './KanbanColumn';

interface Props {
  opportunities: (PlacementOpportunity & { companyName: string })[];
  onViewOpportunity: (opportunity: PlacementOpportunity & { companyName: string }) => void;
}

const STATUSES: PlacementOpportunity['status'][] = ['Active', 'Pending', 'Completed', 'Cancelled'];

const KanbanBoard: React.FC<Props> = ({ opportunities, onViewOpportunity }) => {
  const getOpportunitiesByStatus = (status: PlacementOpportunity['status']) => {
    return opportunities.filter(opp => opp.status === status);
  };

  return (
    <div className="grid grid-cols-4 gap-6">
      {STATUSES.map(status => (
        <KanbanColumn
          key={status}
          status={status}
          opportunities={getOpportunitiesByStatus(status)}
          onViewOpportunity={onViewOpportunity}
        />
      ))}
    </div>
  );
};

export default KanbanBoard;