export declare class RedditDataSource {
    private baseUrl;
    fetchSentiment(keywords: string[]): Promise<{
        [keyword: string]: number;
    }>;
    getStartupDiscussions(): Promise<string[]>;
    getMarketInsights(industry: string): Promise<string[]>;
}
//# sourceMappingURL=reddit-data.d.ts.map