import React from 'react';
import { Settings2, AlertCircle } from 'lucide-react';

export interface Column {
  key: string;
  label: string;
  sortable?: boolean;
}

interface Props {
  columns: Column[];
  visibleColumns: string[];
  onToggleColumn: (columnKey: string) => void;
  maxColumns?: number;
}

const ColumnVisibility: React.FC<Props> = ({ 
  columns, 
  visibleColumns, 
  onToggleColumn,
  maxColumns = 8
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleToggle = (columnKey: string) => {
    const isCurrentlyVisible = visibleColumns.includes(columnKey);
    if (!isCurrentlyVisible && visibleColumns.length >= maxColumns) {
      alert(`You can only display up to ${maxColumns} columns at a time`);
      return;
    }
    onToggleColumn(columnKey);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
      >
        <Settings2 className="w-4 h-4" />
        Columns ({visibleColumns.length}/{maxColumns})
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <h3 className="text-sm font-medium text-gray-700">Show/Hide Columns</h3>
              <span className="text-xs text-gray-500">
                ({visibleColumns.length}/{maxColumns})
              </span>
            </div>
            {visibleColumns.length >= maxColumns && (
              <div className="flex items-center gap-2 p-2 mb-3 bg-yellow-50 rounded-lg text-yellow-800 text-xs">
                <AlertCircle className="w-4 h-4" />
                <span>Maximum {maxColumns} columns allowed</span>
              </div>
            )}
            <div className="space-y-2">
              {columns.map(column => (
                <label key={column.key} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={visibleColumns.includes(column.key)}
                    onChange={() => handleToggle(column.key)}
                    className="rounded text-blue-500 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{column.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ColumnVisibility;