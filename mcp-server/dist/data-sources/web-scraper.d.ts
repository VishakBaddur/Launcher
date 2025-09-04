import { StartupData } from '../types/index';
export declare class WebScraperDataSource {
    private userAgent;
    scrapeStartupData(industry: string): Promise<StartupData[]>;
    scrapeMarketSize(industry: string): Promise<string>;
    scrapeCompetitorAnalysis(keywords: string[]): Promise<StartupData[]>;
    scrapeIndustryTrends(industry: string): Promise<string[]>;
    scrapeBusinessModelExamples(industry: string): Promise<{
        [key: string]: string[];
    }>;
    private scrapeGoogleSearch;
    scrapeRealTimeNews(idea: string): Promise<string[]>;
    private estimateMarketSize;
}
//# sourceMappingURL=web-scraper.d.ts.map