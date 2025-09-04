export interface StartupData {
    name: string;
    description: string;
    industry: string;
    funding: string;
    status: string;
    founded: string;
    employees: string;
    location: string;
    website: string;
}
export interface MarketData {
    marketSize: string;
    growthRate: string;
    trends: string[];
    opportunities: string[];
    threats: string[];
}
export interface CompetitorData {
    competitors: StartupData[];
    competitiveAdvantages: string[];
    marketGaps: string[];
}
export interface TrendData {
    googleTrends: {
        [keyword: string]: number;
    };
    redditSentiment: {
        [keyword: string]: number;
    };
    newsMentions: {
        [keyword: string]: number;
    };
    socialMediaBuzz: {
        [keyword: string]: number;
    };
}
export interface ValidationResult {
    feasibilityScore: number;
    marketSize: string;
    competitionLevel: string;
    trends: string[];
    opportunities: string[];
    risks: string[];
    recommendations: string[];
    similarStartups: StartupData[];
    marketInsights: MarketData;
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
export interface PitchData {
    problem: string;
    solution: string;
    marketSize: string;
    businessModel: string;
    traction: string;
    team: string;
    competition: string;
    financials: string;
    fundingAsk: string;
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
//# sourceMappingURL=index.d.ts.map