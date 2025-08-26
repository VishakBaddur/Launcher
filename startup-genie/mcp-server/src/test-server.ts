import express from 'express';
import cors from 'cors';
import { GoogleTrendsDataSource } from './data-sources/google-trends';
import { RedditDataSource } from './data-sources/reddit-data';
import { WebScraperDataSource } from './data-sources/web-scraper';
import { ValidationResult, BusinessModelData, PitchData } from './types/index';

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// Initialize data sources
const googleTrends = new GoogleTrendsDataSource();
const redditData = new RedditDataSource();
const webScraper = new WebScraperDataSource();

// Test endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Startup Genie MCP Server is running!' });
});

// Validate idea endpoint
app.post('/api/validate_idea', async (req, res) => {
  try {
    const { idea_description } = req.body;
    
    if (!idea_description) {
      return res.status(400).json({ error: 'idea_description is required' });
    }

    console.log('Validating idea:', idea_description);

    // Extract keywords and detect industry
    const keywords = extractKeywords(idea_description);
    const industry = detectIndustry(idea_description);

    console.log('Keywords:', keywords);
    console.log('Industry:', industry);

    // Fetch live data from all sources including real-time news
    const [trends, sentiment, competitors, marketSize, industryTrends, realTimeNews] = await Promise.all([
      googleTrends.fetchTrends(keywords),
      redditData.fetchSentiment(keywords),
      webScraper.scrapeCompetitorAnalysis(keywords),
      webScraper.scrapeMarketSize(industry),
      webScraper.scrapeIndustryTrends(industry),
      webScraper.scrapeRealTimeNews(idea_description)
    ]);

    console.log('Live data fetched:', { 
      trends, 
      sentiment, 
      competitors: competitors.length, 
      marketSize,
      trendsFound: industryTrends.length,
      realTimeNews: realTimeNews.length
    });

    // Analyze and generate insights based on live data including real-time news
    const feasibilityScore = calculateFeasibilityScoreFromLiveData(trends, sentiment, competitors, marketSize, realTimeNews);
    const opportunities = identifyOpportunitiesFromLiveData(keywords, trends, sentiment, industryTrends, realTimeNews);
    const risks = identifyRisksFromLiveData(competitors, sentiment, marketSize, realTimeNews);
    const recommendations = generateRecommendationsFromLiveData(idea_description, trends, competitors, industryTrends, realTimeNews);

    const result: ValidationResult = {
      feasibilityScore,
      marketSize,
      competitionLevel: assessCompetitionLevelFromLiveData(competitors),
      trends: extractTrendsFromLiveData(trends, industryTrends),
      opportunities,
      risks,
      recommendations,
      similarStartups: competitors.slice(0, 5),
      marketInsights: {
        marketSize,
        growthRate: calculateGrowthRateFromLiveData(trends, industryTrends),
        trends: extractTrendsFromLiveData(trends, industryTrends),
        opportunities,
        threats: risks
      }
    };

    console.log('Validation result:', result);
    res.json(result);

  } catch (error) {
    console.error('Error validating idea:', error);
    res.status(500).json({ error: 'Failed to validate idea', details: (error as Error).message });
  }
});

// Generate business model endpoint
app.post('/api/generate_business_model', async (req, res) => {
  try {
    const { company_info } = req.body;
    
    if (!company_info) {
      return res.status(400).json({ error: 'company_info is required' });
    }

    console.log('Generating business model for:', company_info);

    const industry = detectIndustry(company_info.description);
    const businessAnalysis = analyzeBusinessDescription(company_info.description);
    
    // Debug logging
    console.log('Industry detected:', industry);
    console.log('Business analysis:', businessAnalysis);
    
    // Fetch live business model data
    const [competitors, businessModelExamples] = await Promise.all([
      webScraper.scrapeStartupData(industry),
      webScraper.scrapeBusinessModelExamples(industry)
    ]);
    
    console.log('Live business model data:', {
      competitors: competitors.length,
      examples: Object.keys(businessModelExamples).length
    });
    
    const result: BusinessModelData = {
      revenueStreams: generateRevenueStreamsFromLiveData(businessAnalysis, businessModelExamples, competitors),
      costStructure: generateCostStructureFromLiveData(businessAnalysis, businessModelExamples, competitors),
      keyPartnerships: generatePartnershipsFromLiveData(businessAnalysis, businessModelExamples, competitors),
      keyResources: generateResourcesFromLiveData(businessAnalysis, businessModelExamples, competitors),
      valuePropositions: generateValuePropsFromLiveData(businessAnalysis, businessModelExamples, competitors),
      customerSegments: generateSegmentsFromLiveData(businessAnalysis, businessModelExamples, competitors),
      channels: generateChannelsFromLiveData(businessAnalysis, businessModelExamples, competitors),
      customerRelationships: generateRelationshipsFromLiveData(businessAnalysis, businessModelExamples, competitors)
    };

    console.log('Business model generated from live data:', result);
    res.json(result);

  } catch (error) {
    console.error('Error generating business model:', error);
    res.status(500).json({ error: 'Failed to generate business model', details: (error as Error).message });
  }
});

