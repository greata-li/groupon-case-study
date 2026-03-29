"""
Pipeline endpoint handlers.
Each endpoint has one job with clear input/output.
Configs (system prompts, model, temperature) are loaded from JSON files
and editable via the admin panel.
"""

import json
import os
import time

import anthropic

client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))


async def run_endpoint(endpoint_id: str, config: dict, input_data: dict) -> dict:
    """Route to the correct endpoint handler and return structured result."""
    handlers = {
        "business_classifier": run_business_classifier,
        "market_intelligence": run_market_intelligence,
        "deal_generator": run_deal_generator,
    }

    handler = handlers.get(endpoint_id)
    if not handler:
        return {"error": f"No handler for endpoint '{endpoint_id}'"}

    start_time = time.time()
    result = await handler(config, input_data)
    elapsed_ms = round((time.time() - start_time) * 1000)

    return {
        "endpoint_id": endpoint_id,
        "model": config.get("model", "unknown"),
        "latency_ms": elapsed_ms,
        "output": result,
    }


async def call_claude(config: dict, user_message: str) -> str:
    """Make a Claude API call using the endpoint's config."""
    response = client.messages.create(
        model=config.get("model", "claude-haiku-4-5-20251001"),
        max_tokens=config.get("max_tokens", 1024),
        temperature=config.get("temperature", 0.3),
        system=config.get("system_prompt", "You are a helpful assistant."),
        messages=[{"role": "user", "content": user_message}],
    )
    return response.content[0].text


async def run_business_classifier(config: dict, input_data: dict) -> dict:
    """
    Endpoint 1: Business Classifier
    Input: business description + location
    Output: category, subcategory, tags, business type
    """
    user_message = json.dumps({
        "business_description": input_data.get("business_description", ""),
        "location": input_data.get("location", ""),
    })

    raw_output = await call_claude(config, user_message)

    try:
        return json.loads(raw_output)
    except json.JSONDecodeError:
        return {"raw_response": raw_output, "parse_error": True}


async def run_market_intelligence(config: dict, input_data: dict) -> dict:
    """
    Endpoint 2: Market Intelligence
    Input: category + location + services + prices
    Output: recommended discount %, price positioning, deal structure advice
    """
    user_message = json.dumps({
        "category": input_data.get("category", ""),
        "location": input_data.get("location", ""),
        "services": input_data.get("services", []),
        "prices": input_data.get("prices", []),
    })

    raw_output = await call_claude(config, user_message)

    try:
        return json.loads(raw_output)
    except json.JSONDecodeError:
        return {"raw_response": raw_output, "parse_error": True}


async def run_deal_generator(config: dict, input_data: dict) -> dict:
    """
    Endpoint 3: Deal Generator
    Input: all merchant input + classified category + market recommendations
    Output: complete deal as structured JSON
    """
    user_message = json.dumps(input_data)

    raw_output = await call_claude(config, user_message)

    try:
        return json.loads(raw_output)
    except json.JSONDecodeError:
        return {"raw_response": raw_output, "parse_error": True}
