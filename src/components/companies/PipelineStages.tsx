import React from 'react';
import { Users, ThumbsUp, ThumbsDown, Send, MessageSquare, CheckCircle, Clock, XCircle } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import type { AffiliateAccount } from '../../models/AffiliateAccount';

interface StageConfig {
  id: string;
  label: string;
  icon: React.ElementType;
  color: string;
  group: 'prospecting' | 'active' | 'followup';
}

interface Props {
  affiliates: AffiliateAccount[];
}

const stages: StageConfig[] = [
  // Prospecting Group
  { 
    id: 'prospects',
    label: 'Prospects',
    icon: Users,
    color: 'border-gray-500 bg-gray-50 hover:bg-gray-100',
    group: 'prospecting'
  },
  {
    id: 'good-fit',
    label: 'Good Fit',
    icon: ThumbsUp,
    color: 'border-green-500 bg-green-50 hover:bg-green-100',
    group: 'prospecting'
  },
  {
    id: 'bad-fit',
    label: 'Bad Fit',
    icon: ThumbsDown,
    color: 'border-red-500 bg-red-50 hover:bg-red-100',
    group: 'prospecting'
  },
  // Active Engagement Group
  {
    id: 'outreach',
    label: 'Outreach',
    icon: Send,
    color: 'border-blue-500 bg-blue-50 hover:bg-blue-100',
    group: 'active'
  },
  {
    id: 'negotiation',
    label: 'Negotiation',
    icon: MessageSquare,
    color: 'border-purple-500 bg-purple-50 hover:bg-purple-100',
    group: 'active'
  },
  {
    id: 'recruited',
    label: 'Recruited',
    icon: CheckCircle,
    color: 'border-indigo-500 bg-indigo-50 hover:bg-indigo-100',
    group: 'active'
  },
  // Follow-up Group
  {
    id: 'unresponsive',
    label: 'Unresponsive',
    icon: Clock,
    color: 'border-yellow-500 bg-yellow-50 hover:bg-yellow-100',
    group: 'followup'
  },
  {
    id: 'not-interested',
    label: 'Not Interested',
    icon: XCircle,
    color: 'border-orange-500 bg-orange-50 hover:bg-orange-100',
    group: 'followup'
  }
];

const PipelineStages: React.FC<Props> = ({ affiliates }) => {
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'prospects';

  const getCounts = () => {
    const counts: Record<string, number> = {
      prospects: 0,
      'good-fit': 0,
      'bad-fit': 0,
      outreach: 0,
      negotiation: 0,
      recruited: 0,
      unresponsive: 0,
      'not-interested': 0
    };

    affiliates.forEach(affiliate => {
      switch (affiliate.stage) {
        case 'Identified':
          counts.prospects++;
          break;
        case 'Good Fit':
          counts['good-fit']++;
          break;
        case 'Bad Fit':
          counts['bad-fit']++;
          break;
        case 'In Sequence':
          counts.outreach++;
          break;
        case 'Negotiation':
          counts.negotiation++;
          break;
        case 'Placed':
          counts.recruited++;
          break;
        case 'No Response':
          counts.unresponsive++;
          break;
        case 'Not Interested':
          counts['not-interested']++;
          break;
      }
    });

    return counts;
  };

  const stageCounts = getCounts();

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="grid grid-cols-8 gap-4">
        {stages.map((stage, index) => {
          const isActive = activeTab === stage.id;
          const Icon = stage.icon;
          const count = stageCounts[stage.id] || 0;

          return (
            <Link
              key={stage.id}
              to={`?tab=${stage.id}`}
              className={`relative p-4 rounded-lg border-l-4 transition-all ${
                stage.color
              } ${
                isActive ? 'shadow-md' : 'hover:shadow-sm'
              }`}
            >
              <div className="flex flex-col items-center text-center gap-2">
                <Icon className={`w-5 h-5 ${isActive ? 'text-gray-700' : 'text-gray-500'}`} />
                <div>
                  <div className="text-2xl font-bold">
                    {count}
                  </div>
                  <span className={`text-sm font-medium ${isActive ? 'text-gray-900' : 'text-gray-700'}`}>
                    {stage.label}
                  </span>
                </div>
              </div>
              {index < stages.length - 1 && (
                <div className="absolute top-1/2 -right-4 transform -translate-y-1/2 w-4">
                  <div className="h-px w-full bg-gray-300"></div>
                  <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-2 h-2 border-t-2 border-r-2 border-gray-300 rotate-45"></div>
                </div>
              )}
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />
              )}
            </Link>
          );
        })}
      </div>
      <div className="mt-4 flex justify-between px-4">
        <div className="text-xs font-medium text-gray-500">Prospecting</div>
        <div className="text-xs font-medium text-gray-500">Active Engagement</div>
        <div className="text-xs font-medium text-gray-500">Follow-up</div>
      </div>
    </div>
  );
};

export default PipelineStages;