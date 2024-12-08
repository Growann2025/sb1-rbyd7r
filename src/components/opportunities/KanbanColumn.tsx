import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { PlacementOpportunity } from '../../types/opportunity';
import OpportunityCard from './OpportunityCard';

interface Props {
  status: PlacementOpportunity['status'];
  opportunities: (PlacementOpportunity & { companyName: string })[];
  onViewOpportunity: (opportunity: PlacementOpportunity & { companyName: string }) => void;
}

const statusConfig = {
  'Active': { color: 'bg-green-50 border-green-200', title: 'Active' },
  'Pending': { color: 'bg-yellow-50 border-yellow-200', title: 'Pending' },
  'Completed': { color: 'bg-blue-50 border-blue-200', title: 'Completed' },
  'Cancelled': { color: 'bg-red-50 border-red-200', title: 'Cancelled' }
};

const KanbanColumn: React.FC<Props> = ({ status, opportunities, onViewOpportunity }) => {
  const { setNodeRef } = useDroppable({
    id: status
  });

  return (
    <div
      ref={setNodeRef}
      className={`${statusConfig[status].color} rounded-lg border p-4 min-h-[calc(100vh-16rem)]`}
    >
      <h3 className="font-semibold mb-4 flex items-center justify-between">
        <span>{statusConfig[status].title}</span>
        <span className="text-sm bg-white px-2 py-1 rounded">
          {opportunities.length}
        </span>
      </h3>

      <SortableContext
        items={opportunities.map(opp => opp.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-3">
          {opportunities.map(opportunity => (
            <OpportunityCard
              key={opportunity.id}
              opportunity={opportunity}
              onView={onViewOpportunity}
            />
          ))}
        </div>
      </SortableContext>
    </div>
  );
};

export default KanbanColumn;