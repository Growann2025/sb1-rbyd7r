import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { FieldService } from '../../../services/storage/FieldService';
import { autoMatchFields } from '../../../utils/fieldMatching';
import type { Field } from '../../../types/affiliate';

interface Props {
  data: string[][];
  onFieldsMatched: (mapping: Record<string, string>) => void;
  onBack: () => void;
}

const MatchFieldsStep: React.FC<Props> = ({ data, onFieldsMatched, onBack }) => {
  const headers = data[0] || [];
  const [mapping, setMapping] = useState<Record<string, string>>({});
  const [autoMatched, setAutoMatched] = useState<Set<string>>(new Set());
  
  const affiliateFields = FieldService.getAffiliateFields();
  const contactFields = FieldService.getContactFields();
  const placementFields = FieldService.getPlacementFields();

  useEffect(() => {
    const allFields = [...affiliateFields, ...contactFields, ...placementFields];
    const matches = autoMatchFields(headers, allFields);
    
    setMapping(matches);
    setAutoMatched(new Set(Object.keys(matches)));
    console.log('Auto-matched fields:', matches);
  }, [headers]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFieldsMatched(mapping);
  };

  const FieldMapping = ({ field }: { field: Field }) => {
    const isAutoMatched = autoMatched.has(field.id);
    const isRequired = field.required;
    const isMapped = !!mapping[field.id];

    return (
      <div className="flex items-center gap-4 p-3 bg-white rounded-lg border border-gray-200">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700">
            {field.name}
            {isRequired && <span className="text-red-500 ml-1">*</span>}
          </label>
          <p className="text-xs text-gray-500">{field.type}</p>
        </div>
        <select
          value={mapping[field.id] || ''}
          onChange={(e) => {
            setMapping(prev => ({ ...prev, [field.id]: e.target.value }));
            if (e.target.value === '') {
              setAutoMatched(prev => {
                const next = new Set(prev);
                next.delete(field.id);
                return next;
              });
            }
          }}
          className={`w-64 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            isAutoMatched ? 'bg-green-50 border-green-200' :
            !isMapped && isRequired ? 'border-red-200' :
            'border-gray-200'
          }`}
        >
          <option value="">Select column</option>
          {headers.map(header => (
            <option key={header} value={header}>{header}</option>
          ))}
        </select>
      </div>
    );
  };

  return (
    <div className="space-y-6 max-h-[calc(100vh-16rem)] overflow-y-auto">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Upload
      </button>

      <div>
        <h3 className="text-lg font-semibold">Match Your Fields</h3>
        <p className="text-gray-500">Fields have been automatically matched based on your CSV headers. Please review and adjust if needed.</p>
        <p className="text-sm text-gray-400 mt-1">Only Domain field is required</p>
      </div>

      <div className="space-y-8">
        {/* Field Groups */}
        <div className="space-y-3">
          <h4 className="font-medium text-gray-700">Affiliate Profile Fields</h4>
          {affiliateFields.map(field => (
            <FieldMapping key={field.id} field={field} />
          ))}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-700">Contact Fields</h4>
            {contactFields.map(field => (
              <FieldMapping key={field.id} field={field} />
            ))}
          </div>
          <div className="space-y-3">
            <h4 className="font-medium text-gray-700">Placement Fields</h4>
            {placementFields.map(field => (
              <FieldMapping key={field.id} field={field} />
            ))}
          </div>
        </div>

      </div>
      
      <button
        onClick={handleSubmit}
        className="mt-6 w-full px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        disabled={!mapping.domain}
      >
        {!mapping.domain ? 'Please map Domain field' : 'Continue to Preview'}
      </button>
    </div>
  );
};

export default MatchFieldsStep;