import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { AffiliateStage } from '../../types/affiliate';
import { StorageService } from '../../services/storage/StorageService';
import { NotificationService } from '../../services/notification/NotificationService';
import { AuditLogService } from '../../services/audit/AuditLogService';
import ConfirmationDialog from './ConfirmationDialog';
import StageSelectionModal from './StageSelectionModal';

interface Props {
  selectedCount: number;
  selectedIds: string[];
  onChangeComplete?: () => void;
}

const BulkActions: React.FC<Props> = ({
  selectedCount,
  selectedIds,
  onChangeComplete
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showStageModal, setShowStageModal] = useState(false);
  const [selectedStage, setSelectedStage] = useState<AffiliateStage | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleStageChange = (stage: AffiliateStage) => {
    console.log('Selected stage:', stage);
    setSelectedStage(stage);
    setShowStageModal(false);
    setShowConfirmation(true);
  };

  const handleConfirmStageChange = async () => {
    if (!selectedStage || !selectedIds?.length) {
      console.log('Missing required data:', { selectedStage, selectedIds });
      return;
    }
    
    setIsLoading(true);
    
    try {
      console.log('Starting bulk update for stage:', selectedStage);
      const affiliates = StorageService.getAffiliates();
      console.log('Current affiliates:', affiliates);
      
      const updatedAffiliates = affiliates.map(affiliate => {
        if (selectedIds.includes(affiliate.id)) {
          console.log('Updating affiliate:', affiliate.id);
          return {
            ...affiliate,
            stage: selectedStage,
            updatedAt: new Date().toISOString()
          };
        }
        return affiliate;
      });

      console.log('Saving updated affiliates:', updatedAffiliates);
      StorageService.saveAffiliates(updatedAffiliates);

      // Verify changes were saved
      const savedAffiliates = StorageService.getAffiliates();
      const allUpdated = selectedIds.every(id => 
        savedAffiliates.find(a => a.id === id)?.stage === selectedStage
      );

      if (!allUpdated) {
        throw new Error('Failed to update all selected affiliates');
      }

      // Log audit entry
      AuditLogService.logAction(
        'bulk_stage_change',
        selectedIds.join(','),
        'affiliate',
        { stage: { before: 'multiple', after: selectedStage } }
      );

      // Send notification
      NotificationService.sendNotification(
        'stage_change',
        `Updated stage to ${selectedStage} for ${selectedCount} affiliate${selectedCount !== 1 ? 's' : ''}`
      );

      // Cleanup
      setShowConfirmation(false);
      setShowStageModal(false);
      setSelectedStage(null);
      onChangeComplete?.();
      
      console.log('Bulk update completed successfully');
    } catch (error) {
      console.error('Bulk update failed:', error);
      NotificationService.sendNotification(
        'error',
        'Failed to update affiliates'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = () => {
    const affiliates = StorageService.getAffiliates();
    const remainingAffiliates = affiliates.filter(a => !selectedIds?.includes(a.id));
    StorageService.saveAffiliates(remainingAffiliates);
    onChangeComplete?.();
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
      >
        <span>Bulk Actions ({selectedCount})</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
          <button
            onClick={() => {
              setShowStageModal(true);
              setIsOpen(false);
            }}
            className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
          >
            Change Stage
          </button>
          
          <div className="border-t border-gray-100 my-1"></div>
          
          <button
            onClick={() => {
              setShowConfirmation(true);
              setIsOpen(false);
            }}
            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
          >
            Delete Selected
          </button>
        </div>
      )}

      {showStageModal && (
        <StageSelectionModal
          selectedCount={selectedCount}
          onSelect={handleStageChange}
          onClose={() => setShowStageModal(false)}
        />
      )}

      {showConfirmation && selectedStage && (
        <ConfirmationDialog
          title="Change Stage"
          message={`Are you sure you want to change the stage to "${selectedStage}" for ${selectedCount} affiliate profile${selectedCount === 1 ? '' : 's'}?`}
          onConfirm={handleConfirmStageChange}
          onCancel={() => {
            setShowConfirmation(false);
            setSelectedStage(null);
          }}
          isLoading={isLoading}
        />
      )}
    </div>
  );
};

export default BulkActions;