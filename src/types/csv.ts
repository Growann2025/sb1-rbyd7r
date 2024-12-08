export interface CSVRow {
  rowIndex: number;
  data: Record<string, string>;
}

export interface ParsedCSVData {
  headers: string[];
  rows: CSVRow[];
  totalRows: number;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  row: CSVRow;
}

export interface ImportResult {
  success: boolean;
  message: string;
  importedCount: number;
  errors?: string[];
}