import React, { useState } from 'react';
import { Upload, AlertCircle, Download } from 'lucide-react';

interface Props {
  onFileData: (data: string[][], fileName: string) => void;
}

const FileUploadStep: React.FC<Props> = ({ onFileData }) => {
  const [error, setError] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);

  const processFile = (file: File) => {
    if (!file.name.endsWith('.csv')) {
      setError('Please upload a CSV file');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.split(/\r?\n/)
          .filter(line => line.trim().length > 0)
          .map(line => parseCsvLine(line));

        if (lines.length < 2) {
          setError('File must contain at least a header row and one data row');
          return;
        }

        onFileData(lines, file.name);
        setError('');
      } catch (err) {
        setError('Invalid CSV format');
      }
    };
    reader.readAsText(file);
  };

  const parseCsvLine = (line: string): string[] => {
    const values: string[] = [];
    let currentValue = '';
    let insideQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        if (insideQuotes && line[i + 1] === '"') {
          // Handle escaped quotes
          currentValue += '"';
          i++;
        } else {
          insideQuotes = !insideQuotes;
        }
      } else if (char === ',' && !insideQuotes) {
        values.push(currentValue.trim());
        currentValue = '';
      } else {
        currentValue += char;
      }
    }
    
    values.push(currentValue.trim());
    return values.map(value => {
      if (value.startsWith('"') && value.endsWith('"')) {
        return value.slice(1, -1).trim();
      }
      return value.trim();
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      processFile(file);
    }
  };

  const downloadTemplate = () => {
    const headers = [
      'Domain',
      'Traffic',
      'Title (Optional)',
      'URL (Optional)',
      'Notes',
      'Stage',
      'Types',
      'Payment',
      'Full Name',
      'First Name',
      'Last Name',
      'Email',
      'Last Contact Date',
      'Role'
    ];

    const csvContent = [
      headers.join(','),
      'example.com,50000,Example Title,https://example.com/page,Some notes,Identified,Blog,PayPal,John Smith,John,Smith,john@example.com,2024-03-01,Marketing Director'
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'affiliate-profiles-template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold">Upload Your Data</h3>
          <p className="text-gray-500">Upload a CSV file containing your affiliate profiles</p>
        </div>
        <button
          onClick={downloadTemplate}
          className="flex items-center gap-2 text-blue-500 hover:text-blue-700"
        >
          <Download className="w-4 h-4" />
          Download Template
        </button>
      </div>

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <div className="mb-4">
          <p className="text-lg font-medium">
            {isDragging ? 'Drop your CSV file here' : 'Drag & drop your CSV file here'}
          </p>
          <p className="text-sm text-gray-500">or</p>
        </div>
        <label className="inline-block">
          <span className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 cursor-pointer">
            Choose CSV File
          </span>
          <input
            type="file"
            accept=".csv"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                processFile(file);
              }
            }}
            className="hidden"
          />
        </label>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-red-600 bg-red-50 p-4 rounded-lg">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default FileUploadStep;