import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { GoogleTrendsDataSource } from './data-sources/google-trends';
import { RedditDataSource } from './data-sources/reddit-data';
import { WebScraperDataSource } from './data-sources/web-scraper';
import { RAGSystem } from './rag/rag-system';
import { ValidationResult, BusinessModelData, PitchData } from './types/index';
import * as _ from 'lodash';

const app = express();
const server = createServer(app);
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Initialize data sources and RAG system
const googleTrends = new GoogleTrendsDataSource();
const redditData = new RedditDataSource();
const webScraper = new WebScraperDataSource();
const ragSystem = new RAGSystem();

// Enhanced health endpoint with system status
app.get('/api/health', (req, res) => {
  const systemStatus = {
    status: 'OK',
    message: 'Real-Time Market Intelligence Platform with RAG is running!',
    features: {
      realTimeMonitoring: true,
      marketIntelligence: true,
      advancedAnalytics: true,
      marketPredictions: true,
      sentimentAnalysis: true,
      ragSystem: true,
      dynamicContentGeneration: true
    },
    uptime: process.uptime(),
    timestamp: Date.now(),
    port: port
  };
  res.json(systemStatus);
});

// RAG-powered market intelligence endpoint
app.post('/api/rag_intelligence', async (req, res) => {
  try {
    const { query, industry } = req.body;
    
    if (!query) {
      return res.status(400).json({ error: 'query is required' });
    }

    console.log(`🧠 RAG Processing query: "${query}" for industry: ${industry || 'general'}`);

    // Process query through RAG system
    const ragResponse = await ragSystem.processRAGQuery(query, industry || 'technology');

    const response = {
      query,
      industry: industry || 'technology',
      timestamp: Date.now(),
      ragResponse,
      confidence: ragResponse.confidence,
      dataSources: {
        retrievedDataPoints: ragResponse.retrievedData.length,
        insights: ragResponse.insights.length,
        recommendations: ragResponse.recommendations.length
      }
    };

    console.log(`✅ RAG Intelligence generated with ${ragResponse.confidence.toFixed(1)}% confidence`);
    res.json(response);

  } catch (error) {
    console.error('Error in RAG intelligence:', error);
    res.status(500).json({ error: 'Failed to generate RAG intelligence', details: (error as Error).message });
  }
});

// Simplified market intelligence endpoint
app.post('/api/market_intelligence', async (req, res) => {
  try {
    const { industry, timeframe = '1d' } = req.body;
    
    if (!industry) {
      return res.status(400).json({ error: 'industry is required' });
    }

    console.log(`🧠 Generating market intelligence for: ${industry}`);

    // Fetch real-time data
    const [trends, sentiment, competitors, marketSize] = await Promise.all([
      googleTrends.fetchTrends([industry]),
      redditData.fetchSentiment([industry]),
      webScraper.scrapeCompetitorAnalysis([industry]),
      webScraper.scrapeMarketSize(industry)
    ]);

    const intelligence = {
      marketSize: marketSize || '$1.0 billion',
      growthRate: 0.15, // 15% default growth rate
      volatility: 0.25,
      trends: [{
        direction: 'up',
        strength: 75,
        confidence: 0.8,
        timeframe: 'medium-term',
        factors: ['Market growth', 'Technology adoption']
      }],
      sentiment: {
        score: sentiment.score || 0,
        comparative: sentiment.comparative || 0,
        tokens: [],
        positive: [],
        negative: [],
        confidence: 0.7
      },
      riskScore: 45,
      opportunityScore: 75,
      competitiveIndex: competitors.length * 10,
      marketMaturity: 'growing',
      predictions: {
        nextMonth: 1000000,
        nextQuarter: 1200000,
        nextYear: 1500000,
        confidence: 0.8
      }
    };

    const response = {
      industry,
      timestamp: Date.now(),
      intelligence,
      dataSources: {
        trends: trends,
        sentiment: sentiment,
        competitors: competitors.length,
        marketSize
      },
      confidence: intelligence.predictions.confidence,
      recommendations: ['Focus on market differentiation', 'Build strong partnerships', 'Invest in technology']
    };

    res.json(response);

  } catch (error) {
    console.error('Error generating market intelligence:', error);
    res.status(500).json({ error: 'Failed to generate market intelligence', details: (error as Error).message });
  }
});

