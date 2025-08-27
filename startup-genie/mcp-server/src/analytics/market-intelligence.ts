import * as natural from 'natural';
import sentiment from 'sentiment';
import compromise from 'compromise';
import { Matrix } from 'ml-matrix';
import { LinearRegression } from 'ml-regression';
import { kmeans } from 'ml-kmeans';
import * as technicalIndicators from 'technicalindicators';
import moment from 'moment';
import * as _ from 'lodash';
import NodeCache from 'node-cache';

export interface MarketDataPoint {
  timestamp: number;
  value: number;
  source: string;
  confidence: number;
}

export interface MarketTrend {
  direction: 'up' | 'down' | 'stable';
  strength: number;
  confidence: number;
  timeframe: string;
  factors: string[];
}

export interface SentimentAnalysis {
  score: number;
  comparative: number;
  tokens: string[];
  positive: string[];
  negative: string[];
  confidence: number;
}

export interface MarketIntelligence {
  marketSize: number;
  growthRate: number;
  volatility: number;
  trends: MarketTrend[];
  sentiment: SentimentAnalysis;
  riskScore: number;
  opportunityScore: number;
  competitiveIndex: number;
  marketMaturity: 'emerging' | 'growing' | 'mature' | 'declining';
  predictions: {
    nextMonth: number;
    nextQuarter: number;
    nextYear: number;
    confidence: number;
  };
}

export class MarketIntelligenceEngine {
  private cache: NodeCache;
  private tokenizer: natural.WordTokenizer;
  private sentimentAnalyzer: sentiment;
  private regressionModel: LinearRegression | null = null;

  constructor() {
    this.cache = new NodeCache({ stdTTL: 3600 }); // 1 hour cache
    this.tokenizer = new natural.WordTokenizer();
    this.sentimentAnalyzer = new sentiment();
  }

  // Debug helper to check for NaN values
  private debugNaN(data: any, label: string): void {
    console.log(`🔍 DEBUG [${label}]: Checking for NaN values...`);
    
    if (typeof data === 'number' && isNaN(data)) {
      console.error(`❌ NaN detected in ${label}:`, data);
      return;
    }
    
    if (typeof data === 'object' && data !== null) {
      for (const [key, value] of Object.entries(data)) {
        if (typeof value === 'number' && isNaN(value)) {
          console.error(`❌ NaN detected in ${label}.${key}:`, value);
        } else if (typeof value === 'object' && value !== null) {
          this.debugNaN(value, `${label}.${key}`);
        }
      }
    }
  }

  // Safe number conversion with NaN handling
  private safeNumber(value: any, defaultValue: number = 0): number {
    if (value === null || value === undefined || value === '') {
      return defaultValue;
    }
    
    const num = parseFloat(value);
    return isNaN(num) ? defaultValue : num;
  }

  // Clean response to remove any NaN values
  private cleanResponse(data: any): any {
    if (typeof data === 'number') {
      return isNaN(data) ? 0 : data;
    }
    
    if (typeof data === 'object' && data !== null) {
      if (Array.isArray(data)) {
        return data.map(item => this.cleanResponse(item));
      } else {
        const cleaned: any = {};
        for (const [key, value] of Object.entries(data)) {
          cleaned[key] = this.cleanResponse(value);
        }
        return cleaned;
      }
    }
    
    return data;
  }