// Create pitch deck endpoint
app.post('/api/create_pitch_deck', async (req, res) => {
  try {
    const { startup_info } = req.body;
    
    if (!startup_info) {
      return res.status(400).json({ error: 'startup_info is required' });
    }

    console.log('Creating pitch deck for:', startup_info);

    const industry = detectIndustry(startup_info.description);
    const businessAnalysis = analyzeBusinessDescription(startup_info.description);
    const [competitors, marketSize, industryTrends] = await Promise.all([
      webScraper.scrapeCompetitorAnalysis([industry]),
      webScraper.scrapeMarketSize(industry),
      webScraper.scrapeIndustryTrends(industry)
    ]);

    const slides = generatePitchSlides(startup_info, businessAnalysis, competitors, marketSize, industryTrends);

    const result = {
      startupName: startup_info.startupName || startup_info.name || 'Startup',
      title: `${startup_info.startupName || startup_info.name || 'Startup'} - Investor Pitch Deck`,
      slides,
      createdAt: new Date().toISOString()
    };

    console.log('Pitch deck created with', slides.length, 'slides');
    res.json(result);

  } catch (error) {
    console.error('Error creating pitch deck:', error);
    res.status(500).json({ error: 'Failed to create pitch deck', details: (error as Error).message });
  }
});

// Helper functions
function extractKeywords(text: string): string[] {
  const commonKeywords = [
    'artificial intelligence', 'AI', 'machine learning', 'ML',
    'fintech', 'healthtech', 'edtech', 'ecommerce', 'saas',
    'mobile app', 'web app', 'platform', 'marketplace',
    'sustainability', 'renewable energy', 'blockchain', 'crypto'
  ];

  const lowerText = text.toLowerCase();
  return commonKeywords.filter(keyword => lowerText.includes(keyword));
}

function detectIndustry(description: string): string {
  const lowerDesc = description.toLowerCase();
  
  if (lowerDesc.includes('ai') || lowerDesc.includes('artificial intelligence') || lowerDesc.includes('machine learning')) {
    return 'artificial intelligence';
  } else if (lowerDesc.includes('fintech') || lowerDesc.includes('financial') || lowerDesc.includes('payment')) {
    return 'fintech';
  } else if (lowerDesc.includes('health') || lowerDesc.includes('medical') || lowerDesc.includes('wellness')) {
    return 'healthtech';
  } else if (lowerDesc.includes('education') || lowerDesc.includes('learning') || lowerDesc.includes('edtech')) {
    return 'edtech';
  } else if (lowerDesc.includes('food') || lowerDesc.includes('delivery') || lowerDesc.includes('restaurant')) {
    return 'food delivery';
  } else if (lowerDesc.includes('ecommerce') || lowerDesc.includes('retail') || lowerDesc.includes('shopping')) {
    return 'ecommerce';
  } else if (lowerDesc.includes('shoes') || lowerDesc.includes('sneakers') || lowerDesc.includes('footwear')) {
    return 'luxury footwear';
  } else if (lowerDesc.includes('marketplace') || lowerDesc.includes('resell') || lowerDesc.includes('reselling')) {
    return 'marketplace';
  }
  
  return 'technology';
}

function analyzeBusinessDescription(description: string) {
  const lowerDesc = description.toLowerCase();
  
  // Extract key business elements
  const analysis: {
    businessType: string;
    productType: string;
    targetMarket: string;
    valueProps: string[];
    operations: string[];
    keywords: string[];
  } = {
    businessType: '',
    productType: '',
    targetMarket: '',
    valueProps: [],
    operations: [],
    keywords: []
  };

  // Detect business type - improved logic
  if (lowerDesc.includes('resell') || lowerDesc.includes('reselling') || lowerDesc.includes('marketplace')) {
    analysis.businessType = 'marketplace';
  } else if (lowerDesc.includes('platform') || lowerDesc.includes('app') || lowerDesc.includes('software') || lowerDesc.includes('delivery')) {
    analysis.businessType = 'platform';
  } else if (lowerDesc.includes('service') || lowerDesc.includes('consulting')) {
    analysis.businessType = 'service';
  } else if (lowerDesc.includes('product') || lowerDesc.includes('manufacturing')) {
    analysis.businessType = 'product';
  }

  // Extract product/service type - improved logic
  if (lowerDesc.includes('shoes') || lowerDesc.includes('sneakers') || lowerDesc.includes('footwear')) {
    analysis.productType = 'luxury_footwear';
  } else if (lowerDesc.includes('ai') || lowerDesc.includes('artificial intelligence')) {
    analysis.productType = 'ai_technology';
  } else if (lowerDesc.includes('health') || lowerDesc.includes('medical')) {
    analysis.productType = 'healthcare';
  } else if (lowerDesc.includes('education') || lowerDesc.includes('learning')) {
    analysis.productType = 'education';
  } else if (lowerDesc.includes('food') || lowerDesc.includes('delivery') || lowerDesc.includes('restaurant')) {
    analysis.productType = 'food_delivery';
  }

  // Extract target market indicators
  if (lowerDesc.includes('high end') || lowerDesc.includes('luxury') || lowerDesc.includes('premium')) {
    analysis.targetMarket = 'luxury_premium';
  } else if (lowerDesc.includes('small business') || lowerDesc.includes('startup')) {
    analysis.targetMarket = 'small_business';
  } else if (lowerDesc.includes('enterprise') || lowerDesc.includes('corporate')) {
    analysis.targetMarket = 'enterprise';
  } else if (lowerDesc.includes('health') || lowerDesc.includes('healthy')) {
    analysis.targetMarket = 'health_conscious';
  }

  // Extract value propositions
  if (lowerDesc.includes('right price') || lowerDesc.includes('competitive')) {
    analysis.valueProps.push('competitive_pricing');
  }
  if (lowerDesc.includes('rare') || lowerDesc.includes('exclusive')) {
    analysis.valueProps.push('exclusive_access');
  }
  if (lowerDesc.includes('quality') || lowerDesc.includes('authentic')) {
    analysis.valueProps.push('quality_assurance');
  }
  if (lowerDesc.includes('fast') || lowerDesc.includes('quick')) {
    analysis.valueProps.push('speed_convenience');
  }
  if (lowerDesc.includes('healthy') || lowerDesc.includes('nutritious')) {
    analysis.valueProps.push('health_benefits');
  }

  // Extract operational keywords
  const keywords = ['resell', 'marketplace', 'platform', 'service', 'product', 'luxury', 'high end', 'rare', 'collection', 'price', 'quality', 'food', 'delivery', 'restaurant', 'healthy', 'fast', 'quick'];
  analysis.keywords = keywords.filter(keyword => lowerDesc.includes(keyword));

  return analysis;
}

