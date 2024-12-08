import React, { useState } from 'react';
import { X, Mail, Calendar, MessageSquare, Star, ThumbsUp, ThumbsDown } from 'lucide-react';
import type { AffiliateAccount, CommunicationEntry } from '../../types/affiliate';

interface Props {
  affiliate: AffiliateAccount;
  onClose: () => void;
  onUpdate: (affiliate: AffiliateAccount) => void;
}

const AffiliateDetails: React.FC<Props> = ({ affiliate, onClose, onUpdate }) => {
  const [activeTab, setActiveTab] = useState<'info' | 'communication'>('info');
  const [newNote, setNewNote] = useState('');

  const addCommunicationEntry = (type: CommunicationEntry['type'], content: string) => {
    const newEntry: CommunicationEntry = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      content,
      date: new Date().toISOString()
    };

    onUpdate({
      ...affiliate,
      communicationHistory: [newEntry, ...affiliate.communicationHistory],
      updatedAt: new Date().toISOString()
    });
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    
    addCommunicationEntry('note', newNote);
    setNewNote('');
  };

  const handleMarkStatus = (status: 'Fit' | 'Not a fit') => {
    onUpdate({
      ...affiliate,
      status,
      updatedAt: new Date().toISOString()
    });
    addCommunicationEntry('note', `Marked as ${status}`);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-end z-50">
      <div className="bg-white w-full max-w-2xl h-full overflow-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold">{affiliate.companyName}</h2>
            <p className="text-gray-500">{affiliate.niche}</p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Status Action Bar */}
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Current Status:</span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                affiliate.status === 'Fit' 
                  ? 'bg-green-100 text-green-800'
                  : affiliate.status === 'Not a fit'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {affiliate.status || 'Undefined'}
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleMarkStatus('Fit')}
                disabled={affiliate.status === 'Fit'}
                className={`flex items-center gap-2 px-3 py-1 rounded-lg text-sm ${
                  affiliate.status === 'Fit'
                    ? 'bg-green-100 text-green-800 cursor-not-allowed'
                    : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <ThumbsUp className="w-4 h-4" />
                Good Fit
              </button>
              <button
                onClick={() => handleMarkStatus('Not a fit')}
                disabled={affiliate.status === 'Not a fit'}
                className={`flex items-center gap-2 px-3 py-1 rounded-lg text-sm ${
                  affiliate.status === 'Not a fit'
                    ? 'bg-red-100 text-red-800 cursor-not-allowed'
                    : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <ThumbsDown className="w-4 h-4" />
                Bad Fit
              </button>
            </div>
          </div>
        </div>

        <div className="border-b border-gray-200">
          <nav className="flex">
            <button
              onClick={() => setActiveTab('info')}
              className={`px-6 py-3 font-medium text-sm ${
                activeTab === 'info'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Information
            </button>
            <button
              onClick={() => setActiveTab('communication')}
              className={`px-6 py-3 font-medium text-sm ${
                activeTab === 'communication'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Communication History
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'info' ? (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Score</h3>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < affiliate.affiliateScore
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {affiliate.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-gray-100 rounded-full text-sm text-gray-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Contacts</h3>
                <div className="space-y-3">
                  {affiliate.contacts.map(contact => (
                    <div
                      key={contact.id}
                      className="flex justify-between items-start p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium">
                          {contact.firstName} {contact.lastName}
                          {contact.isPrimary && (
                            <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                              Primary
                            </span>
                          )}
                        </p>
                        <p className="text-sm text-gray-500">{contact.email}</p>
                        {contact.role && (
                          <p className="text-sm text-gray-500">{contact.role}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Notes</h3>
                <p className="text-gray-700">{affiliate.notes}</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <form onSubmit={handleAddNote} className="space-y-3">
                <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Add a note..."
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={!newNote.trim()}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                  >
                    Add Note
                  </button>
                </div>
              </form>

              <div className="space-y-4">
                {affiliate.communicationHistory.map(entry => (
                  <div
                    key={entry.id}
                    className="p-4 bg-gray-50 rounded-lg space-y-2"
                  >
                    <div className="flex items-center gap-2">
                      {entry.type === 'email' && <Mail className="w-4 h-4" />}
                      {entry.type === 'meeting' && <Calendar className="w-4 h-4" />}
                      {entry.type === 'note' && <MessageSquare className="w-4 h-4" />}
                      <span className="text-sm text-gray-500">
                        {new Date(entry.date).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-gray-700">{entry.content}</p>
                    {entry.status && (
                      <span className="inline-block px-2 py-1 bg-gray-100 rounded text-xs text-gray-700">
                        {entry.status}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AffiliateDetails;