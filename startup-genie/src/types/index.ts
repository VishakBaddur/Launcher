export interface User {
  email: string;
  id?: string;
}

export interface ValidationResult {
  feasibilityScore: number;
  marketSize: string;
  competitionLevel: string;
  trends: string[];
  opportunities: string[];
  risks: string[];
  recommendations: string[];
  similarStartups: string[] | StartupData[];
  marketInsights?: {
    marketSize: string;
    growthRate: string;
    trends: string[];
    opportunities: string[];
    threats: string[];
  };
}

export interface BusinessModel {
  companyName?: string;
  description?: string;
  targetMarket?: string;
  valueProposition?: string;
  valuePropositions?: string[];
  revenueStreams: string[];
  keyPartnerships: string[];
  keyResources: string[];
  keyActivities?: string[];
  costStructure: string[];
  customerSegments: string[];
  channels: string[];
  customerRelationships: string[];
}

export interface PitchSlide {
  id: string;
  title: string;
  content: string;
  presenterNotes: string;
}

export interface PitchDeck {
  startupName: string;
  title: string;
  slides: PitchSlide[];
  createdAt: string;
}

export interface StartupData {
  name: string;
  industry: string;
  description: string;
  funding: string;
  status: string;
}

export interface RAGResponse {
  startups: StartupData[];
  marketTrends: string[];
  insights: any;
} 