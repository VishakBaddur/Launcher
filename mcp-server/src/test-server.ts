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
    
    const result = await ragSystem.processRAGQuery(idea_description, 'technology');
    res.json(result);
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
    
    const result = await ragSystem.processRAGQuery(company_info.description, 'business');
    res.json(result);
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
    
    const result = await ragSystem.processRAGQuery(startup_info.description, 'startup');
    res.json(result);
  } catch (error) {
    console.error('Error creating pitch deck:', error);
    res.status(500).json({ error: 'Failed to create pitch deck' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Launcher MCP Server running on http://localhost:${PORT}`);
  console.log(`📊 RAG-powered data processing enabled`);
  console.log(`🔍 Real-time data fetching from multiple sources`);
  console.log(`🎯 Industry-specific intelligence implemented`);
}); 