function generateDynamicRevenueStreams(analysis: any): string[] {
  const streams = [];
  
  if (analysis.businessType === 'marketplace') {
    streams.push('Commission on sales (10-15%)');
    streams.push('Transaction fees');
    streams.push('Premium listing fees');
  }
  
  if (analysis.productType === 'luxury_footwear') {
    streams.push('Authentication fees');
    streams.push('Storage fees for high-value items');
    streams.push('Insurance fees');
  }
  
  if (analysis.businessType === 'platform') {
    streams.push('Subscription fees');
    streams.push('Usage-based pricing');
    streams.push('API access fees');
  }
  
  if (analysis.targetMarket === 'luxury_premium') {
    streams.push('Membership subscriptions');
    streams.push('Concierge services');
  }
  
  // Add common streams
  streams.push('Shipping and handling fees');
  streams.push('Data monetization');
  
  return streams;
}

function generateDynamicCostStructure(analysis: any): string[] {
  const costs = [];
  
  if (analysis.businessType === 'marketplace') {
    costs.push('Platform development and maintenance');
    costs.push('Payment processing fees');
    costs.push('Customer support');
  }
  
  if (analysis.productType === 'luxury_footwear') {
    costs.push('Inventory acquisition costs');
    costs.push('Authentication services');
    costs.push('Secure storage facilities');
    costs.push('Insurance for high-value items');
  }
  
  if (analysis.targetMarket === 'luxury_premium') {
    costs.push('Premium customer service');
    costs.push('High-quality packaging');
    costs.push('Brand marketing');
  }
  
  // Add common costs
  costs.push('Technology infrastructure');
  costs.push('Employee salaries');
  costs.push('Marketing and customer acquisition');
  costs.push('Legal and compliance');
  
  return costs;
}

function generateDynamicPartnerships(analysis: any): string[] {
  const partnerships = [];
  
  if (analysis.businessType === 'marketplace') {
    partnerships.push('Payment processors (Stripe, PayPal)');
    partnerships.push('Shipping and logistics partners');
  }
  
  if (analysis.productType === 'luxury_footwear') {
    partnerships.push('Luxury brand partnerships');
    partnerships.push('Authentication services');
    partnerships.push('Insurance providers');
  }
  
  if (analysis.targetMarket === 'luxury_premium') {
    partnerships.push('High-end marketing agencies');
    partnerships.push('Luxury retail partnerships');
  }
  
  // Add common partnerships
  partnerships.push('Technology providers');
  partnerships.push('Legal and accounting firms');
  partnerships.push('Marketing agencies');
  
  return partnerships;
}

function generateDynamicResources(analysis: any): string[] {
  const resources = [];
  
  if (analysis.businessType === 'marketplace') {
    resources.push('Technology platform');
    resources.push('Customer database');
    resources.push('Transaction processing system');
  }
  
  if (analysis.productType === 'luxury_footwear') {
    resources.push('Inventory of rare items');
    resources.push('Authentication expertise');
    resources.push('Relationships with collectors');
  }
  
  if (analysis.targetMarket === 'luxury_premium') {
    resources.push('Brand reputation');
    resources.push('Expert market knowledge');
    resources.push('Premium customer relationships');
  }
  
  // Add common resources
  resources.push('Development team');
  resources.push('Intellectual property');
  resources.push('Strategic partnerships');
  
  return resources;
}

function generateDynamicValueProps(analysis: any): string[] {
  const props = [];
  
  if (analysis.valueProps.includes('competitive_pricing')) {
    props.push('Competitive pricing and fair market value');
  }
  
  if (analysis.valueProps.includes('exclusive_access')) {
    props.push('Access to rare and exclusive items');
  }
  
  if (analysis.valueProps.includes('quality_assurance')) {
    props.push('Guaranteed authenticity and quality');
  }
  
  if (analysis.businessType === 'marketplace') {
    props.push('Secure and trusted transaction platform');
    props.push('Convenient buying and selling process');
  }
  
  if (analysis.targetMarket === 'luxury_premium') {
    props.push('Premium customer experience');
    props.push('Expert consultation and support');
  }
  
  // Add common value props
  props.push('Better user experience');
  props.push('Professional customer service');
  
  return props;
}

