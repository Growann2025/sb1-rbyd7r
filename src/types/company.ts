export interface Company {
  domain: string;
  stage: string;
  status: 'Fit' | 'Not a fit' | '';
  types: string[];
  payment: string;
  targetUrl: string;
  fullName: string;
  firstName: string;
  lastName: string;
  email: string;
  traffic: number;
  lastContact: string;
}