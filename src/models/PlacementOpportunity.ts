import { CustomFieldValue } from './CustomField';
import { Contract } from './Contract';

export type OpportunityType = 'Blog' | 'Review' | 'Social Media' | 'Sponsored Post' | 'Video';
export type OpportunityStatus = 'Active' | 'Pending' | 'Completed' | 'Cancelled';

export interface PlacementOpportunity {
  id: string;
  affiliateId: string;
  title: string;
  type: OpportunityType;
  url?: string;
  pricing?: number;
  audienceReach?: number;
  status: OpportunityStatus;
  customFields: CustomFieldValue[];
  contract?: Contract;
  createdAt: string;
  updatedAt: string;
}