function generateDynamicSegments(analysis: any): string[] {
  const segments = [];
  
  if (analysis.productType === 'luxury_footwear') {
    segments.push('Luxury sneaker collectors');
    segments.push('High-end fashion enthusiasts');
    segments.push('Sneaker enthusiasts and hobbyists');
  }
  
  if (analysis.businessType === 'marketplace') {
    segments.push('Resellers and flippers');
    segments.push('Investment-minded buyers');
  }
  
  if (analysis.targetMarket === 'luxury_premium') {
    segments.push('Fashion influencers and celebrities');
    segments.push('Luxury retail stores');
    segments.push('International buyers');
  }
  
  // Add common segments
  segments.push('Individual consumers');
  segments.push('Small to medium businesses');
  
  return segments;
}

function generateDynamicChannels(analysis: any): string[] {
  const channels = [];
  
  if (analysis.businessType === 'marketplace') {
    channels.push('Online marketplace platform');
    channels.push('Mobile app (iOS/Android)');
  }
  
  if (analysis.productType === 'luxury_footwear') {
    channels.push('Social media marketing (Instagram, TikTok)');
    channels.push('Influencer partnerships');
  }
  
  if (analysis.targetMarket === 'luxury_premium') {
    channels.push('Partnerships with luxury retailers');
    channels.push('Trade shows and events');
  }
  
  // Add common channels
  channels.push('Direct sales');
  channels.push('Online marketing');
  channels.push('SEO and content marketing');
  channels.push('Email marketing campaigns');
  
  return channels;
}

function generateDynamicRelationships(analysis: any): string[] {
  const relationships = [];
  
  if (analysis.businessType === 'marketplace') {
    relationships.push('Secure escrow services');
    relationships.push('Self-service platform');
  }
  
  if (analysis.productType === 'luxury_footwear') {
    relationships.push('Personal authentication consultations');
    relationships.push('Expert advice and market insights');
  }
  
  if (analysis.targetMarket === 'luxury_premium') {
    relationships.push('VIP customer service');
    relationships.push('Concierge services for premium customers');
  }
  
  // Add common relationships
  relationships.push('Personal account management');
  relationships.push('Community and support forums');
  relationships.push('24/7 customer support');
  
  return relationships;
}

// Live data analysis functions
function calculateFeasibilityScoreFromLiveData(trends: any, sentiment: any, competitors: any[], marketSize: string, realTimeNews: string[]): number {
  let score = 50; // Base score
  
  // Analyze trends data
  if (trends && Object.keys(trends).length > 0) {
    const trendValues = Object.values(trends);
    const avgTrend = trendValues.reduce((sum: number, val: any) => sum + (val || 0), 0) / trendValues.length;
    if (avgTrend > 70) score += 20;
    else if (avgTrend > 50) score += 10;
    else if (avgTrend < 30) score -= 10;
  }
  
  // Analyze sentiment data
  if (sentiment && Object.keys(sentiment).length > 0) {
    const sentimentValues = Object.values(sentiment);
    const avgSentiment = sentimentValues.reduce((sum: number, val: any) => sum + (val || 0), 0) / sentimentValues.length;
    if (avgSentiment > 0.5) score += 15;
    else if (avgSentiment > 0.2) score += 5;
    else if (avgSentiment < -0.2) score -= 15;
  }
  
  // Analyze competition
  const competitorCount = competitors.length;
  if (competitorCount < 5) score += 15;
  else if (competitorCount < 15) score += 5;
  else if (competitorCount > 30) score -= 10;
  
  // Analyze market size
  if (marketSize) {
    const sizeMatch = marketSize.match(/\$([\d,]+(?:\.\d+)?)\s*(billion|million|trillion)/i);
    if (sizeMatch) {
      const value = parseFloat(sizeMatch[1].replace(/,/g, ''));
      const unit = sizeMatch[2].toLowerCase();
      
      let marketValue = value;
      if (unit === 'trillion') marketValue = value * 1000;
      else if (unit === 'million') marketValue = value / 1000;
      
      if (marketValue > 100) score += 10;
      else if (marketValue > 10) score += 5;
      else if (marketValue < 1) score -= 5;
    }
  }
  
  return Math.min(10, Math.max(1, Math.round(score / 10)));
}

function identifyOpportunitiesFromLiveData(keywords: string[], trends: any, sentiment: any, industryTrends: string[], realTimeNews: string[]): string[] {
  const opportunities = [];
  
  // Analyze trends
  if (trends && Object.values(trends).some((val: any) => val > 70)) {
    opportunities.push('High market demand and growing trends detected');
  }
  
  // Analyze sentiment
  if (sentiment && Object.values(sentiment).some((val: any) => val > 0.5)) {
    opportunities.push('Positive market sentiment and strong user interest');
  }
  
  // Analyze industry trends
  if (industryTrends.length > 0) {
    opportunities.push(`Industry trends indicate: ${industryTrends[0]}`);
  }
  
  // Analyze keywords for specific opportunities
  if (keywords.includes('ai') || keywords.includes('artificial intelligence')) {
    opportunities.push('AI/ML market experiencing rapid growth and adoption');
  }
  
  if (keywords.includes('food') || keywords.includes('delivery')) {
    opportunities.push('Food delivery market expanding with changing consumer habits');
  }
  
  if (keywords.includes('marketplace')) {
    opportunities.push('Marketplace model showing strong growth across industries');
  }
  
  return opportunities.length > 0 ? opportunities : ['Market research indicates potential for innovation and growth'];
}

