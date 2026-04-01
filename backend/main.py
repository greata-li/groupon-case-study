import json
import uuid
from datetime import datetime
from pathlib import Path
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

CONFIG_DIR = Path(__file__).parent / "app" / "config"
DATA_DIR = Path(__file__).parent / "app" / "data"


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Load endpoint configs on startup
    app.state.endpoint_configs = load_all_configs()
    app.state.benchmark_data = load_benchmark_data()
    app.state.deals = load_deals()
    yield


app = FastAPI(
    title="Groupon AI Deal Creator — Pipeline API",
    description="Admin and pipeline API for the AI-powered merchant deal creator",
    version="0.1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --- Helpers ---

def load_all_configs() -> dict:
    """Load all endpoint config JSON files from the config directory."""
    configs = {}
    for config_file in CONFIG_DIR.glob("*.json"):
        with open(config_file) as f:
            configs[config_file.stem] = json.load(f)
    return configs


def load_benchmark_data() -> dict:
    """Load synthetic benchmark data."""
    benchmark_path = DATA_DIR / "benchmarks.json"
    if benchmark_path.exists():
        with open(benchmark_path) as f:
            return json.load(f)
    return {}


def save_config(endpoint_id: str, config: dict):
    """Save an endpoint config to disk."""
    config_path = CONFIG_DIR / f"{endpoint_id}.json"
    with open(config_path, "w") as f:
        json.dump(config, f, indent=2)


def save_benchmark_data(data: dict):
    """Save benchmark data to disk."""
    benchmark_path = DATA_DIR / "benchmarks.json"
    with open(benchmark_path, "w") as f:
        json.dump(data, f, indent=2)


DEALS_PATH = DATA_DIR / "deals.json"


def load_deals() -> list:
    """Load published deals from disk."""
    if DEALS_PATH.exists():
        with open(DEALS_PATH) as f:
            return json.load(f)
    return []


def save_deals(deals: list):
    """Save published deals to disk."""
    with open(DEALS_PATH, "w") as f:
        json.dump(deals, f, indent=2)


# --- Models ---

class EndpointConfigUpdate(BaseModel):
    system_prompt: str | None = None
    model: str | None = None
    temperature: float | None = None
    max_tokens: int | None = None
    provider: str | None = None


class TestRunRequest(BaseModel):
    endpoint_id: str
    input_data: dict


class MerchantIntake(BaseModel):
    business_name: str
    business_description: str
    location: str
    services: str  # free-text or structured: "Brazilian wax $65, Lash lift $85"
    additional_info: str = ""


class SuggestServicesRequest(BaseModel):
    business_description: str
    location: str


# --- Admin Routes: Endpoint Configs ---

@app.get("/api/endpoints")
async def list_endpoints():
    """List all pipeline endpoints with their configs."""
    return app.state.endpoint_configs


@app.get("/api/endpoints/{endpoint_id}")
async def get_endpoint(endpoint_id: str):
    """Get a single endpoint config."""
    configs = app.state.endpoint_configs
    if endpoint_id not in configs:
        raise HTTPException(status_code=404, detail=f"Endpoint '{endpoint_id}' not found")
    return configs[endpoint_id]


@app.put("/api/endpoints/{endpoint_id}")
async def update_endpoint(endpoint_id: str, update: EndpointConfigUpdate):
    """Update an endpoint's config (system prompt, model, temperature, etc.)."""
    configs = app.state.endpoint_configs
    if endpoint_id not in configs:
        raise HTTPException(status_code=404, detail=f"Endpoint '{endpoint_id}' not found")

    config = configs[endpoint_id]
    update_data = update.model_dump(exclude_none=True)
    config.update(update_data)
    configs[endpoint_id] = config

    save_config(endpoint_id, config)
    return config


# --- Admin Routes: Benchmark Data ---

@app.get("/api/benchmarks")
async def get_benchmarks():
    """Get all synthetic benchmark data."""
    return app.state.benchmark_data


@app.put("/api/benchmarks")
async def update_benchmarks(data: dict):
    """Update benchmark data."""
    app.state.benchmark_data = data
    save_benchmark_data(data)
    return data


# --- Admin Routes: Test Panel ---

@app.post("/api/test")
async def test_endpoint(request: TestRunRequest):
    """Run a pipeline endpoint with test input and return the output."""
    configs = app.state.endpoint_configs
    if request.endpoint_id not in configs:
        raise HTTPException(
            status_code=404,
            detail=f"Endpoint '{request.endpoint_id}' not found",
        )

    config = configs[request.endpoint_id]

    # Import and run the appropriate endpoint handler
    from app.endpoints.pipeline import run_endpoint

    result = await run_endpoint(request.endpoint_id, config, request.input_data)
    return result


# --- Merchant: Service Suggestions ---

@app.post("/api/pipeline/suggest-services")
async def suggest_services(request: SuggestServicesRequest):
    """
    Lightweight call during intake: suggests services based on business description.
    Used between Step 2 and Step 4 to pre-populate the service picker.
    """
    from app.endpoints.pipeline import run_endpoint

    configs = app.state.endpoint_configs
    if "service_suggester" not in configs:
        raise HTTPException(status_code=404, detail="Service suggester not configured")

    result = await run_endpoint(
        "service_suggester",
        configs["service_suggester"],
        {
            "business_description": request.business_description,
            "location": request.location,
        },
    )
    return result


# --- Merchant Pipeline ---

@app.post("/api/pipeline/generate")
async def generate_deal(intake: MerchantIntake):
    """
    Full pipeline: takes Sofia's 5-question intake and produces a complete deal.
    Chains: Business Classifier → Market Intelligence → Deal Generator
    """
    from app.endpoints.pipeline import run_endpoint

    configs = app.state.endpoint_configs

    # Step 1: Classify the business
    classifier_result = await run_endpoint(
        "business_classifier",
        configs["business_classifier"],
        {
            "business_description": intake.business_description,
            "location": intake.location,
        },
    )
    classification = classifier_result.get("output", {})

    # Step 2: Market intelligence
    market_result = await run_endpoint(
        "market_intelligence",
        configs["market_intelligence"],
        {
            "category": classification.get("category", "Beauty & Spas"),
            "location": intake.location,
            "services": intake.services,
            "prices": intake.services,  # raw text — LLM will parse
        },
    )
    market_data = market_result.get("output", {})

    # Step 3: Generate the deal
    deal_result = await run_endpoint(
        "deal_generator",
        configs["deal_generator"],
        {
            "business_name": intake.business_name,
            "business_description": intake.business_description,
            "location": intake.location,
            "services": intake.services,
            "additional_info": intake.additional_info,
            "classification": classification,
            "market_data": market_data,
        },
    )

    return {
        "deal": deal_result.get("output", {}),
        "pipeline_steps": {
            "classification": {
                "output": classification,
                "model": classifier_result.get("model"),
                "latency_ms": classifier_result.get("latency_ms"),
            },
            "market_intelligence": {
                "output": market_data,
                "model": market_result.get("model"),
                "latency_ms": market_result.get("latency_ms"),
            },
            "deal_generation": {
                "output": deal_result.get("output", {}),
                "model": deal_result.get("model"),
                "latency_ms": deal_result.get("latency_ms"),
            },
        },
        "total_latency_ms": sum(
            r.get("latency_ms", 0)
            for r in [classifier_result, market_result, deal_result]
        ),
    }


# --- Business Profile (persisted to JSON file) ---

PROFILE_PATH = DATA_DIR / "profile.json"


def load_profile() -> dict:
    if PROFILE_PATH.exists():
        with open(PROFILE_PATH) as f:
            return json.load(f)
    return {}


def save_profile(profile: dict):
    with open(PROFILE_PATH, "w") as f:
        json.dump(profile, f, indent=2)


@app.get("/api/profile")
async def get_profile():
    return load_profile()


@app.put("/api/profile")
async def update_profile(profile: dict):
    save_profile(profile)
    return profile


# --- Story Extractor (conversational onboarding) ---

class StoryRequest(BaseModel):
    story: str
    follow_up_answers: list[str] = []  # answers to previous follow-up questions


@app.post("/api/pipeline/extract-story")
async def extract_story(request: StoryRequest):
    """
    Core AI endpoint: takes a merchant's free-form story and extracts
    a complete structured business profile + services.
    One call replaces 6+ form screens.
    """
    from app.endpoints.pipeline import call_claude, parse_json_response

    combined_input = request.story
    if request.follow_up_answers:
        combined_input += "\n\nAdditional details:\n" + "\n".join(request.follow_up_answers)

    config = {
        "model": "claude-sonnet-4-20250514",
        "max_tokens": 2048,
        "temperature": 0.3,
        "system_prompt": (
            "You are a business intake specialist for Groupon's AI-powered merchant onboarding.\n\n"
            "Extract structured business information from a merchant's free-form description. "
            "The merchant may speak casually, mention things out of order, or be brief. "
            "Extract everything you can and infer reasonable values for what's missing.\n\n"
            "Return ONLY valid JSON with this structure:\n"
            "{\n"
            '  "business_name": "string or null",\n'
            '  "business_description": "2-3 professional sentences about the business",\n'
            '  "location": "city/neighborhood or null",\n'
            '  "full_address": "street address if mentioned, or null",\n'
            '  "phone": "phone number if mentioned, or null",\n'
            '  "website": "website if mentioned, or null",\n'
            '  "category": "Main Category > Subcategory (e.g., Health, Beauty & Wellness > Waxing)",\n'
            '  "category_confidence": 0.0-1.0,\n'
            '  "services": [\n'
            '    { "name": "Service Name", "price": 65 }\n'
            '  ],\n'
            '  "scheduling_insight": "when they want to fill slots, or null",\n'
            '  "experience_years": number or null,\n'
            '  "business_type": "sole_provider | independent_contractor | company | third_party",\n'
            '  "highlights": ["key selling point 1", "key selling point 2", "key selling point 3"],\n'
            '  "missing_fields": ["list of important fields that could not be extracted"],\n'
            '  "follow_up_questions": ["question to ask if key info is missing"]\n'
            "}\n\n"
            "Rules:\n"
            "- Always generate a business_description even if brief — write a professional version of what they said\n"
            "- Always detect category with confidence score\n"
            "- Extract every service with price mentioned\n"
            "- If they mention slow days, capture as scheduling_insight\n"
            "- Generate 3 highlights from what they described\n"
            "- missing_fields: only list truly critical missing info (business_name, location, services)\n"
            "- follow_up_questions: ask 1-3 targeted questions for missing critical info. "
            "Don't ask for things you can infer. Be conversational, not formal.\n"
            "- If everything important is captured, return empty follow_up_questions array"
        ),
    }

    raw = await call_claude(config, combined_input)

    try:
        extracted = parse_json_response(raw)
    except (json.JSONDecodeError, ValueError):
        extracted = {"raw_response": raw, "parse_error": True}

    # Auto-save extracted data to profile
    if not extracted.get("parse_error"):
        profile = load_profile()
        for key in ["business_name", "business_description", "location", "full_address",
                     "phone", "website", "category", "services", "scheduling_insight",
                     "experience_years", "business_type", "highlights"]:
            val = extracted.get(key)
            if val is not None:
                profile[key] = val
        profile["onboarded"] = True
        save_profile(profile)

    return extracted


# --- AI Text Enhancement ---

class EnhanceTextRequest(BaseModel):
    text: str
    field_type: str  # "highlights" | "description" | "business_description"
    context: dict = {}  # business name, category, etc.


@app.post("/api/pipeline/enhance-text")
async def enhance_text(request: EnhanceTextRequest):
    """AI 'Inspire Me' / 'Share More Details' — enhances or generates text for any field."""
    from app.endpoints.pipeline import call_claude

    prompts = {
        "highlights": "Write 3-5 punchy highlight bullet points for a Groupon deal. Business context: {context}. Current text (improve or generate from scratch if empty): {text}. Return ONLY a JSON array of strings.",
        "description": "Write a compelling 2-3 sentence description for a Groupon deal option. Business context: {context}. Current text (improve or expand if provided, generate if empty): {text}. Return ONLY the description text, no JSON.",
        "business_description": "Write a professional 2-3 sentence business description for a Groupon merchant page. Business context: {context}. Current text (improve if provided, generate if empty): {text}. Return ONLY the description text, no JSON.",
    }

    prompt_template = prompts.get(request.field_type, prompts["description"])
    user_message = prompt_template.format(
        context=json.dumps(request.context),
        text=request.text or "(empty — generate from scratch)",
    )

    config = {
        "model": "claude-haiku-4-5-20251001",
        "max_tokens": 512,
        "temperature": 0.6,
        "system_prompt": "You are a marketing copywriter for Groupon. Write warm, professional, conversion-focused copy. Be concise.",
    }

    raw = await call_claude(config, user_message)
    return {"enhanced_text": raw, "field_type": request.field_type}


# --- Deals (persisted to JSON file) ---

class PublishDealRequest(BaseModel):
    deal: dict
    intake: dict
    contact: dict | None = None


@app.post("/api/deals")
async def publish_deal(request: PublishDealRequest):
    """Publish a deal — saves to disk so it persists across restarts."""
    deal_record = {
        "id": str(uuid.uuid4()),
        "deal": request.deal,
        "intake": request.intake,
        "contact": request.contact or {},
        "published_at": datetime.now().isoformat(),
        "status": "active",
    }
    app.state.deals.insert(0, deal_record)
    save_deals(app.state.deals)
    return deal_record


@app.get("/api/deals")
async def list_deals():
    """List all published deals."""
    return app.state.deals


@app.get("/api/deals/{deal_id}")
async def get_deal(deal_id: str):
    """Get a single deal by ID."""
    for d in app.state.deals:
        if d["id"] == deal_id:
            return d
    raise HTTPException(status_code=404, detail="Deal not found")


@app.delete("/api/deals/{deal_id}")
async def delete_deal(deal_id: str):
    """Delete a deal."""
    app.state.deals = [d for d in app.state.deals if d["id"] != deal_id]
    save_deals(app.state.deals)
    return {"deleted": deal_id}


# --- Health ---

@app.get("/api/health")
async def health():
    return {
        "status": "ok",
        "endpoints": list(app.state.endpoint_configs.keys()),
        "deals_count": len(app.state.deals),
    }
