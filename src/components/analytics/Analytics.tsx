{/* Previous imports remain the same */}
import React from 'react';
import { BarChart3, TrendingUp, Users, Target, Building2, CheckCircle2, XCircle, Clock } from 'lucide-react';

const Analytics = () => {
  // Sample metrics (in a real app, these would come from your data)
  const metrics = {
    totalProspects: 45,
    qualifiedLeads: 28,
    conversionRate: 62,
    avgTraffic: 156420,
    pipelineStages: {
      inSequence: 12,
      noResponse: 8,
      notAFit: 20,
      placed: 5
    },
    trafficPotential: 3245000
  };

  const StatsCard = ({ icon: Icon, label, value, trend = null, suffix = '' }) => (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-500">{label}</p>
          <p className="text-2xl font-bold mt-1">
            {typeof value === 'number' && !suffix.includes('%') 
              ? new Intl.NumberFormat().format(value)
              : value}
            {suffix}
          </p>
          {trend && (
            <p className={`text-sm ${trend >= 0 ? 'text-green-500' : 'text-red-500'} mt-2`}>
              {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}% from last month
            </p>
          )}
        </div>
        <Icon className="w-8 h-8 text-blue-500" />
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Recruitment Analytics</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          icon={Building2}
          label="Total Prospects"
          value={metrics.totalProspects}
          trend={15.3}
        />
        <StatsCard
          icon={Target}
          label="Qualified Leads"
          value={metrics.qualifiedLeads}
          trend={8.2}
        />
        <StatsCard
          icon={TrendingUp}
          label="Conversion Rate"
          value={metrics.conversionRate}
          suffix="%"
          trend={-2.1}
        />
        <StatsCard
          icon={Users}
          label="Avg. Site Traffic"
          value={metrics.avgTraffic}
          trend={12.5}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-lg font-semibold mb-6">Pipeline Overview</h2>
          <div className="space-y-4">
            {Object.entries(metrics.pipelineStages).map(([stage, count]) => {
              const icons = {
                inSequence: Clock,
                noResponse: XCircle,
                notAFit: XCircle,
                placed: CheckCircle2
              };
              const labels = {
                inSequence: 'In Sequence',
                noResponse: 'No Response',
                notAFit: 'Not a Fit',
                placed: 'Placed'
              };
              const Icon = icons[stage];
              
              return (
                <div key={stage} className="flex items-center gap-4">
                  <Icon className={`w-5 h-5 ${
                    stage === 'placed' ? 'text-green-500' :
                    stage === 'inSequence' ? 'text-blue-500' :
                    'text-gray-400'
                  }`} />
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">{labels[stage]}</span>
                      <span className="text-sm text-gray-500">{count}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          stage === 'placed' ? 'bg-green-500' :
                          stage === 'inSequence' ? 'bg-blue-500' :
                          'bg-gray-400'
                        }`}
                        style={{
                          width: `${(count / metrics.totalProspects) * 100}%`
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-lg font-semibold mb-6">Traffic Potential Distribution</h2>
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Total Potential Traffic</span>
                  <span className="text-sm font-medium">
                    {new Intl.NumberFormat().format(metrics.trafficPotential)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-green-500"
                    style={{ width: '75%' }}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Average Traffic per Site</p>
                <p className="text-xl font-semibold mt-1">
                  {new Intl.NumberFormat().format(metrics.avgTraffic)}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Sites with 100k+ Traffic</p>
                <p className="text-xl font-semibold mt-1">12</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-lg lg:col-span-2">
          <h2 className="text-lg font-semibold mb-6">Recruitment Progress</h2>
          <div className="h-64 flex items-center justify-center text-gray-500">
            Monthly recruitment trend chart placeholder
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-lg font-semibold mb-6">Response Rate</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm">First Contact</span>
                <span className="text-sm font-medium">68%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="h-2 rounded-full bg-blue-500" style={{ width: '68%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm">Follow-up</span>
                <span className="text-sm font-medium">45%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="h-2 rounded-full bg-blue-500" style={{ width: '45%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm">Agreement</span>
                <span className="text-sm font-medium">28%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="h-2 rounded-full bg-blue-500" style={{ width: '28%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;