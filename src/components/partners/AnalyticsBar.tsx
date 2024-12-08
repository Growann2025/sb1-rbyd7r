import React from 'react';
import { TrendingUp, Users } from 'lucide-react';
import type { AffiliateAccount, AffiliateStage } from '../../types/affiliate';

interface Props {
  affiliates: AffiliateAccount[];
}

const AnalyticsBar: React.FC<Props> = ({ affiliates }) => {
  const stages: AffiliateStage[] = ['Identified', 'Contacted', 'In Discussions', 'Signed Up'];
  
  const getStageCount = (stage: AffiliateStage) => {
    return affiliates.filter(a => a.stage === stage).length;
  };

  const getConversionRate = (fromStage: AffiliateStage, toStage: AffiliateStage) => {
    const fromCount = getStageCount(fromStage);
    const toCount = getStageCount(toStage);
    if (fromCount === 0) return 0;
    return Math.round((toCount / fromCount) * 100);
  };

  return (
    <div className="grid grid-cols-4 gap-4">
      {stages.map((stage, index) => {
        const count = getStageCount(stage);
        const conversionRate = index > 0 ? getConversionRate(stages[index - 1], stage) : null;

        return (
          <div key={stage} className="bg-white rounded-lg shadow p-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-sm text-gray-500">{stage}</h3>
                <p className="text-2xl font-bold mt-1">{count}</p>
                {conversionRate !== null && (
                  <p className="text-sm text-gray-500 mt-1">
                    <TrendingUp className="w-4 h-4 inline mr-1" />
                    {conversionRate}% conversion
                  </p>
                )}
              </div>
              <Users className="w-6 h-6 text-blue-500" />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AnalyticsBar;