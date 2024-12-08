import React, { useState, useEffect } from 'react';
import type { Contact } from '../../types/affiliate';
import ContactList from './ContactList';

const AFFILIATE_STORAGE_KEY = 'affiliate_profiles';
const CONTACTS_STORAGE_KEY = 'contacts';

const Contacts = () => {
  const [contacts, setContacts] = useState<Contact[]>(() => {
    // First try to get standalone contacts
    const savedContacts = localStorage.getItem(CONTACTS_STORAGE_KEY);
    const standaloneContacts = savedContacts ? JSON.parse(savedContacts) : [];

    // Then get contacts from affiliate profiles
    const savedAffiliates = localStorage.getItem(AFFILIATE_STORAGE_KEY);
    const affiliates = savedAffiliates ? JSON.parse(savedAffiliates) : [];
    const affiliateContacts = affiliates.flatMap(affiliate => 
      affiliate.contacts.map(contact => ({
        ...contact,
        companyName: affiliate.companyName // Add company name for reference
      }))
    );

    // Combine both sources, removing duplicates based on email
    const allContacts = [...standaloneContacts, ...affiliateContacts];
    const uniqueContacts = allContacts.reduce((acc, current) => {
      const x = acc.find(item => item.email === current.email);
      if (!x) {
        return acc.concat([current]);
      } else {
        return acc;
      }
    }, []);

    return uniqueContacts;
  });

  // Save standalone contacts to localStorage whenever they change
  useEffect(() => {
    // Only save contacts that aren't from affiliate profiles
    const standaloneContacts = contacts.filter(contact => !contact.companyName);
    localStorage.setItem(CONTACTS_STORAGE_KEY, JSON.stringify(standaloneContacts));
  }, [contacts]);

  const handleAddContact = (contactData: Omit<Contact, 'id'>) => {
    const newContact: Contact = {
      ...contactData,
      id: Math.random().toString(36).substr(2, 9)
    };
    setContacts(prev => [...prev, newContact]);
  };

  const handleUpdateContact = (updatedContact: Contact) => {
    setContacts(prev => prev.map(contact => 
      contact.id === updatedContact.id ? updatedContact : contact
    ));
  };

  const handleDeleteContacts = (contactIds: string[]) => {
    setContacts(prev => prev.filter(contact => !contactIds.includes(contact.id)));
  };

  return (
    <div className="p-6">
      <ContactList
        contacts={contacts}
        onAddContact={handleAddContact}
        onUpdateContact={handleUpdateContact}
        onDeleteContacts={handleDeleteContacts}
      />
    </div>
  );
};

export default Contacts;