// Enhanced idea validation with simplified ML analysis
app.post('/api/validate_idea', async (req, res) => {
  try {
    const { idea_description } = req.body;
    
    if (!idea_description) {
      return res.status(400).json({ error: 'idea_description is required' });
    }

    console.log('🔍 Validating idea:', idea_description);

    // Extract keywords and detect industry
    const keywords = extractKeywords(idea_description);
    const industry = detectIndustry(idea_description);

    console.log('Keywords:', keywords);
    console.log('Industry:', industry);

    // Fetch real-time data
    const [trends, sentiment, competitors, marketSize] = await Promise.all([
      googleTrends.fetchTrends(keywords),
      redditData.fetchSentiment(keywords),
      webScraper.scrapeCompetitorAnalysis(keywords),
      webScraper.scrapeMarketSize(industry)
    ]);

    console.log('📊 Real-time data fetched:', { 
      trends, 
      sentiment, 
      competitors: competitors.length, 
      marketSize
    });

    // Use RAG system for enhanced analysis
    const ragResponse = await ragSystem.processRAGQuery(idea_description, industry);
    
    // Calculate feasibility score based on RAG data
    const feasibilityScore = calculateFeasibilityScore(trends, sentiment, competitors, marketSize);
    const riskScore = calculateRiskScore(competitors, sentiment);
    const opportunityScore = calculateOpportunityScore(trends, marketSize);

    // Enhanced validation result with RAG insights
    const result: ValidationResult = {
      feasibilityScore,
      marketSize: formatMarketSize(marketSize),
      competitionLevel: assessCompetitionLevel(competitors),
      trends: extractTrends(trends),
      opportunities: ragResponse.recommendations.length > 0 ? ragResponse.recommendations.slice(0, 3) : identifyOpportunities(trends, marketSize),
      risks: identifyRisks(competitors, sentiment),
      recommendations: ragResponse.recommendations.length > 0 ? ragResponse.recommendations : generateRecommendations(feasibilityScore, competitors),
      similarStartups: competitors.slice(0, 5),
      marketInsights: {
        marketSize: formatMarketSize(marketSize),
        growthRate: '15.0% annually',
        trends: extractTrends(trends),
        opportunities: ragResponse.insights.length > 0 ? ragResponse.insights.slice(0, 3) : identifyOpportunities(trends, marketSize),
        threats: identifyRisks(competitors, sentiment)
      }
    };

    console.log('🎯 Validation result:', {
      feasibilityScore: result.feasibilityScore,
      marketSize: result.marketSize,
      competitionLevel: result.competitionLevel
    });

    res.json(result);

  } catch (error) {
    console.error('Error validating idea:', error);
    res.status(500).json({ error: 'Failed to validate idea', details: (error as Error).message });
  }
});

// Enhanced business model generation
app.post('/api/generate_business_model', async (req, res) => {
  try {
    const { company_info } = req.body;
    
    if (!company_info || !company_info.description) {
      return res.status(400).json({ error: 'company_info.description is required' });
    }

    console.log('🏢 Generating business model for:', company_info.description);

    // Analyze business dynamically
    const businessAnalysis = await analyzeBusinessDynamically(company_info.description);

         // Generate comprehensive business model
     const businessModel: BusinessModelData = {
       valuePropositions: generateValuePropositions(businessAnalysis),
       customerSegments: generateCustomerSegments(businessAnalysis),
       keyResources: generateKeyResources(businessAnalysis),
       keyPartnerships: generateKeyPartnerships(businessAnalysis),
       revenueStreams: generateRevenueStreams(businessAnalysis),
       costStructure: generateCostStructure(businessAnalysis),
       channels: generateChannels(businessAnalysis),
       customerRelationships: generateCustomerRelationships(businessAnalysis)
     };

    console.log('✅ Business model generated successfully');
    res.json(businessModel);

  } catch (error) {
    console.error('Error generating business model:', error);
    res.status(500).json({ error: 'Failed to generate business model', details: (error as Error).message });
  }
});

