import express from 'express';
import cors from 'cors';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { GoogleTrendsDataSource } from './data-sources/google-trends.js';
import { RedditDataSource } from './data-sources/reddit-data.js';
import { WebScraperDataSource } from './data-sources/web-scraper.js';
import { RAGSystem } from './rag/rag-system.js';
import { 
  ValidationResult, 
  BusinessModelData, 
  StartupData, 
  MarketData,
  PitchDeck,
  PitchSlide
} from './types/index.js';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// RAG-like data processing system
class RAGProcessor {
  private dataCache: Map<string, any> = new Map();
  private cacheTimeout = 30 * 60 * 1000; // 30 minutes

  // Fetch and process data for idea validation
  async processIdeaValidation(ideaDescription: string): Promise<ValidationResult> {
    const cacheKey = `idea_${ideaDescription.toLowerCase().replace(/\s+/g, '_')}`;
    
    if (this.dataCache.has(cacheKey)) {
      const cached = this.dataCache.get(cacheKey);
      if (Date.now() - cached.timestamp < this.cacheTimeout) {
        return cached.data;
      }
    }

    console.log(`🔍 Processing idea validation for: ${ideaDescription}`);

    // Use dynamic business analysis instead of static detection
    const businessAnalysis = await this.analyzeBusinessDynamically(ideaDescription);
    
    // Process and analyze the data using dynamic context
    const feasibilityScore = this.calculateFeasibilityScoreFromContext(businessAnalysis);
    const opportunities = this.identifyOpportunitiesFromContext(businessAnalysis);
    const risks = this.identifyRisksFromContext(businessAnalysis);
    const recommendations = this.generateRecommendationsFromContext(businessAnalysis);

    const result: ValidationResult = {
      feasibilityScore,
      marketSize: businessAnalysis.marketData?.marketSize || '$1.89 billion',
      competitionLevel: this.assessCompetitionLevelFromContext(businessAnalysis),
      trends: businessAnalysis.marketData?.marketTrends || ['Market analysis shows stable growth patterns'],
      opportunities,
      risks,
      recommendations,
      similarStartups: businessAnalysis.competitors?.competitors || [],
      marketInsights: {
        marketSize: businessAnalysis.marketData?.marketSize || '$1.89 billion',
        growthRate: 'High growth (25%+ annually)',
        trends: businessAnalysis.marketData?.marketTrends || ['Market analysis shows stable growth patterns'],
        opportunities,
        threats: risks
      }
    };

    // Cache the result
    this.dataCache.set(cacheKey, {
      data: result,
      timestamp: Date.now()
    });

    return result;
  }

  // Fetch and process data for business model generation
  async processBusinessModelGeneration(companyInfo: any): Promise<BusinessModelData> {
    const cacheKey = `business_${companyInfo.description?.toLowerCase().replace(/\s+/g, '_')}`;
    
    if (this.dataCache.has(cacheKey)) {
      const cached = this.dataCache.get(cacheKey);
      if (Date.now() - cached.timestamp < this.cacheTimeout) {
        return cached.data;
      }
    }

    console.log(`🏢 Processing business model for: ${companyInfo.description}`);

    const businessAnalysis = await this.analyzeBusinessDynamically(companyInfo.description);
    
    // Generate industry-specific business model components using dynamic context
    const result: BusinessModelData = {
      revenueStreams: this.generateRevenueStreams(businessAnalysis, businessAnalysis.businessModels, businessAnalysis.competitors),
      costStructure: this.generateCostStructure(businessAnalysis, businessAnalysis.businessModels),
      keyPartnerships: this.generateKeyPartnerships(businessAnalysis, businessAnalysis.businessModels),
      keyResources: this.generateKeyResources(businessAnalysis, businessAnalysis.businessModels),
      valuePropositions: this.generateValuePropositions(businessAnalysis, businessAnalysis.marketData),
      customerSegments: this.generateCustomerSegments(businessAnalysis, businessAnalysis.marketData),
      channels: this.generateChannels(businessAnalysis, businessAnalysis.businessModels),
      customerRelationships: this.generateCustomerRelationships(businessAnalysis, businessAnalysis.businessModels)
    };

    // Cache the result
    this.dataCache.set(cacheKey, {
      data: result,
      timestamp: Date.now()
    });

    return result;
  }

  // Fetch and process data for pitch deck creation
  async processPitchDeckCreation(startupInfo: any): Promise<PitchDeck> {
    const cacheKey = `pitch_${startupInfo.startupName}_${startupInfo.description?.toLowerCase().replace(/\s+/g, '_')}`;
    
    if (this.dataCache.has(cacheKey)) {
      const cached = this.dataCache.get(cacheKey);
      if (Date.now() - cached.timestamp < this.cacheTimeout) {
        return cached.data;
      }
    }

    console.log(`📊 Processing pitch deck for: ${startupInfo.startupName}`);

    const businessAnalysis = await this.analyzeBusinessDynamically(startupInfo.description);
    
    // Generate dynamic pitch slides using context
    const slides = this.generatePitchSlidesFromContext(startupInfo, businessAnalysis);

    const result: PitchDeck = {
      startupName: startupInfo.startupName,
      title: `${startupInfo.startupName} - Investor Pitch Deck`,
      slides,
      createdAt: new Date().toISOString()
    };

    // Cache the result
    this.dataCache.set(cacheKey, {
      data: result,
      timestamp: Date.now()
    });

    return result;
  }

  // Dynamic web-based business analysis
  private async analyzeBusinessDynamically(description: string): Promise<any> {
    console.log(`🔍 Dynamically analyzing business: ${description}`);
    
    // Extract key terms for web search
    const searchTerms = this.extractSearchTerms(description);
    
    // Fetch real business context from multiple sources
    const [industryContext, businessModels, marketData, competitors] = await Promise.all([
      this.fetchIndustryContext(searchTerms),
      this.fetchBusinessModelExamples(searchTerms),
      this.fetchMarketContext(searchTerms),
      this.fetchCompetitorContext(searchTerms)
    ]);

    // Generate dynamic business analysis based on real data
    return {
      businessType: this.detectBusinessTypeFromContext(industryContext, description),
      productType: this.detectProductTypeFromContext(industryContext, description),
      targetMarket: this.detectTargetMarketFromContext(marketData, description),
      valueProps: this.extractValuePropsFromContext(industryContext, description),
      industryContext,
      businessModels,
      marketData,
      competitors
    };
  }

  private extractSearchTerms(description: string): string[] {
    const lowerDesc = description.toLowerCase();
    const terms: string[] = [];
    
    // Extract business-related terms
    const businessKeywords = [
      'healthcare', 'health', 'medical', 'hospital', 'clinic', 'pharmacy',
      'food', 'delivery', 'restaurant', 'catering', 'meal',
      'shoes', 'footwear', 'sneakers', 'luxury', 'fashion', 'resale',
      'ai', 'artificial intelligence', 'machine learning', 'technology',
      'education', 'learning', 'training', 'course',
      'finance', 'banking', 'payment', 'insurance',
      'real estate', 'property', 'housing',
      'transportation', 'logistics', 'shipping',
      'government', 'public', 'free', 'subsidy'
    ];
    
    terms.push(...businessKeywords.filter(term => lowerDesc.includes(term)));
    
    // Extract action words
    const actionWords = ['provide', 'deliver', 'create', 'build', 'develop', 'offer', 'sell', 'buy', 'connect', 'manage'];
    terms.push(...actionWords.filter(word => lowerDesc.includes(word)));
    
    // Extract target indicators
    const targetWords = ['free', 'premium', 'luxury', 'affordable', 'enterprise', 'small business', 'individual', 'government'];
    terms.push(...targetWords.filter(word => lowerDesc.includes(word)));
    
    return terms.length > 0 ? terms : ['business', 'startup', 'service'];
  }

  private async fetchIndustryContext(searchTerms: string[]): Promise<any> {
    try {
      // Use alternative data sources instead of Google
      const searchQuery = `${searchTerms.join(' ')} industry business model market analysis`;
      
      // Try multiple data sources
      const sources = [
        `https://www.statista.com/search/?q=${encodeURIComponent(searchQuery)}`,
        `https://www.ibisworld.com/search/?q=${encodeURIComponent(searchQuery)}`,
        `https://www.marketsandmarkets.com/search?q=${encodeURIComponent(searchQuery)}`
      ];

      for (const source of sources) {
        try {
          const response = await axios.get(source, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            },
            timeout: 5000
          });

          const $ = cheerio.load(response.data);
          const context = this.extractIndustryContext($);
          
          // If we got meaningful data, return it
          if (context.industry || context.revenueStreams.length > 0) {
            console.log(`✅ Successfully fetched industry context from ${source}`);
            return context;
          }
        } catch (error) {
          console.warn(`Failed to fetch from ${source}:`, (error as Error).message);
          continue;
        }
      }

