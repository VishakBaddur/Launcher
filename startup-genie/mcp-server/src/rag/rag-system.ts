import * as _ from 'lodash';
import { GoogleTrendsDataSource } from '../data-sources/google-trends';
import { RedditDataSource } from '../data-sources/reddit-data';
import { WebScraperDataSource } from '../data-sources/web-scraper';

export interface MarketDataPoint {
  id: string;
  content: string;
  source: string;
  timestamp: number;
  keywords: string[];
  relevance: number;
  data: any;
}

export interface RAGResponse {
  retrievedData: MarketDataPoint[];
  generatedContent: string;
  insights: string[];
  recommendations: string[];
  confidence: number;
}

export class RAGSystem {
  private googleTrends: GoogleTrendsDataSource;
  private redditData: RedditDataSource;
  private webScraper: WebScraperDataSource;
  private marketDataCache: Map<string, MarketDataPoint[]> = new Map();

  constructor() {
    this.googleTrends = new GoogleTrendsDataSource();
    this.redditData = new RedditDataSource();
    this.webScraper = new WebScraperDataSource();
  }

  async retrieveMarketData(query: string, industry: string): Promise<MarketDataPoint[]> {
    const keywords = this.extractKeywords(query);
    const allData: MarketDataPoint[] = [];

    try {
      const [trends, sentiment, competitors, marketSize, newsData] = await Promise.all([
        this.googleTrends.fetchTrends(keywords),
        this.redditData.fetchSentiment(keywords),
        this.webScraper.scrapeCompetitorAnalysis(keywords),
        this.webScraper.scrapeMarketSize(industry),
        this.webScraper.scrapeRealTimeNews(query)
      ]);

      if (trends && trends.interest) {
        allData.push({
          id: `trends_${Date.now()}`,
          content: `Market trends show ${trends.interest}% interest in ${keywords.join(', ')}`,
          source: 'google_trends',
          timestamp: Date.now(),
          keywords: keywords,
          relevance: this.calculateRelevance(keywords, trends),
          data: trends
        });
      }

      if (sentiment && sentiment.score !== undefined) {
        allData.push({
          id: `sentiment_${Date.now()}`,
          content: `Market sentiment is ${sentiment.comparative > 0 ? 'positive' : 'negative'} with score ${sentiment.score}`,
          source: 'reddit',
          timestamp: Date.now(),
          keywords: keywords,
          relevance: this.calculateRelevance(keywords, sentiment),
          data: sentiment
        });
      }

      competitors.forEach((competitor, index) => {
        allData.push({
          id: `competitor_${index}_${Date.now()}`,
          content: `Competitor: ${competitor.name || 'Unknown'} - ${competitor.funding || 'No funding data'}`,
          source: 'competitor_analysis',
          timestamp: Date.now(),
          keywords: keywords,
          relevance: this.calculateRelevance(keywords, competitor),
          data: competitor
        });
      });

      if (marketSize) {
        allData.push({
          id: `market_size_${Date.now()}`,
          content: `Market size for ${industry}: ${marketSize}`,
          source: 'market_research',
          timestamp: Date.now(),
          keywords: keywords,
          relevance: this.calculateRelevance(keywords, { marketSize }),
          data: { marketSize }
        });
      }

      newsData.forEach((news, index) => {
        allData.push({
          id: `news_${index}_${Date.now()}`,
          content: `Recent news: ${typeof news === 'string' ? news : 'News update'}`,
          source: 'news',
          timestamp: Date.now(),
          keywords: keywords,
          relevance: this.calculateRelevance(keywords, news),
          data: news
        });
      });

      this.marketDataCache.set(query, allData);
      return allData;
    } catch (error) {
      console.error('Error retrieving market data:', error);
      return [];
    }
  }

  generateContentFromRetrievedData(retrievedData: MarketDataPoint[], query: string): RAGResponse {
    const relevantData = this.rankByRelevance(retrievedData, query);
    const insights = this.generateInsights(relevantData);
    const recommendations = this.generateRecommendations(relevantData, query);
    const generatedContent = this.createDynamicContent(relevantData, query);

    return {
      retrievedData: relevantData,
      generatedContent,
      insights,
      recommendations,
      confidence: this.calculateConfidence(relevantData)
    };
  }

  async processRAGQuery(query: string, industry: string): Promise<RAGResponse> {
    console.log(`🔍 RAG Processing: "${query}" for industry: ${industry}`);
    
    const retrievedData = await this.retrieveMarketData(query, industry);
    const ragResponse = this.generateContentFromRetrievedData(retrievedData, query);
    
    console.log(`✅ RAG Generated: ${ragResponse.insights.length} insights, ${ragResponse.recommendations.length} recommendations`);
    
    return ragResponse;
  }

  private extractKeywords(text: string): string[] {
    const words = text.toLowerCase().split(/\s+/);
    const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those']);
    
    return words
      .filter(word => word.length > 2 && !stopWords.has(word))
      .slice(0, 10);
  }

  private calculateRelevance(keywords: string[], data: any): number {
    const dataString = JSON.stringify(data).toLowerCase();
    const keywordMatches = keywords.filter(keyword => 
      dataString.includes(keyword.toLowerCase())
    ).length;
    
    return Math.min(keywordMatches / keywords.length, 1);
  }

  private rankByRelevance(data: MarketDataPoint[], query: string): MarketDataPoint[] {
    return data
      .sort((a, b) => b.relevance - a.relevance)
      .slice(0, 10);
  }

