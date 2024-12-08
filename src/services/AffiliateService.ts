import { AffiliateAccount, AffiliateStage } from '../models/AffiliateAccount';
import { StorageService } from './storage/StorageService';

export class AffiliateService {
  static updateAffiliateStatus(affiliate: AffiliateAccount, status: 'Fit' | 'Not a fit' | ''): AffiliateAccount {
    // Map status to stage
    const stage: AffiliateStage = status === 'Fit' ? 'Good Fit' 
      : status === 'Not a fit' ? 'Bad Fit' 
      : 'Identified';

    const updatedAffiliate: AffiliateAccount = {
      ...affiliate,
      status,
      stage,
      updatedAt: new Date().toISOString()
    };

    // Update in storage
    const affiliates = StorageService.getAffiliates();
    const updatedAffiliates = affiliates.map(a => 
      a.id === updatedAffiliate.id ? updatedAffiliate : a
    );
    StorageService.saveAffiliates(updatedAffiliates);

    return updatedAffiliate;
  }

  static getAffiliatesByStage(stage: AffiliateStage): AffiliateAccount[] {
    const affiliates = StorageService.getAffiliates();
    return affiliates.filter(a => a.stage === stage);
  }

  static getAffiliatesByStatus(status: 'Fit' | 'Not a fit' | ''): AffiliateAccount[] {
    const affiliates = StorageService.getAffiliates();
    return affiliates.filter(a => a.status === status);
  }
}