  // Real-time market data processing with ML
  async analyzeMarketIntelligence(
    industry: string,
    rawData: any[],
    newsData: any[],
    socialData: any[]
  ): Promise<MarketIntelligence> {
    console.log(`🧠 Starting market intelligence analysis for: ${industry}`);
    console.log(`📊 Raw data count: ${rawData.length}, News: ${newsData.length}, Social: ${socialData.length}`);
    
    // Debug input data
    this.debugNaN(rawData, 'rawData');
    this.debugNaN(newsData, 'newsData');
    this.debugNaN(socialData, 'socialData');

    const cacheKey = `market_intelligence_${industry}_${moment().format('YYYY-MM-DD-HH')}`;
    const cached = this.cache.get<MarketIntelligence>(cacheKey);
    if (cached) {
      console.log(`📋 Using cached market intelligence for ${industry}`);
      return cached;
    }

    try {
      // Process raw market data with safe handling
      const marketData = this.processMarketData(rawData);
      console.log(`📈 Processed market data points: ${marketData.length}`);
      this.debugNaN(marketData, 'marketData');

      const trends = this.analyzeTrends(marketData);
      console.log(`📊 Generated trends: ${trends.length}`);
      this.debugNaN(trends, 'trends');

      const sentiment = this.analyzeSentiment(newsData, socialData);
      console.log(`😊 Sentiment analysis completed`);
      this.debugNaN(sentiment, 'sentiment');

      const predictions = this.generatePredictions(marketData, trends);
      console.log(`🔮 Predictions generated`);
      this.debugNaN(predictions, 'predictions');

      // Calculate advanced metrics with safe handling
      const volatility = this.calculateVolatility(marketData);
      const riskScore = this.calculateRiskScore(marketData, sentiment, trends);
      const opportunityScore = this.calculateOpportunityScore(marketData, trends, sentiment);
      const competitiveIndex = this.calculateCompetitiveIndex(rawData);

      console.log(`📊 Calculated metrics - Volatility: ${volatility}, Risk: ${riskScore}, Opportunity: ${opportunityScore}, Competition: ${competitiveIndex}`);

      const intelligence: MarketIntelligence = {
        marketSize: this.extractMarketSize(rawData),
        growthRate: this.calculateGrowthRate(marketData),
        volatility,
        trends,
        sentiment,
        riskScore,
        opportunityScore,
        competitiveIndex,
        marketMaturity: this.determineMarketMaturity(marketData, trends),
        predictions
      };

      // Clean the response to remove any NaN values
      const cleanedIntelligence = this.cleanResponse(intelligence);
      this.debugNaN(cleanedIntelligence, 'finalIntelligence');

      this.cache.set(cacheKey, cleanedIntelligence);
      console.log(`✅ Market intelligence analysis completed for ${industry}`);
      
      return cleanedIntelligence;
    } catch (error) {
      console.error(`❌ Error in market intelligence analysis:`, error);
      // Return safe defaults
      return this.getSafeDefaults(industry);
    }
  }

  // Safe defaults when analysis fails
  private getSafeDefaults(industry: string): MarketIntelligence {
    console.log(`🛡️ Returning safe defaults for ${industry}`);
    return {
      marketSize: 1000000, // $1M default
      growthRate: 0.05, // 5% default
      volatility: 0.2, // 20% default
      trends: [],
      sentiment: {
        score: 0,
        comparative: 0,
        tokens: [],
        positive: [],
        negative: [],
        confidence: 0
      },
      riskScore: 50,
      opportunityScore: 50,
      competitiveIndex: 50,
      marketMaturity: 'mature',
      predictions: {
        nextMonth: 1000000,
        nextQuarter: 1000000,
        nextYear: 1000000,
        confidence: 0.5
      }
    };
  }

