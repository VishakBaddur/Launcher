export declare class NewsDataSource {
    private baseUrl;
    private apiKey;
    fetchNews(keywords: string[]): Promise<{
        [keyword: string]: number;
    }>;
    getMarketInsights(industry: string): Promise<string[]>;
    getStartupNews(): Promise<string[]>;
    getIndustryTrends(industry: string): Promise<string[]>;
}
//# sourceMappingURL=news-api.d.ts.map