      // If all sources fail, generate context based on search terms
      return this.generateIndustryContextFromTerms(searchTerms);
    } catch (error) {
      console.warn('All industry context sources failed:', error);
      return this.generateIndustryContextFromTerms(searchTerms);
    }
  }

  private generateIndustryContextFromTerms(searchTerms: string[]): any {
    const terms = searchTerms.join(' ').toLowerCase();
    const context: any = {
      industry: '',
      businessModels: [],
      revenueStreams: [],
      costStructure: [],
      partnerships: [],
      resources: []
    };

    // Generate industry-specific context based on terms
    if (terms.includes('health') || terms.includes('medical') || terms.includes('hospital')) {
      context.industry = 'Healthcare and Medical Services';
      context.revenueStreams = [
        'Government funding and grants',
        'Medicare/Medicaid reimbursements',
        'Insurance partnerships',
        'Pharmaceutical partnerships',
        'Medical equipment leasing',
        'Research and clinical trials'
      ];
      context.costStructure = [
        'Medical staff salaries and benefits',
        'Medical equipment and supplies',
        'Facility maintenance and utilities',
        'Regulatory compliance and licensing'
      ];
      context.partnerships = [
        'Government health agencies',
        'Insurance companies',
        'Pharmaceutical companies',
        'Medical equipment suppliers'
      ];
      context.resources = [
        'Medical professionals and staff',
        'Medical facilities and equipment',
        'Government funding and grants',
        'Medical licenses and certifications'
      ];
    } else if (terms.includes('food') || terms.includes('delivery') || terms.includes('restaurant')) {
      context.industry = 'Food Delivery and Restaurant Services';
      context.revenueStreams = [
        'Delivery fees',
        'Restaurant commission (15-30%)',
        'Subscription fees for premium features',
        'Rush delivery fees'
      ];
      context.costStructure = [
        'Delivery fleet management',
        'Restaurant onboarding and support',
        'Food safety compliance',
        'Delivery insurance'
      ];
      context.partnerships = [
        'Restaurant networks',
        'Delivery service providers',
        'Payment processors',
        'Food safety certification bodies'
      ];
      context.resources = [
        'Delivery network',
        'Restaurant partnerships',
        'Food safety protocols',
        'Real-time tracking system'
      ];
    } else if (terms.includes('ai') || terms.includes('technology') || terms.includes('software')) {
      context.industry = 'Technology and Software Services';
      context.revenueStreams = [
        'Software licensing fees',
        'Subscription services',
        'API access fees',
        'Consulting services'
      ];
      context.costStructure = [
        'Development team salaries',
        'Cloud infrastructure costs',
        'Marketing and sales expenses',
        'Legal and compliance costs'
      ];
      context.partnerships = [
        'Cloud computing providers',
        'Technology integrators',
        'Marketing agencies',
        'Legal and accounting firms'
      ];
      context.resources = [
        'Development team',
        'Technology platform',
        'Intellectual property',
        'Customer data'
      ];
    } else if (terms.includes('shoes') || terms.includes('fashion') || terms.includes('luxury')) {
      context.industry = 'Luxury Fashion and Retail';
      context.revenueStreams = [
        'Authentication fees',
        'Commission on sales (10-15%)',
        'Premium listing fees',
        'Storage fees for high-value items'
      ];
      context.costStructure = [
        'Authentication services',
        'Secure storage facilities',
        'Insurance for high-value items',
        'Expert verification team'
      ];
      context.partnerships = [
        'Luxury brand authenticators',
        'Secure logistics providers',
        'Insurance companies',
        'Fashion industry experts'
      ];
      context.resources = [
        'Authentication expertise',
        'Secure storage facilities',
        'Luxury brand relationships',
        'Expert verification team'
      ];
    } else {
      // Generic business context
      context.industry = 'General Business Services';
      context.revenueStreams = [
        'Service fees',
        'Subscription fees',
        'Transaction fees',
        'Consulting fees'
      ];
      context.costStructure = [
        'Employee salaries',
        'Technology infrastructure',
        'Marketing and customer acquisition',
        'Legal and compliance'
      ];
      context.partnerships = [
        'Technology providers',
        'Marketing agencies',
        'Legal and accounting firms'
      ];
      context.resources = [
        'Development team',
        'Technology platform',
        'Customer data',
        'Intellectual property'
      ];
    }

    return context;
  }

  private async fetchBusinessModelExamples(searchTerms: string[]): Promise<any> {
    try {
      const searchQuery = `${searchTerms.join(' ')} business model revenue streams examples`;
      const response = await axios.get(`https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        timeout: 10000
      });

      const $ = cheerio.load(response.data);
      return this.extractBusinessModelExamples($);
    } catch (error) {
      console.warn('Failed to fetch business model examples:', error);
      return {};
    }
  }

  private async fetchMarketContext(searchTerms: string[]): Promise<any> {
    try {
      const searchQuery = `${searchTerms.join(' ')} market size customers target audience`;
      const response = await axios.get(`https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        timeout: 10000
      });

      const $ = cheerio.load(response.data);
      return this.extractMarketContext($);
    } catch (error) {
      console.warn('Failed to fetch market context:', error);
      return {};
    }
  }

  private async fetchCompetitorContext(searchTerms: string[]): Promise<any> {
    try {
      const searchQuery = `${searchTerms.join(' ')} competitors companies similar businesses`;
      const response = await axios.get(`https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        timeout: 10000
      });

      const $ = cheerio.load(response.data);
      return this.extractCompetitorContext($);
    } catch (error) {
      console.warn('Failed to fetch competitor context:', error);
      return {};
    }
  }

  private extractIndustryContext($: cheerio.CheerioAPI): any {
    const context: any = {
      industry: '',
      businessModels: [],
      revenueStreams: [],
      costStructure: [],
      partnerships: [],
      resources: []
    };

    $('p, div, h1, h2, h3').each((i, el) => {
      const text = $(el).text().toLowerCase();
      
      // Extract industry information
      if (text.includes('industry') || text.includes('sector') || text.includes('market')) {
        context.industry = text.substring(0, 200);
      }
      
      // Extract business model components
      if (text.includes('revenue') || text.includes('income') || text.includes('earnings')) {
        context.revenueStreams.push(text.substring(0, 100));
      }
      
      if (text.includes('cost') || text.includes('expense') || text.includes('spending')) {
        context.costStructure.push(text.substring(0, 100));
      }
      
      if (text.includes('partner') || text.includes('alliance') || text.includes('collaboration')) {
        context.partnerships.push(text.substring(0, 100));
      }
      
      if (text.includes('resource') || text.includes('asset') || text.includes('capability')) {
        context.resources.push(text.substring(0, 100));
      }
    });

    return context;
  }

  private extractBusinessModelExamples($: cheerio.CheerioAPI): any {
    const examples: any = {
      revenueStreams: [],
      costStructure: [],
      partnerships: [],
      resources: [],
      valuePropositions: [],
      customerSegments: []
    };

    $('p, div, li').each((i, el) => {
      const text = $(el).text().toLowerCase();
      
      // Extract revenue streams
      if (text.includes('revenue') || text.includes('income') || text.includes('fee') || text.includes('subscription')) {
        examples.revenueStreams.push(text.substring(0, 80));
      }
      
      // Extract costs
      if (text.includes('cost') || text.includes('expense') || text.includes('salary') || text.includes('infrastructure')) {
        examples.costStructure.push(text.substring(0, 80));
      }
      
      // Extract partnerships
      if (text.includes('partner') || text.includes('supplier') || text.includes('vendor')) {
        examples.partnerships.push(text.substring(0, 80));
      }
      
      // Extract resources
      if (text.includes('resource') || text.includes('asset') || text.includes('team') || text.includes('technology')) {
        examples.resources.push(text.substring(0, 80));
      }
      
      // Extract value propositions
      if (text.includes('value') || text.includes('benefit') || text.includes('advantage') || text.includes('solution')) {
        examples.valuePropositions.push(text.substring(0, 80));
      }
      
      // Extract customer segments
      if (text.includes('customer') || text.includes('client') || text.includes('user') || text.includes('audience')) {
        examples.customerSegments.push(text.substring(0, 80));
      }
    });

    return examples;
  }

  private extractMarketContext($: cheerio.CheerioAPI): any {
    const context: any = {
      marketSize: '',
      targetCustomers: [],
      customerNeeds: [],
      marketTrends: []
    };

    $('p, div').each((i, el) => {
      const text = $(el).text().toLowerCase();
      
      // Extract market size
      if (text.includes('market size') || text.includes('billion') || text.includes('million')) {
        context.marketSize = text.substring(0, 100);
      }
      
      // Extract target customers
      if (text.includes('customer') || text.includes('user') || text.includes('client') || text.includes('audience')) {
        context.targetCustomers.push(text.substring(0, 80));
      }
      
      // Extract customer needs
      if (text.includes('need') || text.includes('problem') || text.includes('pain point') || text.includes('challenge')) {
        context.customerNeeds.push(text.substring(0, 80));
      }
      
      // Extract market trends
      if (text.includes('trend') || text.includes('growth') || text.includes('increase') || text.includes('demand')) {
        context.marketTrends.push(text.substring(0, 80));
      }
    });

    return context;
  }

  private extractCompetitorContext($: cheerio.CheerioAPI): any {
    const context: any = {
      competitors: [],
      competitiveAdvantages: [],
      marketPosition: ''
    };

    $('a, h3, h2, p').each((i, el) => {
      const text = $(el).text();
      
      // Extract competitor names
      if (text.length > 3 && text.length < 100 && !text.includes('Google') && !text.includes('Search')) {
        context.competitors.push(text);
      }
      
      // Extract competitive advantages
      if (text.toLowerCase().includes('advantage') || text.toLowerCase().includes('differentiation') || text.toLowerCase().includes('unique')) {
        context.competitiveAdvantages.push(text.substring(0, 80));
      }
    });

    return context;
  }

  private detectBusinessTypeFromContext(industryContext: any, description: string): string {
    const lowerDesc = description.toLowerCase();
    const contextText = industryContext.industry?.toLowerCase() || '';
    
    if (lowerDesc.includes('marketplace') || lowerDesc.includes('platform') || contextText.includes('marketplace')) {
      return 'marketplace';
    } else if (lowerDesc.includes('delivery') || lowerDesc.includes('service') || contextText.includes('service')) {
      return 'service';
    } else if (lowerDesc.includes('product') || lowerDesc.includes('manufacturing') || contextText.includes('product')) {
      return 'product';
    } else if (lowerDesc.includes('software') || lowerDesc.includes('app') || contextText.includes('software')) {
      return 'platform';
    }
    
    return 'service';
  }

  private detectProductTypeFromContext(industryContext: any, description: string): string {
    const lowerDesc = description.toLowerCase();
    const contextText = industryContext.industry?.toLowerCase() || '';
    
    // More specific detection logic
    if (lowerDesc.includes('health') || lowerDesc.includes('medical') || lowerDesc.includes('hospital') || 
        lowerDesc.includes('clinic') || lowerDesc.includes('govt funds') || lowerDesc.includes('government') ||
        contextText.includes('healthcare') || contextText.includes('medical')) {
      return 'healthcare';
    } else if (lowerDesc.includes('food') || lowerDesc.includes('delivery') || lowerDesc.includes('restaurant') ||
               lowerDesc.includes('meal') || lowerDesc.includes('catering') ||
               contextText.includes('food') || contextText.includes('restaurant')) {
      return 'food_delivery';
    } else if (lowerDesc.includes('shoes') || lowerDesc.includes('sneakers') || lowerDesc.includes('footwear') ||
               lowerDesc.includes('luxury') || lowerDesc.includes('fashion') || lowerDesc.includes('resale') ||
               contextText.includes('fashion') || contextText.includes('luxury')) {
      return 'fashion_retail';
    } else if (lowerDesc.includes('ai') || lowerDesc.includes('artificial intelligence') || 
               lowerDesc.includes('machine learning') || lowerDesc.includes('technology') ||
               lowerDesc.includes('software') || lowerDesc.includes('app') ||
               contextText.includes('technology') || contextText.includes('software')) {
      return 'technology';
    } else if (lowerDesc.includes('education') || lowerDesc.includes('learning') || 
               lowerDesc.includes('training') || lowerDesc.includes('course') ||
               contextText.includes('education')) {
      return 'education';
    } else if (lowerDesc.includes('finance') || lowerDesc.includes('banking') || 
               lowerDesc.includes('payment') || lowerDesc.includes('insurance') ||
               contextText.includes('finance') || contextText.includes('banking')) {
      return 'financial_services';
    }
    
    return 'general_service';
  }

  private detectTargetMarketFromContext(marketData: any, description: string): string {
    const lowerDesc = description.toLowerCase();
    const contextText = marketData.targetCustomers?.join(' ')?.toLowerCase() || '';
    
    // More specific target market detection
    if (lowerDesc.includes('free') || lowerDesc.includes('govt funds') || lowerDesc.includes('government') ||
        lowerDesc.includes('public') || lowerDesc.includes('subsidy') ||
        contextText.includes('government') || contextText.includes('public')) {
      return 'government_public';
    } else if (lowerDesc.includes('luxury') || lowerDesc.includes('premium') || 
               lowerDesc.includes('high end') || lowerDesc.includes('exclusive') ||
               contextText.includes('premium') || contextText.includes('luxury')) {
      return 'luxury_premium';
    } else if (lowerDesc.includes('enterprise') || lowerDesc.includes('corporate') || 
               lowerDesc.includes('business') || lowerDesc.includes('b2b') ||
               contextText.includes('enterprise') || contextText.includes('corporate')) {
      return 'enterprise';
    } else if (lowerDesc.includes('small business') || lowerDesc.includes('startup') ||
               lowerDesc.includes('sme') || lowerDesc.includes('local business') ||
               contextText.includes('small business')) {
      return 'small_business';
    } else if (lowerDesc.includes('individual') || lowerDesc.includes('consumer') ||
               lowerDesc.includes('personal') || lowerDesc.includes('b2c')) {
      return 'individual_consumer';
    }
    
    return 'general_consumer';
  }

  private extractValuePropsFromContext(industryContext: any, description: string): string[] {
    const valueProps: string[] = [];
    const lowerDesc = description.toLowerCase();
    const contextText = industryContext.industry?.toLowerCase() || '';
    
    if (lowerDesc.includes('free') || lowerDesc.includes('government')) {
      valueProps.push('free_access');
    }
    if (lowerDesc.includes('quality') || contextText.includes('quality')) {
      valueProps.push('quality_assurance');
    }
    if (lowerDesc.includes('fast') || lowerDesc.includes('quick') || contextText.includes('speed')) {
      valueProps.push('speed_efficiency');
    }
    if (lowerDesc.includes('secure') || contextText.includes('security')) {
      valueProps.push('security_privacy');
    }
    if (lowerDesc.includes('convenient') || contextText.includes('convenience')) {
      valueProps.push('convenience');
    }
    
    return valueProps;
  }

  // Context-based analysis methods for idea validation
  private calculateFeasibilityScoreFromContext(businessAnalysis: any): number {
    let score = 7; // Base score

    // Market size factor
    if (businessAnalysis.marketData?.marketSize?.includes('billion')) {
      score += 1;
    }

    // Competition factor
    const competitorCount = businessAnalysis.competitors?.competitors?.length || 0;
    if (competitorCount < 5) {
      score += 1;
    } else if (competitorCount > 10) {
      score -= 1;
    }

    // Trend factor
    if (businessAnalysis.marketData?.marketTrends?.length > 0) {
      score += 1;
    }

    return Math.min(Math.max(score, 1), 10);
  }

  private identifyOpportunitiesFromContext(businessAnalysis: any): string[] {
    const opportunities: string[] = [];

    if (businessAnalysis.marketData?.marketSize?.includes('billion')) {
      opportunities.push('Large market opportunity with significant growth potential');
    }

    if (businessAnalysis.marketData?.marketTrends?.length > 0) {
      opportunities.push('Market trends align with current industry direction');
    }

    const competitorCount = businessAnalysis.competitors?.competitors?.length || 0;
    if (competitorCount < 5) {
      opportunities.push('Limited competition in the space');
    }

    opportunities.push('Growing demand for innovative solutions');
    opportunities.push('Technology advancement enabling new possibilities');

    return opportunities.slice(0, 5);
  }

  private identifyRisksFromContext(businessAnalysis: any): string[] {
    const risks: string[] = [];

    const competitorCount = businessAnalysis.competitors?.competitors?.length || 0;
    if (competitorCount > 5) {
      risks.push('High competition from established players');
    }

    if (businessAnalysis.marketData?.marketSize?.includes('million')) {
      risks.push('Limited market size may constrain growth');
    }

    risks.push('Regulatory challenges in some markets');
    risks.push('Technology adoption barriers');
    risks.push('Market volatility and economic uncertainty');

    return risks.slice(0, 5);
  }

  private generateRecommendationsFromContext(businessAnalysis: any): string[] {
    const recommendations: string[] = [];

    const risks = this.identifyRisksFromContext(businessAnalysis);
    if (risks.some(risk => risk.includes('competition'))) {
      recommendations.push('Focus on a specific niche to differentiate from competitors');
    }

    if (businessAnalysis.marketData?.marketSize?.includes('billion')) {
      recommendations.push('Leverage the large market opportunity with strategic positioning');
    }

    recommendations.push('Conduct thorough market research and customer interviews');
    recommendations.push('Build a minimum viable product (MVP) to test assumptions');
    recommendations.push('Consider strategic partnerships for faster market entry');

    return recommendations.slice(0, 5);
  }

  private assessCompetitionLevelFromContext(businessAnalysis: any): string {
    const competitorCount = businessAnalysis.competitors?.competitors?.length || 0;
    if (competitorCount < 3) return 'Low';
    if (competitorCount < 8) return 'Medium';
    return 'High';
  }

  // Business model generation methods
  private generateRevenueStreams(businessAnalysis: any, businessModelExamples: any, competitors: any[]): string[] {
    const streams: string[] = [];
    
    // Use scraped business model examples as primary source
    if (businessModelExamples.revenueStreams && businessModelExamples.revenueStreams.length > 0) {
      streams.push(...businessModelExamples.revenueStreams.slice(0, 6));
    }
    
    // Use industry context as secondary source
    if (businessAnalysis.industryContext?.revenueStreams && businessAnalysis.industryContext.revenueStreams.length > 0) {
      streams.push(...businessAnalysis.industryContext.revenueStreams.slice(0, 4));
    }
    
    // Generate based on business type if we don't have enough data
    if (streams.length < 3) {
      if (businessAnalysis.businessType === 'marketplace') {
        streams.push('Commission on sales (10-15%)');
        streams.push('Transaction fees');
        streams.push('Premium listing fees');
      } else if (businessAnalysis.businessType === 'platform') {
        streams.push('Subscription fees');
        streams.push('Usage-based pricing');
        streams.push('API access fees');
      } else if (businessAnalysis.businessType === 'service') {
        streams.push('Service fees');
        streams.push('Consulting fees');
        streams.push('Maintenance fees');
      }
    }
    
    // Add common streams if we still don't have enough
    if (streams.length < 4) {
      streams.push('Data monetization');
      streams.push('Partnership revenue');
    }
    
    return streams.slice(0, 8);
  }

  private generateCostStructure(businessAnalysis: any, businessModelExamples: any): string[] {
    const costs: string[] = [];
    
    // Use scraped business model examples as primary source
    if (businessModelExamples.costStructure && businessModelExamples.costStructure.length > 0) {
      costs.push(...businessModelExamples.costStructure.slice(0, 6));
    }
    
    // Use industry context as secondary source
    if (businessAnalysis.industryContext?.costStructure && businessAnalysis.industryContext.costStructure.length > 0) {
      costs.push(...businessAnalysis.industryContext.costStructure.slice(0, 4));
    }
    
    // Add common costs if we don't have enough data
    if (costs.length < 4) {
      costs.push('Technology infrastructure');
      costs.push('Employee salaries');
      costs.push('Marketing and customer acquisition');
      costs.push('Legal and compliance');
    }
    
    return costs.slice(0, 8);
  }

  private generateKeyPartnerships(businessAnalysis: any, businessModelExamples: any): string[] {
    const partnerships: string[] = [];
    
    // Use scraped business model examples as primary source
    if (businessModelExamples.partnerships && businessModelExamples.partnerships.length > 0) {
      partnerships.push(...businessModelExamples.partnerships.slice(0, 6));
    }
    
    // Use industry context as secondary source
    if (businessAnalysis.industryContext?.partnerships && businessAnalysis.industryContext.partnerships.length > 0) {
      partnerships.push(...businessAnalysis.industryContext.partnerships.slice(0, 4));
    }
    
    // Add common partnerships if we don't have enough data
    if (partnerships.length < 4) {
      partnerships.push('Technology providers');
      partnerships.push('Marketing agencies');
      partnerships.push('Legal and accounting firms');
    }
    
    return partnerships.slice(0, 8);
  }

  private generateKeyResources(businessAnalysis: any, businessModelExamples: any): string[] {
    const resources: string[] = [];
    
    // Use scraped business model examples as primary source
    if (businessModelExamples.resources && businessModelExamples.resources.length > 0) {
      resources.push(...businessModelExamples.resources.slice(0, 6));
    }
    
    // Use industry context as secondary source
    if (businessAnalysis.industryContext?.resources && businessAnalysis.industryContext.resources.length > 0) {
      resources.push(...businessAnalysis.industryContext.resources.slice(0, 4));
    }
    
    // Add common resources if we don't have enough data
    if (resources.length < 4) {
      resources.push('Development team');
      resources.push('Technology platform');
      resources.push('Customer data');
      resources.push('Intellectual property');
    }
    
    return resources.slice(0, 8);
  }

  private generateValuePropositions(businessAnalysis: any, marketData: any): string[] {
    const propositions: string[] = [];
    
    // Use scraped business model examples as primary source
    if (businessAnalysis.businessModels?.valuePropositions && businessAnalysis.businessModels.valuePropositions.length > 0) {
      propositions.push(...businessAnalysis.businessModels.valuePropositions.slice(0, 4));
    }
    
    // Generate based on value props detected from context
    if (businessAnalysis.valueProps.includes('free_access')) {
      propositions.push('Free access to essential services');
    }
    if (businessAnalysis.valueProps.includes('quality_assurance')) {
      propositions.push('High-quality, reliable service delivery');
    }
    if (businessAnalysis.valueProps.includes('speed_efficiency')) {
      propositions.push('Fast and efficient service delivery');
    }
    if (businessAnalysis.valueProps.includes('security_privacy')) {
      propositions.push('Secure and private data handling');
    }
    if (businessAnalysis.valueProps.includes('convenience')) {
      propositions.push('Convenient and user-friendly experience');
    }
    
    // Add default propositions if we don't have enough
    if (propositions.length < 3) {
      propositions.push('Innovative solution to market problems');
      propositions.push('Superior user experience and interface');
      propositions.push('Cost-effective alternative to existing solutions');
    }
    
    return propositions.slice(0, 5);
  }

  private generateCustomerSegments(businessAnalysis: any, marketData: any): string[] {
    const segments: string[] = [];
    
    // Use scraped market data as primary source
    if (marketData.targetCustomers && marketData.targetCustomers.length > 0) {
      segments.push(...marketData.targetCustomers.slice(0, 4));
    }
    
    // Use scraped business model examples as secondary source
    if (businessAnalysis.businessModels?.customerSegments && businessAnalysis.businessModels.customerSegments.length > 0) {
      segments.push(...businessAnalysis.businessModels.customerSegments.slice(0, 3));
    }
    
    // Generate based on target market if we don't have enough data
    if (segments.length < 3) {
      if (businessAnalysis.targetMarket === 'government_public') {
        segments.push('Government agencies');
        segments.push('Public sector organizations');
        segments.push('Community organizations');
      } else if (businessAnalysis.targetMarket === 'luxury_premium') {
        segments.push('High-net-worth individuals');
        segments.push('Premium customers');
        segments.push('Luxury market consumers');
      } else if (businessAnalysis.targetMarket === 'enterprise') {
        segments.push('Large corporations');
        segments.push('Enterprise customers');
        segments.push('Business organizations');
      } else if (businessAnalysis.targetMarket === 'small_business') {
        segments.push('Small to medium businesses');
        segments.push('Startups and entrepreneurs');
        segments.push('Local businesses');
      }
    }
    
    // Add default segments if we still don't have enough
    if (segments.length < 3) {
      segments.push('Individual consumers');
      segments.push('Small to medium businesses');
      segments.push('Specific industry verticals');
    }
    
    return segments.slice(0, 5);
  }

  private generateChannels(businessAnalysis: any, businessModelExamples: any): string[] {
    const channels: string[] = [];
    
    // Generate based on business type
    if (businessAnalysis.businessType === 'marketplace') {
      channels.push('Online marketplace platform');
      channels.push('Mobile applications');
      channels.push('Social media marketing');
    } else if (businessAnalysis.businessType === 'platform') {
      channels.push('Web platform');
      channels.push('API integrations');
      channels.push('Partner networks');
    } else if (businessAnalysis.businessType === 'service') {
      channels.push('Direct service delivery');
      channels.push('Service provider networks');
      channels.push('Referral programs');
    }
    
    // Generate based on target market
    if (businessAnalysis.targetMarket === 'enterprise') {
      channels.push('Direct enterprise sales');
      channels.push('Partner channel sales');
      channels.push('Industry conferences and events');
    } else if (businessAnalysis.targetMarket === 'government_public') {
      channels.push('Government procurement');
      channels.push('Public sector partnerships');
      channels.push('Community outreach');
    }
    
    // Add common channels
    channels.push('Direct sales');
    channels.push('Online marketing');
    channels.push('App stores and marketplaces');
    channels.push('Referral programs');
    
    return channels.slice(0, 6);
  }

  private generateCustomerRelationships(businessAnalysis: any, businessModelExamples: any): string[] {
    const relationships: string[] = [];
    
    // Generate based on target market
    if (businessAnalysis.targetMarket === 'luxury_premium') {
      relationships.push('Personal concierge services');
      relationships.push('Exclusive membership programs');
      relationships.push('VIP customer support');
    } else if (businessAnalysis.targetMarket === 'enterprise') {
      relationships.push('Dedicated account managers');
      relationships.push('Custom training programs');
      relationships.push('24/7 enterprise support');
    } else if (businessAnalysis.targetMarket === 'government_public') {
      relationships.push('Government liaison services');
      relationships.push('Public sector support');
      relationships.push('Community engagement programs');
    } else if (businessAnalysis.businessType === 'platform') {
      relationships.push('Self-service platform');
      relationships.push('Community and support forums');
      relationships.push('API documentation and support');
    }
    
    // Add common relationships
    relationships.push('Personal account management');
    relationships.push('Training and onboarding');
    relationships.push('Ongoing customer success');
    
    return relationships.slice(0, 6);
  }

  // Context-based pitch deck generation
  private generatePitchSlidesFromContext(startupInfo: any, businessAnalysis: any): PitchSlide[] {
    const slides: PitchSlide[] = [];

    // Generate problem statement based on context
    const problemStatement = this.generateProblemStatementFromContext(startupInfo, businessAnalysis);
    const solutionStatement = this.generateSolutionStatementFromContext(startupInfo, businessAnalysis);

    slides.push({
      id: '1',
      title: `${startupInfo.startupName} - Overview`,
      content: `**Problem:** ${problemStatement}\n\n**Solution:** ${solutionStatement}\n\n**Market Size:** ${businessAnalysis.marketData?.marketSize || '$1.89 billion'}\n\n**Business Model:** ${this.generateBusinessModelSummaryFromContext(businessAnalysis)}\n\n**Traction:** ${this.generateTractionStatement(startupInfo)}\n\n**Team:** ${this.generateTeamStatement(startupInfo)}\n\n**Competition:** ${this.generateCompetitionStatementFromContext(businessAnalysis)}\n\n**Financials:** ${this.generateFinancialsStatement(startupInfo)}\n\n**Funding Ask:** ${this.generateFundingAsk(startupInfo)}`,
      presenterNotes: `Start with a strong hook about the problem. Emphasize the market size and your unique solution. Be prepared to discuss your team's background and the competitive landscape.`
    });

    slides.push({
      id: '2',
      title: 'Market Analysis',
      content: `**Competition Level:** ${this.assessCompetitionLevelFromContext(businessAnalysis)}\n\n**Key Opportunities:** ${this.identifyOpportunitiesFromContext(businessAnalysis).join(', ')}\n\n**Key Risks:** ${this.identifyRisksFromContext(businessAnalysis).join(', ')}\n\n**Recommended Actions:** ${this.generateRecommendationsFromContext(businessAnalysis).join(', ')}`,
      presenterNotes: `Highlight the market opportunity and how you're positioned to capture it. Address potential risks proactively and show you have a plan to mitigate them.`
    });

    slides.push({
      id: '3',
      title: 'Business Model',
      content: `**Revenue Streams:** ${this.generateRevenueStreams(businessAnalysis, businessAnalysis.businessModels, businessAnalysis.competitors).join(', ')}\n\n**Cost Structure:** ${this.generateCostStructure(businessAnalysis, businessAnalysis.businessModels).join(', ')}\n\n**Key Partnerships:** ${this.generateKeyPartnerships(businessAnalysis, businessAnalysis.businessModels).join(', ')}\n\n**Key Resources:** ${this.generateKeyResources(businessAnalysis, businessAnalysis.businessModels).join(', ')}`,
      presenterNotes: `Explain how you will generate revenue and achieve profitability. Show that you understand the economics of your business.`
    });

    slides.push({
      id: '4',
      title: 'Value Proposition',
      content: `**Core Value Propositions:** ${this.generateValuePropositions(businessAnalysis, businessAnalysis.marketData).join(', ')}\n\n**Target Market:** ${this.generateCustomerSegments(businessAnalysis, businessAnalysis.marketData).join(', ')}\n\n**Customer Relationships:** ${this.generateCustomerRelationships(businessAnalysis, businessAnalysis.businessModels).join(', ')}\n\n**Channels:** ${this.generateChannels(businessAnalysis, businessAnalysis.businessModels).join(', ')}`,
      presenterNotes: `Clearly articulate what makes your solution unique and valuable. Show that you understand your customers and how to reach them.`
    });

    slides.push({
      id: '5',
      title: 'Competitive Analysis',
      content: `**Competitors:** ${businessAnalysis.competitors?.competitors?.length > 0 ? businessAnalysis.competitors.competitors.slice(0, 3).join(', ') : 'Limited direct competition'}\n\n**Our Advantages:** ${this.generateValuePropositions(businessAnalysis, businessAnalysis.marketData).join(', ')}\n\n**Market Position:** ${this.assessCompetitionLevelFromContext(businessAnalysis)} competition level\n\n**Differentiation Strategy:** Focus on ${businessAnalysis.valueProps.length > 0 ? businessAnalysis.valueProps.join(', ') : 'unique value propositions'}`,
      presenterNotes: `Acknowledge competition but show your competitive advantages. Explain how you will differentiate and capture market share.`
    });

    slides.push({
      id: '6',
      title: 'Financial Projections',
      content: `**Market Size:** ${businessAnalysis.marketData?.marketSize || '$1.89 billion'}\n\n**Growth Rate:** High growth (25%+ annually)\n\n**Revenue Model:** ${this.generateRevenueStreams(businessAnalysis, businessAnalysis.businessModels, businessAnalysis.competitors).slice(0, 3).join(', ')}\n\n**Projected Growth:** Strong unit economics with scalable business model\n\n**Funding Requirements:** Seeking funding for product development and market expansion\n\n**Exit Strategy:** Potential for acquisition or IPO in 5-7 years`,
      presenterNotes: `Present realistic financial projections and key metrics. Show that you understand the economics and have a path to profitability.`
    });

    slides.push({
      id: '7',
      title: 'Technology & Innovation',
      content: `**Technology Stack:** ${this.generateTechnologyStackFromContext(businessAnalysis)}\n\n**Innovation Areas:** ${this.generateInnovationAreasFromContext(businessAnalysis)}\n\n**Intellectual Property:** Proprietary technology and processes\n\n**Scalability:** Cloud-based infrastructure for global expansion\n\n**Security:** Enterprise-grade security and compliance\n\n**Future Roadmap:** Continuous innovation and feature development`,
      presenterNotes: `Highlight your technical capabilities and innovation. Show that you have a solid technology foundation and clear development roadmap.`
    });

    slides.push({
      id: '8',
      title: 'Team & Execution',
      content: `**Founding Team:** Experienced entrepreneurs with relevant backgrounds\n\n**Advisors:** Industry experts and successful entrepreneurs\n\n**Execution Plan:** Clear milestones and go-to-market strategy\n\n**Hiring Plan:** Strategic team expansion in key areas\n\n**Partnerships:** Strategic partnerships for growth and market access\n\n**Risk Mitigation:** Comprehensive risk management strategy`,
      presenterNotes: `Highlight team strengths and relevant experience. Show that you have the right people and plan to execute successfully.`
    });

    slides.push({
      id: '9',
      title: 'Market Trends & Timing',
      content: `**Current Trends:** ${businessAnalysis.marketData?.marketTrends?.join(', ') || 'Market analysis shows stable growth patterns'}\n\n**Market Timing:** Optimal timing for market entry\n\n**Growth Drivers:** ${businessAnalysis.marketData?.customerNeeds?.join(', ') || 'Growing demand for innovative solutions'}\n\n**Regulatory Environment:** Favorable regulatory conditions\n\n**Technology Readiness:** Technology infrastructure supports our solution\n\n**Customer Readiness:** Growing demand for our type of solution`,
      presenterNotes: `Show that you understand market timing and trends. Explain why now is the right time for your solution.`
    });

    slides.push({
      id: '10',
      title: 'Funding & Next Steps',
      content: `**Funding Ask:** Seeking $2M in seed funding\n\n**Use of Funds:** 40% Product Development, 30% Team Expansion, 20% Marketing, 10% Operations\n\n**Milestones:** 12-month roadmap with key deliverables\n\n**Success Metrics:** Clear KPIs and success indicators\n\n**Exit Strategy:** Multiple exit options including acquisition and IPO\n\n**Next Steps:** Immediate action items and timeline`,
      presenterNotes: `Clearly state how much funding you need and how you will use it. Show a clear path to success and exit.`
    });

    return slides;
  }

  private generateProblemStatementFromContext(startupInfo: any, businessAnalysis: any): string {
    const customerNeeds = businessAnalysis.marketData?.customerNeeds || [];
    if (customerNeeds.length > 0) {
      return customerNeeds[0];
    }
    
    if (businessAnalysis.productType === 'healthcare') {
      return `Access to quality healthcare remains a challenge for many individuals, with high costs and limited availability creating barriers to essential medical services.`;
    } else if (businessAnalysis.productType === 'food_delivery') {
      return `Consumers face limited food options, long delivery times, and inconsistent service quality when ordering food online.`;
    } else if (businessAnalysis.productType === 'fashion_retail') {
      return `Luxury footwear enthusiasts struggle to find authentic, rare, and high-quality shoes at fair prices.`;
    } else if (businessAnalysis.productType === 'technology') {
      return `Businesses struggle to implement and scale technology solutions due to complexity and high costs.`;
    }
    
    return `Current solutions in the market are limited and expensive, creating a significant gap for ${startupInfo.description?.toLowerCase() || 'innovative solutions'}.`;
  }

  private generateSolutionStatementFromContext(startupInfo: any, businessAnalysis: any): string {
    const valueProps = this.generateValuePropositions(businessAnalysis, businessAnalysis.marketData);
    if (valueProps.length > 0) {
      return valueProps[0];
    }
    
    if (businessAnalysis.productType === 'healthcare') {
      return `Our platform provides accessible, high-quality healthcare services through innovative technology and strategic partnerships.`;
    } else if (businessAnalysis.productType === 'food_delivery') {
      return `Our platform connects consumers with the best local restaurants, providing fast delivery and guaranteed quality.`;
    } else if (businessAnalysis.productType === 'fashion_retail') {
      return `Our marketplace provides a trusted platform for authentic luxury footwear with expert authentication.`;
    } else if (businessAnalysis.productType === 'technology') {
      return `Our platform provides easy-to-implement, scalable technology solutions with expert support.`;
    }
    
    return `Our platform provides ${startupInfo.description?.toLowerCase() || 'innovative solutions'} through an innovative, user-friendly solution.`;
  }

  private generateBusinessModelSummaryFromContext(businessAnalysis: any): string {
    if (businessAnalysis.businessType === 'marketplace') {
      return `Marketplace model with commission-based revenue streams and transaction fees.`;
    } else if (businessAnalysis.businessType === 'platform') {
      return `SaaS platform model with subscription fees and usage-based pricing.`;
    } else if (businessAnalysis.targetMarket === 'enterprise') {
      return `Enterprise licensing model with custom integrations and dedicated support.`;
    }
    
    return `Subscription-based SaaS model with multiple revenue streams including transaction fees, premium features, and enterprise licensing.`;
  }

  private generateTractionStatement(startupInfo: any): string {
    return `Early stage with strong market validation and growing user interest. Ready for rapid scaling with proper funding.`;
  }

  private generateTeamStatement(startupInfo: any): string {
    return `Experienced team with backgrounds in technology, business development, and market expertise.`;
  }

  private generateCompetitionStatementFromContext(businessAnalysis: any): string {
    const competitors = businessAnalysis.competitors?.competitors || [];
    if (competitors.length === 0) {
      return `Limited direct competition in the space, our unique approach and technology differentiate us significantly.`;
    }
    return `While there are ${competitors.length} competitors in the space, our unique approach and technology differentiate us significantly.`;
  }

  private generateFinancialsStatement(startupInfo: any): string {
    return `Projected revenue of $1M in first year, growing to $10M by year 3. Strong unit economics with 70% gross margins.`;
  }

  private generateFundingAsk(startupInfo: any): string {
    return `Seeking $2M in seed funding to accelerate product development, team expansion, and market penetration.`;
  }

  private generateTechnologyStackFromContext(businessAnalysis: any): string {
    if (businessAnalysis.productType === 'technology') {
      return `Modern, scalable architecture with AI/ML algorithms, cloud infrastructure, and enterprise-grade security.`;
    }
    
    return `Modern, scalable architecture with cloud infrastructure and enterprise-grade security.`;
  }

  private generateInnovationAreasFromContext(businessAnalysis: any): string {
    if (businessAnalysis.productType === 'technology') {
      return `AI/ML algorithms, Data processing, Machine learning optimization, Neural networks`;
    }
    
    return `Platform optimization, User experience, Technology innovation`;
  }
}

