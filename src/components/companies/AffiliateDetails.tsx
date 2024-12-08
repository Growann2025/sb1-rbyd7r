import React from 'react';
import { X, Users, Plus, ExternalLink } from 'lucide-react';
import { AffiliateAccount } from '../../models/AffiliateAccount';
import { AffiliateService } from '../../services/AffiliateService';
import StatusButtons from './StatusButtons';

interface Props {
  affiliate: AffiliateAccount;
  onClose: () => void;
  onUpdate: (affiliate: AffiliateAccount) => void;
  onNext?: () => void;
  onPrevious?: () => void;
  hasNext?: boolean;
  hasPrevious?: boolean;
}

const AffiliateDetails: React.FC<Props> = ({
  affiliate,
  onClose,
  onUpdate,
  onNext,
  onPrevious,
  hasNext,
  hasPrevious
}) => {
  const handleStatusChange = (status: 'Fit' | 'Not a fit' | '') => {
    const updatedAffiliate = AffiliateService.updateAffiliateStatus(affiliate, status);
    onUpdate(updatedAffiliate);
    
    if (status && onNext && hasNext) {
      setTimeout(onNext, 500);
    }
  };

  const getDomainUrl = (domain: string) => {
    return domain.startsWith('http') ? domain : `https://${domain}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-end z-50">
      <div className="bg-white w-full max-w-2xl h-full overflow-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <a 
            href={getDomainUrl(affiliate.domain)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xl font-bold text-blue-500 hover:text-blue-700 flex items-center gap-2"
          >
            {affiliate.domain}
            <ExternalLink className="w-5 h-5" />
          </a>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 border-b border-gray-200">
          <StatusButtons 
            status={affiliate.status} 
            onStatusChange={handleStatusChange}
          />
          
          {hasNext && (
            <div className="text-sm text-gray-500">
              Press → to view next profile
            </div>
          )}
        </div>

        <div className="p-6 space-y-6">
          {/* Status and Stage */}
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              affiliate.status === 'Fit' ? 'bg-green-100 text-green-800' :
              affiliate.status === 'Not a fit' ? 'bg-red-100 text-red-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {affiliate.status || 'No Status'}
            </span>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              {affiliate.stage}
            </span>
          </div>

          {/* Traffic */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 text-gray-500 mb-1">
              <Users className="w-4 h-4" />
              <span className="text-sm">Traffic</span>
            </div>
            <p className="text-xl font-semibold">
              {affiliate.traffic?.toLocaleString() || '0'}
            </p>
          </div>

          {/* Placement Opportunities */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Placement Opportunities</h3>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-full hover:bg-gray-50">
                <Plus className="w-4 h-4" />
                Add Placement
              </button>
            </div>

            {affiliate.placements?.map(placement => (
              <div key={placement.id} className="mb-3">
                <a
                  href={placement.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-4 border border-gray-200 rounded-lg hover:border-gray-300"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-blue-500 hover:text-blue-700">{placement.title}</h4>
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                      {placement.status}
                    </span>
                  </div>
                </a>
              </div>
            ))}

            {(!affiliate.placements || affiliate.placements.length === 0) && (
              <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                <p>No placement opportunities added yet</p>
                <p className="text-sm">Click the button above to add your first placement</p>
              </div>
            )}
          </div>

          {/* Contacts */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contacts</h3>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-full hover:bg-gray-50 mb-4">
              <Plus className="w-4 h-4" />
              Add Contact
            </button>

            {affiliate.contacts?.map(contact => (
              <div key={contact.id} className="mb-3 p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">
                      {contact.firstName} {contact.lastName}
                      {contact.isPrimary && (
                        <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                          Primary
                        </span>
                      )}
                    </h4>
                    <p className="text-sm text-gray-500">{contact.email}</p>
                    {contact.role && (
                      <p className="text-sm text-gray-500">{contact.role}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {(!affiliate.contacts || affiliate.contacts.length === 0) && (
              <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                <p>No contacts added yet</p>
                <p className="text-sm">Click the button above to add your first contact</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AffiliateDetails;