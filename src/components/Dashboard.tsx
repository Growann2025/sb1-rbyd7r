import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Building2, CheckCircle2, XCircle, Clock, Target } from 'lucide-react';

const STORAGE_KEY = 'affiliate_profiles';

const Dashboard = () => {
  // Get actual data from localStorage
  const affiliates = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');

  // Calculate metrics based on actual data
  const metrics = {
    affiliateMetrics: {
      prospects: affiliates.filter(a => !a.status && !['In sequence', 'Placed', 'No Response', 'Not Interested'].includes(a.stage)).length,
      goodFit: affiliates.filter(a => a.status === 'Fit' && a.stage !== 'In sequence').length,
      badFit: affiliates.filter(a => a.status === 'Not a fit').length,
      outreach: affiliates.filter(a => a.stage === 'In sequence').length,
      recruited: affiliates.filter(a => a.stage === 'Placed').length,
      unresponsive: affiliates.filter(a => a.stage === 'No Response').length,
      notInterested: affiliates.filter(a => a.stage === 'Not Interested').length
    }
  };

  const totalAffiliates = affiliates.length;

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Prospects Review Card */}
        <Link 
          to="/affiliate-profiles" 
          className="block bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
        >
          <div className="p-8">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-white text-lg font-medium mb-2">Prospects Awaiting Review</h3>
                <p className="text-5xl font-bold text-white">{metrics.affiliateMetrics.prospects}</p>
                <div className="mt-4 flex items-center text-blue-100 hover:text-white">
                  <span>Review prospects</span>
                  <Users className="w-5 h-5 ml-2" />
                </div>
              </div>
              <Users className="w-16 h-16 text-blue-100" />
            </div>
          </div>
        </Link>

        {/* Qualified Affiliates Card */}
        <Link 
          to="/affiliate-profiles?tab=good-fit" 
          className="block bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
        >
          <div className="p-8">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-white text-lg font-medium mb-2">Qualified Affiliates Awaiting Outreach</h3>
                <p className="text-5xl font-bold text-white">{metrics.affiliateMetrics.goodFit}</p>
                <div className="mt-4 flex items-center text-green-100 hover:text-white">
                  <span>Start outreach</span>
                  <Target className="w-5 h-5 ml-2" />
                </div>
              </div>
              <Target className="w-16 h-16 text-green-100" />
            </div>
          </div>
        </Link>
      </div>

      <div className="space-y-6">
        <h2 className="text-lg font-semibold">Affiliate Profile Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Total Prospects</h3>
            <div className="mt-2 flex justify-between items-center">
              <span className="text-2xl font-bold">{metrics.affiliateMetrics.prospects}</span>
              <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                {totalAffiliates ? ((metrics.affiliateMetrics.prospects / totalAffiliates) * 100).toFixed(1) : '0'}%
              </span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-sm font-medium text-green-500">Good Fit</h3>
            <div className="mt-2 flex justify-between items-center">
              <span className="text-2xl font-bold">{metrics.affiliateMetrics.goodFit}</span>
              <span className="px-2 py-1 bg-green-100 text-green-600 rounded-full text-sm">
                {totalAffiliates ? ((metrics.affiliateMetrics.goodFit / totalAffiliates) * 100).toFixed(1) : '0'}%
              </span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-sm font-medium text-blue-500">In Outreach</h3>
            <div className="mt-2 flex justify-between items-center">
              <span className="text-2xl font-bold">{metrics.affiliateMetrics.outreach}</span>
              <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded-full text-sm">
                {totalAffiliates ? ((metrics.affiliateMetrics.outreach / totalAffiliates) * 100).toFixed(1) : '0'}%
              </span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-sm font-medium text-purple-500">Recruited</h3>
            <div className="mt-2 flex justify-between items-center">
              <span className="text-2xl font-bold">{metrics.affiliateMetrics.recruited}</span>
              <span className="px-2 py-1 bg-purple-100 text-purple-600 rounded-full text-sm">
                {totalAffiliates ? ((metrics.affiliateMetrics.recruited / totalAffiliates) * 100).toFixed(1) : '0'}%
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold mb-4">Affiliate Pipeline Distribution</h3>
          <div className="space-y-4">
            {[
              { label: 'Prospects', value: metrics.affiliateMetrics.prospects, color: 'bg-gray-500' },
              { label: 'Good Fit', value: metrics.affiliateMetrics.goodFit, color: 'bg-green-500' },
              { label: 'Bad Fit', value: metrics.affiliateMetrics.badFit, color: 'bg-red-500' },
              { label: 'Outreach', value: metrics.affiliateMetrics.outreach, color: 'bg-blue-500' },
              { label: 'Recruited', value: metrics.affiliateMetrics.recruited, color: 'bg-purple-500' },
              { label: 'Unresponsive', value: metrics.affiliateMetrics.unresponsive, color: 'bg-yellow-500' },
              { label: 'Not Interested', value: metrics.affiliateMetrics.notInterested, color: 'bg-orange-500' }
            ].map(({ label, value, color }) => (
              <div key={label}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">{label}</span>
                  <span className="text-sm text-gray-500">{value}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${color}`}
                    style={{
                      width: totalAffiliates ? `${(value / totalAffiliates) * 100}%` : '0%'
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;