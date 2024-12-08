import React from 'react';
import type { Contact } from '../../../types/affiliate';

interface Props {
  contact: Contact;
  onClick: () => void;
}

const ContactCell: React.FC<Props> = ({ contact, onClick }) => {
  if (!contact) return null;

  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 hover:bg-gray-100 px-2 py-1 rounded-lg"
    >
      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-sm">
        {contact.firstName[0]}{contact.lastName[0]}
      </div>
      <span>
        {contact.firstName} {contact.lastName}
      </span>
    </button>
  );
};

export default ContactCell;