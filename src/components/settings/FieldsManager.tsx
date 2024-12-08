import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { Field, CustomField } from '../../types/affiliate';
import { FieldService } from '../../services/storage/FieldService';
import { useFields } from '../../hooks/useFields';

interface FieldFormData {
  name: string;
  type: CustomField['type'];
  required: boolean;
  section: 'affiliate' | 'contact' | 'placement';
}

const FieldsManager: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingField, setEditingField] = useState<Field | null>(null);
  const [formData, setFormData] = useState<FieldFormData>({
    name: '',
    type: 'text',
    required: false,
    section: 'affiliate'
  });

  const fields = useFields();
  const affiliateFields = fields.filter(f => f.section === 'affiliate');
  const contactFields = fields.filter(f => f.section === 'contact');
  const placementFields = fields.filter(f => f.section === 'placement');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingField) {
      FieldService.updateField({
        ...editingField,
        ...formData
      });
    } else {
      FieldService.addField(formData);
    }

    setShowForm(false);
    setEditingField(null);
    setFormData({
      name: '',
      type: 'text',
      required: false,
      section: 'affiliate'
    });
  };

  const handleEdit = (field: Field) => {
    setEditingField(field);
    setFormData({
      name: field.name,
      type: field.type,
      required: field.required,
      section: field.section
    });
    setShowForm(true);
  };

  const handleDelete = (fieldId: string) => {
    if (confirm('Are you sure you want to delete this field? This may affect existing data.')) {
      FieldService.deleteField(fieldId);
    }
  };

  const renderFields = (fields: Field[], section: string) => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{section} Fields</h3>
      <div className="space-y-2">
        {fields.map(field => (
          <div
            key={field.id}
            className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200"
          >
            <div>
              <p className="font-medium">{field.name}</p>
              <p className="text-sm text-gray-500">
                Type: {field.type}
                {field.required && <span className="ml-2 text-red-500">Required</span>}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(field)}
                className="p-1 hover:bg-gray-100 rounded"
                disabled={field.id === 'domain'} // Prevent editing core fields
              >
                <Pencil className="w-4 h-4 text-gray-500" />
              </button>
              <button
                onClick={() => handleDelete(field.id)}
                className="p-1 hover:bg-gray-100 rounded"
                disabled={field.id === 'domain'} // Prevent deleting core fields
              >
                <Trash2 className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Custom Fields</h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          <Plus className="w-4 h-4" />
          Add Field
        </button>
      </div>

      {renderFields(affiliateFields, 'Affiliate Profile')}
      {renderFields(contactFields, 'Contact')}
      {renderFields(placementFields, 'Placement')}

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                {editingField ? 'Edit Field' : 'Add New Field'}
              </h3>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingField(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Field Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Field Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as CustomField['type'] }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="text">Text</option>
                  <option value="number">Number</option>
                  <option value="date">Date</option>
                  <option value="email">Email</option>
                  <option value="phone">Phone</option>
                  <option value="url">URL</option>
                  <option value="currency">Currency</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Section
                </label>
                <select
                  value={formData.section}
                  onChange={(e) => setFormData(prev => ({ ...prev, section: e.target.value as 'affiliate' | 'contact' | 'placement' }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="affiliate">Affiliate Profile</option>
                  <option value="contact">Contact</option>
                  <option value="placement">Placement</option>
                </select>
              </div>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.required}
                  onChange={(e) => setFormData(prev => ({ ...prev, required: e.target.checked }))}
                  className="rounded text-blue-500 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Required Field</span>
              </label>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingField(null);
                  }}
                  className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  {editingField ? 'Update' : 'Add'} Field
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FieldsManager;