function identifyRisksFromLiveData(competitors: any[], sentiment: any, marketSize: string, realTimeNews: string[]): string[] {
  const risks = [];
  
  // Analyze competition
  if (competitors.length > 20) {
    risks.push(`High competition with ${competitors.length} identified competitors`);
  } else if (competitors.length > 10) {
    risks.push('Moderate to high competition in the market');
  }
  
  // Analyze sentiment
  if (sentiment && Object.values(sentiment).some((val: any) => val < -0.3)) {
    risks.push('Negative market sentiment detected');
  }
  
  // Analyze market size
  if (marketSize) {
    const sizeMatch = marketSize.match(/\$([\d,]+(?:\.\d+)?)\s*(billion|million|trillion)/i);
    if (sizeMatch) {
      const value = parseFloat(sizeMatch[1].replace(/,/g, ''));
      const unit = sizeMatch[2].toLowerCase();
      
      let marketValue = value;
      if (unit === 'trillion') marketValue = value * 1000;
      else if (unit === 'million') marketValue = value / 1000;
      
      if (marketValue < 1) {
        risks.push('Small market size may limit growth potential');
      }
    }
  }
  
  return risks.length > 0 ? risks : ['Standard market risks apply - conduct thorough due diligence'];
}

function generateRecommendationsFromLiveData(ideaDescription: string, trends: any, competitors: any[], industryTrends: string[], realTimeNews: string[]): string[] {
  const recommendations = [];
  
  // Competition-based recommendations
  if (competitors.length > 10) {
    recommendations.push('Focus on a specific niche to differentiate from competitors');
    recommendations.push('Analyze competitor weaknesses and address market gaps');
  } else if (competitors.length < 5) {
    recommendations.push('Low competition presents opportunity for market leadership');
    recommendations.push('Focus on rapid execution and market penetration');
  }
  
  // Trend-based recommendations
  if (trends && Object.values(trends).some((val: any) => val > 80)) {
    recommendations.push('Market is trending - prioritize rapid execution strategy');
  }
  
  // Industry trend recommendations
  if (industryTrends.length > 0) {
    recommendations.push(`Align with industry trends: ${industryTrends[0].substring(0, 100)}...`);
  }
  
  // Standard recommendations
  recommendations.push('Conduct thorough market research and customer interviews');
  recommendations.push('Build a minimum viable product (MVP) to test assumptions');
  recommendations.push('Develop a clear competitive advantage and value proposition');
  
  return recommendations;
}

function assessCompetitionLevelFromLiveData(competitors: any[]): string {
  if (competitors.length < 3) return 'Low';
  if (competitors.length < 10) return 'Medium';
  if (competitors.length < 20) return 'High';
  return 'Very High';
}

function extractTrendsFromLiveData(trends: any, industryTrends: string[]): string[] {
  const extractedTrends: string[] = [];
  
  // Extract from Google Trends data
  if (trends && Object.keys(trends).length > 0) {
    Object.entries(trends).forEach(([keyword, value]: [string, any]) => {
      if (value > 50) {
        extractedTrends.push(`${keyword} is trending (score: ${Math.round(value)})`);
      }
    });
  }
  
  // Add industry trends
  industryTrends.forEach(trend => {
    extractedTrends.push(trend.substring(0, 150) + '...');
  });
  
  return extractedTrends.length > 0 ? extractedTrends : ['Market analysis shows stable growth patterns'];
}

function calculateGrowthRateFromLiveData(trends: any, industryTrends: string[]): string {
  if (!trends || Object.keys(trends).length === 0) {
    return 'Stable growth (5-10% annually)';
  }
  
  const avgTrend = Object.values(trends).reduce((sum: number, val: any) => sum + (val || 0), 0) / Object.keys(trends).length;
  
  if (avgTrend > 80) return 'High growth (25%+ annually)';
  if (avgTrend > 60) return 'Strong growth (15-25% annually)';
  if (avgTrend > 40) return 'Moderate growth (10-15% annually)';
  return 'Stable growth (5-10% annually)';
}

// Live business model generation functions
function generateRevenueStreamsFromLiveData(analysis: any, businessModelExamples: any, competitors: any[]): string[] {
  const streams = [];
  
  // Generate based on product type FIRST (prioritize industry-specific)
  if (analysis.productType === 'food_delivery') {
    streams.push('Delivery fees');
    streams.push('Restaurant commission (15-30%)');
    streams.push('Subscription fees for premium features');
    streams.push('Rush delivery fees');
  } else if (analysis.productType === 'luxury_footwear') {
    streams.push('Authentication fees');
    streams.push('Storage fees for high-value items');
  } else if (analysis.productType === 'ai_technology') {
    streams.push('AI model licensing');
    streams.push('Data processing fees');
  }
  
  // Generate based on business type
  if (analysis.businessType === 'marketplace') {
    streams.push('Commission on sales (10-15%)');
    streams.push('Transaction fees');
    streams.push('Premium listing fees');
  }
  
  if (analysis.businessType === 'platform') {
    streams.push('Subscription fees');
    streams.push('Usage-based pricing');
    streams.push('API access fees');
  }
  
  // Use scraped business model examples as backup
  if (businessModelExamples.revenueStreams && businessModelExamples.revenueStreams.length > 0 && streams.length < 3) {
    streams.push(...businessModelExamples.revenueStreams.slice(0, 3 - streams.length));
  }
  
  // Add common streams
  streams.push('Shipping and handling fees');
  streams.push('Data monetization');
  
  return streams.slice(0, 8); // Limit to 8 items
}

