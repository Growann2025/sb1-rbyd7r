import React, { useState } from 'react';
import { Upload, X, Check, AlertCircle } from 'lucide-react';

interface CSVData {
  firstName: string;
  lastName: string;
  email: string;
  website: string;
  status: string;
}

const CSVUpload = ({ onClose }: { onClose: () => void }) => {
  const [preview, setPreview] = useState<CSVData[]>([]);
  const [error, setError] = useState<string>('');

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      setError('Please upload a CSV file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.split('\n');
        const headers = lines[0].split(',');
        
        const data = lines.slice(1).map(line => {
          const values = line.split(',');
          return {
            firstName: values[0]?.trim() || '',
            lastName: values[1]?.trim() || '',
            email: values[2]?.trim() || '',
            website: values[3]?.trim() || '',
            status: 'pending'
          };
        }).filter(item => item.firstName && item.email);

        setPreview(data);
        setError('');
      } catch (err) {
        setError('Invalid CSV format');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[80vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-bold">Import Affiliates via CSV</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 flex-1 overflow-auto">
          {!preview.length ? (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <label className="block">
                <span className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 cursor-pointer">
                  Choose CSV File
                </span>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
              <p className="text-sm text-gray-500 mt-2">
                File should contain: First Name, Last Name, Email, Website
              </p>
            </div>
          ) : (
            <div>
              <div className="mb-4 flex items-center gap-2 text-green-600">
                <Check className="w-5 h-5" />
                <span>Found {preview.length} affiliates</span>
              </div>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left py-3 px-4">Name</th>
                      <th className="text-left py-3 px-4">Email</th>
                      <th className="text-left py-3 px-4">Website</th>
                    </tr>
                  </thead>
                  <tbody>
                    {preview.map((item, index) => (
                      <tr key={index} className="border-t border-gray-100">
                        <td className="py-3 px-4">
                          {item.firstName} {item.lastName}
                        </td>
                        <td className="py-3 px-4">{item.email}</td>
                        <td className="py-3 px-4">{item.website}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {error && (
            <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            disabled={!preview.length || !!error}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Import {preview.length} Affiliates
          </button>
        </div>
      </div>
    </div>
  );
};

export default CSVUpload;