import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';
import * as cron from 'node-cron';
import * as moment from 'moment';
import { WebScraperDataSource } from '../data-sources/web-scraper';
import { GoogleTrendsDataSource } from '../data-sources/google-trends';
import { RedditDataSource } from '../data-sources/reddit-data';
import { MarketIntelligenceEngine, MarketIntelligence } from '../analytics/market-intelligence';
import * as _ from 'lodash';

export interface MarketAlert {
  id: string;
  type: 'trend_change' | 'sentiment_shift' | 'competitor_activity' | 'market_volatility' | 'opportunity_detected';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: number;
  data: any;
  industry: string;
}

export interface RealTimeMarketData {
  timestamp: number;
  industry: string;
  marketSize: number;
  growthRate: number;
  volatility: number;
  sentiment: number;
  competitorCount: number;
  trends: any[];
  alerts: MarketAlert[];
}

export class RealTimeMarketMonitor {
  private io: SocketIOServer;
  private webScraper: WebScraperDataSource;
  private googleTrends: GoogleTrendsDataSource;
  private redditData: RedditDataSource;
  private intelligenceEngine: MarketIntelligenceEngine;
  private activeMonitors: Map<string, NodeJS.Timeout> = new Map();
  private marketCache: Map<string, MarketIntelligence> = new Map();
  private alertHistory: MarketAlert[] = [];
  private subscribers: Map<string, string[]> = new Map(); // industry -> socketIds

