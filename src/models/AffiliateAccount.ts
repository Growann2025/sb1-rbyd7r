import { Contact } from './Contact';
import { PlacementOpportunity } from './PlacementOpportunity';
import { CommunicationEntry } from './CommunicationEntry';
import { Tag } from './Tag';
import { AffiliateMetrics } from './AffiliateMetrics';

export interface AffiliateAccount {
  id: string;
  domain: string;
  status: 'Fit' | 'Not a fit' | '';
  stage: AffiliateStage;
  traffic?: number;
  notes?: string;
  contacts: Contact[];
  placements: PlacementOpportunity[];
  communicationHistory: CommunicationEntry[];
  tags: Tag[];
  metrics: AffiliateMetrics;
  createdAt: string;
  updatedAt: string;
}

export type AffiliateStage = 
  | 'Identified'
  | 'Good Fit'
  | 'Bad Fit'
  | 'In Sequence'
  | 'No Response'
  | 'Not Interested'
  | 'Negotiation'
  | 'Placed';