// Base field type for custom fields
export interface CustomField {
  id: string;
  name: string;
  type: 'text' | 'number' | 'date' | 'email' | 'phone' | 'url' | 'currency';
  required: boolean;
  order: number;
}

// Custom field values
export interface CustomFieldValue {
  fieldId: string;
  value: string | number | Date;
}

// Contact model
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

// Contact field definition
export interface ContactField extends CustomField {
  section: 'contact';
}

// Placement opportunity model
export interface PlacementOpportunity {
  id: string;
  affiliateId: string;
  title: string;
  type: string;
  url?: string;
  pricing?: number;
  audienceReach?: number;
  status: 'Active' | 'Pending' | 'Completed' | 'Cancelled';
  customFields: CustomFieldValue[];
  createdAt: string;
  updatedAt: string;
}

// Placement field definition
export interface PlacementField extends CustomField {
  section: 'placement';
}

// Affiliate profile model
export interface AffiliateProfile {
  id: string;
  domain: string;
  status: 'Fit' | 'Not a fit' | '';
  stage: AffiliateStage;
  traffic?: number;
  notes?: string;
  customFields: CustomFieldValue[];
  contacts: Contact[];
  placements: PlacementOpportunity[];
  createdAt: string;
  updatedAt: string;
}

// Affiliate field definition
export interface AffiliateField extends CustomField {
  section: 'affiliate';
}

export type AffiliateStage = 
  | 'Prospects'
  | 'Good Fit'
  | 'Bad Fit'
  | 'Outreach'
  | 'Negotiation'
  | 'Recruited'
  | 'Unresponsive'
  | 'Not Interested';

// Combined field types
export type Field = AffiliateField | ContactField | PlacementField;

// Default fields configuration
export const DEFAULT_AFFILIATE_FIELDS: AffiliateField[] = [
  {
    id: 'domain',
    name: 'Domain',
    type: 'url',
    required: true,
    order: 0,
    section: 'affiliate'
  },
  {
    id: 'traffic',
    name: 'Traffic',
    type: 'number',
    required: false,
    order: 1,
    section: 'affiliate'
  },
  {
    id: 'stage',
    name: 'Stage',
    type: 'text',
    required: false,
    order: 2,
    section: 'affiliate'
  },
  {
    id: 'notes',
    name: 'Notes',
    type: 'text',
    required: false,
    order: 3,
    section: 'affiliate'
  }
];

export const DEFAULT_CONTACT_FIELDS: ContactField[] = [
  {
    id: 'firstName',
    name: 'First Name',
    type: 'text',
    required: false,
    order: 0,
    section: 'contact'
  },
  {
    id: 'lastName',
    name: 'Last Name',
    type: 'text',
    required: false,
    order: 1,
    section: 'contact'
  },
  {
    id: 'email',
    name: 'Email',
    type: 'email',
    required: false,
    order: 2,
    section: 'contact'
  },
  {
    id: 'role',
    name: 'Role',
    type: 'text',
    required: false,
    order: 3,
    section: 'contact'
  },
  {
    id: 'phone',
    name: 'Phone',
    type: 'phone',
    required: false,
    order: 4,
    section: 'contact'
  }
];

export const DEFAULT_PLACEMENT_FIELDS: PlacementField[] = [
  {
    id: 'title',
    name: 'Title',
    type: 'text',
    required: false,
    order: 0,
    section: 'placement'
  },
  {
    id: 'type',
    name: 'Type',
    type: 'text',
    required: false,
    order: 1,
    section: 'placement'
  },
  {
    id: 'url',
    name: 'URL',
    type: 'url',
    required: false,
    order: 2,
    section: 'placement'
  },
  {
    id: 'pricing',
    name: 'Pricing',
    type: 'currency',
    required: false,
    order: 3,
    section: 'placement'
  },
  {
    id: 'audienceReach',
    name: 'Audience Reach',
    type: 'number',
    required: false,
    order: 4,
    section: 'placement'
  }
];