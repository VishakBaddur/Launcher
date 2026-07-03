import os
import re
import json
import requests
from typing import Dict, Any

GROQ_API_KEY = os.getenv('GROQ_API_KEY')
GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"
GROQ_MODEL = "llama-3.1-70b-versatile"

try:
    from rag_service import get_rag_service
    RAG_ENABLED = True
except Exception:
    RAG_ENABLED = False

def _call_llm(prompt: str, max_tokens: int = 1000) -> str:
    if not GROQ_API_KEY:
        print("[Groq] No API key found")
        return ""
    try:
        headers = {
            "Authorization": f"Bearer {GROQ_API_KEY}",
            "Content-Type": "application/json"
        }
        payload = {
            "model": GROQ_MODEL,
            "messages": [{"role": "user", "content": prompt}],
            "max_tokens": max_tokens,
            "temperature": 0.4,
        }
        response = requests.post(GROQ_API_URL, headers=headers, json=payload, timeout=30)
        response.raise_for_status()
        result = response.json()
        return result["choices"][0]["message"]["content"]
    except Exception as e:
        print(f"[Groq] API call failed: {str(e)}")
        return ""

def _extract_json(text: str, fallback: Dict) -> Dict:
    try:
        json_match = re.search(r"```json\s*(\{.*?\})\s*```", text, re.DOTALL)
        if not json_match:
            json_match = re.search(r"(\{.*\})", text, re.DOTALL)
        if json_match:
            return json.loads(json_match.group(1))
    except Exception:
        pass
    return fallback

def _extract_list(text: str, fallback: list) -> list:
    try:
        match = re.search(r"\[.*?\]", text, re.DOTALL)
        if match:
            return json.loads(match.group(0))
    except Exception:
        pass
    return fallback

def analyze_idea(idea: str) -> Dict[str, Any]:
    rag_context = ""
    if RAG_ENABLED:
        try:
            rag = get_rag_service()
            similar = rag.retrieve_similar(idea, n_results=2)
            if similar:
                rag_context = f"\nRelevant past analyses for context:\n{json.dumps(similar, indent=2)}\n"
        except Exception:
            pass

    # Step 1: Market categorization
    step1_prompt = f"""You are a startup analyst. Analyze this business idea and return ONLY a JSON object.

Business idea: {idea}
{rag_context}

Return this exact JSON structure:
{{
  "category": "specific industry category",
  "market_size": "estimated market size with numbers",
  "target_customers": "specific target customer description",
  "market_trends": ["trend1", "trend2", "trend3"],
  "timing": "assessment of market timing"
}}"""

    step1_text = _call_llm(step1_prompt, 500)
    step1 = _extract_json(step1_text, {
        "category": "Technology",
        "market_size": "Unknown",
        "target_customers": "General consumers",
        "market_trends": ["Digital transformation"],
        "timing": "Current market conditions are favorable"
    })

    # Step 2: SWOT
    step2_prompt = f"""You are a startup analyst. Based on this business idea and market context, return ONLY a JSON object.

Business idea: {idea}
Market category: {step1.get('category')}
Market size: {step1.get('market_size')}
Target customers: {step1.get('target_customers')}

Return this exact JSON structure:
{{
  "strengths": ["specific strength 1", "specific strength 2", "specific strength 3"],
  "weaknesses": ["specific weakness 1", "specific weakness 2"],
  "opportunities": ["specific opportunity 1", "specific opportunity 2", "specific opportunity 3"],
  "threats": ["specific threat 1", "specific threat 2"]
}}"""

    step2_text = _call_llm(step2_prompt, 500)
    step2 = _extract_json(step2_text, {
        "strengths": ["Novel approach"],
        "weaknesses": ["Unproven market"],
        "opportunities": ["Growing demand"],
        "threats": ["Competition"]
    })

    # Step 3: Competitor positioning
    step3_prompt = f"""You are a startup analyst. Based on this business idea, return ONLY a JSON object.

Business idea: {idea}
Market: {step1.get('category')} - {step1.get('market_size')}
Strengths: {step2.get('strengths')}

Return this exact JSON structure:
{{
  "competitors": ["real competitor 1", "real competitor 2", "real competitor 3"],
  "competitive_advantage": "specific competitive advantage for this idea",
  "positioning_statement": "one sentence positioning statement",
  "moat": "specific defensible moat"
}}"""

    step3_text = _call_llm(step3_prompt, 500)
    step3 = _extract_json(step3_text, {
        "competitors": ["Established players"],
        "competitive_advantage": "Novel approach",
        "positioning_statement": "A better solution for this market",
        "moat": "First mover advantage"
    })

    # Step 4: Pitch narrative
    step4_prompt = f"""You are a startup pitch expert. Based on this complete analysis, return ONLY a JSON object.

Business idea: {idea}
Market: {step1.get('category')}, {step1.get('market_size')}
Target customers: {step1.get('target_customers')}
Key strengths: {step2.get('strengths')}
Competitors: {step3.get('competitors')}
Competitive advantage: {step3.get('competitive_advantage')}

Return this exact JSON structure:
{{
  "investor_hook": "one compelling sentence that makes investors lean forward",
  "summary": "two sentence executive summary",
  "recommendations": ["specific actionable recommendation 1", "specific actionable recommendation 2", "specific actionable recommendation 3"],
  "success_factors": ["key success factor 1", "key success factor 2", "key success factor 3"],
  "example_companies": [{{"name": "relevant company", "description": "why relevant"}}]
}}"""

    step4_text = _call_llm(step4_prompt, 600)
    step4 = _extract_json(step4_text, {
        "investor_hook": f"{idea} addresses a significant market gap.",
        "summary": f"{idea} is an emerging opportunity.",
        "recommendations": ["Validate with customers", "Build MVP", "Find early adopters"],
        "success_factors": ["Strong execution", "Market timing", "Team"],
        "example_companies": []
    })

    result = {
        "summary": step4.get("summary", ""),
        "investor_hook": step4.get("investor_hook", ""),
        "market_trends": step1.get("market_trends", []),
        "swot": step2,
        "competitors": step3.get("competitors", []),
        "competitive_advantage": step3.get("competitive_advantage", ""),
        "positioning_statement": step3.get("positioning_statement", ""),
        "challenges": step2.get("threats", []),
        "success_factors": step4.get("success_factors", []),
        "recommendations": step4.get("recommendations", []),
        "example_companies": [{"name": c["name"], "description": c["description"]} if isinstance(c, dict) else {"name": c, "description": ""} for c in step4.get("example_companies", [])],
        "similarStartups": [],
        "news": [],
        "pipeline_steps_completed": 4,
        "market_size": step1.get("market_size", ""),
        "target_customers": step1.get("target_customers", ""),
        "timing": step1.get("timing", ""),
    }

    if RAG_ENABLED:
        try:
            rag = get_rag_service()
            rag.store_analysis(idea, result)
        except Exception:
            pass

    return result


def generate_insights(data: dict) -> Dict[str, Any]:
    idea = data.get('business_idea', data.get('idea', ''))
    return analyze_idea(idea)

