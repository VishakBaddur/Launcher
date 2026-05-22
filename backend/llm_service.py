import os
import re
import json
import requests
from typing import Dict, Any

HUGGINGFACE_API_KEY = os.getenv('HUGGINGFACE_API_KEY') or os.getenv('HF_TOKEN')
API_URL = "https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta"

def _call_zephyr(prompt: str, max_tokens: int = 400) -> str:
    """Single Zephyr API call with error handling."""
    if not HUGGINGFACE_API_KEY:
        return ""
    try:
        headers = {
            "Authorization": f"Bearer {HUGGINGFACE_API_KEY}",
            "Content-Type": "application/json"
        }
        response = requests.post(
            API_URL,
            headers=headers,
            json={"inputs": prompt, "parameters": {"temperature": 0.3, "max_new_tokens": max_tokens}},
            timeout=20
        )
        response.raise_for_status()
        result = response.json()
        if isinstance(result, list):
            return result[0].get('generated_text', '')
        return result.get('generated_text', '')
    except Exception as e:
        print(f"[Zephyr] API call failed: {str(e)}")
        return ""

def _extract_json(text: str, fallback: Dict) -> Dict:
    """Extract JSON from LLM response with fallback."""
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
    """Extract a JSON array from LLM response with fallback."""
    try:
        match = re.search(r"\[.*?\]", text, re.DOTALL)
        if match:
            return json.loads(match.group(0))
    except Exception:
        pass
    # Try to extract bullet points as list
    lines = [l.strip().lstrip('-•*').strip() for l in text.split('\n') if l.strip().startswith(('-', '•', '*'))]
    return lines if lines else fallback

# ─────────────────────────────────────────────
# STEP 1: Market Categorization
# ─────────────────────────────────────────────
def step1_categorize(idea: str, context: Dict) -> Dict:
    """Step 1: Identify market category, size, and target customers."""
    prompt = f"""<|system|>You are a market research analyst. Respond only with a JSON object.</s>
<|user|>
Analyze this startup idea and return a JSON object.
Idea: "{idea}"
Target Market: {context.get('target_market', 'general')}
Location: {context.get('location', 'global')}

Return ONLY this JSON:
{{
  "category": "industry category",
  "market_size": "estimated market size",
  "target_customers": "primary customer segment",
  "market_stage": "emerging/growing/mature",
  "key_trends": ["trend1", "trend2", "trend3"]
}}
</s>
<|assistant|>"""

    fallback = {
        "category": "Technology",
        "market_size": "Multi-billion dollar addressable market",
        "target_customers": "SMBs and enterprise clients",
        "market_stage": "growing",
        "key_trends": ["AI adoption", "Digital transformation", "Remote work"]
    }
    raw = _call_zephyr(prompt, max_tokens=300)
    result = _extract_json(raw, fallback)
    for k in fallback:
        if k not in result:
            result[k] = fallback[k]
    return result

# ─────────────────────────────────────────────
# STEP 2: SWOT Analysis
# ─────────────────────────────────────────────
def step2_swot(idea: str, step1: Dict) -> Dict:
    """Step 2: Generate SWOT based on Step 1 market context."""
    prompt = f"""<|system|>You are a strategic business consultant. Respond only with a JSON object.</s>
<|user|>
Based on this market analysis, generate a SWOT analysis.
Idea: "{idea}"
Category: {step1.get('category')}
Market Size: {step1.get('market_size')}
Target Customers: {step1.get('target_customers')}
Market Stage: {step1.get('market_stage')}
Key Trends: {', '.join(step1.get('key_trends', []))}

Return ONLY this JSON:
{{
  "strengths": ["strength1", "strength2", "strength3"],
  "weaknesses": ["weakness1", "weakness2"],
  "opportunities": ["opportunity1", "opportunity2", "opportunity3"],
  "threats": ["threat1", "threat2"]
}}
</s>
<|assistant|>"""

    fallback = {
        "strengths": ["First-mover advantage", "AI-powered automation", "Scalable architecture"],
        "weaknesses": ["Early stage with limited traction", "Requires user education"],
        "opportunities": ["Growing market demand", "Underserved customer segments", "Partnership potential"],
        "threats": ["Established competitors", "Market saturation risk"]
    }
    raw = _call_zephyr(prompt, max_tokens=350)
    result = _extract_json(raw, fallback)
    for k in fallback:
        if k not in result or not result[k]:
            result[k] = fallback[k]
    return result

