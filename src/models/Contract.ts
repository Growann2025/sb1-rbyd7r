export interface Contract {
  id: string;
  placementId: string;
  status: 'Draft' | 'Sent' | 'Signed' | 'Terminated';
  startDate: Date;
  endDate: Date;
  value: number;
  terms: string[];
}