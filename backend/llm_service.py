import os
import re
import json
import requests
from typing import Dict, Any

HUGGINGFACE_API_KEY = os.getenv('HUGGINGFACE_API_KEY')
API_URL = "https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta"

def generate_insights(context: Dict[str, Any]) -> Dict[str, Any]:
    """
    Generates structured startup insights by forcing the LLM to output a valid JSON scheme
    including actionable recommendations, handling decoding with a fallback safety state.
    """
    prompt = f"""You are an elite business intelligence system. Evaluate the following business criteria and return a valid JSON object.

Business Idea: {context.get('business_idea', '')}
Target Market: {context.get('target_market', '')}
Location: {context.get('location', '')}
Budget: {context.get('budget', '')}
Business Model: {context.get('business_model', '')}

CRITICAL: Return ONLY a JSON object wrapped inside a ```json ... ``` block matching this structure:
{{
  "category": "String",
  "description": "String",
  "example_companies": [
    {{"name": "Company A", "description": "Why they match"}}
  ],
  "market_trends": ["Trend 1", "Trend 2"],
  "common_challenges": ["Challenge 1"],
  "success_factors": ["Factor 1"],
  "recommendations": ["Actionable Rec 1", "Actionable Rec 2"]
}}
Do not write conversational introductions or conversational text after the code block."""

    fallback_response = {
        "category": "Unknown",
        "description": "Unable to safely parse generated analysis structural data.",
        "example_companies": [],
        "market_trends": [],
        "common_challenges": [],
        "success_factors": [],
        "recommendations": []
    }

    if not HUGGINGFACE_API_KEY:
        print("Warning: Missing HUGGINGFACE_API_KEY environment variable.")

    try:
        headers = {
            "Authorization": f"Bearer {HUGGINGFACE_API_KEY}",
            "Content-Type": "application/json"
        }
        
        response = requests.post(API_URL, headers=headers, json={"inputs": prompt, "parameters": {"temperature": 0.3}}, timeout=15)
        response.raise_for_status()
        
        llm_output = response.json()
        generated_text = llm_output[0].get('generated_text', '') if isinstance(llm_output, list) else llm_output.get('generated_text', '')

        # Isolate the JSON block via regex
        json_match = re.search(r"```json\s*(\{.*?\})\s*```", generated_text, re.DOTALL)
        if not json_match:
            json_match = re.search(r"(\{.*?\})", generated_text, re.DOTALL)

        if json_match:
            parsed_data = json.loads(json_match.group(1))
            
            # Schema integrity fallback check including recommendations
            for field in ["category", "description", "example_companies", "market_trends", "common_challenges", "success_factors", "recommendations"]:
                if field not in parsed_data:
                    parsed_data[field] = fallback_response[field]
            return parsed_data
            
        print("Failed to isolate JSON schema in LLM response text.")
        return fallback_response

    except Exception as e:
        print(f"Error executing insights pipeline: {str(e)}")
        return fallback_response
