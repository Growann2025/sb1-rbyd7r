import { ParsedCSVData, ImportResult } from '../../types/csv';
import { parseCSV } from '../../utils/csv/parser';
import { validateCSVStructure, validateCSVRow } from '../../utils/csv/validator';
import { transformToAffiliate } from '../../utils/csv/transformer';
import { StorageService } from '../storage/StorageService';

export class CSVImportService {
  static async importCSV(fileContent: string): Promise<ImportResult> {
    try {
      // Parse CSV
      const parsedData = parseCSV(fileContent);
      
      // Validate structure
      const structureErrors = validateCSVStructure(parsedData.headers);
      if (structureErrors.length > 0) {
        return {
          success: false,
          message: 'Invalid CSV structure',
          importedCount: 0,
          errors: structureErrors
        };
      }

      // Validate and transform rows
      const validationResults = parsedData.rows.map(row => validateCSVRow(row));
      const invalidRows = validationResults.filter(result => !result.isValid);

      if (invalidRows.length > 0) {
        return {
          success: false,
          message: 'Validation errors found',
          importedCount: 0,
          errors: invalidRows.flatMap(row => 
            row.errors.map(error => `Row ${row.row.rowIndex}: ${error}`)
          )
        };
      }

      // Transform and save valid rows
      const affiliates = parsedData.rows.map(row => transformToAffiliate(row));
      const existingAffiliates = StorageService.getAffiliates();
      StorageService.saveAffiliates([...existingAffiliates, ...affiliates]);

      return {
        success: true,
        message: 'Import completed successfully',
        importedCount: affiliates.length
      };
    } catch (error) {
      return {
        success: false,
        message: 'Import failed',
        importedCount: 0,
        errors: [error instanceof Error ? error.message : 'Unknown error occurred']
      };
    }
  }
}