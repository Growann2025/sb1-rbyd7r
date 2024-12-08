import React, { useState } from 'react';
import type { PlacementOpportunity, OpportunityType, OpportunityStatus } from '../../types/opportunity';

const OPPORTUNITY_TYPES: OpportunityType[] = ['Blog', 'Review', 'Social Media', 'Sponsored Post', 'Video'];
const OPPORTUNITY_STATUSES: OpportunityStatus[] = ['Active', 'Pending', 'Completed', 'Cancelled'];

interface Props {
  companyId: string;
  initialData?: PlacementOpportunity | null;
  onSave: (opportunity: Omit<PlacementOpportunity, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

const OpportunityForm: React.FC<Props> = ({ companyId, initialData, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    companyId,
    type: initialData?.type || OPPORTUNITY_TYPES[0],
    status: initialData?.status || OPPORTUNITY_STATUSES[0],
    pricing: initialData?.pricing || 0,
    audienceReach: initialData?.audienceReach || 0,
    notes: initialData?.notes || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Type
        </label>
        <select
          value={formData.type}
          onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as OpportunityType }))}
          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {OPPORTUNITY_TYPES.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Status
        </label>
        <select
          value={formData.status}
          onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as OpportunityStatus }))}
          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {OPPORTUNITY_STATUSES.map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Pricing ($)
        </label>
        <input
          type="number"
          min="0"
          value={formData.pricing}
          onChange={(e) => setFormData(prev => ({ ...prev, pricing: parseFloat(e.target.value) }))}
          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Audience Reach
        </label>
        <input
          type="number"
          min="0"
          value={formData.audienceReach}
          onChange={(e) => setFormData(prev => ({ ...prev, audienceReach: parseInt(e.target.value) }))}
          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Notes
        </label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
          rows={4}
          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          {initialData ? 'Update' : 'Create'} Opportunity
        </button>
      </div>
    </form>
  );
};

export default OpportunityForm;