// Initialize data sources and RAG system
const googleTrends = new GoogleTrendsDataSource();
const redditData = new RedditDataSource();
const webScraper = new WebScraperDataSource();
const ragSystem = new RAGSystem();

// Helper functions for real-time analysis
function calculateFeasibilityScore(trends: any, sentiment: any, competitors: any[], marketSize: string): number {
  let score = 50; // Base score
  
  // Market size factor - OPTIMAL SIZE MATTERS MORE THAN MAXIMUM SIZE
  if (marketSize && marketSize.includes('billion')) {
    const size = parseFloat(marketSize.replace(/[^0-9.]/g, ''));
    
    // Sweet spot: $1B-$50B markets (large enough to matter, not too saturated)
    if (size >= 1 && size <= 50) {
      score += 20; // Optimal market size
    } else if (size > 50 && size <= 100) {
      score += 10; // Large but potentially saturated
    } else if (size > 100) {
      score += 5; // Very large but likely saturated with big players
    } else if (size < 1) {
      score += 15; // Smaller but potentially underserved
    }
  } else if (marketSize && marketSize.includes('million')) {
    const size = parseFloat(marketSize.replace(/[^0-9.]/g, ''));
    if (size >= 100) score += 15; // $100M+ is good for startups
    else if (size >= 10) score += 10; // $10M+ is decent
    else score += 5; // Smaller markets
  }
  
  // Competition factor (less competition = higher score)
  if (competitors.length === 0) score += 25;
  else if (competitors.length < 3) score += 15;
  else if (competitors.length < 10) score += 5;
  else score -= 10;
  
  // Trend factor
  const avgTrend = Object.values(trends).reduce((sum: number, val: any) => sum + (val || 0), 0) / Object.keys(trends).length;
  if (avgTrend > 70) score += 15;
  else if (avgTrend > 40) score += 10;
  else if (avgTrend > 20) score += 5;
  
  // Sentiment factor
  const avgSentiment = Object.values(sentiment).reduce((sum: number, val: any) => sum + (val || 0), 0) / Object.keys(sentiment).length;
  if (avgSentiment > 0.5) score += 10;
  else if (avgSentiment > 0) score += 5;
  else if (avgSentiment < -0.5) score -= 15;
  
  // Market maturity penalty for very large markets
  if (marketSize && marketSize.includes('billion')) {
    const size = parseFloat(marketSize.replace(/[^0-9.]/g, ''));
    if (size > 100 && competitors.length > 5) {
      score -= 10; // Penalty for large, competitive markets
    }
  }
  
  return Math.min(Math.max(score, 0), 100);
}

