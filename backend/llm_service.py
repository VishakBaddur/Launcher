from typing import Dict, Any
import os
import requests
from datetime import datetime

HUGGINGFACE_API_KEY = os.getenv('HUGGINGFACE_API_KEY')
API_URL = "https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta"

def generate_insights(context: Dict[str, Any]) -> Dict[str, Any]:
    """
    Generate business insights using the LLM.
    """
    business_idea = context.get('business_idea', '')
    target_market = context.get('target_market', '')
    location = context.get('location', '')
    budget = context.get('budget', '')
    business_model = context.get('business_model', '')
    has_real_data = context.get('has_real_data', False)
    similar_ideas = context.get('similar_ideas', [])

    # Construct the prompt
    prompt = f"""You are a business analyst helping evaluate a new business idea. Please provide detailed insights based on the following information:

Business Idea: {business_idea}
Target Market: {target_market}
Location: {location}
Budget: {budget}
Business Model: {business_model}

{f'Similar Business Ideas: {", ".join(similar_ideas)}' if similar_ideas else ''}

Please provide a structured analysis including:
1. Business Category
2. Brief Description
3. Example Companies (if any similar businesses exist)
4. Market Trends
5. Common Challenges
6. Success Factors

Focus on providing actionable insights and real-world examples. If you're unsure about specific data, clearly indicate that the information is an estimate or general guidance."""

    try:
        headers = {
            "Authorization": f"Bearer {HUGGINGFACE_API_KEY}",
            "Content-Type": "application/json"
        }
        
        response = requests.post(
            API_URL,
            headers=headers,
            json={"inputs": prompt}
        )
        response.raise_for_status()
        
        # Parse the LLM response
        llm_response = response.json()
        generated_text = llm_response[0].get('generated_text', '')
        
        # Extract structured data from the LLM response
        # This is a simplified parser - you might want to make it more robust
        sections = generated_text.split('\n\n')
        insights = {
            "category": "Unknown",
            "description": "",
            "example_companies": [],
            "market_trends": [],
            "common_challenges": [],
            "success_factors": []
        }
        
        current_section = None
        for section in sections:
            if "Business Category:" in section:
                insights["category"] = section.split("Business Category:")[1].strip()
            elif "Brief Description:" in section:
                insights["description"] = section.split("Brief Description:")[1].strip()
            elif "Example Companies:" in section:
                companies_text = section.split("Example Companies:")[1].strip()
                insights["example_companies"] = [
                    {"name": company.strip(), "description": "Similar business model"}
                    for company in companies_text.split('\n')
                    if company.strip()
                ]
            elif "Market Trends:" in section:
                trends_text = section.split("Market Trends:")[1].strip()
                insights["market_trends"] = [
                    trend.strip()
                    for trend in trends_text.split('\n')
                    if trend.strip()
                ]
            elif "Common Challenges:" in section:
                challenges_text = section.split("Common Challenges:")[1].strip()
                insights["common_challenges"] = [
                    challenge.strip()
                    for challenge in challenges_text.split('\n')
                    if challenge.strip()
                ]
            elif "Success Factors:" in section:
                factors_text = section.split("Success Factors:")[1].strip()
                insights["success_factors"] = [
                    factor.strip()
                    for factor in factors_text.split('\n')
                    if factor.strip()
                ]
        
        return insights

    except Exception as e:
        print(f"Error generating insights: {str(e)}")
        return {
            "category": "Unknown",
            "description": "Unable to generate insights at this time.",
            "example_companies": [],
            "market_trends": [],
            "common_challenges": [],
            "success_factors": []
        } 