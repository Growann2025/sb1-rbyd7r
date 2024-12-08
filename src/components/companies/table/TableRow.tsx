import React from 'react';
import type { AffiliateAccount } from '../../../types/affiliate';
import { getDaysAgo } from '../../../utils/date';
import DomainCell from '../DomainCell';
import StageCell from './StageCell';
import StatusCell from './StatusCell';
import ContactCell from './ContactCell';

interface Props {
  affiliate: AffiliateAccount;
  visibleColumns: string[];
  selected: boolean;
  onSelect: () => void;
  onStageChange: (stage: string) => void;
  onStatusChange: (affiliate: AffiliateAccount, status: 'Fit' | 'Not a fit' | '') => void;
  onView: () => void;
  openStageMenu: string | null;
  onStageMenuToggle: () => void;
}

const TableRow: React.FC<Props> = ({
  affiliate,
  visibleColumns,
  selected,
  onSelect,
  onStageChange,
  onStatusChange,
  onView,
  openStageMenu,
  onStageMenuToggle
}) => {
  return (
    <tr className="border-t border-gray-100 hover:bg-gray-50">
      <td className="py-3 px-4">
        <input
          type="checkbox"
          checked={selected}
          onChange={onSelect}
          className="rounded text-blue-500 focus:ring-blue-500"
        />
      </td>
      {visibleColumns.includes('domain') && (
        <td className="py-3 px-4">
          <DomainCell domain={affiliate.website} />
        </td>
      )}
      {visibleColumns.includes('stage') && (
        <td className="py-3 px-4">
          <StageCell
            stage={affiliate.stage}
            isOpen={openStageMenu === affiliate.id}
            onClick={onStageMenuToggle}
            onStageSelect={onStageChange}
          />
        </td>
      )}
      {visibleColumns.includes('status') && (
        <td className="py-3 px-4">
          <StatusCell 
            affiliate={affiliate}
            onStatusChange={onStatusChange}
          />
        </td>
      )}
      {visibleColumns.includes('contact') && (
        <td className="py-3 px-4">
          <ContactCell
            contact={affiliate.contacts[0]}
            onClick={onView}
          />
        </td>
      )}
      {visibleColumns.includes('traffic') && (
        <td className="py-3 px-4">
          {affiliate.audienceReach?.toLocaleString() || 0}
        </td>
      )}
      {visibleColumns.includes('lastContact') && (
        <td className="py-3 px-4">
          {getDaysAgo(affiliate.lastContactDate)} days ago
        </td>
      )}
      {visibleColumns.includes('actions') && (
        <td className="py-3 px-4">
          <button 
            onClick={onView}
            className="text-blue-500 hover:text-blue-700"
          >
            View Details
          </button>
        </td>
      )}
    </tr>
  );
};

export default TableRow;