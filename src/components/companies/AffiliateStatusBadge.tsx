import React from 'react';

type StatusType = 'approved' | 'pending' | 'review' | 'rejected' | 'Fit' | 'Not a fit' | '';

interface StatusConfig {
  color: string;
  label: string;
}

const statusConfigs: Record<StatusType, StatusConfig> = {
  'approved': {
    color: 'bg-green-100 text-green-800',
    label: 'Approved',
  },
  'pending': {
    color: 'bg-yellow-100 text-yellow-800',
    label: 'Pending',
  },
  'review': {
    color: 'bg-blue-100 text-blue-800',
    label: 'In Review',
  },
  'rejected': {
    color: 'bg-red-100 text-red-800',
    label: 'Rejected',
  },
  'Fit': {
    color: 'bg-green-100 text-green-800',
    label: 'Good Fit',
  },
  'Not a fit': {
    color: 'bg-red-100 text-red-800',
    label: 'Not a Fit',
  },
  '': {
    color: 'bg-gray-100 text-gray-800',
    label: 'Undefined',
  }
};

interface Props {
  status: StatusType;
}

const AffiliateStatusBadge: React.FC<Props> = ({ status }) => {
  const config = statusConfigs[status] || statusConfigs[''];
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
      {config.label}
    </span>
  );
};

export default AffiliateStatusBadge;