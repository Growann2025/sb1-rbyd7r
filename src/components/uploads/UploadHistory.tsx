import React from 'react';
import { Calendar, CheckCircle, XCircle, FileText } from 'lucide-react';
import { StorageService, UploadRecord } from '../../services/storage/StorageService';

const UploadHistory: React.FC = () => {
  const [history, setHistory] = React.useState<UploadRecord[]>([]);

  React.useEffect(() => {
    setHistory(StorageService.getUploadHistory());
  }, []);

  if (history.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <p className="font-medium">No upload history available</p>
        <p className="text-sm">Upload some data to see the history here</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Upload History</h3>
      <div className="space-y-2">
        {history.map((record) => (
          <div 
            key={record.id}
            className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200"
          >
            <div className="flex items-center gap-3">
              {record.success ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <XCircle className="w-5 h-5 text-red-500" />
              )}
              <div>
                <p className="font-medium">{record.fileName}</p>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(record.date).toLocaleString()}</span>
                  <span>•</span>
                  <span>{record.recordCount} records</span>
                </div>
              </div>
            </div>
            {record.error && (
              <span className="text-sm text-red-500">{record.error}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default UploadHistory;