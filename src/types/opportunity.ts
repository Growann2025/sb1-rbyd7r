export type OpportunityType = 'Blog' | 'Review' | 'Social Media' | 'Sponsored Post' | 'Video';
export type OpportunityStatus = 'Active' | 'Pending' | 'Completed' | 'Cancelled';

export interface PlacementOpportunity {
  id: string;
  companyId: string;
  type: OpportunityType;
  status: OpportunityStatus;
  pricing: number;
  audienceReach: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}