/**
 * Utility functions for safe data handling and fallback content
 */

// Safe mapping utility to reduce repetition
export const safeMap = <T, U>(
  arr: T[] | undefined | null, 
  fn: (item: T, index: number) => U
): U[] => {
  if (!arr || !Array.isArray(arr)) {
    console.warn('⚠️ safeMap: Array is undefined/null, using fallback');
    return [];
  }
  return arr.map(fn);
};

// Safe access with fallback and logging
export const safeAccess = <T>(
  obj: any,
  path: string,
  fallback: T,
  logWarning: boolean = true
): T => {
  const keys = path.split('.');
  let current = obj;
  
  for (const key of keys) {
    if (current === null || current === undefined || !(key in current)) {
      if (logWarning) {
        console.warn(`⚠️ safeAccess: Path "${path}" not found, using fallback:`, fallback);
      }
      return fallback;
    }
    current = current[key];
  }
  
  return current;
};

// Fallback data generators
export const fallbackData = {
  // Idea Validation fallbacks
  ideaValidation: {
    feasibilityScore: 75,
    marketSize: '$50B',
    competitionLevel: 'Medium',
    trends: [
      'Market growth and expansion',
      'Technology adoption increasing',
      'Consumer demand rising',
      'Regulatory environment evolving'
    ],
    opportunities: [
      'First-mover advantage in emerging market',
      'Technology gap in current solutions',
      'Growing customer demand',
      'Partnership opportunities available'
    ],
    risks: [
      'Market competition intensifying',
      'Regulatory changes possible',
      'Technology disruption risk',
      'Customer adoption challenges'
    ],
    recommendations: [
      'Focus on customer acquisition and retention',
      'Build strong partnerships and alliances',
      'Invest in technology and innovation',
      'Monitor market trends and competition'
    ],
    marketInsights: {
      marketSize: '$50B',
      growthRate: '12% annually',
      trends: [
        'Market growth and expansion',
        'Technology adoption increasing',
        'Consumer demand rising'
      ],
      opportunities: ['Market expansion', 'Technology integration'],
      threats: ['Competition', 'Market volatility']
    },
    founderFit: {
      score: 70,
      label: 'Moderate',
      breakdown: {
        domain: 70,
        technical: 70,
        startup: 70
      }
    },
    executionDifficulty: {
      level: 'Medium',
      score: 60,
      reasoning: 'Moderate complexity with standard development requirements'
    },
    timeToMVP: {
      timeframe: '3-6 months',
      score: 70,
      phases: ['Prototype development', 'Beta testing', 'Market launch']
    },
    riskAnalysis: {
      topRisks: [
        {
          category: 'Competition',
          risk: 'Market competition intensifying',
          severity: 'Medium',
          probability: 'High',
          weightedScore: 6,
          isCritical: false,
          mitigations: [
            {
              action: 'Build strong differentiation and unique value proposition',
              priority: 'High',
              effort: 'Medium',
              timeline: '3-6 months'
            }
          ]
        }
      ],
      overallRiskLevel: 'Medium',
      criticalRisks: 0
    }
  },

  // Business Plan fallbacks
  businessPlan: {
    businessModelFitScore: 75,
    revenueStreams: [
      {
        stream: 'Subscription Fees',
        priority: 'Primary',
        projectedPercentage: 70,
        description: 'Monthly/annual subscription revenue from core service offering',
        unitEconomics: {
          arpu: 100,
          churnRate: 5,
          ltv: 2000,
          cac: 200
        }
      },
      {
        stream: 'Transaction Fees',
        priority: 'Secondary',
        projectedPercentage: 20,
        description: 'Revenue from transaction processing and service fees',
        unitEconomics: {
          arpu: 50,
          churnRate: 8,
          ltv: 625,
          cac: 150
        }
      }
    ],
    costStructure: [
      'Product Development & Engineering',
      'Marketing & Customer Acquisition',
      'Operations & Infrastructure',
      'Sales & Business Development'
    ],
    customerSegments: [
      'Small to Medium Businesses (Primary)',
      'Enterprise Customers (Secondary)',
      'Individual Consumers (Emerging)'
    ],
    keyPartnerships: [
      'Technology Integration Partners',
      'Distribution & Channel Partners',
      'Strategic Business Partners'
    ],
    unitEconomics: {
      contributionMargin: 60,
      paybackPeriod: 12,
      ltvCacRatio: 10,
      profitabilityAssessment: 'Good',
      recommendations: [
        'Optimize customer acquisition costs',
        'Improve customer retention rates',
        'Increase average revenue per user'
      ]
    },
    scalabilityAnalysis: {
      scalabilityLevel: 'High',
      reasoning: 'Strong scalability potential with digital product and recurring revenue model',
      challenges: [
        'Customer acquisition at scale',
        'Infrastructure scaling requirements',
        'Team and operational scaling'
      ],
      recommendations: [
        'Automate key business processes',
        'Build strategic partnerships',
        'Invest in scalable technology infrastructure'
      ]
    },
    partnershipViability: {
      overallViability: 'High',
      partnerships: [
        {
          partner: 'Technology Integration Partners',
          viability: 'High',
          reasoning: 'Easy to integrate with existing systems and platforms',
          effort: 'Low',
          timeline: '1-3 months',
          recommendations: ['Start with pilot programs', 'Build integration documentation']
        },
        {
          partner: 'Distribution Partners',
          viability: 'Medium',
          reasoning: 'Requires more negotiation and relationship building',
          effort: 'Medium',
          timeline: '3-6 months',
          recommendations: ['Identify key distribution channels', 'Develop partnership proposals']
        }
      ]
    }
  },

  // Pitch Deck fallbacks
  pitchDeck: {
    pitchReadinessScore: 75,
    slides: [
      {
        id: '1',
        title: 'Problem Statement',
        content: 'The current market faces significant challenges in efficiency, cost-effectiveness, and user experience. Our solution addresses these critical pain points with innovative technology and a customer-centric approach.',
        presenterNotes: 'Start with a compelling problem that resonates with your audience. Use data and real examples to make it tangible. Connect the problem to market size and opportunity.',
        visualAid: 'Problem-solution diagram showing market gap and opportunity size'
      },
      {
        id: '2',
        title: 'Solution Overview',
        content: 'Our innovative platform leverages cutting-edge technology to solve the identified problems with a scalable, user-friendly approach that delivers measurable value to customers.',
        presenterNotes: 'Clearly articulate your unique value proposition. Focus on benefits, not just features. Show how your solution is different and better than existing alternatives.',
        visualAid: 'Product mockup or architecture diagram showing key features'
      },
      {
        id: '3',
        title: 'Market Opportunity',
        content: 'Large and growing market with significant untapped potential. Strong demand indicators and favorable market trends support our business model and growth projections.',
        presenterNotes: 'Use credible market data and sources. Show market size, growth rate, and your addressable market. Include relevant benchmarks and comparisons.',
        visualAid: 'Market size chart and growth projections'
      },
      {
        id: '4',
        title: 'Business Model',
        content: 'Sustainable revenue model with multiple streams and strong unit economics. Clear path to profitability with scalable cost structure and efficient customer acquisition.',
        presenterNotes: 'Explain your revenue model clearly. Show unit economics and path to profitability. Highlight scalability and efficiency of your business model.',
        visualAid: 'Revenue model diagram and unit economics table'
      },
      {
        id: '5',
        title: 'Competitive Advantage',
        content: 'Unique positioning with defensible moats and sustainable competitive advantages. Strong team and technology foundation supporting long-term success.',
        presenterNotes: 'Clearly differentiate from competitors. Show your unique advantages and how they create defensible moats. Highlight team strengths and technology advantages.',
        visualAid: 'Competitive landscape chart and advantage matrix'
      }
    ],
    investorFit: {
      suggestedInvestorTypes: [
        'Early-stage VCs focused on technology',
        'Angel investors with industry expertise',
        'Industry-specific investment funds',
        'Strategic corporate investors'
      ],
      nextSteps: [
        'Prepare detailed financial projections',
        'Build and test minimum viable product',
        'Gather customer feedback and validation',
        'Develop go-to-market strategy'
      ]
    }
  }
};

// Logging utility for debugging
export const logFallbackUsage = (context: string, dataType: string) => {
  console.warn(`🔄 Using fallback data for ${dataType} in ${context}. This may indicate API issues.`);
};

// Performance-optimized safe map for large datasets
export const safeMapOptimized = <T, U>(
  arr: T[] | undefined | null, 
  fn: (item: T, index: number) => U,
  context: string = 'unknown'
): U[] => {
  if (!arr || !Array.isArray(arr)) {
    logFallbackUsage(context, 'array');
    return [];
  }
  
  // For very large arrays, we could add performance monitoring here
  if (arr.length > 1000) {
    console.info(`📊 Processing large dataset: ${arr.length} items in ${context}`);
  }
  
  return arr.map(fn);
};
