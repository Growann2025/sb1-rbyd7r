import React from 'react';
import { ExternalLink } from 'lucide-react';
import { cleanDomain } from '../../utils/domain';

interface Props {
  domain: string;
}

const DomainCell: React.FC<Props> = ({ domain }) => {
  const cleanedDomain = cleanDomain(domain);
  const faviconUrl = `https://www.google.com/s2/favicons?domain=${cleanedDomain}&sz=16`;
  const fullUrl = domain.startsWith('http') ? domain : `https://${domain}`;

  return (
    <a
      href={fullUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 text-blue-500 hover:text-blue-700"
    >
      <img 
        src={faviconUrl}
        alt=""
        className="w-4 h-4"
        onError={(e) => {
          e.currentTarget.style.display = 'none';
        }}
      />
      <span>{cleanedDomain}</span>
      <ExternalLink className="w-4 h-4" />
    </a>
  );
};

export default DomainCell;