  // Advanced trend analysis using technical indicators
  private analyzeTrends(data: MarketDataPoint[]): MarketTrend[] {
    const trends: MarketTrend[] = [];
    
    if (data.length < 10) {
      console.log(`⚠️ Insufficient data for trend analysis: ${data.length} points`);
      return trends;
    }

    try {
      // Convert to price array for technical analysis
      const prices = data.map(d => this.safeNumber(d.value, 0));
      console.log(`📊 Prices for trend analysis: ${prices.length} points`);
      
      // Validate prices
      if (prices.some(p => p <= 0)) {
        console.log(`⚠️ Some prices are zero or negative, using safe defaults`);
        return trends;
      }

      // Calculate technical indicators with error handling
      let sma20: number[] = [];
      let sma50: number[] = [];
      let rsi: number[] = [];
      let macd: any[] = [];

      try {
        sma20 = technicalIndicators.SMA.calculate({ period: 20, values: prices });
        sma50 = technicalIndicators.SMA.calculate({ period: 50, values: prices });
        rsi = technicalIndicators.RSI.calculate({ period: 14, values: prices });
        macd = technicalIndicators.MACD.calculate({ 
          fastPeriod: 12, 
          slowPeriod: 26, 
          signalPeriod: 9, 
          values: prices
        });
      } catch (error) {
        console.error(`❌ Error calculating technical indicators:`, error);
        return trends;
      }

      // Analyze trend direction and strength
      if (sma20.length > 0 && sma50.length > 0) {
        const currentSMA20 = this.safeNumber(sma20[sma20.length - 1], 0);
        const currentSMA50 = this.safeNumber(sma50[sma50.length - 1], 0);
        const previousSMA20 = this.safeNumber(sma20[sma20.length - 2] || currentSMA20, 0);
        const previousSMA50 = this.safeNumber(sma50[sma50.length - 2] || currentSMA50, 0);

        if (currentSMA50 > 0) {
          const direction = currentSMA20 > currentSMA50 ? 'up' : 'down';
          const strength = Math.abs(currentSMA20 - currentSMA50) / currentSMA50;
          const momentum = previousSMA20 > 0 ? (currentSMA20 - previousSMA20) / previousSMA20 : 0;

          trends.push({
            direction,
            strength: Math.min(strength * 100, 100),
            confidence: this.calculateConfidence(data),
            timeframe: 'medium-term',
            factors: this.extractTrendFactors(rsi, macd, momentum)
          });
        }
      }

      console.log(`📈 Generated ${trends.length} trends`);
      return trends;
    } catch (error) {
      console.error(`❌ Error in trend analysis:`, error);
      return trends;
    }
  }

  // ML-powered sentiment analysis
  private analyzeSentiment(newsData: any[], socialData: any[]): SentimentAnalysis {
    try {
      const allText = [...newsData, ...socialData]
        .map(item => item.title || item.content || item.text || '')
        .join(' ');

      if (!allText.trim()) {
        console.log(`⚠️ No text data for sentiment analysis`);
        return this.getSafeSentiment();
      }

      // Use compromise for NLP preprocessing
      let processedText = '';
      try {
        const doc = compromise(allText);
        processedText = doc.normalize().text();
      } catch (error) {
        console.error(`❌ Error in NLP preprocessing:`, error);
        processedText = allText;
      }

      // Analyze sentiment using multiple approaches
      let sentimentResult;
      try {
        sentimentResult = this.sentimentAnalyzer.analyze(processedText);
      } catch (error) {
        console.error(`❌ Error in sentiment analysis:`, error);
        return this.getSafeSentiment();
      }
      
      // Enhanced sentiment analysis with confidence scoring
      const confidence = this.calculateSentimentConfidence(sentimentResult, allText);
      
      // Extract key sentiment indicators
      let tokens: string[] = [];
      try {
        tokens = this.tokenizer.tokenize(processedText) || [];
      } catch (error) {
        console.error(`❌ Error in tokenization:`, error);
        tokens = [];
      }

      const positive = tokens.filter(token => 
        natural.PorterStemmer.stem(token).length > 2 && 
        sentimentResult.positive.includes(token)
      );
      const negative = tokens.filter(token => 
        natural.PorterStemmer.stem(token).length > 2 && 
        sentimentResult.negative.includes(token)
      );

      const result = {
        score: this.safeNumber(sentimentResult.score, 0),
        comparative: this.safeNumber(sentimentResult.comparative, 0),
        tokens,
        positive,
        negative,
        confidence: this.safeNumber(confidence, 0)
      };

      console.log(`😊 Sentiment analysis completed - Score: ${result.score}, Comparative: ${result.comparative}`);
      return result;
    } catch (error) {
      console.error(`❌ Error in sentiment analysis:`, error);
      return this.getSafeSentiment();
    }
  }