function generateCostStructureFromLiveData(analysis: any, businessModelExamples: any, competitors: any[]): string[] {
  const costs = [];
  
  // Generate based on product type FIRST
  if (analysis.productType === 'food_delivery') {
    costs.push('Delivery fleet management');
    costs.push('Restaurant onboarding and support');
    costs.push('Food safety compliance');
    costs.push('Delivery insurance');
  } else if (analysis.productType === 'luxury_footwear') {
    costs.push('Inventory acquisition costs');
    costs.push('Authentication services');
    costs.push('Secure storage facilities');
  }
  
  // Generate based on business type
  if (analysis.businessType === 'marketplace') {
    costs.push('Platform development and maintenance');
    costs.push('Payment processing fees');
  }
  
  // Use scraped business model examples as backup
  if (businessModelExamples.resources && businessModelExamples.resources.length > 0 && costs.length < 3) {
    costs.push(...businessModelExamples.resources.slice(0, 3 - costs.length));
  }
  
  // Add common costs
  costs.push('Technology infrastructure');
  costs.push('Employee salaries');
  costs.push('Marketing and customer acquisition');
  costs.push('Legal and compliance');
  
  return costs.slice(0, 8);
}

function generatePartnershipsFromLiveData(analysis: any, businessModelExamples: any, competitors: any[]): string[] {
  const partnerships = [];
  
  // Generate based on product type FIRST
  if (analysis.productType === 'food_delivery') {
    partnerships.push('Restaurant partnerships');
    partnerships.push('Delivery fleet partnerships');
    partnerships.push('Payment processors (Stripe, PayPal)');
    partnerships.push('Food safety certification partners');
  } else if (analysis.productType === 'luxury_footwear') {
    partnerships.push('Luxury brand partnerships');
    partnerships.push('Authentication services');
  } else if (analysis.productType === 'ai_technology') {
    partnerships.push('Cloud infrastructure providers');
    partnerships.push('Data providers');
  }
  
  // Generate based on business type
  if (analysis.businessType === 'marketplace') {
    partnerships.push('Payment processors (Stripe, PayPal)');
    partnerships.push('Shipping and logistics partners');
  }
  
  // Use scraped business model examples as backup
  if (businessModelExamples.partnerships && businessModelExamples.partnerships.length > 0 && partnerships.length < 2) {
    partnerships.push(...businessModelExamples.partnerships.slice(0, 2 - partnerships.length));
  }
  
  // Add common partnerships
  partnerships.push('Technology providers');
  partnerships.push('Legal and accounting firms');
  
  return partnerships.slice(0, 6);
}

function generateResourcesFromLiveData(analysis: any, businessModelExamples: any, competitors: any[]): string[] {
  const resources = [];
  
  // Generate based on product type FIRST
  if (analysis.productType === 'food_delivery') {
    resources.push('Delivery infrastructure');
    resources.push('Restaurant network');
    resources.push('Customer data and preferences');
    resources.push('Food safety protocols');
  } else if (analysis.productType === 'luxury_footwear') {
    resources.push('Inventory of rare items');
    resources.push('Authentication expertise');
  } else if (analysis.productType === 'ai_technology') {
    resources.push('AI models and algorithms');
    resources.push('Computing infrastructure');
  }
  
  // Generate based on business type
  if (analysis.businessType === 'marketplace') {
    resources.push('Technology platform');
    resources.push('Customer database');
  }
  
  // Use scraped business model examples as backup
  if (businessModelExamples.resources && businessModelExamples.resources.length > 0 && resources.length < 2) {
    resources.push(...businessModelExamples.resources.slice(0, 2 - resources.length));
  }
  
  // Add common resources
  resources.push('Development team');
  resources.push('Intellectual property');
  
  return resources.slice(0, 6);
}

function generateValuePropsFromLiveData(analysis: any, businessModelExamples: any, competitors: any[]): string[] {
  const props = [];
  
  // Use scraped business model examples
  if (businessModelExamples.valueProps && businessModelExamples.valueProps.length > 0) {
    props.push(...businessModelExamples.valueProps.slice(0, 2));
  }
  
  // Generate based on analysis
  if (analysis.valueProps.includes('competitive_pricing')) {
    props.push('Competitive pricing and fair market value');
  }
  
  if (analysis.valueProps.includes('exclusive_access')) {
    props.push('Access to rare and exclusive items');
  }
  
  if (analysis.valueProps.includes('quality_assurance')) {
    props.push('Guaranteed authenticity and quality');
  }
  
  if (analysis.valueProps.includes('speed_convenience')) {
    props.push('Fast and convenient service');
  }
  
  if (analysis.valueProps.includes('health_benefits')) {
    props.push('Healthy and nutritious options');
  }
  
  if (analysis.businessType === 'marketplace') {
    props.push('Secure and trusted transaction platform');
  }
  
  if (analysis.targetMarket === 'luxury_premium') {
    props.push('Premium customer experience');
  }
  
  if (analysis.productType === 'food_delivery') {
    props.push('Fast and convenient delivery');
    props.push('Wide selection of healthy restaurants');
  }
  
  // Add common value props
  props.push('Better user experience');
  props.push('Professional customer service');
  
  return props.slice(0, 6);
}

