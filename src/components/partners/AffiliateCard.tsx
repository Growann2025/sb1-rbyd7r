import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Mail, Calendar, MessageSquare, Star, Users, Tag } from 'lucide-react';
import type { AffiliateAccount } from '../../types/affiliate';

interface Props {
  affiliate: AffiliateAccount;
  onView: (affiliate: AffiliateAccount) => void;
  onUpdate: (affiliate: AffiliateAccount) => void;
}

const AffiliateCard: React.FC<Props> = ({ affiliate, onView, onUpdate }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: affiliate.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.8 : 1,
  };

  const handleQuickEmail = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Implement email functionality
  };

  const handleScheduleMeeting = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Implement meeting scheduling
  };

  const handleAddNote = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Implement note adding
  };

  const handleViewDetails = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onView(affiliate);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow"
    >
      <div {...attributes} {...listeners} className="cursor-move">
        <div className="flex justify-between items-start mb-3">
          <h4 className="font-medium">{affiliate.companyName}</h4>
          <div className="flex -mt-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < affiliate.affiliateScore
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="space-y-2 mb-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Tag className="w-4 h-4" />
            <span>{affiliate.niche}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Users className="w-4 h-4" />
            <span>{affiliate.audienceReach.toLocaleString()} reach</span>
          </div>

          <div className="inline-block px-2 py-1 bg-gray-100 rounded text-xs text-gray-700">
            {affiliate.engagementStatus}
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-3 border-t border-gray-100">
        <div className="flex gap-2">
          <button
            onClick={handleQuickEmail}
            className="p-1 hover:bg-gray-100 rounded"
            title="Send Email"
          >
            <Mail className="w-4 h-4 text-gray-500" />
          </button>
          <button
            onClick={handleScheduleMeeting}
            className="p-1 hover:bg-gray-100 rounded"
            title="Schedule Meeting"
          >
            <Calendar className="w-4 h-4 text-gray-500" />
          </button>
          <button
            onClick={handleAddNote}
            className="p-1 hover:bg-gray-100 rounded"
            title="Add Note"
          >
            <MessageSquare className="w-4 h-4 text-gray-500" />
          </button>
        </div>
        <button
          onClick={handleViewDetails}
          className="text-sm text-blue-500 hover:text-blue-700"
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default AffiliateCard;