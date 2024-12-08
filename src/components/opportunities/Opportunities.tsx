import React, { useState } from 'react';
import KanbanBoard from '../partners/KanbanBoard';
import type { AffiliateAccount } from '../../types/affiliate';

const Opportunities = () => {
  // Sample data - in a real app, this would come from your backend
  const [affiliates, setAffiliates] = useState<AffiliateAccount[]>([
    {
      id: '1',
      companyName: 'Tech Reviews Inc',
      website: 'techreviews.com',
      niche: 'Technology',
      audienceReach: 50000,
      engagementStatus: 'Active',
      affiliateScore: 4,
      stage: 'In Discussions',
      tags: ['Tech', 'Reviews', 'B2B'],
      contacts: [
        {
          id: '1-1',
          firstName: 'John',
          lastName: 'Smith',
          email: 'john@techreviews.com',
          phone: '555-0123',
          role: 'Marketing Director',
          isPrimary: true
        }
      ],
      notes: 'High-quality tech review site with engaged audience',
      communicationHistory: [
        {
          id: '1',
          type: 'email',
          content: 'Initial outreach email sent',
          date: new Date().toISOString(),
          status: 'sent'
        }
      ],
      lastContactDate: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ]);

  const handleUpdateAffiliate = (updatedAffiliate: AffiliateAccount) => {
    setAffiliates(prev => prev.map(affiliate => 
      affiliate.id === updatedAffiliate.id ? updatedAffiliate : affiliate
    ));
  };

  return (
    <KanbanBoard 
      affiliates={affiliates}
      onUpdateAffiliate={handleUpdateAffiliate}
    />
  );
};

export default Opportunities;