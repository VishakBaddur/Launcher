import React, { useState, useEffect } from 'react';

interface AnalyticsMetrics {
  predictionAccuracy: number;
  userEngagement: {
    totalUsers: number;
    totalEvents: number;
    avgEventsPerUser: number;
    engagementRate: number;
    avgProcessingTime: number;
    enrichmentAdoptionRate: number;
  };
  performance: {
    avgResponseTime: number;
    cacheHitRate: number;
    dataProcessingTimeReduction: number;
    immediateVsEnrichedRatio: number;
  };
  resumeMetrics: {
    predictionAccuracy: string;
    dataProcessingTimeReduction: string;
    userEngagementIncrease: string;
    scalabilityImprovement: string;
    totalUsers: number;
    totalPredictions: number;
    avgResponseTime: string;
    cacheHitRate: string;
  };
  timestamp: string;
}

const AnalyticsDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<AnalyticsMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const fetchMetrics = async () => {
    try {
      const response = await fetch('https://launcher-backend-cxxk.onrender.com/api/analytics/metrics');
      if (response.ok) {
        const data = await response.json();
        setMetrics(data);
      }
    } catch (error) {
      console.error('Error fetching metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !metrics) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            <span className="text-gradient-animate">📊 Analytics Dashboard</span>
          </h1>
          <p className="text-lg text-gray-300">Production Metrics & Performance Insights</p>
        </div>

        {/* Resume Metrics - Key Differentiators */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="glass-card p-6">
            <div className="text-3xl font-bold text-green-400 mb-2">
              {metrics.resumeMetrics.predictionAccuracy}
            </div>
            <div className="text-sm text-gray-300">Prediction Accuracy</div>
            <div className="text-xs text-gray-400 mt-1">RAG-based AI systems</div>
          </div>

          <div className="glass-card p-6">
            <div className="text-3xl font-bold text-blue-400 mb-2">
              {metrics.resumeMetrics.dataProcessingTimeReduction}
            </div>
            <div className="text-sm text-gray-300">Processing Time Reduction</div>
            <div className="text-xs text-gray-400 mt-1">Real-time API integrations</div>
          </div>

          <div className="glass-card p-6">
            <div className="text-3xl font-bold text-purple-400 mb-2">
              {metrics.resumeMetrics.userEngagementIncrease}
            </div>
            <div className="text-sm text-gray-300">User Engagement Increase</div>
            <div className="text-xs text-gray-400 mt-1">Dynamic reporting dashboards</div>
          </div>

          <div className="glass-card p-6">
            <div className="text-3xl font-bold text-orange-400 mb-2">
              {metrics.resumeMetrics.scalabilityImprovement}x
            </div>
            <div className="text-sm text-gray-300">Scalability Improvement</div>
            <div className="text-xs text-gray-400 mt-1">Distributed architecture</div>
          </div>
        </div>

        {/* User Engagement Metrics */}
        <div className="glass-card p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">👥 User Engagement</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            <div>
              <div className="text-2xl font-bold text-white">{metrics.userEngagement.totalUsers}</div>
              <div className="text-sm text-gray-300">Total Users</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{metrics.userEngagement.totalEvents}</div>
              <div className="text-sm text-gray-300">Total Events</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">
                {metrics.userEngagement.avgEventsPerUser.toFixed(1)}
              </div>
              <div className="text-sm text-gray-300">Avg Events/User</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">
                {metrics.userEngagement.enrichmentAdoptionRate.toFixed(1)}%
              </div>
              <div className="text-sm text-gray-300">Enrichment Adoption</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">
                {metrics.userEngagement.avgProcessingTime.toFixed(0)}ms
              </div>
              <div className="text-sm text-gray-300">Avg Processing Time</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">
                {metrics.userEngagement.engagementRate.toFixed(1)}%
              </div>
              <div className="text-sm text-gray-300">Engagement Rate</div>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="glass-card p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">⚡ Performance</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="text-3xl font-bold text-green-400 mb-2">
                {metrics.performance.avgResponseTime.toFixed(0)}ms
              </div>
              <div className="text-sm text-gray-300">Average Response Time</div>
              <div className="text-xs text-gray-400 mt-1">
                Baseline: 5000ms | Reduction: {metrics.performance.dataProcessingTimeReduction.toFixed(1)}%
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-400 mb-2">
                {metrics.performance.cacheHitRate.toFixed(1)}%
              </div>
              <div className="text-sm text-gray-300">Cache Hit Rate</div>
              <div className="text-xs text-gray-400 mt-1">In-memory TTL cache (24h)</div>
            </div>
          </div>
        </div>

        {/* System Health */}
        <div className="glass-card p-8">
          <h2 className="text-2xl font-bold text-white mb-6">🔧 System Health</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-xl font-bold text-white">{metrics.resumeMetrics.totalPredictions}</div>
              <div className="text-sm text-gray-300">Total Predictions</div>
            </div>
            <div>
              <div className="text-xl font-bold text-white">{metrics.resumeMetrics.avgResponseTime}</div>
              <div className="text-sm text-gray-300">Avg Response Time</div>
            </div>
            <div>
              <div className="text-xl font-bold text-white">{metrics.resumeMetrics.cacheHitRate}</div>
              <div className="text-sm text-gray-300">Cache Hit Rate</div>
            </div>
            <div>
              <div className="text-xl font-bold text-green-400">Healthy</div>
              <div className="text-sm text-gray-300">System Status</div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-gray-400 text-sm">
          Last updated: {new Date(metrics.timestamp).toLocaleString()}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;