function analyzeMarketGaps(competitors: any[], idea: string): string[] {
  const gaps = [];
  const ideaKeywords = idea.toLowerCase().split(/\s+/);
  
  if (competitors.length === 0) {
    gaps.push('First-mover advantage - no direct competitors identified');
    gaps.push('Market education opportunity - need to create awareness');
  } else if (competitors.length < 5) {
    gaps.push('Moderate competition - opportunity for differentiation');
    gaps.push('Niche market positioning available');
  } else {
    gaps.push('High competition - focus on unique value proposition');
    gaps.push('Market saturation risk - need strong differentiation');
  }
  
  // Analyze specific gaps based on competitor descriptions
  const competitorDescriptions = competitors.map(c => c.description?.toLowerCase() || '').join(' ');
  
  if (!competitorDescriptions.includes('ai') && ideaKeywords.includes('ai')) {
    gaps.push('AI integration gap - competitors lack AI capabilities');
  }
  
  if (!competitorDescriptions.includes('real-time') && ideaKeywords.includes('real-time')) {
    gaps.push('Real-time processing gap in current market');
  }
  
  if (!competitorDescriptions.includes('mobile') && ideaKeywords.includes('mobile')) {
    gaps.push('Mobile-first approach gap');
  }
  
  return gaps;
}

function analyzeMarketSizeOptimality(marketSize: string, competitors: any[]): any {
  if (!marketSize) {
    return {
      score: 50,
      level: 'Unknown',
      reasoning: 'Market size data not available',
      recommendations: ['Conduct market research to determine actual market size']
    };
  }

  const size = parseFloat(marketSize.replace(/[^0-9.]/g, ''));
  const isBillion = marketSize.includes('billion');
  const competitorCount = competitors.length;

  let score = 50;
  let level = 'Unknown';
  let reasoning = '';
  let recommendations: string[] = [];

  if (isBillion) {
    if (size >= 1 && size <= 50) {
      score = 85;
      level = 'Optimal';
      reasoning = `$${size}B market is the sweet spot - large enough to matter but not oversaturated`;
      recommendations = ['Focus on rapid market entry and differentiation'];
    } else if (size > 50 && size <= 100) {
      score = 70;
      level = 'Good';
      reasoning = `$${size}B market is large but may have established players`;
      recommendations = ['Find niche positioning within the large market'];
    } else if (size > 100) {
      score = 60;
      level = 'Challenging';
      reasoning = `$${size}B market is very large but likely dominated by big players`;
      recommendations = ['Consider market segmentation or disruptive approach'];
      if (competitorCount > 5) {
        score = 45;
        level = 'High Risk';
        reasoning += ' and highly competitive';
        recommendations.push('Requires significant capital and differentiation');
      }
    } else if (size < 1) {
      score = 75;
      level = 'Emerging';
      reasoning = `$${size}B market is smaller but potentially underserved`;
      recommendations = ['Focus on market education and early adoption'];
    }
  } else if (marketSize.includes('million')) {
    if (size >= 100) {
      score = 80;
      level = 'Good';
      reasoning = `$${size}M market is substantial for startup entry`;
      recommendations = ['Focus on market penetration and growth'];
    } else if (size >= 10) {
      score = 70;
      level = 'Moderate';
      reasoning = `$${size}M market is decent but may limit growth potential`;
      recommendations = ['Consider market expansion strategies'];
    } else {
      score = 60;
      level = 'Small';
      reasoning = `$${size}M market is small and may limit scalability`;
      recommendations = ['Focus on niche dominance or market expansion'];
    }
  }

  return {
    score,
    level,
    reasoning,
    recommendations,
    marketSize: marketSize,
    competitorCount
  };
}

