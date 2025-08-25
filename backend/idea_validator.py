from flask import Blueprint, request, jsonify
from typing import Dict, Any, Optional
import os
import requests
from datetime import datetime, timedelta
import pandas as pd
from .business_mappings import get_business_mapping, get_similar_business_ideas
from .llm_service import generate_insights

idea_validator = Blueprint('idea_validator', __name__)

NEWSDATA_API_KEY = os.getenv('NEWSDATA_API_KEY')
SERPAPI_API_KEY = os.getenv('SERPAPI_API_KEY')

def get_news_data(query: str) -> Dict[str, Any]:
    """Get news data from NewsData.io"""
    try:
        url = "https://newsdata.io/api/1/news"
        params = {
            "apikey": NEWSDATA_API_KEY,
            "q": query,
            "language": "en",
            "size": 5
        }
        response = requests.get(url, params=params)
        response.raise_for_status()
        return response.json()
    except Exception as e:
        print(f"Error fetching news data: {str(e)}")
        return {"status": "error", "results": []}

def get_trends_data(query: str) -> Dict[str, Any]:
    """Get trends data from SerpApi (Google Trends)"""
    try:
        url = "https://serpapi.com/search"
        params = {
            "engine": "google_trends",
            "q": query,
            "date": "today 12-m",
            "api_key": SERPAPI_API_KEY
        }
        response = requests.get(url, params=params)
        response.raise_for_status()
        return response.json()
    except Exception as e:
        print(f"Error fetching trends data: {str(e)}")
        return {"interest_over_time": []}

@idea_validator.route('/validate', methods=['POST'])
def validate_idea():
    try:
        data = request.get_json()
        business_idea = data.get('business_idea', '')
        target_market = data.get('target_market', '')
        location = data.get('location', '')
        budget = data.get('budget', '')
        business_model = data.get('business_model', '')

        # Get business mapping if available
        business_mapping = get_business_mapping(business_idea)
        similar_ideas = get_similar_business_ideas(business_idea)

        # Get news and trends data
        news_data = get_news_data(business_idea)
        trends_data = get_trends_data(business_idea)

        # Prepare context for LLM
        context = {
            "business_idea": business_idea,
            "target_market": target_market,
            "location": location,
            "budget": budget,
            "business_model": business_model,
            "has_real_data": bool(business_mapping),
            "similar_ideas": similar_ideas
        }

        if business_mapping:
            # Use real company data
            example_companies = [
                {
                    "name": company.name,
                    "founded_year": company.founded_year,
                    "funding": company.funding_amount,
                    "description": company.description,
                    "website": company.website,
                    "news_url": company.news_url,
                    "market_size": company.market_size,
                    "key_metrics": company.key_metrics
                }
                for company in business_mapping.example_companies
            ]
            
            # Generate recommendations based on the business mapping and context
            recommendations = [
                f"Focus on {target_market} in {location} with a budget of {budget}",
                "Leverage technology for efficient delivery and customer experience",
                "Build strong relationships with local restaurants and vendors",
                "Implement a robust quality control and food safety system",
                "Develop a unique value proposition to differentiate from competitors"
            ]
            
            response_data = {
                "status": "success",
                "data": {
                    "category": business_mapping.category,
                    "description": business_mapping.description,
                    "example_companies": example_companies,
                    "market_trends": business_mapping.market_trends,
                    "common_challenges": business_mapping.common_challenges,
                    "success_factors": business_mapping.success_factors,
                    "news": news_data.get("results", []),
                    "trends": trends_data.get("interest_over_time", []),
                    "data_source": "real_companies",
                    "market_data": business_mapping.market_data,
                    "recommendations": recommendations
                }
            }
        else:
            # Generate AI insights
            ai_insights = generate_insights(context)
            
            # Add market data for visualization
            market_data = {
                "monthly_growth": [
                    {"month": "Jan 2023", "value": 100},
                    {"month": "Feb 2023", "value": 110},
                    {"month": "Mar 2023", "value": 120},
                    {"month": "Apr 2023", "value": 130},
                    {"month": "May 2023", "value": 140},
                    {"month": "Jun 2023", "value": 150}
                ],
                "market_share": [
                    {"company": "Market Leader", "value": 40},
                    {"company": "Second Player", "value": 30},
                    {"company": "Others", "value": 30}
                ],
                "user_demographics": [
                    {"age": "18-24", "value": 30},
                    {"age": "25-34", "value": 35},
                    {"age": "35-44", "value": 20},
                    {"age": "45+", "value": 15}
                ]
            }
            
            response_data = {
                "status": "success",
                "data": {
                    "category": ai_insights.get("category", "Unknown"),
                    "description": ai_insights.get("description", ""),
                    "example_companies": ai_insights.get("example_companies", []),
                    "market_trends": ai_insights.get("market_trends", []),
                    "common_challenges": ai_insights.get("common_challenges", []),
                    "success_factors": ai_insights.get("success_factors", []),
                    "news": news_data.get("results", []),
                    "trends": trends_data.get("interest_over_time", []),
                    "data_source": "ai_generated",
                    "similar_ideas": similar_ideas,
                    "market_data": market_data,
                    "recommendations": ai_insights.get("recommendations", [])
                }
            }

        return jsonify(response_data)

    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500 