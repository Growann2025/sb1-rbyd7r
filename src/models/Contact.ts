import { CustomFieldValue } from './CustomField';

export interface Contact {
  id: string;
  affiliateId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role?: string;
  isPrimary: boolean;
  lastContactDate?: string;
  customFields: CustomFieldValue[];
  createdAt: string;
  updatedAt: string;
}