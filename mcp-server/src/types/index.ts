export interface ValidationResult {
  feasibilityScore: number;
  marketSize: string;
  competitionLevel: string;
  trends: string[];
  opportunities: string[];
  risks: string[];
  recommendations: string[];
  similarStartups: StartupData[] | string[];
  marketInsights?: {
    marketSize: string;
    growthRate: string;
    trends: string[];
    opportunities: string[];
    threats: string[];
  };
}

export interface BusinessModelData {
  revenueStreams: string[];
  costStructure: string[];
  keyPartnerships: string[];
  keyResources: string[];
  valuePropositions: string[];
  customerSegments: string[];
  channels: string[];
  customerRelationships: string[];
}

export interface StartupData {
  name: string;
  description: string;
  industry: string;
}

export interface MarketData {
  marketSize: string;
  growthRate: string;
  trends: string[];
  opportunities: string[];
  threats: string[];
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