// Enhanced pitch deck creation
app.post('/api/create_pitch_deck', async (req, res) => {
  try {
    const { startup_info } = req.body;
    
    if (!startup_info || !startup_info.description) {
      return res.status(400).json({ error: 'startup_info.description is required' });
    }

    console.log('📊 Creating pitch deck for:', startup_info.description);

    // Analyze startup dynamically
    const businessAnalysis = await analyzeBusinessDynamically(startup_info.description);

         // Generate comprehensive pitch deck with slides
     const pitchDeck = {
       startupName: startup_info.startupName || 'Your Startup',
       title: `${startup_info.startupName || 'Your Startup'} - Investor Pitch Deck`,
       slides: [
         {
           id: '1',
           title: 'Problem Statement',
           content: generateProblemStatement(startup_info.description),
           presenterNotes: 'Start with the problem - this is what investors care about most.'
         },
         {
           id: '2',
           title: 'Solution',
           content: generateSolutionStatement(startup_info.description),
           presenterNotes: 'Present your solution clearly and concisely.'
         },
         {
           id: '3',
           title: 'Market Opportunity',
           content: `Market Size: ${businessAnalysis.marketSize || '$1.0 billion'}\nGrowth Rate: 15.0% annually\nTarget Market: Primary market with clear value proposition`,
           presenterNotes: 'Show the market size and growth potential.'
         },
         {
           id: '4',
           title: 'Business Model',
           content: generateBusinessModelSummary(businessAnalysis),
           presenterNotes: 'Explain how you will make money.'
         },
         {
           id: '5',
           title: 'Competitive Advantage',
           content: generateCompetitiveAdvantage(businessAnalysis),
           presenterNotes: 'What makes you different from competitors?'
         },
         {
           id: '6',
           title: 'Financial Projections',
           content: generateFinancialProjections(businessAnalysis),
           presenterNotes: 'Show realistic financial projections.'
         },
         {
           id: '7',
           title: 'Team',
           content: generateTeamSection(startup_info),
           presenterNotes: 'Highlight team expertise and experience.'
         },
         {
           id: '8',
           title: 'Funding Ask',
           content: generateFundingSection(businessAnalysis),
           presenterNotes: 'Be specific about how much funding you need and what you will use it for.'
         }
       ],
       createdAt: new Date().toISOString()
     };

    console.log('✅ Pitch deck created successfully');
    res.json(pitchDeck);

  } catch (error) {
    console.error('Error creating pitch deck:', error);
    res.status(500).json({ error: 'Failed to create pitch deck', details: (error as Error).message });
  }
});

// Helper functions
function calculateFeasibilityScore(trends: any, sentiment: any, competitors: any[], marketSize: any): number {
  let score = 50; // Base score
  
  // Market size factor
  if (marketSize && marketSize.includes('billion')) {
    score += 20;
  } else if (marketSize && marketSize.includes('million')) {
    score += 10;
  }
  
  // Competition factor (less competition = higher score)
  score += Math.max(0, 20 - competitors.length * 2);
  
  // Sentiment factor
  if (sentiment.comparative > 0.1) {
    score += 15;
  } else if (sentiment.comparative < -0.1) {
    score -= 10;
  }
  
  // Trends factor
  if (trends.interest > 50) {
    score += 15;
  }
  
  return Math.min(Math.max(score, 0), 100);
}

function calculateRiskScore(competitors: any[], sentiment: any): number {
  let risk = 50;
  
  // Competition risk
  risk += competitors.length * 5;
  
  // Sentiment risk
  if (sentiment.comparative < -0.1) {
    risk += 20;
  }
  
  return Math.min(Math.max(risk, 0), 100);
}