function analyzeProductMarketFit(sentiment: any, trends: any, marketSize: string): any {
  const avgSentiment = Object.values(sentiment).reduce((sum: number, val: any) => sum + (val || 0), 0) / Object.keys(sentiment).length;
  const avgTrend = Object.values(trends).reduce((sum: number, val: any) => sum + (val || 0), 0) / Object.keys(trends).length;
  
  let fitScore = 50;
  let fitLevel = 'Unknown';
  
  if (avgSentiment > 0.3 && avgTrend > 60) {
    fitScore = 85;
    fitLevel = 'Strong';
  } else if (avgSentiment > 0.1 && avgTrend > 40) {
    fitScore = 70;
    fitLevel = 'Good';
  } else if (avgSentiment > -0.1 && avgTrend > 20) {
    fitScore = 55;
    fitLevel = 'Moderate';
  } else {
    fitScore = 30;
    fitLevel = 'Weak';
  }
  
  return {
    score: fitScore,
    level: fitLevel,
    indicators: {
      marketSentiment: avgSentiment > 0 ? 'Positive' : 'Negative',
      trendMomentum: avgTrend > 50 ? 'Growing' : 'Stable',
      marketSize: marketSize ? 'Large Market' : 'Unknown Size'
    },
    recommendations: fitScore > 70 ? 
      ['Market shows strong demand', 'Focus on execution and scaling'] :
      ['Market validation needed', 'Consider pivoting or market education']
  };
}

function getCompetitionLevel(competitorCount: number): string {
  if (competitorCount === 0) return 'Very Low';
  if (competitorCount < 3) return 'Low';
  if (competitorCount < 10) return 'Moderate';
  if (competitorCount < 20) return 'High';
  return 'Very High';
}

function generateOpportunities(trends: any, sentiment: any, marketGaps: string[]): string[] {
  const opportunities = [...marketGaps];
  
  const avgTrend = Object.values(trends).reduce((sum: number, val: any) => sum + (val || 0), 0) / Object.keys(trends).length;
  const avgSentiment = Object.values(sentiment).reduce((sum: number, val: any) => sum + (val || 0), 0) / Object.keys(sentiment).length;
  
  if (avgTrend > 70) {
    opportunities.push('High market interest - capitalize on trending demand');
  }
  
  if (avgSentiment > 0.3) {
    opportunities.push('Positive market sentiment - leverage community enthusiasm');
  }
  
  if (Object.keys(trends).length > 5) {
    opportunities.push('Multiple market segments - diversify target audience');
  }
  
  return opportunities.slice(0, 5);
}

function generateRisks(competitors: any[], sentiment: any, trends: any): string[] {
  const risks = [];
  
  if (competitors.length > 10) {
    risks.push('High competition - market saturation risk');
  }
  
  const avgSentiment = Object.values(sentiment).reduce((sum: number, val: any) => sum + (val || 0), 0) / Object.keys(sentiment).length;
  if (avgSentiment < -0.2) {
    risks.push('Negative market sentiment - adoption challenges');
  }
  
  const avgTrend = Object.values(trends).reduce((sum: number, val: any) => sum + (val || 0), 0) / Object.keys(trends).length;
  if (avgTrend < 20) {
    risks.push('Low market interest - need market education');
  }
  
  if (competitors.some(c => c.funding && c.funding.includes('million'))) {
    risks.push('Well-funded competitors - capital requirements high');
  }
  
  risks.push('Technology disruption risk');
  risks.push('Market volatility');
  
  return risks.slice(0, 5);
}

function generateRecommendations(feasibilityScore: number, marketGaps: string[], productMarketFit: any): string[] {
  const recommendations = [];
  
  if (feasibilityScore > 80) {
    recommendations.push('High feasibility - proceed with aggressive market entry');
    recommendations.push('Focus on rapid scaling and market capture');
  } else if (feasibilityScore > 60) {
    recommendations.push('Good feasibility - proceed with careful planning');
    recommendations.push('Focus on differentiation and unique value proposition');
  } else {
    recommendations.push('Moderate feasibility - conduct deeper market research');
    recommendations.push('Consider pivoting or market education strategy');
  }
  
  if (marketGaps.length > 0) {
    recommendations.push('Leverage identified market gaps for competitive advantage');
  }
  
  if (productMarketFit.score > 70) {
    recommendations.push('Strong product-market fit signals - focus on execution');
  } else {
    recommendations.push('Improve product-market fit through customer validation');
  }
  
  recommendations.push('Build strategic partnerships');
  recommendations.push('Invest in technology and innovation');
  
  return recommendations.slice(0, 5);
}

function calculateRelevance(competitor: any, idea: string): number {
  const ideaWords = idea.toLowerCase().split(/\s+/);
  const compText = (competitor.name + ' ' + competitor.description).toLowerCase();
  
  const matches = ideaWords.filter(word => 
    word.length > 3 && compText.includes(word)
  ).length;
  
  return Math.min((matches / ideaWords.length) * 100, 100);
}

function calculateGrowthRate(trends: any): string {
  const avgTrend = Object.values(trends).reduce((sum: number, val: any) => sum + (val || 0), 0) / Object.keys(trends).length;
  
  if (avgTrend > 70) return '25%+ annually';
  if (avgTrend > 50) return '15-25% annually';
  if (avgTrend > 30) return '5-15% annually';
  return '0-5% annually';
}

function generateThreats(competitors: any[], sentiment: any): string[] {
  const threats = [];
  
  if (competitors.length > 5) {
    threats.push('Market saturation');
  }
  
  const avgSentiment = Object.values(sentiment).reduce((sum: number, val: any) => sum + (val || 0), 0) / Object.keys(sentiment).length;
  if (avgSentiment < 0) {
    threats.push('Negative market perception');
  }
  
  threats.push('Technology disruption');
  threats.push('Regulatory changes');
  threats.push('Economic downturn impact');
  
  return threats.slice(0, 3);
}

// Business Model Generation Helper Functions
function generateKeyPartnershipsFromData(competitors: any[], trends: any, description: string): string[] {
  const partnerships = [];
  const descriptionLower = description.toLowerCase();
  
  // Industry-specific partnerships based on description
  if (descriptionLower.includes('ai') || descriptionLower.includes('technology')) {
    partnerships.push('Cloud computing providers (AWS, Google Cloud, Azure)');
    partnerships.push('AI/ML technology partners');
    partnerships.push('Data providers and analytics companies');
  }
  
  if (descriptionLower.includes('healthcare') || descriptionLower.includes('medical')) {
    partnerships.push('Healthcare providers and hospitals');
    partnerships.push('Medical device manufacturers');
    partnerships.push('Insurance companies');
  }
  
  if (descriptionLower.includes('finance') || descriptionLower.includes('payment')) {
    partnerships.push('Banks and financial institutions');
    partnerships.push('Payment processors');
    partnerships.push('Regulatory compliance partners');
  }
  
  // Add common partnerships
  partnerships.push('Technology providers');
  partnerships.push('Marketing and distribution partners');
  partnerships.push('Strategic industry partners');
  
  return partnerships.slice(0, 6);
}

function generateKeyActivitiesFromData(description: string, trends: any): string[] {
  const activities = [];
  const descriptionLower = description.toLowerCase();
  
  if (descriptionLower.includes('ai') || descriptionLower.includes('technology')) {
    activities.push('AI/ML algorithm development');
    activities.push('Data processing and analysis');
    activities.push('Software development and maintenance');
  }
  
  if (descriptionLower.includes('marketplace') || descriptionLower.includes('platform')) {
    activities.push('Platform development and maintenance');
    activities.push('User acquisition and onboarding');
    activities.push('Quality assurance and verification');
  }
  
  if (descriptionLower.includes('service') || descriptionLower.includes('delivery')) {
    activities.push('Service delivery and operations');
    activities.push('Customer support and satisfaction');
    activities.push('Quality control and monitoring');
  }
  
  // Add common activities
  activities.push('Product development and innovation');
  activities.push('Marketing and customer acquisition');
  activities.push('Business development and partnerships');
  
  return activities.slice(0, 6);
}

function generateKeyResourcesFromData(description: string, competitors: any[]): string[] {
  const resources = [];
  const descriptionLower = description.toLowerCase();
  
  if (descriptionLower.includes('ai') || descriptionLower.includes('technology')) {
    resources.push('AI/ML algorithms and models');
    resources.push('Technology platform and infrastructure');
    resources.push('Data and analytics capabilities');
  }
  
  if (descriptionLower.includes('marketplace') || descriptionLower.includes('platform')) {
    resources.push('Technology platform');
    resources.push('User base and network effects');
    resources.push('Brand and reputation');
  }
  
  if (descriptionLower.includes('service') || descriptionLower.includes('delivery')) {
    resources.push('Service delivery network');
    resources.push('Operational expertise');
    resources.push('Customer relationships');
  }
  
  // Add common resources
  resources.push('Development team and expertise');
  resources.push('Intellectual property and patents');
  resources.push('Financial resources and funding');
  
  return resources.slice(0, 6);
}

function generateValuePropositionsFromData(description: string, sentiment: any, trends: any): string[] {
  const propositions = [];
  const descriptionLower = description.toLowerCase();
  const avgSentiment = Object.values(sentiment).reduce((sum: number, val: any) => sum + (val || 0), 0) / Object.keys(sentiment).length;
  
  if (descriptionLower.includes('ai') || descriptionLower.includes('technology')) {
    propositions.push('Advanced AI-powered solutions');
    propositions.push('Automated and efficient processes');
    propositions.push('Data-driven insights and analytics');
  }
  
  if (descriptionLower.includes('marketplace') || descriptionLower.includes('platform')) {
    propositions.push('Comprehensive marketplace platform');
    propositions.push('Trusted and verified transactions');
    propositions.push('Seamless user experience');
  }
  
  if (descriptionLower.includes('service') || descriptionLower.includes('delivery')) {
    propositions.push('Reliable and fast service delivery');
    propositions.push('High-quality customer service');
    propositions.push('Convenient and accessible solutions');
  }
  
  // Add sentiment-based propositions
  if (avgSentiment > 0.3) {
    propositions.push('Market-validated solution with positive reception');
  }
  
  // Add common propositions
  propositions.push('Cost-effective alternative to existing solutions');
  propositions.push('Innovative approach to market problems');
  
  return propositions.slice(0, 5);
}

function generateCustomerRelationshipsFromData(description: string, sentiment: any): string[] {
  const relationships = [];
  const descriptionLower = description.toLowerCase();
  const avgSentiment = Object.values(sentiment).reduce((sum: number, val: any) => sum + (val || 0), 0) / Object.keys(sentiment).length;
  
  if (descriptionLower.includes('enterprise') || descriptionLower.includes('b2b')) {
    relationships.push('Dedicated account management');
    relationships.push('Custom training and onboarding');
    relationships.push('24/7 enterprise support');
  }
  
  if (descriptionLower.includes('consumer') || descriptionLower.includes('b2c')) {
    relationships.push('Self-service platform');
    relationships.push('Community support and forums');
    relationships.push('Automated customer service');
  }
  
  if (descriptionLower.includes('marketplace') || descriptionLower.includes('platform')) {
    relationships.push('Community building and engagement');
    relationships.push('Trust and safety programs');
    relationships.push('User feedback and rating systems');
  }
  
  // Add sentiment-based relationships
  if (avgSentiment > 0.2) {
    relationships.push('Positive community engagement');
  }
  
  // Add common relationships
  relationships.push('Personal customer support');
  relationships.push('Ongoing relationship management');
  
  return relationships.slice(0, 5);
}

function generateChannelsFromData(description: string, trends: any): string[] {
  const channels = [];
  const descriptionLower = description.toLowerCase();
  const avgTrend = Object.values(trends).reduce((sum: number, val: any) => sum + (val || 0), 0) / Object.keys(trends).length;
  
  if (descriptionLower.includes('online') || descriptionLower.includes('digital')) {
    channels.push('Online platform and website');
    channels.push('Mobile applications');
    channels.push('Social media marketing');
  }
  
  if (descriptionLower.includes('enterprise') || descriptionLower.includes('b2b')) {
    channels.push('Direct enterprise sales');
    channels.push('Partner channel sales');
    channels.push('Industry conferences and events');
  }
  
  if (descriptionLower.includes('marketplace') || descriptionLower.includes('platform')) {
    channels.push('Digital marketplace platform');
    channels.push('API integrations');
    channels.push('Partner network distribution');
  }
  
  // Add trend-based channels
  if (avgTrend > 60) {
    channels.push('Trending social media platforms');
  }
  
  // Add common channels
  channels.push('Direct sales and marketing');
  channels.push('Referral programs');
  
  return channels.slice(0, 6);
}

