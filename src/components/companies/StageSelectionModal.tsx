import React from 'react';
import { X } from 'lucide-react';
import type { AffiliateStage } from '../../types/affiliate';

interface Props {
  selectedCount: number;
  onSelect: (stage: AffiliateStage) => void;
  onClose: () => void;
}

const STAGES: AffiliateStage[] = [
  'Prospects',
  'Good Fit',
  'Bad Fit', 
  'Outreach',
  'Negotiation',
  'Recruited',
  'Unresponsive',
  'Not Interested'
];

const StageSelectionModal: React.FC<Props> = ({
  selectedCount,
  onSelect,
  onClose
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">
            Change Stage for {selectedCount} Item{selectedCount !== 1 ? 's' : ''}
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-2">
          {STAGES.map(stage => (
            <button
              key={stage}
              onClick={() => onSelect(stage)}
              className="w-full text-left px-4 py-3 hover:bg-gray-50 rounded-lg transition-colors"
            >
              {stage}
            </button>
          ))}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default StageSelectionModal;