  private getSafeSentiment(): SentimentAnalysis {
    return {
      score: 0,
      comparative: 0,
      tokens: [],
      positive: [],
      negative: [],
      confidence: 0
    };
  }

  // ML regression for market predictions
  private generatePredictions(data: MarketDataPoint[], trends: MarketTrend[]): any {
    if (data.length < 20) {
      console.log(`⚠️ Insufficient data for predictions: ${data.length} points`);
      return {
        nextMonth: 0,
        nextQuarter: 0,
        nextYear: 0,
        confidence: 0
      };
    }

    try {
      // Prepare training data
      const x = data.map((_, index) => [index, index * index]); // Time and time^2 features
      const y = data.map(d => this.safeNumber(d.value, 0));

      // Validate training data
      if (y.some(val => val <= 0)) {
        console.log(`⚠️ Invalid values in training data, using safe defaults`);
        return {
          nextMonth: 0,
          nextQuarter: 0,
          nextYear: 0,
          confidence: 0
        };
      }

      // Train linear regression model
      this.regressionModel = new LinearRegression(x, y);
      this.regressionModel.train();

      // Generate predictions
      const currentIndex = data.length;
      const nextMonth = currentIndex + 30;
      const nextQuarter = currentIndex + 90;
      const nextYear = currentIndex + 365;

      const predictions = {
        nextMonth: this.safeNumber(this.regressionModel.predict([nextMonth, nextMonth * nextMonth]), 0),
        nextQuarter: this.safeNumber(this.regressionModel.predict([nextQuarter, nextQuarter * nextQuarter]), 0),
        nextYear: this.safeNumber(this.regressionModel.predict([nextYear, nextYear * nextYear]), 0),
        confidence: this.calculatePredictionConfidence(data, trends)
      };

      console.log(`🔮 Predictions generated - Next month: ${predictions.nextMonth}, Confidence: ${predictions.confidence}`);
      return predictions;
    } catch (error) {
      console.error(`❌ Error in prediction generation:`, error);
      return {
        nextMonth: 0,
        nextQuarter: 0,
        nextYear: 0,
        confidence: 0
      };
    }
  }

  // Advanced volatility calculation
  private calculateVolatility(data: MarketDataPoint[]): number {
    if (data.length < 2) return 0;

    try {
      const returns = [];
      for (let i = 1; i < data.length; i++) {
        const currentValue = this.safeNumber(data[i].value, 0);
        const previousValue = this.safeNumber(data[i-1].value, 0);
        
        if (previousValue > 0) {
          const return_rate = (currentValue - previousValue) / previousValue;
          returns.push(return_rate);
        }
      }

      if (returns.length === 0) return 0;

      const mean = _.mean(returns);
      const variance = _.mean(returns.map(r => Math.pow(r - mean, 2)));
      const volatility = Math.sqrt(variance) * Math.sqrt(252); // Annualized volatility
      
      return this.safeNumber(volatility, 0);
    } catch (error) {
      console.error(`❌ Error in volatility calculation:`, error);
      return 0;
    }
  }

  // ML-based risk scoring
  private calculateRiskScore(data: MarketDataPoint[], sentiment: SentimentAnalysis, trends: MarketTrend[]): number {
    try {
      let riskScore = 50; // Base risk score

      // Volatility risk
      const volatility = this.calculateVolatility(data);
      riskScore += this.safeNumber(volatility * 20, 0);

      // Sentiment risk
      if (sentiment.comparative < -0.1) riskScore += 15;
      if (sentiment.comparative > 0.1) riskScore -= 10;

      // Trend risk
      const bearishTrends = trends.filter(t => t.direction === 'down');
      riskScore += bearishTrends.length * 5;

      // Market data confidence risk
      const avgConfidence = _.mean(data.map(d => this.safeNumber(d.confidence, 0)));
      riskScore += (1 - avgConfidence) * 10;

      return Math.min(Math.max(this.safeNumber(riskScore, 50), 0), 100);
    } catch (error) {
      console.error(`❌ Error in risk score calculation:`, error);
      return 50;
    }
  }