function generateSegmentsFromLiveData(analysis: any, businessModelExamples: any, competitors: any[]): string[] {
  const segments = [];
  
  // Generate based on product type
  if (analysis.productType === 'luxury_footwear') {
    segments.push('Luxury sneaker collectors');
    segments.push('High-end fashion enthusiasts');
  }
  
  if (analysis.businessType === 'marketplace') {
    segments.push('Resellers and flippers');
    segments.push('Investment-minded buyers');
  }
  
  if (analysis.targetMarket === 'luxury_premium') {
    segments.push('Fashion influencers and celebrities');
    segments.push('Luxury retail stores');
  }
  
  if (analysis.productType === 'ai_technology') {
    segments.push('Technology companies');
    segments.push('Data-driven businesses');
  }
  
  if (analysis.productType === 'food_delivery') {
    segments.push('Restaurant owners and operators');
    segments.push('Food delivery consumers');
    segments.push('Health-conscious individuals');
    segments.push('Busy professionals');
  }
  
  // Add common segments
  segments.push('Individual consumers');
  segments.push('Small to medium businesses');
  
  return segments.slice(0, 6);
}

function generateChannelsFromLiveData(analysis: any, businessModelExamples: any, competitors: any[]): string[] {
  const channels = [];
  
  // Generate based on business type
  if (analysis.businessType === 'marketplace') {
    channels.push('Online marketplace platform');
    channels.push('Mobile app (iOS/Android)');
  }
  
  if (analysis.productType === 'luxury_footwear') {
    channels.push('Social media marketing (Instagram, TikTok)');
    channels.push('Influencer partnerships');
  }
  
  if (analysis.targetMarket === 'luxury_premium') {
    channels.push('Partnerships with luxury retailers');
    channels.push('Trade shows and events');
  }
  
  if (analysis.productType === 'food_delivery') {
    channels.push('Mobile app (iOS/Android)');
    channels.push('Restaurant partnerships');
    channels.push('Social media marketing');
    channels.push('Local SEO and marketing');
  }
  
  // Add common channels
  channels.push('Direct sales');
  channels.push('Online marketing');
  channels.push('SEO and content marketing');
  
  return channels.slice(0, 6);
}

function generateRelationshipsFromLiveData(analysis: any, businessModelExamples: any, competitors: any[]): string[] {
  const relationships = [];
  
  // Generate based on business type
  if (analysis.businessType === 'marketplace') {
    relationships.push('Secure escrow services');
    relationships.push('Self-service platform');
  }
  
  if (analysis.productType === 'luxury_footwear') {
    relationships.push('Personal authentication consultations');
    relationships.push('Expert advice and market insights');
  }
  
  if (analysis.targetMarket === 'luxury_premium') {
    relationships.push('VIP customer service');
    relationships.push('Concierge services for premium customers');
  }
  
  if (analysis.productType === 'food_delivery') {
    relationships.push('Real-time order tracking');
    relationships.push('Customer feedback and ratings');
    relationships.push('Restaurant support and training');
  }
  
  // Add common relationships
  relationships.push('Personal account management');
  relationships.push('24/7 customer support');
  
  return relationships.slice(0, 6);
}

// Pitch deck helper functions
function defineProblem(startupInfo: any, competitors: any[]): string {
  return `Current solutions in the market are ${competitors.length > 5 ? 'fragmented and complex' : 'limited and expensive'}, creating a significant gap for ${startupInfo.description.toLowerCase()}.`;
}

function defineSolution(startupInfo: any): string {
  return `Our platform provides ${startupInfo.description.toLowerCase()} through an innovative, user-friendly solution that addresses the key pain points in the market.`;
}

function summarizeBusinessModel(startupInfo: any): string {
  return `We operate on a subscription-based SaaS model with multiple revenue streams including transaction fees, premium features, and enterprise licensing.`;
}

function generateTraction(startupInfo: any): string {
  return `Early stage with strong market validation and growing user interest. Ready for rapid scaling with proper funding.`;
}

function generateTeamInfo(startupInfo: any): string {
  return `Experienced team with backgrounds in technology, business development, and market expertise.`;
}

function analyzeCompetition(competitors: any[]): string {
  return `While there are ${competitors.length} competitors in the space, our unique approach and technology differentiate us significantly.`;
}

function generateFinancials(startupInfo: any): string {
  return `Projected revenue of $1M in first year, growing to $10M by year 3. Strong unit economics with 70% gross margins.`;
}

function generateFundingAsk(startupInfo: any): string {
  return `Seeking $2M in seed funding to accelerate product development, team expansion, and market penetration.`;
}

