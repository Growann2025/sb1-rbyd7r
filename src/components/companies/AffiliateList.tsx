import React, { useState } from 'react';
import { Search, Filter, ThumbsUp, ThumbsDown, ChevronDown } from 'lucide-react';
import { formatLastContact, getDaysAgo } from '../../utils/date';
import type { AffiliateAccount } from '../../types/affiliate';
import BulkActions from './BulkActions';
import AffiliateStatusBadge from './AffiliateStatusBadge';
import DomainCell from './DomainCell';

interface Props {
  affiliates: AffiliateAccount[];
  searchTerm: string;
  visibleColumns: string[];
  columns: Array<{
    key: string;
    label: string;
    sortable: boolean;
  }>;
  onUpdateAffiliate: (affiliate: AffiliateAccount) => void;
  onViewAffiliate: (affiliate: AffiliateAccount) => void;
  onDeleteAffiliates: (affiliateIds: string[]) => void;
}

const AffiliateList: React.FC<Props> = ({ 
  affiliates = [],
  searchTerm = '', 
  visibleColumns = [], 
  columns = [],
  onUpdateAffiliate,
  onViewAffiliate,
  onDeleteAffiliates
}) => {
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  } | null>(null);
  const [openStageMenu, setOpenStageMenu] = useState<string | null>(null);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const filteredAffiliates = affiliates.filter(affiliate => {
    const searchString = searchTerm.toLowerCase();
    return (
      affiliate.domain.toLowerCase().includes(searchString) ||
      (affiliate.contacts[0]?.firstName + ' ' + affiliate.contacts[0]?.lastName)
        .toLowerCase()
        .includes(searchString)
    );
  });

  const handleStageClick = (e: React.MouseEvent, affiliateId: string) => {
    e.stopPropagation();
    setOpenStageMenu(openStageMenu === affiliateId ? null : affiliateId);
  };

  const handleStageChange = (affiliate: AffiliateAccount, stage: string) => {
    const status = stage === 'Good Fit' ? 'Fit' : stage === 'Bad Fit' ? 'Not a fit' : '';

    onUpdateAffiliate({
      ...affiliate,
      stage: stage as any,
      status,
      updatedAt: new Date().toISOString()
    });
    setOpenStageMenu(null);
  };

  const handleStatusChange = (affiliate: AffiliateAccount, newStatus: 'Fit' | 'Not a fit' | '') => {
    // If clicking the same status, clear it
    const status = affiliate.status === newStatus ? '' : newStatus;
    
    // Update both status and stage
    onUpdateAffiliate({
      ...affiliate,
      status,
      stage: status === 'Fit' ? 'Good Fit' 
        : status === 'Not a fit' ? 'Bad Fit' 
        : 'Identified',
      updatedAt: new Date().toISOString()
    });
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedRows(e.target.checked ? filteredAffiliates.map(a => a.id) : []);
  };

  const handleSelectRow = (affiliateId: string) => {
    setSelectedRows(prev => 
      prev.includes(affiliateId)
        ? prev.filter(id => id !== affiliateId)
        : [...prev, affiliateId]
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {selectedRows.length > 0 && (
        <div className="p-4 border-b border-gray-200">
          <BulkActions
            selectedCount={selectedRows.length}
            onChangeStage={(stage) => {
              const updatedAffiliates = selectedRows.map(id => {
                const affiliate = affiliates.find(a => a.id === id);
                if (affiliate) {
                  return {
                    ...affiliate,
                    stage: stage as any,
                    updatedAt: new Date().toISOString()
                  };
                }
                return null;
              }).filter(Boolean) as AffiliateAccount[];

              updatedAffiliates.forEach(affiliate => onUpdateAffiliate(affiliate));
              setSelectedRows([]);
              setOpenStageMenu(null);
            }}
            onChangeStatus={(status) => {
              const updatedAffiliates = selectedRows.map(id => {
                const affiliate = affiliates.find(a => a.id === id);
                if (affiliate) {
                  return {
                    ...affiliate,
                    status,
                    stage: status && affiliate.stage === 'In sequence' ? 'Identified' : affiliate.stage,
                    updatedAt: new Date().toISOString()
                  };
                }
                return null;
              }).filter(Boolean) as AffiliateAccount[];

              updatedAffiliates.forEach(affiliate => onUpdateAffiliate(affiliate));
              setSelectedRows([]);
            }}
            onDelete={() => {
              onDeleteAffiliates(selectedRows);
              setSelectedRows([]);
            }}
          />
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="w-8 py-3 px-4">
                <input
                  type="checkbox"
                  checked={selectedRows.length === filteredAffiliates.length && filteredAffiliates.length > 0}
                  onChange={handleSelectAll}
                  className="rounded text-blue-500 focus:ring-blue-500"
                />
              </th>
              {columns.map(column => (
                visibleColumns.includes(column.key) && (
                  <th
                    key={column.key}
                    className="text-left py-3 px-4 text-gray-500 font-medium"
                    onClick={() => column.sortable && handleSort(column.key)}
                    style={{ cursor: column.sortable ? 'pointer' : 'default' }}
                  >
                    <div className="flex items-center gap-1">
                      {column.label}
                      {sortConfig?.key === column.key && (
                        <span>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                )
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredAffiliates.map(affiliate => (
              <tr key={affiliate.id} className="border-t border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4">
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(affiliate.id)}
                    onChange={() => handleSelectRow(affiliate.id)}
                    className="rounded text-blue-500 focus:ring-blue-500"
                  />
                </td>
                {visibleColumns.includes('domain') && (
                  <td className="py-3 px-4">
                    <DomainCell domain={affiliate.domain} />
                  </td>
                )}
                {visibleColumns.includes('stage') && (
                  <td className="py-3 px-4 relative stage-dropdown">
                    <div className="relative">
                      <button
                        onClick={(e) => handleStageClick(e, affiliate.id)}
                        className="flex items-center gap-1 hover:bg-gray-100 px-3 py-1.5 rounded w-full max-w-[200px] justify-between"
                      >
                        <span>{affiliate.stage}</span>
                        <ChevronDown className={`w-4 h-4 transition-transform ${openStageMenu === affiliate.id ? 'rotate-180' : ''}`} />
                      </button>
                      {openStageMenu === affiliate.id && (
                        <div className="absolute top-full left-0 mt-1 w-[200px] bg-white border border-gray-200 rounded-lg shadow-lg z-[60] py-1">
                          {['Identified', 'Good Fit', 'Bad Fit', 'In Sequence', 'No Response', 'Not Interested', 'Negotiation', 'Placed'].map(stage => (
                            <button
                              key={stage}
                              onClick={() => handleStageChange(affiliate, stage)}
                              className={`flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-50 ${
                                affiliate.stage === stage ? 'bg-blue-50 text-blue-600' : ''
                              }`}
                            >
                              {stage}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </td>
                )}
                {visibleColumns.includes('status') && (
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStatusChange(affiliate, 'Fit');
                        }}
                        className={`w-5 h-5 ${affiliate.status === 'Fit' ? 'text-green-500' : 'text-gray-400 hover:text-gray-500'}`}
                      >
                        <ThumbsUp className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStatusChange(affiliate, 'Not a fit');
                        }}
                        className={`w-5 h-5 ${affiliate.status === 'Not a fit' ? 'text-red-500' : 'text-gray-400 hover:text-gray-500'}`}
                      >
                        <ThumbsDown className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                )}
                {visibleColumns.includes('contact') && (
                  <td className="py-3 px-4">
                    {affiliate.contacts[0] && (
                      <button
                        onClick={() => onViewAffiliate(affiliate)}
                        className="flex items-center gap-2 hover:bg-gray-50 px-2 py-1 rounded-lg"
                      >
                        <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-medium text-sm">
                          {affiliate.contacts[0].firstName[0]}{affiliate.contacts[0].lastName[0]}
                        </div>
                        <span className="text-gray-700">
                          {affiliate.contacts[0].firstName} {affiliate.contacts[0].lastName}
                        </span>
                      </button>
                    )}
                  </td>
                )}
                {visibleColumns.includes('traffic') && (
                  <td className="py-3 px-4">{affiliate.traffic?.toLocaleString() || 0}</td>
                )}
                {visibleColumns.includes('lastContact') && (
                  <td className="py-3 px-4">
                    {affiliate.lastContactDate ? `${getDaysAgo(affiliate.lastContactDate)} days ago` : 'Never'}
                  </td>
                )}
                {visibleColumns.includes('actions') && (
                  <td className="py-3 px-4">
                    <button 
                      onClick={() => onViewAffiliate(affiliate)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      View Details
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AffiliateList;