  // Opportunity scoring with ML
  private calculateOpportunityScore(data: MarketDataPoint[], trends: MarketTrend[], sentiment: SentimentAnalysis): number {
    try {
      let opportunityScore = 50;

      // Growth opportunity
      const growthRate = this.calculateGrowthRate(data);
      opportunityScore += this.safeNumber(growthRate * 10, 0);

      // Bullish trends
      const bullishTrends = trends.filter(t => t.direction === 'up');
      opportunityScore += bullishTrends.length * 8;

      // Positive sentiment
      if (sentiment.comparative > 0.1) opportunityScore += 15;

      // Market momentum
      const momentum = this.calculateMomentum(data);
      opportunityScore += this.safeNumber(momentum * 5, 0);

      return Math.min(Math.max(this.safeNumber(opportunityScore, 50), 0), 100);
    } catch (error) {
      console.error(`❌ Error in opportunity score calculation:`, error);
      return 50;
    }
  }

  // Competitive analysis using clustering
  private calculateCompetitiveIndex(rawData: any[]): number {
    if (rawData.length === 0) return 0;

    try {
      // Extract competitor metrics
      const competitorMetrics = rawData
        .filter(item => item.type === 'competitor')
        .map(item => [
          this.safeNumber(item.funding || 0, 0), 
          this.safeNumber(item.employees || 0, 0), 
          this.safeNumber(item.age || 0, 0)
        ]);

      if (competitorMetrics.length === 0) return 0;

      // Use k-means clustering to analyze competitive landscape
      const clusters = kmeans(competitorMetrics, Math.min(3, competitorMetrics.length));
      
      // Calculate competitive intensity based on cluster distribution
      const clusterSizes = clusters.clusters.map((cluster: any) => cluster.length);
      const maxClusterSize = Math.max(...clusterSizes);
      const totalCompetitors = competitorMetrics.length;
      
      // Higher concentration in clusters indicates higher competition
      return this.safeNumber((maxClusterSize / totalCompetitors) * 100, 0);
    } catch (error) {
      console.error(`❌ Error in competitive index calculation:`, error);
      return 0;
    }
  }

  // Helper methods
  private processMarketData(rawData: any[]): MarketDataPoint[] {
    try {
      return rawData
        .filter(item => item.value && item.timestamp)
        .map(item => ({
          timestamp: new Date(item.timestamp).getTime(),
          value: this.safeNumber(item.value, 0),
          source: item.source || 'unknown',
          confidence: this.safeNumber(item.confidence, 0.8)
        }))
        .sort((a, b) => a.timestamp - b.timestamp);
    } catch (error) {
      console.error(`❌ Error in market data processing:`, error);
      return [];
    }
  }

  private extractMarketSize(rawData: any[]): number {
    try {
      const marketSizeData = rawData.find(item => item.type === 'market_size');
      return marketSizeData ? this.safeNumber(marketSizeData.value, 1000000) : 1000000;
    } catch (error) {
      console.error(`❌ Error in market size extraction:`, error);
      return 1000000;
    }
  }

  private calculateGrowthRate(data: MarketDataPoint[]): number {
    if (data.length < 2) return 0;
    
    try {
      const firstValue = this.safeNumber(data[0].value, 0);
      const lastValue = this.safeNumber(data[data.length - 1].value, 0);
      const timeSpan = (data[data.length - 1].timestamp - data[0].timestamp) / (1000 * 60 * 60 * 24 * 365); // Years
      
      if (timeSpan > 0 && firstValue > 0) {
        return this.safeNumber(((lastValue - firstValue) / firstValue) / timeSpan, 0);
      }
      return 0;
    } catch (error) {
      console.error(`❌ Error in growth rate calculation:`, error);
      return 0;
    }
  }

