import React from 'react';

type StatusType = 'pending' | 'approved' | 'review' | 'rejected';

interface StatusConfig {
  color: string;
  label: string;
}

const statusConfigs: Record<StatusType, StatusConfig> = {
  pending: {
    color: 'bg-yellow-100 text-yellow-800',
    label: 'Pending',
  },
  approved: {
    color: 'bg-green-100 text-green-800',
    label: 'Approved',
  },
  review: {
    color: 'bg-blue-100 text-blue-800',
    label: 'In Review',
  },
  rejected: {
    color: 'bg-red-100 text-red-800',
    label: 'Rejected',
  },
};

interface Props {
  status: StatusType;
}

const AffiliateStatusBadge: React.FC<Props> = ({ status }) => {
  const config = statusConfigs[status];
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
      {config.label}
    </span>
  );
};

export default AffiliateStatusBadge;