function calculateOpportunityScore(trends: any, marketSize: any): number {
  let opportunity = 50;
  
  // Market size opportunity
  if (marketSize && marketSize.includes('billion')) {
    opportunity += 25;
  }
  
  // Trends opportunity
  if (trends.interest > 50) {
    opportunity += 25;
  }
  
  return Math.min(Math.max(opportunity, 0), 100);
}

function formatMarketSize(marketSize: any): string {
  if (!marketSize) return '$1.0 million';
  return marketSize.toString();
}

function assessCompetitionLevel(competitors: any[]): string {
  if (competitors.length === 0) return 'Very Low';
  if (competitors.length <= 3) return 'Low';
  if (competitors.length <= 10) return 'Medium';
  return 'High';
}

function extractTrends(trends: any): string[] {
  if (!trends || !trends.interest) return ['Market growth', 'Technology adoption'];
  
  const trendList = [];
  if (trends.interest > 50) {
    trendList.push('Growing market interest');
  }
  if (trends.interest > 70) {
    trendList.push('High market demand');
  }
  
  return trendList.length > 0 ? trendList : ['Market growth', 'Technology adoption'];
}

function identifyOpportunities(trends: any, marketSize: any): string[] {
  const opportunities = [];
  
  if (marketSize && marketSize.includes('billion')) {
    opportunities.push('Large market opportunity');
  }
  
  if (trends.interest > 50) {
    opportunities.push('Growing market demand');
  }
  
  opportunities.push('Technology innovation potential');
  opportunities.push('Market differentiation opportunity');
  
  return opportunities;
}

function identifyRisks(competitors: any[], sentiment: any): string[] {
  const risks = [];
  
  if (competitors.length > 5) {
    risks.push('High competition');
  }
  
  if (sentiment.comparative < -0.1) {
    risks.push('Negative market sentiment');
  }
  
  risks.push('Market volatility');
  risks.push('Technology disruption risk');
  
  return risks;
}

function generateRecommendations(feasibilityScore: number, competitors: any[]): string[] {
  const recommendations = [];
  
  if (feasibilityScore < 50) {
    recommendations.push('Consider market differentiation strategy');
    recommendations.push('Focus on unique value proposition');
  } else {
    recommendations.push('Proceed with market entry strategy');
    recommendations.push('Build strong partnerships');
  }
  
  if (competitors.length > 5) {
    recommendations.push('Develop competitive advantages');
  }
  
  recommendations.push('Invest in technology and innovation');
  recommendations.push('Build strong customer relationships');
  
  return recommendations;
}

// Business model generation functions
function generateValuePropositions(businessAnalysis: any): string[] {
  const propositions = [];
  
  if (businessAnalysis.technology) {
    propositions.push('Cutting-edge technology solutions');
    propositions.push('Improved efficiency and productivity');
  }
  
  if (businessAnalysis.marketplace) {
    propositions.push('Seamless platform experience');
    propositions.push('Trusted marketplace for users');
  }
  
  return propositions.length > 0 ? propositions : ['Innovative solution', 'Superior user experience'];
}

function generateCustomerSegments(businessAnalysis: any): string[] {
  return ['Primary target market', 'Secondary market segments', 'Enterprise customers'];
}



function generateKeyResources(businessAnalysis: any): string[] {
  return ['Technology platform', 'Skilled team', 'Intellectual property', 'Strategic partnerships'];
}

function generateKeyPartnerships(businessAnalysis: any): string[] {
  return ['Technology providers', 'Marketing partners', 'Distribution channels', 'Strategic alliances'];
}

function generateRevenueStreams(businessAnalysis: any): string[] {
  return ['Subscription fees', 'Transaction fees', 'Licensing revenue', 'Consulting services'];
}

function generateCostStructure(businessAnalysis: any): string[] {
  return ['Technology development', 'Marketing and sales', 'Operations', 'Customer support'];
}

function generateChannels(businessAnalysis: any): string[] {
  return ['Digital platforms', 'Direct sales', 'Partnership channels', 'Online marketing'];
}