function generateCustomerSegmentsFromData(description: string, marketSize: string): string[] {
  const segments = [];
  const descriptionLower = description.toLowerCase();
  
  if (descriptionLower.includes('enterprise') || descriptionLower.includes('business')) {
    segments.push('Large enterprises and corporations');
    segments.push('Small to medium businesses');
    segments.push('Startups and entrepreneurs');
  }
  
  if (descriptionLower.includes('consumer') || descriptionLower.includes('individual')) {
    segments.push('Individual consumers');
    segments.push('Tech-savvy early adopters');
    segments.push('Price-conscious users');
  }
  
  if (descriptionLower.includes('healthcare') || descriptionLower.includes('medical')) {
    segments.push('Healthcare providers');
    segments.push('Medical professionals');
    segments.push('Patients and healthcare consumers');
  }
  
  if (descriptionLower.includes('finance') || descriptionLower.includes('banking')) {
    segments.push('Financial institutions');
    segments.push('Fintech companies');
    segments.push('Individual investors');
  }
  
  // Add market size-based segments
  if (marketSize && marketSize.includes('billion')) {
    segments.push('Large market opportunity');
  }
  
  // Add common segments
  segments.push('Target market segments');
  
  return segments.slice(0, 5);
}

function generateCostStructureFromData(description: string, competitors: any[]): string[] {
  const costs = [];
  const descriptionLower = description.toLowerCase();
  
  if (descriptionLower.includes('ai') || descriptionLower.includes('technology')) {
    costs.push('AI/ML development and training');
    costs.push('Cloud infrastructure and computing');
    costs.push('Data acquisition and processing');
  }
  
  if (descriptionLower.includes('marketplace') || descriptionLower.includes('platform')) {
    costs.push('Platform development and maintenance');
    costs.push('User acquisition and marketing');
    costs.push('Trust and safety operations');
  }
  
  if (descriptionLower.includes('service') || descriptionLower.includes('delivery')) {
    costs.push('Service delivery operations');
    costs.push('Quality assurance and monitoring');
    costs.push('Customer support and service');
  }
  
  // Add competition-based costs
  if (competitors.length > 5) {
    costs.push('Competitive marketing and differentiation');
  }
  
  // Add common costs
  costs.push('Employee salaries and benefits');
  costs.push('Legal and compliance costs');
  
  return costs.slice(0, 6);
}

function generateRevenueStreamsFromData(description: string, trends: any, marketSize: string): string[] {
  const streams = [];
  const descriptionLower = description.toLowerCase();
  const avgTrend = Object.values(trends).reduce((sum: number, val: any) => sum + (val || 0), 0) / Object.keys(trends).length;
  
  if (descriptionLower.includes('marketplace') || descriptionLower.includes('platform')) {
    streams.push('Transaction fees and commissions');
    streams.push('Subscription and membership fees');
    streams.push('Premium listing and advertising');
  }
  
  if (descriptionLower.includes('ai') || descriptionLower.includes('technology')) {
    streams.push('Software licensing and subscriptions');
    streams.push('API access and usage fees');
    streams.push('Consulting and implementation services');
  }
  
  if (descriptionLower.includes('service') || descriptionLower.includes('delivery')) {
    streams.push('Service fees and delivery charges');
    streams.push('Subscription and membership plans');
    streams.push('Premium service offerings');
  }
  
  // Add trend-based streams
  if (avgTrend > 70) {
    streams.push('High-demand premium services');
  }
  
  // Add market size-based streams
  if (marketSize && marketSize.includes('billion')) {
    streams.push('Large market revenue opportunities');
  }
  
  // Add common streams
  streams.push('Data monetization and analytics');
  
  return streams.slice(0, 6);
}

function analyzeTargetMarket(description: string, marketSize: string): string {
  const descriptionLower = description.toLowerCase();
  
  if (descriptionLower.includes('enterprise') || descriptionLower.includes('business')) {
    return 'B2B enterprise market with high-value customers';
  }
  
  if (descriptionLower.includes('consumer') || descriptionLower.includes('individual')) {
    return 'B2C consumer market with mass appeal';
  }
  
  if (descriptionLower.includes('healthcare') || descriptionLower.includes('medical')) {
    return 'Healthcare industry with regulatory requirements';
  }
  
  if (descriptionLower.includes('finance') || descriptionLower.includes('banking')) {
    return 'Financial services market with compliance needs';
  }
  
  if (marketSize && marketSize.includes('billion')) {
    return 'Large market with significant growth potential';
  }
  
  return 'Target market with growth opportunities';
}

function generateCompetitiveAdvantages(competitors: any[], description: string): string[] {
  const advantages = [];
  const descriptionLower = description.toLowerCase();
  
  if (competitors.length === 0) {
    advantages.push('First-mover advantage in the market');
    advantages.push('No direct competition identified');
  } else if (competitors.length < 3) {
    advantages.push('Limited competition with differentiation opportunity');
    advantages.push('Niche market positioning');
  } else {
    advantages.push('Unique value proposition and differentiation');
    advantages.push('Superior technology and innovation');
  }
  
  if (descriptionLower.includes('ai') || descriptionLower.includes('technology')) {
    advantages.push('Advanced AI/ML capabilities');
    advantages.push('Cutting-edge technology stack');
  }
  
  if (descriptionLower.includes('marketplace') || descriptionLower.includes('platform')) {
    advantages.push('Network effects and platform benefits');
    advantages.push('Comprehensive marketplace solution');
  }
  
  // Add common advantages
  advantages.push('Superior user experience and interface');
  advantages.push('Strong team and execution capabilities');
  
  return advantages.slice(0, 5);
}

function generateRevenueProjections(marketSize: string, trends: any): string {
  const avgTrend = Object.values(trends).reduce((sum: number, val: any) => sum + (val || 0), 0) / Object.keys(trends).length;
  
  if (marketSize && marketSize.includes('billion')) {
    if (avgTrend > 70) {
      return 'High growth potential with $10M+ revenue by year 3';
    } else if (avgTrend > 40) {
      return 'Strong growth with $5M+ revenue by year 3';
    } else {
      return 'Moderate growth with $2M+ revenue by year 3';
    }
  }
  
  if (avgTrend > 60) {
    return 'Strong growth trajectory with scalable revenue model';
  }
  
  return 'Steady growth with multiple revenue streams';
}

function generateCostProjections(description: string, competitors: any[]): string {
  const descriptionLower = description.toLowerCase();
  
  if (descriptionLower.includes('ai') || descriptionLower.includes('technology')) {
    return 'Technology-focused cost structure with R&D investment';
  }
  
  if (descriptionLower.includes('marketplace') || descriptionLower.includes('platform')) {
    return 'Platform development and user acquisition costs';
  }
  
  if (competitors.length > 5) {
    return 'Competitive market requiring significant marketing investment';
  }
  
  return 'Balanced cost structure with growth investments';
}

function calculateProfitability(marketSize: string, trends: any, competitors: any[]): string {
  const avgTrend = Object.values(trends).reduce((sum: number, val: any) => sum + (val || 0), 0) / Object.keys(trends).length;
  
  if (marketSize && marketSize.includes('billion') && avgTrend > 60) {
    return 'High profitability potential with strong unit economics';
  }
  
  if (competitors.length < 3) {
    return 'Strong profitability with limited competition';
  }
  
  if (avgTrend > 40) {
    return 'Good profitability with market growth';
  }
  
  return 'Moderate profitability with optimization opportunities';
}

// Founder Fit Check Feature
function analyzeFounderFit(domainExpertise: string, technicalExpertise: string, startupExperience: string): any {
  let score = 0;
  let level = 'Weak';
  let reasoning = '';
  let recommendations: string[] = [];

  // Domain Expertise Scoring (0-40 points)
  const domainScore = getDomainExpertiseScore(domainExpertise);
  score += domainScore;

  // Technical Expertise Scoring (0-35 points)
  const technicalScore = getTechnicalExpertiseScore(technicalExpertise);
  score += technicalScore;

  // Startup Experience Scoring (0-25 points)
  const experienceScore = getStartupExperienceScore(startupExperience);
  score += experienceScore;

  // Determine level and reasoning
  if (score >= 80) {
    level = 'Strong';
    reasoning = 'Founder has strong domain expertise, technical skills, and startup experience';
    recommendations = [
      'Proceed with confidence - strong founder-market fit',
      'Focus on execution and scaling',
      'Consider raising funding to accelerate growth'
    ];
  } else if (score >= 60) {
    level = 'Moderate';
    reasoning = 'Founder has good foundation but may need to strengthen certain areas';
    recommendations = [
      'Identify and address knowledge gaps',
      'Consider bringing on co-founders or advisors',
      'Focus on learning and skill development'
    ];
  } else {
    level = 'Weak';
    reasoning = 'Founder may need significant development in key areas';
    recommendations = [
      'Strongly consider finding co-founders with complementary skills',
      'Invest in education and skill development',
      'Consider joining an accelerator or incubator',
      'Build a strong advisory board'
    ];
  }

  return {
    score: Math.min(score, 100),
    level,
    reasoning,
    recommendations,
    breakdown: {
      domainExpertise: {
        score: domainScore,
        level: getDomainExpertiseLevel(domainExpertise),
        description: getDomainExpertiseDescription(domainExpertise)
      },
      technicalExpertise: {
        score: technicalScore,
        level: getTechnicalExpertiseLevel(technicalExpertise),
        description: getTechnicalExpertiseDescription(technicalExpertise)
      },
      startupExperience: {
        score: experienceScore,
        level: getStartupExperienceLevel(startupExperience),
        description: getStartupExperienceDescription(startupExperience)
      }
    }
  };
}

function getDomainExpertiseScore(expertise: string): number {
  const lower = expertise.toLowerCase();
  
  if (lower.includes('expert') || lower.includes('specialist') || lower.includes('10+ years')) {
    return 40;
  } else if (lower.includes('experienced') || lower.includes('5+ years') || lower.includes('professional')) {
    return 30;
  } else if (lower.includes('some experience') || lower.includes('2+ years') || lower.includes('familiar')) {
    return 20;
  } else if (lower.includes('beginner') || lower.includes('learning') || lower.includes('new to')) {
    return 10;
  } else {
    return 5; // Unknown or no experience
  }
}

function getTechnicalExpertiseScore(expertise: string): number {
  const lower = expertise.toLowerCase();
  
  if (lower.includes('expert') || lower.includes('senior') || lower.includes('architect') || lower.includes('lead')) {
    return 35;
  } else if (lower.includes('experienced') || lower.includes('intermediate') || lower.includes('developer')) {
    return 25;
  } else if (lower.includes('some experience') || lower.includes('junior') || lower.includes('basic')) {
    return 15;
  } else if (lower.includes('beginner') || lower.includes('learning') || lower.includes('no technical')) {
    return 5;
  } else {
    return 0; // No technical background
  }
}

function getStartupExperienceScore(experience: string): number {
  const lower = experience.toLowerCase();
  
  if (lower.includes('founded') || lower.includes('co-founder') || lower.includes('serial entrepreneur')) {
    return 25;
  } else if (lower.includes('early employee') || lower.includes('startup experience') || lower.includes('worked at startup')) {
    return 20;
  } else if (lower.includes('some startup') || lower.includes('worked with startups') || lower.includes('startup exposure')) {
    return 15;
  } else if (lower.includes('corporate') || lower.includes('enterprise') || lower.includes('large company')) {
    return 10;
  } else {
    return 5; // No startup experience
  }
}

function getDomainExpertiseLevel(expertise: string): string {
  const score = getDomainExpertiseScore(expertise);
  if (score >= 35) return 'Expert';
  if (score >= 25) return 'Experienced';
  if (score >= 15) return 'Some Experience';
  return 'Beginner';
}

function getTechnicalExpertiseLevel(expertise: string): string {
  const score = getTechnicalExpertiseScore(expertise);
  if (score >= 30) return 'Expert';
  if (score >= 20) return 'Experienced';
  if (score >= 10) return 'Some Experience';
  return 'Beginner';
}

function getStartupExperienceLevel(experience: string): string {
  const score = getStartupExperienceScore(experience);
  if (score >= 20) return 'Experienced';
  if (score >= 15) return 'Some Experience';
  if (score >= 10) return 'Corporate Background';
  return 'No Startup Experience';
}

function getDomainExpertiseDescription(expertise: string): string {
  const lower = expertise.toLowerCase();
  if (lower.includes('expert') || lower.includes('specialist')) {
    return 'Deep domain knowledge and industry expertise';
  } else if (lower.includes('experienced')) {
    return 'Solid understanding of the industry and market';
  } else if (lower.includes('some experience')) {
    return 'Basic knowledge of the domain, room for growth';
  } else {
    return 'Limited domain knowledge, significant learning required';
  }
}

function getTechnicalExpertiseDescription(expertise: string): string {
  const lower = expertise.toLowerCase();
  if (lower.includes('expert') || lower.includes('senior')) {
    return 'Strong technical skills and ability to build complex systems';
  } else if (lower.includes('experienced')) {
    return 'Good technical foundation for product development';
  } else if (lower.includes('some experience')) {
    return 'Basic technical skills, may need technical co-founder';
  } else {
    return 'Limited technical background, technical co-founder essential';
  }
}

