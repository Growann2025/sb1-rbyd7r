import { CSVRow, ParsedCSVData } from '../../types/csv';

export function parseCSV(csvContent: string): ParsedCSVData {
  // Split into lines and clean up empty lines
  const lines = csvContent.split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);

  if (lines.length < 2) {
    throw new Error('CSV must contain at least a header row and one data row');
  }

  // Parse headers
  const headers = parseCSVLine(lines[0]);

  // Parse data rows
  const rows: CSVRow[] = lines.slice(1).map((line, index) => {
    const values = parseCSVLine(line);
    const row: CSVRow = {
      rowIndex: index + 1,
      data: {}
    };

    headers.forEach((header, colIndex) => {
      row.data[header] = values[colIndex] || '';
    });

    return row;
  });

  return {
    headers,
    rows,
    totalRows: rows.length
  };
}

function parseCSVLine(line: string): string[] {
  const values: string[] = [];
  let currentValue = '';
  let insideQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];
    
    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        // Handle escaped quotes
        currentValue += '"';
        i++; // Skip next quote
      } else {
        // Toggle quote state
        insideQuotes = !insideQuotes;
      }
    } else if (char === ',' && !insideQuotes) {
      // End of field
      values.push(currentValue.trim());
      currentValue = '';
    } else {
      currentValue += char;
    }
  }
  
  // Add the last value
  values.push(currentValue.trim());
  
  // Clean up any remaining quotes at start/end of values
  return values.map(value => {
    if (value.startsWith('"') && value.endsWith('"')) {
      return value.slice(1, -1).trim();
    }
    return value.trim();
  });
}