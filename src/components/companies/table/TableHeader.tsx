import React from 'react';

interface Column {
  key: string;
  label: string;
  sortable: boolean;
}

interface Props {
  columns: Column[];
  visibleColumns: string[];
  selectedAll: boolean;
  onSelectAll: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const TableHeader: React.FC<Props> = ({ 
  columns, 
  visibleColumns, 
  selectedAll, 
  onSelectAll 
}) => {
  return (
    <thead className="bg-gray-50">
      <tr>
        <th className="w-8 py-3 px-4 sticky left-0 bg-gray-50">
          <input
            type="checkbox"
            checked={selectedAll}
            onChange={onSelectAll}
            className="rounded text-blue-500 focus:ring-blue-500"
          />
        </th>
        {columns.map(column => (
          visibleColumns.includes(column.key) && (
            <th
              key={column.key}
              className="text-left py-3 px-4 text-gray-500 font-medium"
            >
              <div className="flex items-center gap-1">
                {column.label}
              </div>
            </th>
          )
        ))}
      </tr>
    </thead>
  );
};

export default TableHeader;