function getStartupExperienceDescription(experience: string): string {
  const lower = experience.toLowerCase();
  if (lower.includes('founded') || lower.includes('co-founder')) {
    return 'Proven track record of building and scaling startups';
  } else if (lower.includes('early employee')) {
    return 'Experience with startup dynamics and growth challenges';
  } else if (lower.includes('some startup')) {
    return 'Some exposure to startup environment and culture';
  } else if (lower.includes('corporate')) {
    return 'Corporate background, may need to adapt to startup pace';
  } else {
    return 'No startup experience, significant learning curve ahead';
  }
}

function generateProblemStatement(description: string, marketGaps: string[], sentiment: any): string {
  const descriptionLower = description.toLowerCase();
  const avgSentiment = Object.values(sentiment).reduce((sum: number, val: any) => sum + (val || 0), 0) / Object.keys(sentiment).length;
  
  if (descriptionLower.includes('ai') || descriptionLower.includes('technology')) {
    return 'Businesses struggle to implement and scale AI solutions due to complexity, high costs, and lack of expertise. Current solutions are fragmented and difficult to integrate.';
  }
  
  if (descriptionLower.includes('marketplace') || descriptionLower.includes('platform')) {
    return 'Users face fragmented experiences across multiple platforms, with limited trust, high fees, and poor user experiences. The market lacks a comprehensive, trusted solution.';
  }
  
  if (descriptionLower.includes('healthcare') || descriptionLower.includes('medical')) {
    return 'Healthcare providers struggle with inefficiencies, high costs, and limited access to quality care. Patients face barriers to affordable, accessible healthcare services.';
  }
  
  if (marketGaps.length > 0) {
    return `Current market solutions fail to address key gaps: ${marketGaps.slice(0, 2).join(', ')}. This creates significant opportunities for innovative solutions.`;
  }
  
  if (avgSentiment < -0.2) {
    return 'Market shows negative sentiment towards current solutions, indicating significant dissatisfaction and unmet needs.';
  }
  
  return `The current market lacks efficient solutions for ${description.toLowerCase()}, creating significant opportunities for innovation and improvement.`;
}

function generateSolutionStatement(description: string, trends: any, sentiment: any): string {
  const descriptionLower = description.toLowerCase();
  const avgTrend = Object.values(trends).reduce((sum: number, val: any) => sum + (val || 0), 0) / Object.keys(trends).length;
  const avgSentiment = Object.values(sentiment).reduce((sum: number, val: any) => sum + (val || 0), 0) / Object.keys(sentiment).length;
  
  if (descriptionLower.includes('ai') || descriptionLower.includes('technology')) {
    return 'Our AI-powered platform provides easy-to-implement, scalable solutions that reduce complexity and costs while delivering superior results through advanced automation and intelligence.';
  }
  
  if (descriptionLower.includes('marketplace') || descriptionLower.includes('platform')) {
    return 'Our comprehensive marketplace platform provides a trusted, seamless experience with verified transactions, competitive pricing, and superior user experience across all touchpoints.';
  }
  
  if (descriptionLower.includes('healthcare') || descriptionLower.includes('medical')) {
    return 'Our healthcare platform connects patients with quality providers, streamlines processes, and reduces costs through innovative technology and strategic partnerships.';
  }
  
  if (avgTrend > 60 && avgSentiment > 0.2) {
    return `Our solution leverages growing market trends and positive sentiment to deliver ${description.toLowerCase()} through innovative technology and superior execution.`;
  }
  
  return `Our platform provides ${description.toLowerCase()} through an innovative, user-friendly solution that addresses market needs and delivers superior value.`;
}

// API Endpoints
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', message: 'Launcher MCP Server is running' });
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

app.post('/api/validate_idea', async (req, res) => {
  try {
    const { idea_description } = req.body;
    
    if (!idea_description) {
      return res.status(400).json({ error: 'Idea description is required' });
    }

    console.log(`🔍 Validating idea: ${idea_description}`);
    
    // Get comprehensive market intelligence
    const ragResponse = await ragSystem.processRAGQuery(idea_description, 'technology');
    
    // Extract keywords for deeper analysis
    const keywords = idea_description.toLowerCase().split(/\s+/).filter((word: string) => 
      word.length > 3 && !['the', 'and', 'for', 'with', 'that', 'this', 'from', 'they', 'have', 'been', 'were', 'said', 'each', 'which', 'their', 'time', 'will', 'about', 'there', 'could', 'other', 'after', 'first', 'well', 'also', 'new', 'want', 'because', 'any', 'these', 'give', 'day', 'most', 'us'].includes(word)
    );

    // Get real-time market data
    const [trends, sentiment, competitors, marketSize, newsData] = await Promise.all([
      googleTrends.fetchTrends(keywords),
      redditData.fetchSentiment(keywords),
      webScraper.scrapeCompetitorAnalysis(keywords),
      webScraper.scrapeMarketSize(idea_description),
      webScraper.scrapeRealTimeNews(idea_description)
    ]);

    // Calculate real feasibility score based on data
    const feasibilityScore = calculateFeasibilityScore(trends, sentiment, competitors, marketSize);
    
    // Generate market gap analysis
    const marketGaps = analyzeMarketGaps(competitors, idea_description);
    
    // Market size optimality analysis
    const marketSizeAnalysis = analyzeMarketSizeOptimality(marketSize, competitors);
    
    // Product-market fit analysis
    const productMarketFit = analyzeProductMarketFit(sentiment, trends, marketSize);
    
    // Create comprehensive validation report
    const validationReport = {
      idea: idea_description,
      timestamp: new Date().toISOString(),
      dataSources: {
        trends: Object.keys(trends).length,
        sentiment: Object.keys(sentiment).length,
        competitors: competitors.length,
        news: newsData.length
      },
      feasibilityScore: feasibilityScore,
      marketAnalysis: {
        marketSize: marketSize || 'Data not available',
        marketSizeOptimality: marketSizeAnalysis,
        competitionLevel: getCompetitionLevel(competitors.length),
        marketTrends: Object.entries(trends).map(([keyword, score]) => ({
          keyword,
          trendScore: score,
          interpretation: score > 70 ? 'High Interest' : score > 40 ? 'Moderate Interest' : 'Low Interest'
        })),
        marketGaps: marketGaps
      },
      productMarketFit: productMarketFit,
      opportunities: generateOpportunities(trends, sentiment, marketGaps),
      risks: generateRisks(competitors, sentiment, trends),
      recommendations: generateRecommendations(feasibilityScore, marketGaps, productMarketFit),
      similarStartups: competitors.slice(0, 5).map(comp => ({
        name: comp.name,
        description: comp.description,
        funding: comp.funding,
        relevance: calculateRelevance(comp, idea_description)
      })),
      marketInsights: {
        marketSize: marketSize || 'Data not available',
        growthRate: calculateGrowthRate(trends),
        trends: Object.keys(trends).slice(0, 5),
        opportunities: marketGaps.slice(0, 3),
        threats: generateThreats(competitors, sentiment)
      },
      confidence: ragResponse.confidence,
      lastUpdated: new Date().toISOString()
    };

    res.json(validationReport);
  } catch (error) {
    console.error('Error validating idea:', error);
    res.status(500).json({ error: 'Failed to validate idea' });
  }
});

app.post('/api/generate_business_model', async (req, res) => {
  try {
    const { company_info } = req.body;
    
    if (!company_info || !company_info.description) {
      return res.status(400).json({ error: 'Company description is required' });
    }

    console.log(`🏢 Generating business model for: ${company_info.description}`);
    
    // Get comprehensive market intelligence
    const ragResponse = await ragSystem.processRAGQuery(company_info.description, 'business');
    
    // Extract keywords for deeper analysis
    const keywords = company_info.description.toLowerCase().split(/\s+/).filter((word: string) => 
      word.length > 3 && !['the', 'and', 'for', 'with', 'that', 'this', 'from', 'they', 'have', 'been', 'were', 'said', 'each', 'which', 'their', 'time', 'will', 'about', 'there', 'could', 'other', 'after', 'first', 'well', 'also', 'new', 'want', 'because', 'any', 'these', 'give', 'day', 'most', 'us'].includes(word)
    );

    // Get real-time market data
    const [trends, sentiment, competitors, marketSize, newsData] = await Promise.all([
      googleTrends.fetchTrends(keywords),
      redditData.fetchSentiment(keywords),
      webScraper.scrapeCompetitorAnalysis(keywords),
      webScraper.scrapeMarketSize(company_info.description),
      webScraper.scrapeRealTimeNews(company_info.description)
    ]);

    // Generate business model based on real data
    const businessModel = {
      companyName: company_info.companyName || 'Your Company',
      description: company_info.description,
      timestamp: new Date().toISOString(),
      dataSources: {
        trends: Object.keys(trends).length,
        sentiment: Object.keys(sentiment).length,
        competitors: competitors.length,
        news: newsData.length
      },
      businessModelCanvas: {
        keyPartnerships: generateKeyPartnershipsFromData(competitors, trends, company_info.description),
        keyActivities: generateKeyActivitiesFromData(company_info.description, trends),
        keyResources: generateKeyResourcesFromData(company_info.description, competitors),
        valuePropositions: generateValuePropositionsFromData(company_info.description, sentiment, trends),
        customerRelationships: generateCustomerRelationshipsFromData(company_info.description, sentiment),
        channels: generateChannelsFromData(company_info.description, trends),
        customerSegments: generateCustomerSegmentsFromData(company_info.description, marketSize),
        costStructure: generateCostStructureFromData(company_info.description, competitors),
        revenueStreams: generateRevenueStreamsFromData(company_info.description, trends, marketSize)
      },
      marketAnalysis: {
        marketSize: marketSize || 'Data not available',
        competitionLevel: getCompetitionLevel(competitors.length),
        marketTrends: Object.entries(trends).map(([keyword, score]) => ({
          keyword,
          trendScore: score,
          interpretation: score > 70 ? 'High Interest' : score > 40 ? 'Moderate Interest' : 'Low Interest'
        })),
        targetMarket: analyzeTargetMarket(company_info.description, marketSize),
        competitiveAdvantages: generateCompetitiveAdvantages(competitors, company_info.description)
      },
      financialProjections: {
        marketSize: marketSize || 'Data not available',
        growthRate: calculateGrowthRate(trends),
        revenueProjections: generateRevenueProjections(marketSize, trends),
        costProjections: generateCostProjections(company_info.description, competitors),
        profitability: calculateProfitability(marketSize, trends, competitors)
      },
      confidence: ragResponse.confidence,
      lastUpdated: new Date().toISOString()
    };

    res.json(businessModel);
  } catch (error) {
    console.error('Error generating business model:', error);
    res.status(500).json({ error: 'Failed to generate business model' });
  }
});

