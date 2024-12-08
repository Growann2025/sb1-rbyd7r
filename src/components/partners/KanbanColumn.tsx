import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { AffiliateAccount, AffiliateStage } from '../../types/affiliate';
import AffiliateCard from './AffiliateCard';

interface Props {
  stage: AffiliateStage;
  affiliates: AffiliateAccount[];
  onViewAffiliate: (affiliate: AffiliateAccount) => void;
  onUpdateAffiliate: (affiliate: AffiliateAccount) => void;
}

const stageConfig = {
  'Identified': { color: 'bg-purple-50 border-purple-200' },
  'Contacted': { color: 'bg-blue-50 border-blue-200' },
  'In Discussions': { color: 'bg-yellow-50 border-yellow-200' },
  'Signed Up': { color: 'bg-green-50 border-green-200' }
};

const KanbanColumn: React.FC<Props> = ({ 
  stage, 
  affiliates, 
  onViewAffiliate,
  onUpdateAffiliate 
}) => {
  const { setNodeRef } = useDroppable({ id: stage });

  return (
    <div
      ref={setNodeRef}
      className={`${stageConfig[stage].color} rounded-lg border p-4 min-h-[calc(100vh-16rem)]`}
    >
      <h3 className="font-semibold mb-4 flex items-center justify-between">
        <span>{stage}</span>
        <span className="text-sm bg-white px-2 py-1 rounded">
          {affiliates.length}
        </span>
      </h3>

      <SortableContext
        items={affiliates.map(a => a.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-3">
          {affiliates.map(affiliate => (
            <AffiliateCard
              key={affiliate.id}
              affiliate={affiliate}
              onView={onViewAffiliate}
              onUpdate={onUpdateAffiliate}
            />
          ))}
        </div>
      </SortableContext>
    </div>
  );
};

export default KanbanColumn;