import React, { useState } from 'react';
import { Search, Filter, Plus, Mail, Phone, Building2 } from 'lucide-react';
import type { Contact } from '../../types/affiliate';
import ContactModal from './ContactModal';
import DeleteConfirmation from './DeleteConfirmation';

interface Props {
  contacts: Contact[];
  onAddContact: (contact: Omit<Contact, 'id'>) => void;
  onUpdateContact: (contact: Contact) => void;
  onDeleteContacts: (contactIds: string[]) => void;
}

const ContactList: React.FC<Props> = ({ 
  contacts, 
  onAddContact, 
  onUpdateContact, 
  onDeleteContacts 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  const handleRowSelect = (contactId: string) => {
    setSelectedRows(prev => 
      prev.includes(contactId)
        ? prev.filter(id => id !== contactId)
        : [...prev, contactId]
    );
  };

  const handleSelectAll = () => {
    if (selectedRows.length === filteredContacts.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(filteredContacts.map(c => c.id));
    }
  };

  const handleDelete = () => {
    onDeleteContacts(selectedRows);
    setSelectedRows([]);
    setShowDeleteConfirmation(false);
  };

  const filteredContacts = contacts.filter(contact => {
    const searchString = searchTerm.toLowerCase();
    return (
      contact.firstName.toLowerCase().includes(searchString) ||
      contact.lastName.toLowerCase().includes(searchString) ||
      contact.email.toLowerCase().includes(searchString) ||
      (contact.role && contact.role.toLowerCase().includes(searchString)) ||
      (contact.companyName && contact.companyName.toLowerCase().includes(searchString))
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Contacts</h1>
        <div className="flex gap-3">
          {selectedRows.length > 0 && (
            <button
              onClick={() => setShowDeleteConfirmation(true)}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Delete Selected ({selectedRows.length})
            </button>
          )}
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            <Plus className="w-4 h-4" />
            Add Contact
          </button>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search contacts..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
          <Filter className="w-4 h-4" />
          Filter
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="w-8 py-3 px-4">
                <input
                  type="checkbox"
                  checked={selectedRows.length === filteredContacts.length && filteredContacts.length > 0}
                  onChange={handleSelectAll}
                  className="rounded text-blue-500 focus:ring-blue-500"
                />
              </th>
              <th className="text-left py-3 px-4">Name</th>
              <th className="text-left py-3 px-4">Company</th>
              <th className="text-left py-3 px-4">Email</th>
              <th className="text-left py-3 px-4">Phone</th>
              <th className="text-left py-3 px-4">Role</th>
              <th className="text-left py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredContacts.map(contact => (
              <tr 
                key={contact.id}
                className={`border-t border-gray-100 hover:bg-gray-50 ${
                  selectedRows.includes(contact.id) ? 'bg-blue-50' : ''
                }`}
              >
                <td className="py-3 px-4">
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(contact.id)}
                    onChange={() => handleRowSelect(contact.id)}
                    className="rounded text-blue-500 focus:ring-blue-500"
                  />
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                      <span className="text-gray-600">
                        {contact.firstName[0]}{contact.lastName[0]}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium">
                        {contact.firstName} {contact.lastName}
                        {contact.isPrimary && (
                          <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                            Primary
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4">
                  {contact.companyName ? (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Building2 className="w-4 h-4" />
                      {contact.companyName}
                    </div>
                  ) : (
                    <span className="text-gray-400">No company</span>
                  )}
                </td>
                <td className="py-3 px-4">
                  <a 
                    href={`mailto:${contact.email}`}
                    className="flex items-center gap-2 text-blue-500 hover:text-blue-700"
                  >
                    <Mail className="w-4 h-4" />
                    {contact.email}
                  </a>
                </td>
                <td className="py-3 px-4">
                  {contact.phone ? (
                    <a 
                      href={`tel:${contact.phone}`}
                      className="flex items-center gap-2 text-blue-500 hover:text-blue-700"
                    >
                      <Phone className="w-4 h-4" />
                      {contact.phone}
                    </a>
                  ) : (
                    <span className="text-gray-400">No phone</span>
                  )}
                </td>
                <td className="py-3 px-4">
                  {contact.role || 'No role'}
                </td>
                <td className="py-3 px-4">
                  <button
                    onClick={() => setEditingContact(contact)}
                    className="text-blue-500 hover:text-blue-700"
                    disabled={!!contact.companyName}
                    title={contact.companyName ? "Affiliate contacts can only be edited from the Affiliate Profile" : ""}
                  >
                    {contact.companyName ? 'View' : 'Edit'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {(showAddModal || editingContact) && (
        <ContactModal
          contact={editingContact}
          onClose={() => {
            setShowAddModal(false);
            setEditingContact(null);
          }}
          onSave={(contactData) => {
            if (editingContact) {
              onUpdateContact({ ...contactData, id: editingContact.id });
            } else {
              onAddContact(contactData);
            }
            setShowAddModal(false);
            setEditingContact(null);
          }}
        />
      )}

      {showDeleteConfirmation && (
        <DeleteConfirmation
          count={selectedRows.length}
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteConfirmation(false)}
        />
      )}
    </div>
  );
};

export default ContactList;