  private calculateMomentum(data: MarketDataPoint[]): number {
    if (data.length < 10) return 0;
    
    try {
      const recent = data.slice(-10);
      const older = data.slice(-20, -10);
      
      const recentAvg = _.mean(recent.map(d => this.safeNumber(d.value, 0)));
      const olderAvg = _.mean(older.map(d => this.safeNumber(d.value, 0)));
      
      return olderAvg > 0 ? this.safeNumber((recentAvg - olderAvg) / olderAvg, 0) : 0;
    } catch (error) {
      console.error(`❌ Error in momentum calculation:`, error);
      return 0;
    }
  }

  private calculateConfidence(data: MarketDataPoint[]): number {
    try {
      const avgConfidence = _.mean(data.map(d => this.safeNumber(d.confidence, 0)));
      const dataQuality = Math.min(data.length / 100, 1); // More data = higher quality
      return this.safeNumber(avgConfidence * dataQuality, 0);
    } catch (error) {
      console.error(`❌ Error in confidence calculation:`, error);
      return 0;
    }
  }

  private calculateSentimentConfidence(sentimentResult: any, text: string): number {
    try {
      const wordCount = text.split(' ').length;
      const tokenCount = sentimentResult.tokens.length;
      const analysisDepth = Math.min(tokenCount / wordCount, 1);
      const sentimentStrength = Math.abs(this.safeNumber(sentimentResult.comparative, 0));
      
      return Math.min(this.safeNumber(analysisDepth * sentimentStrength * 100, 0), 100);
    } catch (error) {
      console.error(`❌ Error in sentiment confidence calculation:`, error);
      return 0;
    }
  }

  private calculatePredictionConfidence(data: MarketDataPoint[], trends: MarketTrend[]): number {
    try {
      const dataQuality = Math.min(data.length / 50, 1);
      const trendConsistency = trends.length > 0 ? _.mean(trends.map(t => this.safeNumber(t.confidence, 0))) : 0;
      const volatility = this.calculateVolatility(data);
      const volatilityPenalty = Math.max(0, 1 - volatility);
      
      return (dataQuality * 0.4 + trendConsistency * 0.4 + volatilityPenalty * 0.2) * 100;
    } catch (error) {
      console.error(`❌ Error in prediction confidence calculation:`, error);
      return 0;
    }
  }

  private extractTrendFactors(rsi: number[], macd: any[], momentum: number): string[] {
    const factors = [];
    
    try {
      if (rsi.length > 0) {
        const currentRSI = this.safeNumber(rsi[rsi.length - 1], 50);
        if (currentRSI > 70) factors.push('Overbought conditions');
        else if (currentRSI < 30) factors.push('Oversold conditions');
      }
      
      if (macd.length > 0) {
        const currentMACD = macd[macd.length - 1];
        if (currentMACD.MACD > currentMACD.signal) factors.push('Bullish MACD crossover');
        else factors.push('Bearish MACD crossover');
      }
      
      if (momentum > 0.05) factors.push('Strong upward momentum');
      else if (momentum < -0.05) factors.push('Strong downward momentum');
    } catch (error) {
      console.error(`❌ Error in trend factor extraction:`, error);
    }
    
    return factors;
  }

  private determineMarketMaturity(data: MarketDataPoint[], trends: MarketTrend[]): 'emerging' | 'growing' | 'mature' | 'declining' {
    try {
      const growthRate = this.calculateGrowthRate(data);
      const volatility = this.calculateVolatility(data);
      const trendDirection = trends.length > 0 ? trends[0].direction : 'stable';
      
      if (growthRate > 0.2 && volatility > 0.3) return 'emerging';
      if (growthRate > 0.1 && trendDirection === 'up') return 'growing';
      if (growthRate < -0.05 || trendDirection === 'down') return 'declining';
      return 'mature';
    } catch (error) {
      console.error(`❌ Error in market maturity determination:`, error);
      return 'mature';
    }
  }
}
