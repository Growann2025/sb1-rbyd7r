import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { StorageService } from '../../services/storage/StorageService';
import AffiliateList from './AffiliateList';
import CSVUpload from './CSVUpload';
import PipelineStages from './PipelineStages';
import ColumnVisibility from './ColumnVisibility';
import AffiliateDetails from './AffiliateDetails';
import type { AffiliateAccount } from '../../models/AffiliateAccount';
import BulkActions from './BulkActions';

const columns = [
  { key: 'domain', label: 'Domain', sortable: true },
  { key: 'stage', label: 'Stage', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'contact', label: 'Contact', sortable: true },
  { key: 'traffic', label: 'Traffic', sortable: true },
  { key: 'lastContact', label: 'Last Contact', sortable: true },
  { key: 'actions', label: 'Actions', sortable: false }
];

const Companies = () => {
  const [searchParams] = useSearchParams();
  const [showCSVUpload, setShowCSVUpload] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [visibleColumns, setVisibleColumns] = useState(['domain', 'stage', 'status', 'contact', 'traffic', 'lastContact', 'actions']);
  const [affiliates, setAffiliates] = useState<AffiliateAccount[]>([]);
  const [selectedAffiliate, setSelectedAffiliate] = useState<AffiliateAccount | null>(null);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  // Subscribe to storage changes
  useEffect(() => {
    const handleStorageChange = () => {
      const savedAffiliates = StorageService.getAffiliates();
      setAffiliates(savedAffiliates);
    };

    window.addEventListener('storage', handleStorageChange);
    handleStorageChange(); // Initial load

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleBulkActionComplete = () => {
    setSelectedRows([]);
    const savedAffiliates = StorageService.getAffiliates();
    setAffiliates(savedAffiliates);
  };

  const activeTab = searchParams.get('tab') || 'prospects';

  const getFilteredAffiliates = () => {
    const allAffiliates = affiliates || [];
    
    const filterByStage = (stage: string) => allAffiliates.filter(a => 
      a.stage && a.stage.toLowerCase() === stage.toLowerCase()
    );
    
    switch (activeTab) {
      case 'prospects':
        return allAffiliates.filter(a => 
          !a.status && 
          !['Good Fit', 'Bad Fit', 'Outreach', 'Placed', 'No Response', 'Not Interested'].includes(a.stage)
        );
      case 'good-fit':
        return filterByStage('Good Fit');
      case 'bad-fit':
        return filterByStage('Bad Fit');
      case 'outreach':
        return filterByStage('Outreach');
      case 'negotiation':
        return filterByStage('Negotiation');
      case 'recruited':
        return filterByStage('Recruited');
      case 'unresponsive':
        return filterByStage('Unresponsive');
      case 'not-interested':
        return filterByStage('Not Interested');
      default:
        return allAffiliates;
    }
  };

  const filteredAffiliates = getFilteredAffiliates();

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Affiliate Management</h1>
        <div className="flex gap-3">
          <button
            onClick={() => setShowCSVUpload(true)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            Import CSV
          </button>
          <button 
            onClick={() => {}}
            className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Add Profile
          </button>
        </div>
      </div>

      <PipelineStages affiliates={affiliates} />

      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search profiles..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {selectedRows.length > 0 && (
          <BulkActions
            selectedCount={selectedRows.length}
            selectedIds={selectedRows}
            onChangeComplete={handleBulkActionComplete}
          />
        )}
        <ColumnVisibility
          columns={columns}
          visibleColumns={visibleColumns}
          onToggleColumn={(columnKey) => {
            setVisibleColumns(prev => 
              prev.includes(columnKey)
                ? prev.filter(key => key !== columnKey)
                : [...prev, columnKey]
            );
          }}
        />
      </div>

      <AffiliateList 
        affiliates={filteredAffiliates}
        searchTerm={searchTerm}
        visibleColumns={visibleColumns}
        columns={columns}
        selectedRows={selectedRows}
        onSelectRows={setSelectedRows}
        onViewAffiliate={setSelectedAffiliate}
      />

      {showCSVUpload && (
        <CSVUpload onClose={() => setShowCSVUpload(false)} />
      )}

      {selectedAffiliate && (
        <AffiliateDetails
          affiliate={selectedAffiliate}
          onClose={() => setSelectedAffiliate(null)}
          onUpdate={(updatedAffiliate) => {
            const newAffiliates = affiliates.map(a => 
              a.id === updatedAffiliate.id ? updatedAffiliate : a
            );
            StorageService.saveAffiliates(newAffiliates);
            setAffiliates(newAffiliates);
          }}
        />
      )}
    </div>
  );
};

export default Companies;