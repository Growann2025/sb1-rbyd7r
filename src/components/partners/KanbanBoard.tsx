import React, { useState } from 'react';
import { DndContext, DragEndEvent, closestCenter } from '@dnd-kit/core';
import { Search, Filter, SlidersHorizontal, BarChart2 } from 'lucide-react';
import type { AffiliateAccount, AffiliateStage } from '../../types/affiliate';
import KanbanColumn from './KanbanColumn';
import AffiliateDetails from './AffiliateDetails';
import AnalyticsBar from './AnalyticsBar';
import FilterPanel from './FilterPanel';

const STAGES: AffiliateStage[] = ['Identified', 'Contacted', 'In Discussions', 'Signed Up'];

interface Props {
  affiliates: AffiliateAccount[];
  onUpdateAffiliate: (affiliate: AffiliateAccount) => void;
}

const KanbanBoard: React.FC<Props> = ({ affiliates, onUpdateAffiliate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedAffiliate, setSelectedAffiliate] = useState<AffiliateAccount | null>(null);
  const [filters, setFilters] = useState({
    niche: '',
    engagementStatus: '',
    minScore: 1,
    maxScore: 5
  });

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) return;
    
    const affiliateId = active.id as string;
    const newStage = over.id as AffiliateStage;
    
    const affiliate = affiliates.find(a => a.id === affiliateId);
    if (affiliate && affiliate.stage !== newStage) {
      onUpdateAffiliate({
        ...affiliate,
        stage: newStage,
        updatedAt: new Date().toISOString()
      });
    }
  };

  const filteredAffiliates = affiliates.filter(affiliate => {
    const matchesSearch = searchTerm === '' || 
      affiliate.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      affiliate.niche.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesNiche = !filters.niche || affiliate.niche === filters.niche;
    const matchesStatus = !filters.engagementStatus || affiliate.engagementStatus === filters.engagementStatus;
    const matchesScore = affiliate.affiliateScore >= filters.minScore && 
                        affiliate.affiliateScore <= filters.maxScore;
    
    return matchesSearch && matchesNiche && matchesStatus && matchesScore;
  });

  const getAffiliatesByStage = (stage: AffiliateStage) => {
    return filteredAffiliates.filter(a => a.stage === stage);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Affiliate Pipeline</h1>
        <div className="flex gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            <Filter className="w-4 h-4" />
            Filters
          </button>
        </div>
      </div>

      <AnalyticsBar affiliates={affiliates} />

      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search affiliates by name or niche..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {showFilters && (
        <FilterPanel
          filters={filters}
          onUpdateFilters={setFilters}
          onClose={() => setShowFilters(false)}
        />
      )}

      <DndContext
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-4 gap-6">
          {STAGES.map(stage => (
            <KanbanColumn
              key={stage}
              stage={stage}
              affiliates={getAffiliatesByStage(stage)}
              onViewAffiliate={setSelectedAffiliate}
              onUpdateAffiliate={onUpdateAffiliate}
            />
          ))}
        </div>
      </DndContext>

      {selectedAffiliate && (
        <AffiliateDetails
          affiliate={selectedAffiliate}
          onClose={() => setSelectedAffiliate(null)}
          onUpdate={onUpdateAffiliate}
        />
      )}
    </div>
  );
};

export default KanbanBoard;