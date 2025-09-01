# Launcher MCP Server

A Model Context Protocol (MCP) server that provides AI-powered startup insights using free data sources.

## 🚀 Features

- **Free Data Sources**: Uses only free APIs and web scraping
- **Idea Validation**: Analyze startup ideas with market data
- **Business Model Generation**: Create comprehensive business models
- **Pitch Deck Creation**: Generate investor-ready pitch decks
- **Real-time Market Insights**: Google Trends, Reddit sentiment, web scraping

## 📊 Free Data Sources Used

### 1. **Google Trends API** (Completely Free)
- Market trend analysis
- Keyword popularity tracking
- Geographic trend data

### 2. **Reddit API** (Free)
- Community sentiment analysis
- Startup discussions and insights
- Market trend validation

### 3. **Web Scraping** (Free)
- Startup directories (Crunchbase, AngelList, StartupBlink)
- Market size data from industry reports
- Competitor analysis from search results

### 4. **News APIs** (Free Tiers)
- NewsAPI (1,000 requests/day free)
- GNews (100 requests/day free)
- Market trend validation

## 🛠️ Installation

```bash
# Navigate to MCP server directory
cd mcp-server

# Install dependencies
npm install

# Build the project
npm run build

# Start the server
npm start
```

## 🔧 Development

```bash
# Run in development mode
npm run dev

# Run tests
npm test
```

## 📋 Available Tools

### 1. `validate_idea`
Validates a startup idea using market data and trends.

**Input:**
```json
{
  "idea_description": "AI-powered food delivery platform for restaurants"
}
```

**Output:**
```json
{
  "feasibilityScore": 8.5,
  "marketSize": "$136.55 billion",
  "competitionLevel": "High",
  "trends": ["AI is trending (score: 85)", "food delivery is trending (score: 72)"],
  "opportunities": ["High market demand and growing trends"],
  "risks": ["High competition in the market"],
  "recommendations": ["Focus on a specific niche to differentiate from competitors"],
  "similarStartups": [...],
  "marketInsights": {...}
}
```

### 2. `generate_business_model`
Generates a complete business model canvas.

**Input:**
```json
{
  "company_info": {
    "name": "FoodAI",
    "description": "AI-powered food delivery platform"
  }
}
```

### 3. `create_pitch_deck`
Creates investor-ready pitch deck content.

**Input:**
```json
{
  "startup_info": {
    "name": "FoodAI",
    "description": "AI-powered food delivery platform"
  }
}
```

## 🌐 Integration with Launcher

The MCP server integrates seamlessly with your Launcher React application:

```typescript
// In your React app
const validateIdea = async (ideaDescription: string) => {
  const response = await fetch('/api/mcp/validate_idea', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idea_description: ideaDescription })
  });
  return response.json();
};
```

## 🔒 Rate Limiting & Caching

The server implements intelligent caching and rate limiting:

- **Google Trends**: Cached for 24 hours
- **Reddit Data**: Cached for 6 hours
- **Web Scraping**: Cached for 12 hours
- **Rate Limiting**: Respects API limits automatically

## 📈 Data Quality

### Real Data Sources:
- ✅ Google Trends (real-time)
- ✅ Reddit discussions (real-time)
- ✅ Web scraping (real-time)
- ✅ News APIs (real-time)

### Fallback Data:
- 📊 Industry statistics
- 🏢 Startup databases
- 📰 Market reports
- 💡 Expert insights

## 🚀 Deployment

### Local Development:
```bash
npm run dev
```

### Production:
```bash
npm run build
npm start
```

### Docker:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 📝 Environment Variables

```bash
# Optional: Redis for caching (if available)
REDIS_URL=redis://localhost:6379

# Optional: API keys for enhanced features
NEWS_API_KEY=your_news_api_key
REDDIT_CLIENT_ID=your_reddit_client_id
```

## 🔍 Monitoring

The server includes built-in monitoring:

- Request/response logging
- Error tracking
- Performance metrics
- Data source availability

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Add your data source
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - feel free to use this for your own projects!

## 🆘 Support

If you encounter any issues:

1. Check the logs: `npm run dev`
2. Verify data source availability
3. Check rate limits
4. Review the fallback data

---

**Built with ❤️ for the startup community** 