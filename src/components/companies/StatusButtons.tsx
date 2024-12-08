import React from 'react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';

interface Props {
  status: 'Fit' | 'Not a fit' | '';
  onStatusChange: (status: 'Fit' | 'Not a fit' | '') => void;
  size?: 'sm' | 'md' | 'lg';
}

const StatusButtons: React.FC<Props> = ({ status, onStatusChange, size = 'md' }) => {
  const buttonSizes = {
    sm: 'px-2 py-1 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg'
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => onStatusChange(status === 'Fit' ? '' : 'Fit')}
        className={`flex items-center gap-2 rounded-lg transition-colors ${buttonSizes[size]} ${
          status === 'Fit'
            ? 'bg-green-100 text-green-800 hover:bg-green-200'
            : 'bg-white border border-gray-200 hover:bg-gray-50'
        }`}
      >
        <ThumbsUp className={size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'} />
        <span>Good Fit</span>
      </button>
      
      <button
        onClick={() => onStatusChange(status === 'Not a fit' ? '' : 'Not a fit')}
        className={`flex items-center gap-2 rounded-lg transition-colors ${buttonSizes[size]} ${
          status === 'Not a fit'
            ? 'bg-red-100 text-red-800 hover:bg-red-200'
            : 'bg-white border border-gray-200 hover:bg-gray-50'
        }`}
      >
        <ThumbsDown className={size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'} />
        <span>Bad Fit</span>
      </button>
    </div>
  );
};

export default StatusButtons;