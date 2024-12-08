import React from 'react';
import { ChevronDown } from 'lucide-react';
import type { AffiliateStage } from '../../../types/affiliate';

interface Props {
  stage: AffiliateStage;
  isOpen: boolean;
  onClick: (e: React.MouseEvent) => void;
  onStageSelect: (stage: AffiliateStage) => void;
}

const STAGES: AffiliateStage[] = [
  'Identified',
  'In sequence',
  'No Response',
  'Not Interested',
  'Negotiation',
  'Placed'
];

const StageCell: React.FC<Props> = ({ 
  stage, 
  isOpen, 
  onClick, 
  onStageSelect 
}) => {
  return (
    <div className="relative stage-dropdown">
      <button
        onClick={onClick}
        className="flex items-center gap-1 hover:bg-gray-100 px-3 py-1.5 rounded w-full max-w-[200px] justify-between"
      >
        <span>{stage}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-[200px] bg-white border border-gray-200 rounded-lg shadow-lg z-[60] py-1">
          {STAGES.map(stageOption => (
            <button
              key={stageOption}
              onClick={() => onStageSelect(stageOption)}
              className={`block w-full text-left px-4 py-2 hover:bg-gray-50 ${
                stage === stageOption ? 'bg-blue-50 text-blue-600' : ''
              }`}
            >
              {stageOption}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default StageCell;