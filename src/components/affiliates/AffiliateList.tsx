import React, { useState } from 'react';
import { Search, Filter, UserPlus, Upload, ChevronDown, ChevronRight } from 'lucide-react';
import AffiliateStatusBadge from './AffiliateStatusBadge';
import CSVUpload from './CSVUpload';
import { AffiliateAccount } from '../../types/affiliate';

interface Props {
  onAddAffiliate: () => void;
}

const AffiliateList: React.FC<Props> = ({ onAddAffiliate }) => {
  const [showCSVUpload, setShowCSVUpload] = useState(false);
  const [expandedAccounts, setExpandedAccounts] = useState<string[]>([]);

  const toggleExpand = (accountId: string) => {
    setExpandedAccounts(prev => 
      prev.includes(accountId) 
        ? prev.filter(id => id !== accountId)
        : [...prev, accountId]
    );
  };

  // Sample data
  const affiliates: AffiliateAccount[] = [
    {
      id: '1',
      companyName: 'Tech Reviews Inc',
      website: 'techreviews.com',
      status: 'approved',
      commissionRate: 10,
      paymentMethod: 'paypal',
      paymentDetails: 'payments@techreviews.com',
      contacts: [
        {
          id: '1-1',
          firstName: 'John',
          lastName: 'Smith',
          email: 'john@techreviews.com',
          phone: '555-0123',
          role: 'Marketing Director',
          isPrimary: true
        },
        {
          id: '1-2',
          firstName: 'Sarah',
          lastName: 'Johnson',
          email: 'sarah@techreviews.com',
          role: 'Affiliate Manager',
          isPrimary: false
        }
      ],
      createdAt: '2024-03-10'
    },
    // Add more sample data as needed
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Affiliate Management</h1>
        <div className="flex gap-3">
          <button
            onClick={() => setShowCSVUpload(true)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            <Upload className="w-4 h-4" />
            <span>Import CSV</span>
          </button>
          <button 
            onClick={onAddAffiliate}
            className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add Affiliate</span>
          </button>
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search affiliates or contacts..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
          <Filter className="w-4 h-4" />
          <span>Filter</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="w-8"></th>
              <th className="text-left py-4 px-6 text-gray-500 font-medium">Company</th>
              <th className="text-left py-4 px-6 text-gray-500 font-medium">Website</th>
              <th className="text-left py-4 px-6 text-gray-500 font-medium">Status</th>
              <th className="text-left py-4 px-6 text-gray-500 font-medium">Commission</th>
              <th className="text-left py-4 px-6 text-gray-500 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {affiliates.map((affiliate) => (
              <React.Fragment key={affiliate.id}>
                <tr className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="pl-4">
                    <button 
                      onClick={() => toggleExpand(affiliate.id)}
                      className="p-1 hover:bg-gray-200 rounded"
                    >
                      {expandedAccounts.includes(affiliate.id) 
                        ? <ChevronDown className="w-4 h-4" />
                        : <ChevronRight className="w-4 h-4" />
                      }
                    </button>
                  </td>
                  <td className="py-4 px-6">
                    <div className="font-medium">{affiliate.companyName}</div>
                    <div className="text-sm text-gray-500">
                      {affiliate.contacts.length} contacts
                    </div>
                  </td>
                  <td className="py-4 px-6">{affiliate.website}</td>
                  <td className="py-4 px-6">
                    <AffiliateStatusBadge status={affiliate.status} />
                  </td>
                  <td className="py-4 px-6">{affiliate.commissionRate}%</td>
                  <td className="py-4 px-6">
                    <button className="text-blue-500 hover:text-blue-700">
                      View Details
                    </button>
                  </td>
                </tr>
                {expandedAccounts.includes(affiliate.id) && (
                  <tr className="bg-gray-50">
                    <td colSpan={6} className="py-2">
                      <div className="px-12 py-3">
                        <div className="text-sm font-medium text-gray-500 mb-2">
                          Contacts
                        </div>
                        <div className="space-y-3">
                          {affiliate.contacts.map((contact) => (
                            <div 
                              key={contact.id}
                              className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm"
                            >
                              <div>
                                <div className="font-medium">
                                  {contact.firstName} {contact.lastName}
                                  {contact.isPrimary && (
                                    <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                                      Primary
                                    </span>
                                  )}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {contact.email} • {contact.role || 'No role specified'}
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <button className="text-gray-400 hover:text-gray-600">
                                  Edit
                                </button>
                              </div>
                            </div>
                          ))}
                          <button className="text-sm text-blue-500 hover:text-blue-700 mt-2">
                            + Add Contact
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {showCSVUpload && <CSVUpload onClose={() => setShowCSVUpload(false)} />}
    </div>
  );
};

export default AffiliateList;