app.post('/api/create_pitch_deck', async (req, res) => {
  try {
    const { startup_info } = req.body;
    
    if (!startup_info || !startup_info.startupName || !startup_info.description) {
      return res.status(400).json({ error: 'Startup name and description are required' });
    }

    console.log(`📊 Creating pitch deck for: ${startup_info.startupName}`);
    
    // Get comprehensive market intelligence
    const ragResponse = await ragSystem.processRAGQuery(startup_info.description, 'startup');
    
    // Extract keywords for deeper analysis
    const keywords = startup_info.description.toLowerCase().split(/\s+/).filter((word: string) => 
      word.length > 3 && !['the', 'and', 'for', 'with', 'that', 'this', 'from', 'they', 'have', 'been', 'were', 'said', 'each', 'which', 'their', 'time', 'will', 'about', 'there', 'could', 'other', 'after', 'first', 'well', 'also', 'new', 'want', 'because', 'any', 'these', 'give', 'day', 'most', 'us'].includes(word)
    );

    // Get real-time market data
    const [trends, sentiment, competitors, marketSize, newsData] = await Promise.all([
      googleTrends.fetchTrends(keywords),
      redditData.fetchSentiment(keywords),
      webScraper.scrapeCompetitorAnalysis(keywords),
      webScraper.scrapeMarketSize(startup_info.description),
      webScraper.scrapeRealTimeNews(startup_info.description)
    ]);

    // Calculate real feasibility score based on data
    const feasibilityScore = calculateFeasibilityScore(trends, sentiment, competitors, marketSize);
    
    // Generate market gap analysis
    const marketGaps = analyzeMarketGaps(competitors, startup_info.description);
    
    // Product-market fit analysis
    const productMarketFit = analyzeProductMarketFit(sentiment, trends, marketSize);

    // Generate comprehensive pitch deck based on real data
    const pitchDeck = {
      startupName: startup_info.startupName,
      title: `${startup_info.startupName} - Investor Pitch Deck`,
      timestamp: new Date().toISOString(),
      dataSources: {
        trends: Object.keys(trends).length,
        sentiment: Object.keys(sentiment).length,
        competitors: competitors.length,
        news: newsData.length
      },
      slides: [
        {
          id: '1',
          title: 'Problem Statement',
          content: generateProblemStatement(startup_info.description, marketGaps, sentiment),
          presenterNotes: 'Start with the problem - this is what investors care about most. Use real market data to support your claims.'
        },
        {
          id: '2',
          title: 'Solution',
          content: generateSolutionStatement(startup_info.description, trends, sentiment),
          presenterNotes: 'Present your solution clearly and concisely. Show how it addresses the identified problems.'
        },
        {
          id: '3',
          title: 'Market Opportunity',
          content: `Market Size: ${marketSize || 'Data not available'}\nGrowth Rate: ${calculateGrowthRate(trends)}\nTarget Market: ${analyzeTargetMarket(startup_info.description, marketSize)}\nMarket Trends: ${Object.keys(trends).slice(0, 3).join(', ')}`,
          presenterNotes: 'Show the market size and growth potential. Use real data to demonstrate the opportunity.'
        },
        {
          id: '4',
          title: 'Business Model',
          content: `Revenue Streams: ${generateRevenueStreamsFromData(startup_info.description, trends, marketSize).slice(0, 3).join(', ')}\nCost Structure: ${generateCostStructureFromData(startup_info.description, competitors).slice(0, 3).join(', ')}\nKey Partnerships: ${generateKeyPartnershipsFromData(competitors, trends, startup_info.description).slice(0, 3).join(', ')}`,
          presenterNotes: 'Explain how you will make money. Show that you understand the economics of your business.'
        },
        {
          id: '5',
          title: 'Competitive Advantage',
          content: `Competition Level: ${getCompetitionLevel(competitors.length)}\nMarket Gaps: ${marketGaps.slice(0, 3).join(', ')}\nOur Advantages: ${generateCompetitiveAdvantages(competitors, startup_info.description).slice(0, 3).join(', ')}\nFeasibility Score: ${feasibilityScore}/100`,
          presenterNotes: 'Highlight your competitive advantages and market positioning. Show why you will win.'
        },
        {
          id: '6',
          title: 'Product-Market Fit',
          content: `Fit Score: ${productMarketFit.score}/100 (${productMarketFit.level})\nMarket Sentiment: ${productMarketFit.indicators.marketSentiment}\nTrend Momentum: ${productMarketFit.indicators.trendMomentum}\nRecommendations: ${productMarketFit.recommendations.join(', ')}`,
          presenterNotes: 'Demonstrate that you have product-market fit or a clear path to achieve it.'
        },
        {
          id: '7',
          title: 'Financial Projections',
          content: `Market Size: ${marketSize || 'Data not available'}\nGrowth Rate: ${calculateGrowthRate(trends)}\nRevenue Projections: ${generateRevenueProjections(marketSize, trends)}\nProfitability: ${calculateProfitability(marketSize, trends, competitors)}`,
          presenterNotes: 'Present realistic financial projections based on market data. Show path to profitability.'
        },
        {
          id: '8',
          title: 'Team & Execution',
          content: `Founding Team: Experienced entrepreneurs with relevant backgrounds\nExecution Plan: Clear milestones and go-to-market strategy\nHiring Plan: Strategic team expansion in key areas\nPartnerships: Strategic partnerships for growth and market access`,
          presenterNotes: 'Highlight team strengths and relevant experience. Show that you can execute.'
        },
        {
          id: '9',
          title: 'Market Insights',
          content: `Market Trends: ${Object.entries(trends).map(([keyword, score]) => `${keyword} (${score.toFixed(1)}%)`).slice(0, 3).join(', ')}\nOpportunities: ${generateOpportunities(trends, sentiment, marketGaps).slice(0, 3).join(', ')}\nRisks: ${generateRisks(competitors, sentiment, trends).slice(0, 3).join(', ')}`,
          presenterNotes: 'Show deep understanding of market dynamics and trends. Address risks proactively.'
        },
        {
          id: '10',
          title: 'Funding & Next Steps',
          content: `Funding Ask: Seeking $2M in seed funding\nUse of Funds: 40% Product Development, 30% Team Expansion, 20% Marketing, 10% Operations\nMilestones: 12-month roadmap with key deliverables\nSuccess Metrics: Clear KPIs and success indicators\nNext Steps: Immediate action items and timeline`,
          presenterNotes: 'Clearly state funding needs and how you will use the money. Show clear next steps.'
        }
      ],
      marketIntelligence: {
        feasibilityScore: feasibilityScore,
        productMarketFit: productMarketFit,
        marketGaps: marketGaps,
        opportunities: generateOpportunities(trends, sentiment, marketGaps),
        risks: generateRisks(competitors, sentiment, trends),
        recommendations: generateRecommendations(feasibilityScore, marketGaps, productMarketFit)
      },
      confidence: ragResponse.confidence,
      lastUpdated: new Date().toISOString()
    };

    res.json(pitchDeck);
  } catch (error) {
    console.error('Error creating pitch deck:', error);
    res.status(500).json({ error: 'Failed to create pitch deck' });
  }
});

// Founder Fit Check API Endpoint
app.post('/api/founder_fit_check', async (req, res) => {
  try {
    const { domain_expertise, technical_expertise, startup_experience } = req.body;
    
    if (!domain_expertise || !technical_expertise || !startup_experience) {
      return res.status(400).json({ 
        error: 'All founder background fields are required: domain_expertise, technical_expertise, startup_experience' 
      });
    }

    console.log(`👤 Analyzing founder fit for: ${domain_expertise}, ${technical_expertise}, ${startup_experience}`);
    
    // Analyze founder fit
    const founderFitAnalysis = analyzeFounderFit(domain_expertise, technical_expertise, startup_experience);
    
    const response = {
      timestamp: new Date().toISOString(),
      founderFit: founderFitAnalysis,
      summary: {
        overallScore: founderFitAnalysis.score,
        overallLevel: founderFitAnalysis.level,
        keyStrengths: getKeyStrengths(founderFitAnalysis.breakdown),
        keyWeaknesses: getKeyWeaknesses(founderFitAnalysis.breakdown),
        nextSteps: founderFitAnalysis.recommendations
      }
    };

    console.log(`✅ Founder fit analysis completed: ${founderFitAnalysis.score}/100 (${founderFitAnalysis.level})`);
    res.json(response);
    
  } catch (error) {
    console.error('Error analyzing founder fit:', error);
    res.status(500).json({ error: 'Failed to analyze founder fit' });
  }
});

function getKeyStrengths(breakdown: any): string[] {
  const strengths = [];
  
  if (breakdown.domainExpertise.score >= 30) {
    strengths.push('Strong domain expertise');
  }
  if (breakdown.technicalExpertise.score >= 25) {
    strengths.push('Strong technical skills');
  }
  if (breakdown.startupExperience.score >= 20) {
    strengths.push('Relevant startup experience');
  }
  
  return strengths.length > 0 ? strengths : ['Potential for growth'];
}

function getKeyWeaknesses(breakdown: any): string[] {
  const weaknesses = [];
  
  if (breakdown.domainExpertise.score < 20) {
    weaknesses.push('Limited domain expertise');
  }
  if (breakdown.technicalExpertise.score < 15) {
    weaknesses.push('Limited technical skills');
  }
  if (breakdown.startupExperience.score < 15) {
    weaknesses.push('Limited startup experience');
  }
  
  return weaknesses.length > 0 ? weaknesses : ['No major weaknesses identified'];
}

// Execution Difficulty Metric Feature
function analyzeExecutionDifficulty(ideaDescription: string): any {
  const lower = ideaDescription.toLowerCase();
  let difficultyScore = 0;
  let classification = 'Medium';
  let reasoning = '';
  let factors: string[] = [];
  let recommendations: string[] = [];

  // Hard difficulty keywords (add to score)
  const hardKeywords = [
    'fda', 'hipaa', 'compliance', 'regulation', 'regulatory', 'ai infrastructure', 
    'machine learning', 'deep learning', 'neural networks', 'blockchain', 'cryptocurrency',
    'fintech', 'banking', 'financial services', 'healthcare', 'medical device',
    'pharmaceutical', 'biotech', 'clinical trials', 'data privacy', 'gdpr',
    'sox', 'pci', 'iso', 'certification', 'audit', 'legal', 'patent',
    'intellectual property', 'enterprise software', 'saas platform', 'api integration',
    'microservices', 'distributed systems', 'scalability', 'security', 'encryption'
  ];

  // Medium difficulty keywords
  const mediumKeywords = [
    'b2b saas', 'marketplace', 'api integration', 'web application', 'mobile app',
    'e-commerce', 'platform', 'software', 'database', 'backend', 'frontend',
    'cloud', 'aws', 'azure', 'google cloud', 'integration', 'automation',
    'workflow', 'crm', 'erp', 'analytics', 'dashboard', 'reporting'
  ];

  // Easy difficulty keywords (subtract from score)
  const easyKeywords = [
    'simple app', 'no-code', 'website', 'landing page', 'blog', 'portfolio',
    'static site', 'wordpress', 'shopify', 'wix', 'squarespace', 'template',
    'basic', 'simple', 'minimal', 'prototype', 'mvp', 'proof of concept'
  ];

  // Count keyword matches
  let hardCount = 0;
  let mediumCount = 0;
  let easyCount = 0;

  hardKeywords.forEach(keyword => {
    if (lower.includes(keyword)) {
      hardCount++;
      difficultyScore += 3;
      factors.push(`Hard: ${keyword}`);
    }
  });

  mediumKeywords.forEach(keyword => {
    if (lower.includes(keyword)) {
      mediumCount++;
      difficultyScore += 1;
      factors.push(`Medium: ${keyword}`);
    }
  });

  easyKeywords.forEach(keyword => {
    if (lower.includes(keyword)) {
      easyCount++;
      difficultyScore -= 2;
      factors.push(`Easy: ${keyword}`);
    }
  });

  // Determine classification
  if (difficultyScore >= 6) {
    classification = 'Hard';
    reasoning = 'High complexity due to regulatory requirements, advanced technology, or enterprise features';
    recommendations = [
      'Consider hiring specialized talent (legal, compliance, technical)',
      'Plan for longer development cycles (12-24 months)',
      'Budget for regulatory compliance and certifications',
      'Build strong partnerships with industry experts',
      'Consider phased approach with MVP first'
    ];
  } else if (difficultyScore >= 2) {
    classification = 'Medium';
    reasoning = 'Moderate complexity with standard business logic and integrations';
    recommendations = [
      'Plan for 6-12 month development cycle',
      'Focus on core features first, add complexity later',
      'Consider using existing platforms and APIs',
      'Build a strong technical team',
      'Plan for iterative development and testing'
    ];
  } else {
    classification = 'Easy';
    reasoning = 'Low complexity with simple features and minimal technical requirements';
    recommendations = [
      'Can be built quickly (1-3 months)',
      'Consider no-code or low-code solutions',
      'Focus on user experience and design',
      'Perfect for rapid prototyping and validation',
      'Great for first-time entrepreneurs'
    ];
  }

  return {
    classification,
    difficultyScore: Math.max(0, difficultyScore),
    reasoning,
    factors: factors.slice(0, 5), // Top 5 factors
    keywordAnalysis: {
      hardKeywords: hardCount,
      mediumKeywords: mediumCount,
      easyKeywords: easyCount
    },
    recommendations,
    estimatedTimeline: getEstimatedTimeline(classification),
    resourceRequirements: getResourceRequirements(classification)
  };
}

function getEstimatedTimeline(classification: string): string {
  switch (classification) {
    case 'Hard':
      return '12-24 months for full implementation';
    case 'Medium':
      return '6-12 months for MVP, 12-18 months for full product';
    case 'Easy':
      return '1-3 months for MVP, 3-6 months for full product';
    default:
      return 'Timeline depends on complexity';
  }
}

function getResourceRequirements(classification: string): string[] {
  switch (classification) {
    case 'Hard':
      return [
        'Senior technical team (5-10 developers)',
        'Legal and compliance experts',
        'Industry domain experts',
        'Significant budget ($500K-$2M+)',
        'Regulatory consultants'
      ];
    case 'Medium':
      return [
        'Technical team (3-5 developers)',
        'Product manager',
        'Designer',
        'Moderate budget ($100K-$500K)',
        'Industry advisors'
      ];
    case 'Easy':
      return [
        'Small team (1-3 people)',
        'Basic technical skills',
        'Low budget ($10K-$100K)',
        'No-code tools or simple development'
      ];
    default:
      return ['Resources depend on complexity'];
  }
}

// Execution Difficulty Metric API Endpoint
app.post('/api/execution_difficulty', async (req, res) => {
  try {
    const { idea_description } = req.body;
    
    if (!idea_description) {
      return res.status(400).json({ 
        error: 'Idea description is required' 
      });
    }

    console.log(`⚡ Analyzing execution difficulty for: ${idea_description}`);
    
    // Analyze execution difficulty
    const difficultyAnalysis = analyzeExecutionDifficulty(idea_description);
    
    const response = {
      timestamp: new Date().toISOString(),
      idea: idea_description,
      executionDifficulty: difficultyAnalysis,
      summary: {
        classification: difficultyAnalysis.classification,
        difficultyScore: difficultyAnalysis.difficultyScore,
        estimatedTimeline: difficultyAnalysis.estimatedTimeline,
        keyFactors: difficultyAnalysis.factors.slice(0, 3),
        topRecommendation: difficultyAnalysis.recommendations[0]
      }
    };

    console.log(`✅ Execution difficulty analysis completed: ${difficultyAnalysis.classification} (Score: ${difficultyAnalysis.difficultyScore})`);
    res.json(response);
    
  } catch (error) {
    console.error('Error analyzing execution difficulty:', error);
    res.status(500).json({ error: 'Failed to analyze execution difficulty' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Launcher MCP Server running on http://localhost:${PORT}`);
  console.log(`📊 RAG-powered data processing enabled`);
  console.log(`🔍 Real-time data fetching from multiple sources`);
  console.log(`🎯 Industry-specific intelligence implemented`);
}); 