  private generateInsights(data: MarketDataPoint[]): string[] {
    const insights: string[] = [];
    
    const trendsData = data.filter(d => d.source === 'google_trends');
    if (trendsData.length > 0) {
      const trend = trendsData[0];
      if (trend.data.interest > 70) {
        insights.push(`High market interest detected: ${trend.data.interest}% trend growth`);
      } else if (trend.data.interest > 50) {
        insights.push(`Moderate market interest: ${trend.data.interest}% trend growth`);
      }
    }

    const sentimentData = data.filter(d => d.source === 'reddit');
    if (sentimentData.length > 0) {
      const sentiment = sentimentData[0];
      if (sentiment.data.comparative > 0.1) {
        insights.push(`Positive market sentiment detected: ${sentiment.data.comparative.toFixed(2)} sentiment score`);
      } else if (sentiment.data.comparative < -0.1) {
        insights.push(`Negative market sentiment detected: ${sentiment.data.comparative.toFixed(2)} sentiment score`);
      }
    }

    const competitorData = data.filter(d => d.source === 'competitor_analysis');
    if (competitorData.length > 0) {
      insights.push(`Found ${competitorData.length} competitors in the market`);
    }

    const marketData = data.filter(d => d.source === 'market_research');
    if (marketData.length > 0) {
      const market = marketData[0];
      insights.push(`Market size: ${market.data.marketSize}`);
    }

    return insights.length > 0 ? insights : ['Market analysis completed with available data'];
  }

  private generateRecommendations(data: MarketDataPoint[], query: string): string[] {
    const recommendations: string[] = [];
    
    const trendsData = data.filter(d => d.source === 'google_trends');
    if (trendsData.length > 0) {
      const trend = trendsData[0];
      if (trend.data.interest > 70) {
        recommendations.push('High market interest - consider aggressive market entry strategy');
      } else if (trend.data.interest > 50) {
        recommendations.push('Moderate market interest - focus on differentiation and unique value proposition');
      }
    }

    const sentimentData = data.filter(d => d.source === 'reddit');
    if (sentimentData.length > 0) {
      const sentiment = sentimentData[0];
      if (sentiment.data.comparative > 0.1) {
        recommendations.push('Positive sentiment - leverage market enthusiasm in marketing strategy');
      } else if (sentiment.data.comparative < -0.1) {
        recommendations.push('Negative sentiment - focus on addressing market concerns and pain points');
      }
    }

    const competitorData = data.filter(d => d.source === 'competitor_analysis');
    if (competitorData.length > 5) {
      recommendations.push('High competition - develop strong competitive advantages and unique positioning');
    } else if (competitorData.length > 0) {
      recommendations.push('Moderate competition - focus on market differentiation and customer experience');
    } else {
      recommendations.push('Low competition - first-mover advantage opportunity, focus on market education');
    }

    recommendations.push('Invest in technology and innovation');
    recommendations.push('Build strong partnerships and strategic alliances');
    recommendations.push('Focus on customer acquisition and retention strategies');

    return recommendations.slice(0, 5);
  }

  private createDynamicContent(data: MarketDataPoint[], query: string): string {
    const contentParts: string[] = [];
    
    contentParts.push(`Market Intelligence Report for: "${query}"`);
    contentParts.push(`Generated on: ${new Date().toLocaleDateString()}`);
    contentParts.push('');

    const marketData = data.filter(d => d.source === 'market_research');
    if (marketData.length > 0) {
      contentParts.push(`Market Size: ${marketData[0].data.marketSize}`);
    }

    const trendsData = data.filter(d => d.source === 'google_trends');
    if (trendsData.length > 0) {
      contentParts.push(`Market Trends: ${trendsData[0].data.interest}% interest growth`);
    }

    const sentimentData = data.filter(d => d.source === 'reddit');
    if (sentimentData.length > 0) {
      const sentiment = sentimentData[0];
      contentParts.push(`Market Sentiment: ${sentiment.data.comparative > 0 ? 'Positive' : 'Negative'} (${sentiment.data.comparative.toFixed(2)})`);
    }

    const competitorData = data.filter(d => d.source === 'competitor_analysis');
    contentParts.push(`Competition Level: ${competitorData.length > 5 ? 'High' : competitorData.length > 0 ? 'Moderate' : 'Low'}`);

    contentParts.push('');
    contentParts.push('Key Insights:');
    const insights = this.generateInsights(data);
    insights.forEach(insight => contentParts.push(`• ${insight}`));

    contentParts.push('');
    contentParts.push('Strategic Recommendations:');
    const recommendations = this.generateRecommendations(data, query);
    recommendations.forEach(rec => contentParts.push(`• ${rec}`));

    return contentParts.join('\n');
  }

  private calculateConfidence(data: MarketDataPoint[]): number {
    if (data.length === 0) return 0;
    
    const avgRelevance = _.mean(data.map(d => d.relevance));
    const dataQuality = Math.min(data.length / 10, 1);
    const recency = this.calculateRecency(data);
    
    return Math.min((avgRelevance * 0.5 + dataQuality * 0.3 + recency * 0.2) * 100, 100);
  }

  private calculateRecency(data: MarketDataPoint[]): number {
    if (data.length === 0) return 0;
    
    const now = Date.now();
    const avgAge = _.mean(data.map(d => now - d.timestamp));
    const maxAge = 24 * 60 * 60 * 1000;
    
    return Math.max(0, 1 - (avgAge / maxAge));
  }
}
