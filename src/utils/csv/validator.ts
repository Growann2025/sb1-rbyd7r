import { CSVRow, ValidationResult } from '../../types/csv';
import { cleanDomain } from '../domain';
import { StorageService } from '../../services/storage/StorageService';

export function validateCSVRow(row: CSVRow): ValidationResult {
  const errors: string[] = [];
  
  if (!row?.data) {
    return {
      isValid: false,
      errors: ['Invalid row data'],
      row
    };
  }
  
  // Validate domain (required)
  const domainValue = row.data['Domain'] || row.data['domain'] || '';
  if (!domainValue) {
    errors.push('Domain is required');
  } else {
    const cleanedDomain = cleanDomain(domainValue);
    if (!cleanedDomain) {
      errors.push('Invalid domain format');
    }
  }

  // Validate traffic (if present)
  const trafficValue = row.data['Traffic'] || row.data['traffic'];
  if (trafficValue && isNaN(Number(trafficValue))) {
    errors.push('Traffic must be a number');
  }

  // Validate email (if present)
  const emailValue = row.data['Email'] || row.data['email'];
  if (emailValue && !emailValue.includes('@')) {
    errors.push('Invalid email format');
  }

  return {
    isValid: errors.length === 0,
    errors,
    row
  };
}

export function validateCSVStructure(headers: string[]): string[] {
  const errors: string[] = [];
  const requiredFields = ['Domain'];
  const normalizedHeaders = headers.map(h => h.toLowerCase());

  requiredFields.forEach(field => {
    if (!normalizedHeaders.includes(field.toLowerCase())) {
      errors.push(`Missing required column: ${field}`);
    }
  });

  return errors;
}

export function checkForDuplicates(rows: CSVRow[]): Map<string, string[]> {
  const duplicates = new Map<string, string[]>();
  const existingAffiliates = StorageService.getAffiliates();
  const existingDomains = new Set(existingAffiliates.map(a => cleanDomain(a.domain)));
  const seenDomains = new Set<string>();

  rows.forEach((row, index) => {
    if (!row?.data) {
      return;
    }
    
    const domainValue = row.data['Domain'] || row.data['domain'] || '';
    if (!domainValue) return;

    const cleanedDomain = cleanDomain(domainValue);
    if (!cleanedDomain) return;

    // Check for duplicates within the CSV
    if (seenDomains.has(cleanedDomain)) {
      const errors = duplicates.get(cleanedDomain) || [];
      errors.push(`Row ${index + 1}: Duplicate domain within CSV`);
      duplicates.set(cleanedDomain, errors);
    }
    seenDomains.add(cleanedDomain);

    // Check for duplicates in existing data
    if (existingDomains.has(cleanedDomain)) {
      const errors = duplicates.get(cleanedDomain) || [];
      errors.push(`Row ${index + 1}: Domain already exists in database`);
      duplicates.set(cleanedDomain, errors);
    }
  });

  return duplicates;
}