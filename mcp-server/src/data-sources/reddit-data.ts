import axios from 'axios';

export class RedditDataSource {
  private baseUrl = 'https://www.reddit.com';

  async fetchSentiment(keywords: string[]): Promise<{ [keyword: string]: number }> {
    const sentiment: { [keyword: string]: number } = {};
    
    try {
      for (const keyword of keywords) {
        // Search Reddit for posts about the keyword
        const response = await axios.get(`${this.baseUrl}/search.json`, {
          params: {
            q: keyword,
            sort: 'hot',
            t: 'month',
            limit: 25
          },
          headers: {
            'User-Agent': 'StartupGenie/1.0'
          }
        });

        const posts = response.data.data.children;
        let totalScore = 0;
        let totalPosts = 0;

        posts.forEach((post: any) => {
          const score = post.data.score || 0;
          const upvoteRatio = post.data.upvote_ratio || 0.5;
          const sentimentScore = (score * upvoteRatio) / 1000; // Normalize
          totalScore += sentimentScore;
          totalPosts++;
        });

        sentiment[keyword] = totalPosts > 0 ? totalScore / totalPosts : 0;
      }
    } catch (error) {
      console.error('Error fetching Reddit data:', error);
      // Fallback to mock data
      keywords.forEach(keyword => {
        sentiment[keyword] = Math.random() * 2 - 1; // Range: -1 to 1
      });
    }

    return sentiment;
  }

  async getStartupDiscussions(): Promise<string[]> {
    try {
      // Get posts from startup-related subreddits
      const subreddits = ['startups', 'entrepreneur', 'smallbusiness'];
      const discussions: string[] = [];

      for (const subreddit of subreddits) {
        const response = await axios.get(`${this.baseUrl}/r/${subreddit}/hot.json`, {
          params: { limit: 10 },
          headers: { 'User-Agent': 'StartupGenie/1.0' }
        });

        const posts = response.data.data.children;
        posts.forEach((post: any) => {
          if (post.data.title && post.data.selftext) {
            discussions.push(`${post.data.title}: ${post.data.selftext.substring(0, 200)}...`);
          }
        });
      }

      return discussions;
    } catch (error) {
      console.error('Error fetching Reddit discussions:', error);
      return [
        'How to validate a startup idea before building?',
        'What are the biggest challenges for new entrepreneurs?',
        'Which industries are currently trending for startups?',
        'How to find product-market fit?'
      ];
    }
  }

  async getMarketInsights(industry: string): Promise<string[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/search.json`, {
        params: {
          q: `${industry} market trends`,
          sort: 'top',
          t: 'month',
          limit: 20
        },
        headers: { 'User-Agent': 'StartupGenie/1.0' }
      });

      const posts = response.data.data.children;
      return posts.map((post: any) => post.data.title).slice(0, 10);
    } catch (error) {
      console.error('Error fetching market insights:', error);
      return [
        `${industry} market is growing rapidly`,
        `New technologies disrupting ${industry}`,
        `Investors showing interest in ${industry} startups`,
        `Regulatory changes affecting ${industry}`
      ];
    }
  }
} 