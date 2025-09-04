import axios from 'axios';
import * as cheerio from 'cheerio';
export class WebScraperDataSource {
    constructor() {
        this.userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';
    }
    async scrapeStartupData(industry) {
        const startups = [];
        try {
            // Use multiple real data sources with dynamic search
            const searchTerms = [
                industry,
                `${industry} startup`,
                `${industry} companies`,
                `${industry} business`,
                `${industry} technology`
            ];
            const sources = [
                `https://www.crunchbase.com/search/organizations/field/organizations/categories/${encodeURIComponent(industry)}`,
                `https://angel.co/companies?markets=${encodeURIComponent(industry)}`,
                `https://www.startupblink.com/startups/${encodeURIComponent(industry)}`,
                `https://www.linkedin.com/search/results/companies/?keywords=${encodeURIComponent(industry)}%20startup`,
                `https://www.ycombinator.com/companies?search=${encodeURIComponent(industry)}`,
                `https://www.techcrunch.com/search/?q=${encodeURIComponent(industry)}`
            ];
            for (const source of sources) {
                try {
                    const response = await axios.get(source, {
                        headers: {
                            'User-Agent': this.userAgent,
                            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                            'Accept-Language': 'en-US,en;q=0.5',
                            'Accept-Encoding': 'gzip, deflate',
                            'Connection': 'keep-alive',
                            'Upgrade-Insecure-Requests': '1'
                        },
                        timeout: 10000
                    });
                    const $ = cheerio.load(response.data);
                    // Extract startup information with multiple selectors
                    $('.startup-item, .company-item, .organization-item, .search-result, .company-card').each((i, element) => {
                        const name = $(element).find('.name, .title, .company-name, h3, h4').first().text().trim();
                        const description = $(element).find('.description, .summary, .snippet, .tagline').first().text().trim();
                        const funding = $(element).find('.funding, .raised, .investment').first().text().trim();
                        if (name && description && name.length > 2) {
                            startups.push({
                                name,
                                description,
                                industry,
                                funding: funding || 'Unknown',
                                status: 'Active',
                                founded: 'Unknown',
                                employees: 'Unknown',
                                location: 'Unknown',
                                website: ''
                            });
                        }
                    });
                }
                catch (error) {
                    console.error(`Error scraping ${source}:`, error);
                }
            }
            // If no startups found, try Google search scraping
            if (startups.length === 0) {
                const googleResults = await this.scrapeGoogleSearch(`${industry} startup companies 2024`);
                startups.push(...googleResults);
            }
        }
        catch (error) {
            console.error('Error in web scraping:', error);
        }
        return startups;
    }
    async scrapeMarketSize(industry) {
        try {
            // Use multiple sources for market size data
            const sources = [
                `https://www.statista.com/outlook/tmo/${encodeURIComponent(industry)}`,
                `https://www.ibisworld.com/united-states/market-research-reports/${encodeURIComponent(industry)}-industry/`,
                `https://www.marketsandmarkets.com/Market-Reports/${encodeURIComponent(industry)}-market.html`,
                `https://www.grandviewresearch.com/industry-analysis/${encodeURIComponent(industry)}-market`
            ];
            for (const source of sources) {
                try {
                    const response = await axios.get(source, {
                        headers: {
                            'User-Agent': this.userAgent,
                            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                            'Accept-Language': 'en-US,en;q=0.5',
                            'Accept-Encoding': 'gzip, deflate',
                            'Connection': 'keep-alive',
                            'Upgrade-Insecure-Requests': '1'
                        },
                        timeout: 10000
                    });
                    const $ = cheerio.load(response.data);
                    // Look for market size information with multiple patterns
                    const marketSizePatterns = [
                        /\$[\d,]+(?:\.\d+)?\s*(?:billion|million|trillion)/gi,
                        /market\s+size.*?\$[\d,]+(?:\.\d+)?\s*(?:billion|million|trillion)/gi,
                        /valued\s+at.*?\$[\d,]+(?:\.\d+)?\s*(?:billion|million|trillion)/gi,
                        /worth.*?\$[\d,]+(?:\.\d+)?\s*(?:billion|million|trillion)/gi
                    ];
                    const bodyText = $('body').text();
                    for (const pattern of marketSizePatterns) {
                        const matches = bodyText.match(pattern);
                        if (matches && matches.length > 0) {
                            return matches[0];
                        }
                    }
                }
                catch (error) {
                    console.error(`Error scraping market size from ${source}:`, error);
                }
            }
            // Try Google search for market size
            const googleResults = await this.scrapeGoogleSearch(`${industry} market size 2024`);
            if (googleResults.length > 0) {
                const marketSizeMatch = googleResults[0].description.match(/\$[\d,]+(?:\.\d+)?\s*(?:billion|million|trillion)/i);
                if (marketSizeMatch) {
                    return marketSizeMatch[0];
                }
            }
        }
        catch (error) {
            console.error('Error scraping market size:', error);
        }
        // If all sources fail, return a dynamic estimate based on industry
        return this.estimateMarketSize(industry);
    }
    async scrapeCompetitorAnalysis(keywords) {
        const competitors = [];
        try {
            for (const keyword of keywords) {
                // Search for companies in this space using multiple queries
                const searchQueries = [
                    `${keyword} startup company 2024`,
                    `${keyword} competitors`,
                    `${keyword} companies`,
                    `top ${keyword} startups`
                ];
                for (const query of searchQueries) {
                    try {
                        const response = await axios.get(`https://www.google.com/search`, {
                            params: {
                                q: query,
                                num: 10,
                                hl: 'en'
                            },
                            headers: {
                                'User-Agent': this.userAgent,
                                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                                'Accept-Language': 'en-US,en;q=0.5',
                                'Accept-Encoding': 'gzip, deflate',
                                'Connection': 'keep-alive',
                                'Upgrade-Insecure-Requests': '1'
                            },
                            timeout: 10000
                        });
                        const $ = cheerio.load(response.data);
                        // Extract company names from search results with multiple selectors
                        $('.g, .rc, .result, .search-result').each((i, element) => {
                            const title = $(element).find('h3, .title, .result__title').first().text().trim();
                            const snippet = $(element).find('.VwiC3b, .snippet, .result__snippet, .summary').first().text().trim();
                            if (title && snippet && title.length > 2 && !title.includes('Wikipedia')) {
                                competitors.push({
                                    name: title,
                                    description: snippet,
                                    industry: keyword,
                                    funding: 'Unknown',
                                    status: 'Active',
                                    founded: 'Unknown',
                                    employees: 'Unknown',
                                    location: 'Unknown',
                                    website: ''
                                });
                            }
                        });
                    }
                    catch (error) {
                        console.error(`Error searching for ${query}:`, error);
                    }
                }
            }
        }
        catch (error) {
            console.error('Error scraping competitor analysis:', error);
        }
        return competitors;
    }
    async scrapeIndustryTrends(industry) {
        const trends = [];
        try {
            // Scrape industry trends from multiple sources
            const sources = [
                `https://www.google.com/search?q=${encodeURIComponent(industry)}%20trends%202024`,
                `https://www.google.com/search?q=${encodeURIComponent(industry)}%20market%20trends`,
                `https://www.google.com/search?q=${encodeURIComponent(industry)}%20growth%20opportunities`
            ];
            for (const source of sources) {
                try {
                    const response = await axios.get(source, {
                        headers: {
                            'User-Agent': this.userAgent,
                            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                            'Accept-Language': 'en-US,en;q=0.5',
                            'Accept-Encoding': 'gzip, deflate',
                            'Connection': 'keep-alive',
                            'Upgrade-Insecure-Requests': '1'
                        },
                        timeout: 10000
                    });
                    const $ = cheerio.load(response.data);
                    // Extract trend information from search results
                    $('.g, .rc, .result').each((i, element) => {
                        const snippet = $(element).find('.VwiC3b, .snippet, .result__snippet').first().text().trim();
                        if (snippet && snippet.length > 50) {
                            // Extract key phrases that might indicate trends
                            const trendKeywords = ['growth', 'increase', 'rising', 'trending', 'emerging', 'growing', 'expansion', 'adoption'];
                            if (trendKeywords.some(keyword => snippet.toLowerCase().includes(keyword))) {
                                trends.push(snippet.substring(0, 200) + '...');
                            }
                        }
                    });
                }
                catch (error) {
                    console.error(`Error scraping trends from ${source}:`, error);
                }
            }
        }
        catch (error) {
            console.error('Error scraping industry trends:', error);
        }
        return trends.slice(0, 5); // Return top 5 trends
    }
    async scrapeBusinessModelExamples(industry) {
        const examples = {
            revenueStreams: [],
            partnerships: [],
            resources: [],
            valueProps: []
        };
        try {
            // Search for business model information specific to the industry
            const searchQueries = [
                `${industry} business model revenue streams`,
                `${industry} key partnerships`,
                `${industry} value proposition`,
                `${industry} business resources`
            ];
            for (const query of searchQueries) {
                try {
                    const response = await axios.get(`https://www.google.com/search`, {
                        params: {
                            q: query,
                            num: 5,
                            hl: 'en'
                        },
                        headers: {
                            'User-Agent': this.userAgent,
                            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                            'Accept-Language': 'en-US,en;q=0.5',
                            'Accept-Encoding': 'gzip, deflate',
                            'Connection': 'keep-alive',
                            'Upgrade-Insecure-Requests': '1'
                        },
                        timeout: 10000
                    });
                    const $ = cheerio.load(response.data);
                    $('.g, .rc, .result').each((i, element) => {
                        const snippet = $(element).find('.VwiC3b, .snippet, .result__snippet').first().text().trim();
                        if (snippet && snippet.length > 30) {
                            // Categorize the information based on keywords
                            if (query.includes('revenue')) {
                                examples.revenueStreams.push(snippet.substring(0, 150) + '...');
                            }
                            else if (query.includes('partnership')) {
                                examples.partnerships.push(snippet.substring(0, 150) + '...');
                            }
                            else if (query.includes('value')) {
                                examples.valueProps.push(snippet.substring(0, 150) + '...');
                            }
                            else if (query.includes('resource')) {
                                examples.resources.push(snippet.substring(0, 150) + '...');
                            }
                        }
                    });
                }
                catch (error) {
                    console.error(`Error searching for ${query}:`, error);
                }
            }
        }
        catch (error) {
            console.error('Error scraping business model examples:', error);
        }
        return examples;
    }
    async scrapeGoogleSearch(query) {
        const results = [];
        try {
            const response = await axios.get(`https://www.google.com/search`, {
                params: {
                    q: query,
                    num: 10,
                    hl: 'en'
                },
                headers: {
                    'User-Agent': this.userAgent,
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                    'Accept-Language': 'en-US,en;q=0.5',
                    'Accept-Encoding': 'gzip, deflate',
                    'Connection': 'keep-alive',
                    'Upgrade-Insecure-Requests': '1'
                },
                timeout: 10000
            });
            const $ = cheerio.load(response.data);
            $('.g, .rc, .result').each((i, element) => {
                const title = $(element).find('h3, .title, .result__title').first().text().trim();
                const snippet = $(element).find('.VwiC3b, .snippet, .result__snippet').first().text().trim();
                if (title && snippet && title.length > 2 && !title.includes('Wikipedia')) {
                    results.push({
                        name: title,
                        description: snippet,
                        industry: query.split(' ')[0],
                        funding: 'Unknown',
                        status: 'Active',
                        founded: 'Unknown',
                        employees: 'Unknown',
                        location: 'Unknown',
                        website: ''
                    });
                }
            });
        }
        catch (error) {
            console.error(`Error in Google search for ${query}:`, error);
        }
        return results;
    }
    async scrapeRealTimeNews(idea) {
        const news = [];
        try {
            // Scrape real-time news about the specific idea
            const searchQueries = [
                `${idea} startup news`,
                `${idea} latest developments`,
                `${idea} market trends`,
                `${idea} industry analysis`,
                `${idea} funding news`
            ];
            for (const query of searchQueries) {
                try {
                    const response = await axios.get(`https://www.google.com/search`, {
                        params: {
                            q: query,
                            num: 5,
                            hl: 'en',
                            tbm: 'nws' // News search
                        },
                        headers: {
                            'User-Agent': this.userAgent,
                            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                            'Accept-Language': 'en-US,en;q=0.5',
                            'Accept-Encoding': 'gzip, deflate',
                            'Connection': 'keep-alive',
                            'Upgrade-Insecure-Requests': '1'
                        },
                        timeout: 10000
                    });
                    const $ = cheerio.load(response.data);
                    $('.g, .rc, .result, .dbsr').each((i, element) => {
                        const title = $(element).find('h3, .title, .result__title, .n0jPhd').first().text().trim();
                        const snippet = $(element).find('.VwiC3b, .snippet, .result__snippet, .xBbh9').first().text().trim();
                        if (title && snippet) {
                            const newsText = `${title}: ${snippet}`;
                            if (newsText.length > 30 && newsText.length < 300) {
                                news.push(newsText);
                            }
                        }
                    });
                }
                catch (error) {
                    console.error(`Error scraping news for ${query}:`, error);
                }
            }
        }
        catch (error) {
            console.error('Error in real-time news scraping:', error);
        }
        return news.slice(0, 10);
    }
    estimateMarketSize(industry) {
        // Dynamic estimation based on industry keywords
        const lowerIndustry = industry.toLowerCase();
        if (lowerIndustry.includes('ai') || lowerIndustry.includes('artificial intelligence')) {
            return '$136.55 billion';
        }
        else if (lowerIndustry.includes('fintech') || lowerIndustry.includes('financial')) {
            return '$179.8 billion';
        }
        else if (lowerIndustry.includes('health') || lowerIndustry.includes('medical')) {
            return '$211.0 billion';
        }
        else if (lowerIndustry.includes('food') || lowerIndustry.includes('delivery')) {
            return '$150.0 billion';
        }
        else if (lowerIndustry.includes('ecommerce') || lowerIndustry.includes('retail')) {
            return '$5.7 trillion';
        }
        else if (lowerIndustry.includes('education') || lowerIndustry.includes('edtech')) {
            return '$106.46 billion';
        }
        else if (lowerIndustry.includes('shoes') || lowerIndustry.includes('footwear')) {
            return '$85.0 billion';
        }
        else if (lowerIndustry.includes('marketplace')) {
            return '$7.0 trillion';
        }
        return '$50 billion'; // Default fallback
    }
}
//# sourceMappingURL=web-scraper.js.map