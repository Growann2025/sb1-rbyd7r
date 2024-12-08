import React from 'react';
import { X } from 'lucide-react';

interface FilterValues {
  niche: string;
  engagementStatus: string;
  minScore: number;
  maxScore: number;
}

interface Props {
  filters: FilterValues;
  onUpdateFilters: (filters: FilterValues) => void;
  onClose: () => void;
}

const FilterPanel: React.FC<Props> = ({ filters, onUpdateFilters, onClose }) => {
  const niches = ['Tech', 'Finance', 'Lifestyle', 'Gaming', 'Education'];
  const statuses = ['Awaiting Reply', 'Meeting Scheduled', 'Follow-up Required', 'Active', 'Inactive'];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Filter Affiliates</h3>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Niche
          </label>
          <select
            value={filters.niche}
            onChange={(e) => onUpdateFilters({ ...filters, niche: e.target.value })}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Niches</option>
            {niches.map(niche => (
              <option key={niche} value={niche}>{niche}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Engagement Status
          </label>
          <select
            value={filters.engagementStatus}
            onChange={(e) => onUpdateFilters({ ...filters, engagementStatus: e.target.value })}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Statuses</option>
            {statuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Affiliate Score Range
          </label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="1"
              max="5"
              value={filters.minScore}
              onChange={(e) => onUpdateFilters({ ...filters, minScore: parseInt(e.target.value) })}
              className="flex-1"
            />
            <span className="text-sm text-gray-500">to</span>
            <input
              type="range"
              min="1"
              max="5"
              value={filters.maxScore}
              onChange={(e) => onUpdateFilters({ ...filters, maxScore: parseInt(e.target.value) })}
              className="flex-1"
            />
          </div>
          <div className="flex justify-between text-sm text-gray-500 mt-1">
            <span>{filters.minScore}</span>
            <span>{filters.maxScore}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;