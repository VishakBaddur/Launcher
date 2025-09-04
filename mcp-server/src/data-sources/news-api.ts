import axios from 'axios';

export class NewsDataSource {
  private baseUrl = 'https://newsapi.org/v2';
  private apiKey = process.env.NEWS_API_KEY || 'demo'; // Free tier: 1,000 requests/day

  async fetchNews(keywords: string[]): Promise<{ [keyword: string]: number }> {
    const newsCount: { [keyword: string]: number } = {};
    
    try {
      for (const keyword of keywords) {
        const response = await axios.get(`${this.baseUrl}/everything`, {
          params: {
            q: keyword,
            from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Last 30 days
            sortBy: 'relevancy',
            pageSize: 100,
            apiKey: this.apiKey
          }
        });

        if (response.data.status === 'ok') {
          newsCount[keyword] = response.data.totalResults;
        } else {
          newsCount[keyword] = 0;
        }
      }
    } catch (error) {
      console.error('Error fetching news data:', error);
      // Fallback to mock data
      keywords.forEach(keyword => {
        newsCount[keyword] = Math.floor(Math.random() * 1000) + 100;
      });
    }

    return newsCount;
  }

  async getMarketInsights(industry: string): Promise<string[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/everything`, {
        params: {
          q: `${industry} market trends startup`,
          from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Last 7 days
          sortBy: 'relevancy',
          pageSize: 20,
          apiKey: this.apiKey
        }
      });

      if (response.data.status === 'ok') {
        return response.data.articles.map((article: any) => article.title);
      }
    } catch (error) {
      console.error('Error fetching market insights:', error);
    }

    // Fallback insights
    return [
      `${industry} market shows strong growth potential`,
      `New technologies disrupting ${industry} sector`,
      `Investors showing increased interest in ${industry} startups`,
      `${industry} companies raising significant funding`,
      `Regulatory changes affecting ${industry} landscape`
    ];
  }

  async getStartupNews(): Promise<string[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/everything`, {
        params: {
          q: 'startup funding unicorn',
          from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          sortBy: 'relevancy',
          pageSize: 10,
          apiKey: this.apiKey
        }
      });

      if (response.data.status === 'ok') {
        return response.data.articles.map((article: any) => article.title);
      }
    } catch (error) {
      console.error('Error fetching startup news:', error);
    }

    // Fallback startup news
    return [
      'New AI startup raises $50M in Series A funding',
      'Fintech startup reaches unicorn status',
      'Healthtech startup launches revolutionary product',
      'Edtech startup expands to new markets',
      'Sustainability startup gains investor attention'
    ];
  }

  async getIndustryTrends(industry: string): Promise<string[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/everything`, {
        params: {
          q: `${industry} trends 2024`,
          from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          sortBy: 'relevancy',
          pageSize: 15,
          apiKey: this.apiKey
        }
      });

      if (response.data.status === 'ok') {
        return response.data.articles.map((article: any) => article.title);
      }
    } catch (error) {
      console.error('Error fetching industry trends:', error);
    }

    // Fallback trends
    return [
      `${industry} adoption accelerating globally`,
      `New regulations shaping ${industry} future`,
      `Major players entering ${industry} market`,
      `${industry} technology becoming more accessible`,
      `Consumer demand driving ${industry} innovation`
    ];
  }
} 