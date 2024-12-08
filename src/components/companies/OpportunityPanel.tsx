import React, { useState } from 'react';
import { X, Plus, Pencil, Trash2 } from 'lucide-react';
import type { PlacementOpportunity, OpportunityType, OpportunityStatus } from '../../types/opportunity';
import OpportunityForm from './OpportunityForm';

interface Props {
  companyId: string;
  companyName: string;
  onClose: () => void;
}

const OpportunityPanel: React.FC<Props> = ({ companyId, companyName, onClose }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingOpportunity, setEditingOpportunity] = useState<PlacementOpportunity | null>(null);
  
  // Sample data - replace with actual data fetching
  const [opportunities, setOpportunities] = useState<PlacementOpportunity[]>([
    {
      id: '1',
      companyId,
      type: 'Blog',
      status: 'Active',
      pricing: 500,
      audienceReach: 50000,
      notes: 'Monthly blog post opportunity',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ]);

  const handleSave = (opportunity: Omit<PlacementOpportunity, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingOpportunity) {
      setOpportunities(prev => prev.map(opp => 
        opp.id === editingOpportunity.id 
          ? { ...opp, ...opportunity, updatedAt: new Date().toISOString() }
          : opp
      ));
    } else {
      const newOpportunity: PlacementOpportunity = {
        ...opportunity,
        id: Math.random().toString(36).substr(2, 9),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setOpportunities(prev => [...prev, newOpportunity]);
    }
    setShowForm(false);
    setEditingOpportunity(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this opportunity?')) {
      setOpportunities(prev => prev.filter(opp => opp.id !== id));
    }
  };

  const handleEdit = (opportunity: PlacementOpportunity) => {
    setEditingOpportunity(opportunity);
    setShowForm(true);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-end">
      <div className="bg-white w-full max-w-2xl h-full overflow-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold">Placement Opportunities</h2>
            <p className="text-gray-500">{companyName}</p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {!showForm ? (
            <>
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center gap-2 mb-6 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              >
                <Plus className="w-4 h-4" />
                Add Opportunity
              </button>

              <div className="space-y-4">
                {opportunities.map(opportunity => (
                  <div
                    key={opportunity.id}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="font-medium">{opportunity.type}</span>
                        <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          opportunity.status === 'Active' ? 'bg-green-100 text-green-800' :
                          opportunity.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                          opportunity.status === 'Completed' ? 'bg-blue-100 text-blue-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {opportunity.status}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(opportunity)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(opportunity.id)}
                          className="text-gray-400 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
                      <div>
                        <span className="block">Pricing</span>
                        <span className="text-gray-900 font-medium">
                          ${opportunity.pricing.toLocaleString()}
                        </span>
                      </div>
                      <div>
                        <span className="block">Audience Reach</span>
                        <span className="text-gray-900 font-medium">
                          {opportunity.audienceReach.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    {opportunity.notes && (
                      <p className="mt-2 text-sm text-gray-500">{opportunity.notes}</p>
                    )}
                  </div>
                ))}

                {opportunities.length === 0 && (
                  <div className="text-center text-gray-500 py-8">
                    <p>No opportunities added yet</p>
                    <p className="text-sm">Click the button above to add your first opportunity</p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <OpportunityForm
              companyId={companyId}
              initialData={editingOpportunity}
              onSave={handleSave}
              onCancel={() => {
                setShowForm(false);
                setEditingOpportunity(null);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default OpportunityPanel;