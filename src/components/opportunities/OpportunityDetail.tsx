import React from 'react';
import { X, Building2, Users, DollarSign, Calendar, Clock, Link } from 'lucide-react';
import type { PlacementOpportunity } from '../../types/opportunity';

interface Props {
  opportunity: PlacementOpportunity & { companyName: string };
  onClose: () => void;
}

const OpportunityDetail: React.FC<Props> = ({ opportunity, onClose }) => {
  const typeColors = {
    'Blog': 'bg-purple-100 text-purple-800',
    'Review': 'bg-blue-100 text-blue-800',
    'Social Media': 'bg-pink-100 text-pink-800',
    'Sponsored Post': 'bg-indigo-100 text-indigo-800',
    'Video': 'bg-orange-100 text-orange-800'
  };

  const statusColors = {
    'Active': 'bg-green-100 text-green-800',
    'Pending': 'bg-yellow-100 text-yellow-800',
    'Completed': 'bg-blue-100 text-blue-800',
    'Cancelled': 'bg-red-100 text-red-800'
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-end z-50">
      <div className="bg-white w-full max-w-2xl h-full overflow-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold">Opportunity Details</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <span className={`text-sm font-medium px-3 py-1 rounded-full ${typeColors[opportunity.type]}`}>
              {opportunity.type}
            </span>
            <span className={`text-sm font-medium px-3 py-1 rounded-full ${statusColors[opportunity.status]}`}>
              {opportunity.status}
            </span>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <Building2 className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Company</p>
                <p className="font-medium">{opportunity.companyName}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <DollarSign className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Pricing</p>
                  <p className="font-medium">${opportunity.pricing.toLocaleString()}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <Users className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Audience Reach</p>
                  <p className="font-medium">{opportunity.audienceReach.toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Created</p>
                  <p className="font-medium">
                    {new Date(opportunity.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <Clock className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Last Updated</p>
                  <p className="font-medium">
                    {new Date(opportunity.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {opportunity.notes && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500 mb-2">Notes</p>
                <p className="text-gray-700">{opportunity.notes}</p>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              Close
            </button>
            <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
              Edit Opportunity
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpportunityDetail;