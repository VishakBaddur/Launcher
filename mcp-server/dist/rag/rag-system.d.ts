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
export declare class RAGSystem {
    private googleTrends;
    private redditData;
    private webScraper;
    private marketDataCache;
    constructor();
    retrieveMarketData(query: string, industry: string): Promise<MarketDataPoint[]>;
    generateContentFromRetrievedData(retrievedData: MarketDataPoint[], query: string): RAGResponse;
    processRAGQuery(query: string, industry: string): Promise<RAGResponse>;
    private extractKeywords;
    private calculateRelevance;
    private rankByRelevance;
    private generateInsights;
    private generateRecommendations;
    private createDynamicContent;
    private calculateConfidence;
    private calculateRecency;
}
//# sourceMappingURL=rag-system.d.ts.map