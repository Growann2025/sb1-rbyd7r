import { Field } from '../types/affiliate';

// Common variations of field names
const FIELD_PATTERNS: Record<string, string[]> = {
  domain: ['domain', 'website', 'url', 'site', 'web address', 'Domain', 'DOMAIN', 'Domain*'],
  firstName: ['first name', 'firstname', 'first', 'given name', 'givenname'],
  lastName: ['last name', 'lastname', 'last', 'surname', 'family name'],
  email: ['email', 'e-mail', 'mail', 'email address'],
  phone: ['phone', 'telephone', 'tel', 'mobile', 'cell'],
  role: ['role', 'position', 'title', 'job title', 'job role'],
  traffic: ['traffic', 'visitors', 'monthly visitors', 'audience', 'monthly traffic'],
  stage: ['stage', 'status', 'state', 'phase'],
  notes: ['notes', 'comments', 'description', 'details', 'additional info']
};

// Normalize string for comparison
const normalize = (str: string): string => {
  return str.toLowerCase()
    .replace(/[^a-z0-9]/g, '') // Remove all non-alphanumeric characters
    .trim();
};

// Calculate similarity between two strings (0-1)
const calculateSimilarity = (str1: string, str2: string): number => {
  const a = normalize(str1);
  const b = normalize(str2);
  
  // Exact match
  if (a === b) return 1;
  
  // Handle asterisk in field names (e.g., "Domain*")
  if (a.replace('*', '') === b || b.replace('*', '') === a) return 1;
  
  // Partial match
  if (a.includes(b) || b.includes(a)) return 0.9;
  
  // Check for partial matches
  const shorter = a.length < b.length ? a : b;
  const longer = a.length < b.length ? b : a;
  
  let matches = 0;
  for (let i = 0; i < shorter.length; i++) {
    if (shorter[i] === longer[i]) matches++;
  }
  
  return matches / longer.length;
};

// Find best match for a header
const findBestMatch = (header: string, patterns: string[]): number => {
  let bestScore = 0;
  
  patterns.forEach(pattern => {
    const score = calculateSimilarity(header, pattern);
    if (score > bestScore) {
      bestScore = score;
    }
  });
  
  return bestScore;
};

export const autoMatchFields = (headers: string[], fields: Field[]): Record<string, string> => {
  const mapping: Record<string, string> = {};
  const usedHeaders = new Set<string>();
  const normalizedHeaders = headers.map(h => h.toLowerCase());
  
  // First pass: Look for exact/close matches
  fields.forEach(field => {
    const patterns = FIELD_PATTERNS[field.id] || [field.name];
    let bestMatch = '';
    let bestScore = 0;
    
    normalizedHeaders.forEach((header, index) => {
      if (usedHeaders.has(header)) return;
      
      const score = findBestMatch(header, patterns);
      if (score > bestScore && score > 0.8) { // Threshold for high confidence match
        bestScore = score;
        bestMatch = headers[index];
      }
    });
    
    if (bestMatch) {
      mapping[field.id] = bestMatch;
      usedHeaders.add(bestMatch);
    }
  });
  
  // Second pass: Try to match remaining fields with lower confidence
  fields.forEach(field => {
    if (mapping[field.id]) return;
    
    const patterns = FIELD_PATTERNS[field.id] || [field.name];
    let bestMatch = '';
    let bestScore = 0;
    
    headers.forEach(header => {
      if (usedHeaders.has(header)) return;
      
      const score = findBestMatch(header, patterns);
      if (score > bestScore && score > 0.5) { // Lower threshold for second pass
        bestScore = score;
        bestMatch = header;
      }
    });
    
    if (bestMatch) {
      mapping[field.id] = bestMatch;
      usedHeaders.add(bestMatch.toLowerCase());
    }
  });
  
  return mapping;
};