import React, { useState, useEffect } from 'react';
import { ArrowLeft, AlertTriangle, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { StorageService } from '../../../services/storage/StorageService';
import { cleanDomain } from '../../../utils/domain';
import { checkForDuplicates } from '../../../utils/csv/validator';
import type { AffiliateAccount, Contact } from '../../../types/affiliate';

const RECORDS_PER_PAGE = 10;

interface Props {
  data: string[][];
  fieldMapping: Record<string, string>;
  onBack: () => void;
  onComplete: () => void;
}

interface ValidatedRecord {
  isValid: boolean;
  errors: string[];
  record: {
    domain: string;
    traffic?: string;
    notes?: string;
    contact: {
      firstName?: string;
      lastName?: string;
      email?: string;
      phone?: string;
      role?: string;
    };
  };
}

const PreviewStep: React.FC<Props> = ({ data, fieldMapping, onBack, onComplete }) => {
  const [importing, setImporting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [records, setRecords] = useState<ValidatedRecord[]>([]);
  const [validCount, setValidCount] = useState(0);
  const [errorCount, setErrorCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [duplicates, setDuplicates] = useState<Map<string, string[]>>(new Map());
  
  const totalPages = Math.ceil(records.length / RECORDS_PER_PAGE);
  const startIndex = (currentPage - 1) * RECORDS_PER_PAGE;
  const visibleRecords = records.slice(startIndex, startIndex + RECORDS_PER_PAGE);

  const getMappedValue = (row: string[], fieldId: string): string => {
    const mappedColumn = fieldMapping[fieldId];
    if (!mappedColumn || !row) {
      console.log(`No mapping found for field ${fieldId}`);
      return '';
    }
    
    const headers = data[0] || [];
    const columnIndex = headers.findIndex(header => 
      header.toLowerCase().trim() === mappedColumn.toLowerCase().trim()
    );
    
    if (columnIndex === -1) {
      console.log(`Column not found for field ${fieldId}:`, mappedColumn);
      return '';
    }
    
    const value = row[columnIndex];
    return value ? value.trim() : '';
  };

  const validateRow = (row: string[]): ValidatedRecord => {
    const errors: string[] = [];
    
    // Skip empty rows
    if (!Array.isArray(row) || row.every(cell => !cell?.trim())) {
      return {
        isValid: false,
        errors: ['Empty row'],
        record: { domain: '', traffic: '', notes: '', contact: {} }
      };
    }
    
    // Log the row being processed
    console.log('Processing row:', row);

    const record = {
      domain: '',
      traffic: '',
      notes: '',
      placements: [],
      contact: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        role: ''
      }
    };

    // Get and validate domain value
    let domainValue = getMappedValue(row, 'domain');
    
    // Clean domain value and ensure it's a valid domain
    if (domainValue) {
      domainValue = domainValue.trim();
      // Remove protocol and trailing slashes if present
      domainValue = domainValue.replace(/^https?:\/\//i, '').replace(/\/+$/, '');
    }
    
    record.domain = domainValue;
    
    if (!record.domain) {
      errors.push('Missing required field "Domain"');
    }
    
    console.log('Domain value:', domainValue);

    // Get other fields
    record.traffic = getMappedValue(row, 'traffic');
    record.notes = getMappedValue(row, 'notes');
    
    // Get placement fields
    const title = getMappedValue(row, 'title');
    const type = getMappedValue(row, 'types');
    const url = getMappedValue(row, 'url');
    
    // Add placement if we have any placement data
    if (title || type || url) {
      record.placements = [{
        title: title || '',
        type: type || '',
        url: url || '',
        status: 'Active'
      }];
    }

    // Get contact fields
    record.contact = {
      firstName: getMappedValue(row, 'firstName'),
      lastName: getMappedValue(row, 'lastName'),
      email: getMappedValue(row, 'email'),
      phone: getMappedValue(row, 'phone'),
      role: getMappedValue(row, 'role')
    };

    return {
      isValid: errors.length === 0,
      errors,
      record
    };
  };

  useEffect(() => {
    if (!data || !Array.isArray(data)) {
      console.log('Invalid data array:', data);
      return;
    }
    
    // Skip header row (first row) and get data rows
    const dataRows = data.slice(1).filter(row => 
      Array.isArray(row) && row.length > 0 && row.some(cell => cell?.trim())
    ).map(row => ({
      rowIndex: 0,
      data: data[0].reduce((acc, header, idx) => {
        acc[header] = row[idx] || '';
        return acc;
      }, {} as Record<string, string>)
    }));

    // Check for duplicates
    const duplicateResults = checkForDuplicates(dataRows);
    setDuplicates(duplicateResults);
    
    console.log('Data rows to process:', dataRows.length);
    const processedRecords = dataRows.map(row => validateRow(Object.values(row.data)));

    // Add duplicate errors to validation results
    processedRecords.forEach((record, index) => {
      const domain = cleanDomain(record.record.domain);
      if (duplicateResults.has(domain)) {
        record.isValid = false;
        record.errors.push(...duplicateResults.get(domain) || []);
      }
    });
    
    setRecords(processedRecords);
    setValidCount(processedRecords.filter(r => r.isValid).length);
    setErrorCount(processedRecords.filter(r => !r.isValid).length);
  }, [data, fieldMapping]);

  const handleImport = async () => {
    if (errorCount > 0) return;
    setImporting(true);

    try {
      const affiliates: AffiliateAccount[] = records
        .filter(r => r.isValid && !duplicates.has(cleanDomain(r.record.domain)))
        .map(({ record }) => {
          // Clean domain by removing protocol and www if present
          const cleanDomain = record.domain.replace(/^(https?:\/\/)?(www\.)?/, '');

          const contact: Contact = {
            id: Math.random().toString(36).substr(2, 9),
            affiliateId: '',
            firstName: record.contact.firstName,
            lastName: record.contact.lastName,
            email: record.contact.email,
            phone: record.contact.phone,
            role: record.contact.role,
            isPrimary: true,
            customFields: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };

          const affiliate: AffiliateAccount = {
            id: Math.random().toString(36).substr(2, 9),
            domain: cleanDomain,
            status: '',
            stage: 'Identified',
            placements: record.placements?.map(p => ({
              id: Math.random().toString(36).substr(2, 9),
              affiliateId: '',
              title: p.title,
              type: p.type,
              url: p.url,
              status: 'Active',
              customFields: [],
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            })) || [],
            traffic: parseInt(record.traffic) || undefined,
            notes: record.notes,
            customFields: [],
            contacts: [contact],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };

          return affiliate;
        });

      const existingAffiliates = StorageService.getAffiliates();
      StorageService.saveAffiliates([...existingAffiliates, ...affiliates]);
      onComplete();
    } catch (error) {
      console.error('Import failed:', error);
      setValidationErrors(['Failed to import data. Please try again.']);
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="space-y-6 h-full">
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-gray-600 mb-2">Total Records</h3>
          <p className="text-3xl font-bold">{records.length}</p>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-gray-600 mb-2">Valid</h3>
          <p className="text-3xl font-bold text-green-600">{validCount}</p>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-gray-600 mb-2">Errors</h3>
          <p className="text-3xl font-bold text-red-600">{errorCount}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden flex-1">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-4 px-6 text-left text-sm font-medium text-gray-500">Status</th>
              <th className="py-4 px-6 text-left text-sm font-medium text-gray-500">Domain</th>
              <th className="py-4 px-6 text-left text-sm font-medium text-gray-500">Traffic</th>
              <th className="py-4 px-6 text-left text-sm font-medium text-gray-500">Contact</th>
              <th className="py-4 px-6 text-left text-sm font-medium text-gray-500">Errors</th>
            </tr>
          </thead>
          <tbody>
            {visibleRecords.map(({ isValid, errors, record }, index) => (
              <tr key={index} className="border-t border-gray-100">
                <td className="py-4 px-6">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    isValid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {isValid ? <Check className="w-4 h-4 mr-1" /> : <AlertTriangle className="w-4 h-4 mr-1" />}
                    {isValid ? 'Valid' : 'Error'}
                  </span>
                </td>
                <td className="py-4 px-6">{record.domain || '-'}</td>
                <td className="py-4 px-6">{record.traffic || '0'}</td>
                <td className="py-4 px-6">
                  {record.contact.firstName && record.contact.lastName 
                    ? `${record.contact.firstName} ${record.contact.lastName}`
                    : '-'}
                </td>
                <td className="py-4 px-6">
                  {errors.length > 0 ? (
                    <ul className="text-sm text-red-600">
                      {errors.map((error, i) => (
                        <li key={i}>{error}</li>
                      ))}
                    </ul>
                  ) : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="flex justify-end gap-4 mt-4 bg-white py-4 border-t border-gray-200">
        <button
          onClick={onBack}
          className="px-6 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
        >
          Back
        </button>
        <button
          onClick={handleImport}
          disabled={importing || errorCount > 0}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
        >
          {importing ? 'Importing...' : `Import ${validCount} Records`}
        </button>
      </div>
    </div>
  );
};

export default PreviewStep;