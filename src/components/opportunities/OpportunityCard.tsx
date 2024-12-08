import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Building2, Users, DollarSign, ChevronRight } from 'lucide-react';
import type { PlacementOpportunity } from '../../types/opportunity';

interface Props {
  opportunity: PlacementOpportunity & { companyName: string };
  onView: (opportunity: PlacementOpportunity & { companyName: string }) => void;
}

const OpportunityCard: React.FC<Props> = ({ opportunity, onView }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: opportunity.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 100 : 1,
    opacity: isDragging ? 0.8 : 1,
  };

  const typeColors = {
    'Blog': 'bg-purple-100 text-purple-800',
    'Review': 'bg-blue-100 text-blue-800',
    'Social Media': 'bg-pink-100 text-pink-800',
    'Sponsored Post': 'bg-indigo-100 text-indigo-800',
    'Video': 'bg-orange-100 text-orange-800'
  };

  // Extract domain from company name for favicon
  const domain = opportunity.companyName.toLowerCase().replace(/[^a-z0-9]/g, '') + '.com';
  const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow"
    >
      <div 
        {...attributes} 
        {...listeners}
        className="cursor-move"
      >
        <div className="flex items-start justify-between mb-2">
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${typeColors[opportunity.type]}`}>
            {opportunity.type}
          </span>
          <span className="text-xs text-gray-500">
            {new Date(opportunity.createdAt).toLocaleDateString()}
          </span>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <img 
              src={faviconUrl} 
              alt=""
              className="w-4 h-4"
              onError={(e) => {
                e.currentTarget.src = '';
                e.currentTarget.className = 'hidden';
              }}
            />
            <Building2 className="w-4 h-4" />
            <span>{opportunity.companyName}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Users className="w-4 h-4" />
            <span>{opportunity.audienceReach.toLocaleString()} reach</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <DollarSign className="w-4 h-4" />
            <span>${opportunity.pricing.toLocaleString()}</span>
          </div>

          {opportunity.notes && (
            <p className="text-sm text-gray-500 line-clamp-2">{opportunity.notes}</p>
          )}
        </div>
      </div>

      <button
        onClick={() => onView(opportunity)}
        className="mt-3 w-full flex items-center justify-center gap-2 text-sm text-blue-500 hover:text-blue-700 py-1 border-t border-gray-100"
      >
        View Details
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};

export default OpportunityCard;