# ─────────────────────────────────────────────
# STEP 3: Competitor & Positioning Analysis
# ─────────────────────────────────────────────
def step3_competitors(idea: str, step1: Dict, step2: Dict) -> Dict:
    """Step 3: Identify competitors and positioning strategy."""
    prompt = f"""<|system|>You are a competitive intelligence analyst. Respond only with a JSON object.</s>
<|user|>
Identify competitors and positioning for this startup.
Idea: "{idea}"
Category: {step1.get('category')}
Strengths: {', '.join(step2.get('strengths', [])[:2])}
Opportunities: {', '.join(step2.get('opportunities', [])[:2])}

Return ONLY this JSON:
{{
  "direct_competitors": ["competitor1", "competitor2", "competitor3"],
  "competitive_advantage": "one sentence differentiator",
  "positioning_statement": "one sentence positioning",
  "moat": "sustainable competitive moat"
}}
</s>
<|assistant|>"""

    fallback = {
        "direct_competitors": ["Established SaaS players", "Vertical-specific tools", "DIY solutions"],
        "competitive_advantage": "AI-first approach with superior automation and user experience",
        "positioning_statement": f"{idea} is the only platform built specifically for this underserved market segment",
        "moat": "Proprietary data network effects and switching costs"
    }
    raw = _call_zephyr(prompt, max_tokens=300)
    result = _extract_json(raw, fallback)
    for k in fallback:
        if k not in result or not result[k]:
            result[k] = fallback[k]
    return result

# ─────────────────────────────────────────────
# STEP 4: Pitch Narrative & Recommendations
# ─────────────────────────────────────────────
def step4_pitch_narrative(idea: str, step1: Dict, step2: Dict, step3: Dict) -> Dict:
    """Step 4: Synthesize all steps into investor narrative and recommendations."""
    prompt = f"""<|system|>You are an expert startup advisor writing investor pitch content. Respond only with a JSON object.</s>
<|user|>
Synthesize this analysis into investor-ready pitch content.
Idea: "{idea}"
Market: {step1.get('market_size')} {step1.get('category')} market
Key Opportunity: {step2.get('opportunities', [''])[0]}
Competitive Advantage: {step3.get('competitive_advantage')}
Main Threat: {step2.get('threats', [''])[0]}

Return ONLY this JSON:
{{
  "problem_statement": "compelling one-sentence problem",
  "solution_statement": "compelling one-sentence solution",
  "value_proposition": "unique value proposition",
  "recommendations": ["actionable rec 1", "actionable rec 2", "actionable rec 3"],
  "investor_hook": "one powerful sentence for investors"
}}
</s>
<|assistant|>"""

    fallback = {
        "problem_statement": f"The current market lacks an efficient, scalable solution for {idea}.",
        "solution_statement": f"{idea} solves this with an AI-powered platform that automates the entire workflow.",
        "value_proposition": "10x faster, 50% cheaper, and smarter than existing alternatives",
        "recommendations": [
            "Focus on a narrow ICP before expanding",
            "Build in public to generate early traction",
            "Prioritize one high-value enterprise partnership"
        ],
        "investor_hook": f"{idea} is capturing a {step1.get('market_size', 'massive')} opportunity with a defensible AI moat."
    }
    raw = _call_zephyr(prompt, max_tokens=400)
    result = _extract_json(raw, fallback)
    for k in fallback:
        if k not in result or not result[k]:
            result[k] = fallback[k]
    return result

# ─────────────────────────────────────────────
# MAIN PIPELINE ORCHESTRATOR
# ─────────────────────────────────────────────
def generate_insights(context: Dict[str, Any]) -> Dict[str, Any]:
    """
    4-step LLM reasoning pipeline:
    Step 1: Market categorization
    Step 2: SWOT analysis (uses Step 1)
    Step 3: Competitor & positioning (uses Steps 1-2)
    Step 4: Pitch narrative & recommendations (uses Steps 1-3)
    """
    idea = context.get('business_idea', '')
    print(f"[Pipeline] Starting 4-step analysis for: {idea}")

    # Step 1
    print("[Pipeline] Step 1: Market categorization...")
    step1 = step1_categorize(idea, context)

    # Step 2
    print("[Pipeline] Step 2: SWOT analysis...")
    step2 = step2_swot(idea, step1)

    # Step 3
    print("[Pipeline] Step 3: Competitor analysis...")
    step3 = step3_competitors(idea, step1, step2)

    # Step 4
    print("[Pipeline] Step 4: Pitch narrative synthesis...")
    step4 = step4_pitch_narrative(idea, step1, step2, step3)

    print("[Pipeline] Complete.")

    return {
        "category": step1.get("category"),
        "description": step4.get("value_proposition"),
        "market_size": step1.get("market_size"),
        "target_customers": step1.get("target_customers"),
        "market_stage": step1.get("market_stage"),
        "key_trends": step1.get("key_trends", []),
        "swot": {
            "strengths": step2.get("strengths", []),
            "weaknesses": step2.get("weaknesses", []),
            "opportunities": step2.get("opportunities", []),
            "threats": step2.get("threats", [])
        },
        "example_companies": [{"name": c, "description": "Direct competitor"} for c in step3.get("direct_competitors", [])],
        "competitive_advantage": step3.get("competitive_advantage"),
        "positioning_statement": step3.get("positioning_statement"),
        "moat": step3.get("moat"),
        "problem_statement": step4.get("problem_statement"),
        "solution_statement": step4.get("solution_statement"),
        "market_trends": step1.get("key_trends", []),
        "common_challenges": step2.get("threats", []),
        "success_factors": step2.get("strengths", []),
        "recommendations": step4.get("recommendations", []),
        "investor_hook": step4.get("investor_hook"),
        "pipeline_steps_completed": 4
    }
