import React from 'react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import type { AffiliateAccount } from '../../../types/affiliate';

interface Props {
  affiliate: AffiliateAccount;
  onStatusChange: (affiliate: AffiliateAccount, status: 'Fit' | 'Not a fit' | '') => void;
}

const StatusCell: React.FC<Props> = ({ affiliate, onStatusChange }) => {
  return (
    <div className="flex gap-3">
      <button 
        onClick={() => onStatusChange(affiliate, 'Fit')}
        className={`w-5 h-5 ${
          affiliate.status === 'Fit' 
            ? 'text-green-500' 
            : 'text-gray-300 hover:text-gray-400'
        }`}
      >
        <ThumbsUp className="w-5 h-5" />
      </button>
      <button 
        onClick={() => onStatusChange(affiliate, 'Not a fit')}
        className={`w-5 h-5 ${
          affiliate.status === 'Not a fit' 
            ? 'text-red-500' 
            : 'text-gray-300 hover:text-gray-400'
        }`}
      >
        <ThumbsDown className="w-5 h-5" />
      </button>
    </div>
  );
};

export default StatusCell;