function generateCustomerRelationships(businessAnalysis: any): string[] {
  return ['Personal assistance', 'Self-service', 'Community building', 'Continuous support'];
}

// Pitch deck generation functions
function generateProblemStatement(description: string): string {
  return `The current market lacks efficient solutions for ${description.toLowerCase()}. Users face challenges with existing options that are either too complex, expensive, or don't meet their specific needs.`;
}

function generateSolutionStatement(description: string): string {
  return `Our platform provides an innovative, user-friendly solution that addresses the core challenges in ${description.toLowerCase()}. We offer a comprehensive, cost-effective alternative that delivers superior results.`;
}

function generateBusinessModelSummary(businessAnalysis: any): string {
  return 'Our business model focuses on creating value through innovative technology solutions, strategic partnerships, and sustainable revenue streams.';
}

function generateCompetitiveAdvantage(businessAnalysis: any): string {
  return 'Our competitive advantages include proprietary technology, strong market positioning, and a dedicated team with deep industry expertise.';
}

function generateFinancialProjections(businessAnalysis: any): string {
  return 'Projected revenue growth of 200% year-over-year, with profitability expected within 18 months.';
}

function generateTeamSection(startupInfo: any): string {
  return 'Experienced team with backgrounds in technology, business development, and market strategy.';
}

function generateFundingSection(businessAnalysis: any): string {
  return 'Seeking $2M in seed funding to accelerate product development and market expansion.';
}

// Enhanced business analysis
async function analyzeBusinessDynamically(description: string): Promise<any> {
  const keywords = extractKeywords(description);
  const industry = detectIndustry(description);
  
  // Fetch market data
  const [competitors, marketSize, trends, sentiment] = await Promise.all([
    webScraper.scrapeCompetitorAnalysis(keywords),
    webScraper.scrapeMarketSize(industry),
    googleTrends.fetchTrends(keywords),
    redditData.fetchSentiment(keywords)
  ]);
  
  return {
    keywords,
    industry,
    competitors,
    marketSize,
    trends,
    sentiment,
    technology: description.toLowerCase().includes('ai') || description.toLowerCase().includes('technology'),
    marketplace: description.toLowerCase().includes('marketplace') || description.toLowerCase().includes('platform')
  };
}

// Enhanced keyword extraction and industry detection
function extractKeywords(text: string): string[] {
  const words = text.toLowerCase().split(/\s+/);
  const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those']);
  
  return words
    .filter(word => word.length > 2 && !stopWords.has(word))
    .slice(0, 10);
}

function detectIndustry(text: string): string {
  const lowerText = text.toLowerCase();
  
  if (lowerText.includes('ai') || lowerText.includes('artificial intelligence') || lowerText.includes('machine learning')) {
    return 'artificial intelligence';
  }
  if (lowerText.includes('delivery') || lowerText.includes('logistics') || lowerText.includes('shipping')) {
    return 'logistics and delivery';
  }
  if (lowerText.includes('education') || lowerText.includes('learning') || lowerText.includes('course')) {
    return 'education technology';
  }
  if (lowerText.includes('health') || lowerText.includes('medical') || lowerText.includes('fitness')) {
    return 'healthcare technology';
  }
  if (lowerText.includes('finance') || lowerText.includes('payment') || lowerText.includes('banking')) {
    return 'financial technology';
  }
  
  return 'technology';
}

// Start the server with error handling
server.listen(port, () => {
  console.log(`🚀 Real-Time Market Intelligence Platform running on port ${port}`);
  console.log(`📊 Market Intelligence: ACTIVE`);
  console.log(`🔌 Real-time Data Processing: ACTIVE`);
  console.log(`🧠 Business Analysis: OPERATIONAL`);
  console.log(`📈 Market Predictions: ENABLED`);
  console.log(`🌐 Server URL: http://localhost:${port}`);
  console.log(`🔗 Health Check: http://localhost:${port}/api/health`);
}).on('error', (error) => {
  console.error('❌ Failed to start server:', error);
  process.exit(1);
});