  constructor(server: HTTPServer) {
    this.io = new SocketIOServer(server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"]
      }
    });

    this.webScraper = new WebScraperDataSource();
    this.googleTrends = new GoogleTrendsDataSource();
    this.redditData = new RedditDataSource();
    this.intelligenceEngine = new MarketIntelligenceEngine();

    this.setupSocketHandlers();
    this.setupAutomatedMonitoring();
  }

  private setupSocketHandlers() {
    this.io.on('connection', (socket) => {
      console.log(`🔌 Real-time monitor connected: ${socket.id}`);

      // Subscribe to market monitoring
      socket.on('subscribe_market', (industry: string) => {
        this.subscribeToMarket(socket.id, industry);
        console.log(`📊 Subscribed ${socket.id} to ${industry} market monitoring`);
        
        // Send current market data
        const currentData = this.marketCache.get(industry);
        if (currentData) {
          socket.emit('market_update', this.formatMarketData(industry, currentData));
        }
      });

      // Unsubscribe from market monitoring
      socket.on('unsubscribe_market', (industry: string) => {
        this.unsubscribeFromMarket(socket.id, industry);
        console.log(`📊 Unsubscribed ${socket.id} from ${industry} market monitoring`);
      });

      // Request historical alerts
      socket.on('get_alerts', (industry: string, limit: number = 50) => {
        const alerts = this.alertHistory
          .filter(alert => alert.industry === industry)
          .slice(-limit);
        socket.emit('historical_alerts', alerts);
      });

      // Set up custom alerts
      socket.on('set_alert', (alertConfig: {
        industry: string;
        type: string;
        threshold: number;
        condition: 'above' | 'below';
      }) => {
        this.setupCustomAlert(socket.id, alertConfig);
      });

      socket.on('disconnect', () => {
        this.handleDisconnect(socket.id);
        console.log(`🔌 Real-time monitor disconnected: ${socket.id}`);
      });
    });
  }

  private setupAutomatedMonitoring() {
    // Monitor markets every 5 minutes
    cron.schedule('*/5 * * * *', () => {
      this.updateAllMonitoredMarkets();
    });

    // Generate market intelligence reports every hour
    cron.schedule('0 * * * *', () => {
      this.generateMarketReports();
    });

    // Clean up old alerts daily
    cron.schedule('0 0 * * *', () => {
      this.cleanupOldAlerts();
    });
  }

  private async updateAllMonitoredMarkets() {
    const industries = Array.from(this.subscribers.keys());
    
    for (const industry of industries) {
      try {
        await this.updateMarketData(industry);
      } catch (error) {
        console.error(`Error updating market data for ${industry}:`, error);
      }
    }
  }

  private async updateMarketData(industry: string) {
    console.log(`🔄 Updating market data for ${industry}`);

    // Fetch real-time data from multiple sources
    const [trends, sentiment, competitors, marketSize, newsData, socialData] = await Promise.all([
      this.googleTrends.fetchTrends([industry]),
      this.redditData.fetchSentiment([industry]),
      this.webScraper.scrapeCompetitorAnalysis([industry]),
      this.webScraper.scrapeMarketSize(industry),
      this.webScraper.scrapeRealTimeNews(industry),
      this.redditData.fetchSentiment([industry])
    ]);

    // Prepare raw data for analysis
    const rawData = [
      { type: 'market_size', value: marketSize, timestamp: Date.now(), source: 'web_scraper' },
      { type: 'trends', value: trends.interest || 0, timestamp: Date.now(), source: 'google_trends' },
      { type: 'sentiment', value: sentiment.score || 0, timestamp: Date.now(), source: 'reddit' },
      ...competitors.map(comp => ({
        type: 'competitor',
        value: comp.funding || 0,
        timestamp: Date.now(),
        source: 'competitor_analysis',
        funding: comp.funding,
        employees: comp.employees,
        age: comp.founded
      }))
    ];

    // Generate market intelligence
    const intelligence = await this.intelligenceEngine.analyzeMarketIntelligence(
      industry,
      rawData,
      newsData,
      [socialData]
    );

    // Store in cache
    this.marketCache.set(industry, intelligence);

    // Check for alerts
    const alerts = this.checkForAlerts(industry, intelligence);

    // Broadcast to subscribers
    this.broadcastMarketUpdate(industry, intelligence, alerts);
  }

  private checkForAlerts(industry: string, intelligence: MarketIntelligence): MarketAlert[] {
    const alerts: MarketAlert[] = [];
    const previousIntelligence = this.marketCache.get(industry);

    if (!previousIntelligence) return alerts;

    // Trend change alerts
    if (intelligence.trends.length > 0 && previousIntelligence.trends.length > 0) {
      const currentTrend = intelligence.trends[0];
      const previousTrend = previousIntelligence.trends[0];
      
      if (currentTrend.direction !== previousTrend.direction) {
        alerts.push({
          id: `trend_${Date.now()}`,
          type: 'trend_change',
          severity: currentTrend.strength > 70 ? 'high' : 'medium',
          message: `Market trend changed from ${previousTrend.direction} to ${currentTrend.direction}`,
          timestamp: Date.now(),
          data: { current: currentTrend, previous: previousTrend },
          industry
        });
      }
    }

    // Sentiment shift alerts
    const sentimentChange = Math.abs(intelligence.sentiment.comparative - previousIntelligence.sentiment.comparative);
    if (sentimentChange > 0.2) {
      alerts.push({
        id: `sentiment_${Date.now()}`,
        type: 'sentiment_shift',
        severity: sentimentChange > 0.4 ? 'high' : 'medium',
        message: `Significant sentiment shift detected (${sentimentChange.toFixed(2)})`,
        timestamp: Date.now(),
        data: { change: sentimentChange, current: intelligence.sentiment },
        industry
      });
    }

    // Volatility alerts
    if (intelligence.volatility > 0.5) {
      alerts.push({
        id: `volatility_${Date.now()}`,
        type: 'market_volatility',
        severity: intelligence.volatility > 0.8 ? 'critical' : 'high',
        message: `High market volatility detected (${intelligence.volatility.toFixed(2)})`,
        timestamp: Date.now(),
        data: { volatility: intelligence.volatility },
        industry
      });
    }

    // Opportunity alerts
    if (intelligence.opportunityScore > 80) {
      alerts.push({
        id: `opportunity_${Date.now()}`,
        type: 'opportunity_detected',
        severity: 'high',
        message: `High opportunity score detected (${intelligence.opportunityScore})`,
        timestamp: Date.now(),
        data: { opportunityScore: intelligence.opportunityScore },
        industry
      });
    }

    // Add to alert history
    this.alertHistory.push(...alerts);

    return alerts;
  }

  private broadcastMarketUpdate(industry: string, intelligence: MarketIntelligence, alerts: MarketAlert[]) {
    const subscribers = this.subscribers.get(industry) || [];
    
    const marketData = this.formatMarketData(industry, intelligence);
    
    subscribers.forEach(socketId => {
      const socket = this.io.sockets.sockets.get(socketId);
      if (socket) {
        socket.emit('market_update', marketData);
        
        // Send alerts separately
        if (alerts.length > 0) {
          socket.emit('market_alerts', alerts);
        }
      }
    });
  }

  private formatMarketData(industry: string, intelligence: MarketIntelligence): RealTimeMarketData {
    return {
      timestamp: Date.now(),
      industry,
      marketSize: intelligence.marketSize,
      growthRate: intelligence.growthRate,
      volatility: intelligence.volatility,
      sentiment: intelligence.sentiment.comparative,
      competitorCount: Math.round(intelligence.competitiveIndex),
      trends: intelligence.trends,
      alerts: this.alertHistory.filter(alert => alert.industry === industry).slice(-10)
    };
  }

  private subscribeToMarket(socketId: string, industry: string) {
    if (!this.subscribers.has(industry)) {
      this.subscribers.set(industry, []);
    }
    
    const subscribers = this.subscribers.get(industry)!;
    if (!subscribers.includes(socketId)) {
      subscribers.push(socketId);
    }

    // Start monitoring if this is the first subscriber
    if (subscribers.length === 1) {
      this.startMarketMonitoring(industry);
    }
  }

  private unsubscribeFromMarket(socketId: string, industry: string) {
    const subscribers = this.subscribers.get(industry);
    if (subscribers) {
      const index = subscribers.indexOf(socketId);
      if (index > -1) {
        subscribers.splice(index, 1);
      }

      // Stop monitoring if no more subscribers
      if (subscribers.length === 0) {
        this.stopMarketMonitoring(industry);
      }
    }
  }

  private startMarketMonitoring(industry: string) {
    if (this.activeMonitors.has(industry)) return;

    // Initial data fetch
    this.updateMarketData(industry);

    // Set up periodic updates
    const interval = setInterval(() => {
      this.updateMarketData(industry);
    }, 5 * 60 * 1000); // 5 minutes

    this.activeMonitors.set(industry, interval);
    console.log(`🚀 Started monitoring ${industry} market`);
  }

  private stopMarketMonitoring(industry: string) {
    const interval = this.activeMonitors.get(industry);
    if (interval) {
      clearInterval(interval);
      this.activeMonitors.delete(industry);
      console.log(`🛑 Stopped monitoring ${industry} market`);
    }
  }

  private handleDisconnect(socketId: string) {
    // Remove from all subscriptions
    for (const [industry, subscribers] of this.subscribers.entries()) {
      const index = subscribers.indexOf(socketId);
      if (index > -1) {
        subscribers.splice(index, 1);
        
        // Stop monitoring if no more subscribers
        if (subscribers.length === 0) {
          this.stopMarketMonitoring(industry);
        }
      }
    }
  }

  private setupCustomAlert(socketId: string, alertConfig: any) {
    // Implementation for custom alerts based on user-defined thresholds
    console.log(`🔔 Setting up custom alert for ${socketId}:`, alertConfig);
  }

  private async generateMarketReports() {
    console.log('📊 Generating market intelligence reports...');
    
    for (const [industry, intelligence] of this.marketCache.entries()) {
      const report = {
        industry,
        timestamp: Date.now(),
        summary: {
          marketSize: intelligence.marketSize,
          growthRate: intelligence.growthRate,
          riskScore: intelligence.riskScore,
          opportunityScore: intelligence.opportunityScore,
          marketMaturity: intelligence.marketMaturity
        },
        predictions: intelligence.predictions,
        trends: intelligence.trends,
        recommendations: this.generateRecommendations(intelligence)
      };

      // Store report or send to subscribers
      console.log(`📈 Market report for ${industry}:`, report.summary);
    }
  }

  private generateRecommendations(intelligence: MarketIntelligence): string[] {
    const recommendations = [];

    if (intelligence.riskScore > 70) {
      recommendations.push('High risk detected - consider risk mitigation strategies');
    }

    if (intelligence.opportunityScore > 80) {
      recommendations.push('High opportunity detected - consider market entry or expansion');
    }

    if (intelligence.volatility > 0.5) {
      recommendations.push('High volatility - implement hedging strategies');
    }

    if (intelligence.marketMaturity === 'declining') {
      recommendations.push('Market in decline - consider pivot or exit strategies');
    }

    return recommendations;
  }

  private cleanupOldAlerts() {
    const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
    this.alertHistory = this.alertHistory.filter(alert => alert.timestamp > oneWeekAgo);
    console.log('🧹 Cleaned up old alerts');
  }

  // Public methods for external access
  public getMarketData(industry: string): MarketIntelligence | undefined {
    return this.marketCache.get(industry);
  }

  public getActiveMonitors(): string[] {
    return Array.from(this.activeMonitors.keys());
  }

  public getAlertHistory(industry?: string): MarketAlert[] {
    if (industry) {
      return this.alertHistory.filter(alert => alert.industry === industry);
    }
    return this.alertHistory;
  }
}
