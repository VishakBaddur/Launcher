export declare class GoogleTrendsDataSource {
    private baseUrl;
    fetchTrends(keywords: string[]): Promise<{
        [keyword: string]: number;
    }>;
    getTrendingTopics(): Promise<string[]>;
}
//# sourceMappingURL=google-trends.d.ts.map