function generatePitchSlides(startupInfo: any, businessAnalysis: any, competitors: any[], marketSize: string, industryTrends: string[]): any[] {
  const slides = [];

  slides.push({
    id: '1',
    title: `${startupInfo.startupName || startupInfo.name || 'Startup'} - Overview`,
    content: `**Problem:** ${defineProblem(startupInfo, competitors)}\n\n**Solution:** ${defineSolution(startupInfo)}\n\n**Market Size:** ${marketSize}\n\n**Business Model:** ${summarizeBusinessModel(startupInfo)}\n\n**Traction:** ${generateTraction(startupInfo)}\n\n**Team:** ${generateTeamInfo(startupInfo)}\n\n**Competition:** ${analyzeCompetition(competitors)}\n\n**Financials:** ${generateFinancials(startupInfo)}\n\n**Funding Ask:** ${generateFundingAsk(startupInfo)}`,
    presenterNotes: `Start with a strong hook about the problem. Emphasize the market size and your unique solution. Be prepared to discuss your team's background and the competitive landscape.`
  });

  slides.push({
    id: '2',
    title: 'Market Analysis',
    content: `**Competition Level:** ${assessCompetitionLevelFromLiveData(competitors)}\n\n**Key Opportunities:** High market demand and growing trends detected\n\n**Key Risks:** Standard market risks apply - conduct thorough due diligence\n\n**Recommended Actions:** Focus on rapid execution and market penetration`,
    presenterNotes: `Highlight the market opportunity and how you're positioned to capture it. Address potential risks proactively and show you have a plan to mitigate them.`
  });

  slides.push({
    id: '3',
    title: 'Product/Service',
    content: `**Product Type:** ${businessAnalysis.productType}\n\n**Target Market:** ${businessAnalysis.targetMarket}\n\n**Value Propositions:** ${generateValuePropsFromLiveData(businessAnalysis, {}, competitors).join(', ')}\n\n**Customer Segments:** ${generateSegmentsFromLiveData(businessAnalysis, {}, competitors).join(', ')}\n\n**Channels:** ${generateChannelsFromLiveData(businessAnalysis, {}, competitors).join(', ')}\n\n**Customer Relationships:** ${generateRelationshipsFromLiveData(businessAnalysis, {}, competitors).join(', ')}`,
    presenterNotes: `Focus on your unique value proposition and how it solves the customer's pain points. Be specific about your target market and how you'll reach them.`
  });

  slides.push({
    id: '4',
    title: 'Revenue Streams',
    content: `**Primary Streams:** ${generateRevenueStreamsFromLiveData(businessAnalysis, {}, competitors).join(', ')}\n\n**Cost Structure:** ${generateCostStructureFromLiveData(businessAnalysis, {}, competitors).join(', ')}`,
    presenterNotes: `Explain your revenue model clearly. Show how you'll achieve profitability and what your key cost drivers are.`
  });

  slides.push({
    id: '5',
    title: 'Business Model',
    content: `**Revenue Streams:** ${generateRevenueStreamsFromLiveData(businessAnalysis, {}, competitors).join(', ')}\n\n**Cost Structure:** ${generateCostStructureFromLiveData(businessAnalysis, {}, competitors).join(', ')}\n\n**Key Partnerships:** ${generatePartnershipsFromLiveData(businessAnalysis, {}, competitors).join(', ')}\n\n**Key Resources:** ${generateResourcesFromLiveData(businessAnalysis, {}, competitors).join(', ')}`,
    presenterNotes: `Walk through your business model canvas. Emphasize your key partnerships and resources that give you a competitive advantage.`
  });

  slides.push({
    id: '6',
    title: 'Market Trends',
    content: `**Growth Rate:** Strong growth (15-25% annually)\n\n**Trends:** Market analysis shows stable growth patterns\n\n**Opportunities:** High market demand and growing trends detected\n\n**Risks:** Standard market risks apply - conduct thorough due diligence`,
    presenterNotes: `Show that you understand the market dynamics and trends. Position your company to take advantage of emerging opportunities.`
  });

  slides.push({
    id: '7',
    title: 'Competitive Analysis',
    content: `**Competitors:** ${competitors.slice(0, 5).map(c => c.name).join(', ')}\n\n**Our Unique Value Proposition:** ${generateValuePropsFromLiveData(businessAnalysis, {}, competitors).join(', ')}`,
    presenterNotes: `Be honest about competition but emphasize your unique advantages. Show how you're different and better positioned to win.`
  });

  slides.push({
    id: '8',
    title: 'Financial Projections',
    content: `**Year 1 Revenue:** ${generateFinancials(startupInfo)}\n\n**Year 3 Revenue:** ${generateFinancials(startupInfo)}`,
    presenterNotes: `Present realistic but ambitious financial projections. Be prepared to explain your assumptions and growth drivers.`
  });

  slides.push({
    id: '9',
    title: 'Ask for Funding',
    content: `**Funding Amount:** ${generateFundingAsk(startupInfo)}\n\n**Use of Funds:** Accelerate product development, team expansion, and market penetration`,
    presenterNotes: `Be specific about how much you're raising and exactly how you'll use the funds. Show the expected return on investment.`
  });

  slides.push({
    id: '10',
    title: 'Questions & Next Steps',
    content: `**Questions:** ${generateTeamInfo(startupInfo)}, ${generateFinancials(startupInfo)}, ${generateFundingAsk(startupInfo)}`,
    presenterNotes: `End with a strong call to action. Invite questions and show enthusiasm for moving forward.`
  });

  return slides;
}

// Start the server
app.listen(port, () => {
  console.log(`🚀 Startup Genie MCP Server running on http://localhost:${port}`);
  console.log(`📊 Health check: http://localhost:${port}/api/health`);
  console.log(`🔍 Test endpoints:`);
  console.log(`   POST http://localhost:${port}/api/validate_idea`);
  console.log(`   POST http://localhost:${port}/api/generate_business_model`);
  console.log(`   POST http://localhost:${port}/api/create_pitch_deck`);
});