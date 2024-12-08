import { CSVRow } from '../../types/csv';
import { AffiliateAccount, Contact } from '../../types/affiliate';
import { cleanDomain } from '../domain';

export function transformToAffiliate(row: CSVRow): AffiliateAccount {
  // Handle case-insensitive field names
  const getValue = (field: string): string => {
    const exactMatch = row.data[field];
    if (exactMatch !== undefined) return exactMatch;
    
    const lowerField = field.toLowerCase();
    const key = Object.keys(row.data).find(k => k.toLowerCase() === lowerField);
    return key ? row.data[key] : '';
  };

  const domain = cleanDomain(getValue('Domain'));
  
  // Create contact if contact information exists
  const contact: Contact = {
    id: Math.random().toString(36).substr(2, 9),
    affiliateId: '',
    firstName: getValue('First Name'),
    lastName: getValue('Last Name'),
    email: getValue('Email'),
    phone: getValue('Phone'),
    role: getValue('Role'),
    isPrimary: true,
    customFields: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const affiliate: AffiliateAccount = {
    id: Math.random().toString(36).substr(2, 9),
    domain,
    status: '',
    stage: getValue('Stage') || 'Identified',
    traffic: parseInt(getValue('Traffic')) || undefined,
    notes: getValue('Notes'),
    customFields: [],
    contacts: [contact],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  return affiliate;
}