import React from 'react';
import { ChevronDown } from 'lucide-react';

interface Props {
  currentStage: string;
  onStageChange: (stage: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const STAGES = [
  'Identified',
  'In sequence',
  'No Response',
  'Not Interested',
  'Negotiation',
  'Placed'
];

const StageSelector: React.FC<Props> = ({ 
  currentStage, 
  onStageChange, 
  isOpen, 
  onToggle 
}) => {
  return (
    <div className="relative inline-block">
      <button
        onClick={onToggle}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
      >
        <span>Stage: {currentStage}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="absolute left-0 mt-1 w-[200px] bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          {STAGES.map(stage => (
            <button
              key={stage}
              onClick={() => {
                onStageChange(stage);
                onToggle();
              }}
              className={`block w-full text-left px-4 py-2 hover:bg-gray-50 ${
                currentStage === stage ? 'bg-blue-50 text-blue-600' : ''
              }`}
            >
              {stage}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default StageSelector;