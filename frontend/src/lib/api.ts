const API_BASE = '/api';

// --- Types ---

export interface EndpointConfig {
  id: string;
  name: string;
  description: string;
  model: string;
  provider: string;
  temperature: number;
  max_tokens: number;
  system_prompt: string;
  sample_input: Record<string, unknown>;
}

export interface TestResult {
  endpoint_id: string;
  model: string;
  latency_ms: number;
  output: Record<string, unknown>;
}

export interface BenchmarkData {
  _meta: {
    description: string;
    last_updated: string;
    data_source: string;
    coverage: string;
  };
  categories: Record<string, unknown>;
  assumptions: Array<{
    id: number;
    assumption: string;
    basis: string;
    impact_if_wrong: string;
    validation: string;
  }>;
}

export interface MerchantIntake {
  business_name: string;
  business_description: string;
  location: string;
  services: string;
  additional_info: string;
  // Contact details - captured in intake, used for the live listing
  phone?: string;
  address?: string;
  website?: string;
}

export interface DealService {
  name: string;
  description?: string;
  original_price: number;
  discount_pct: number;
  deal_price: number;
  voucher_cap?: number;
}

export interface FinePrint {
  expiry_days: number;
  max_per_person: number;
  appointment_required: boolean;
  new_customers_only: boolean;
  restrictions: string[];
  cancellation_policy: string;
  additional_terms?: string;
}

export interface VoucherInstructions {
  redemption_method: string;
  appointment_required: boolean;
  instructions: string;
}

export interface GeneratedDeal {
  title: string;
  description: string;
  highlights?: string[];
  services: DealService[];
  fine_print: string | FinePrint;
  voucher_instructions?: VoucherInstructions;
  category: string;
  scheduling_recommendation: string;
  photo_guidance: string;
  confidence: {
    title: number;
    description: number;
    pricing: number;
    category: number;
  };
  flags?: string[];
}

export interface PipelineStep {
  output: Record<string, unknown>;
  model: string;
  latency_ms: number;
}

export interface PipelineResult {
  deal: GeneratedDeal;
  pipeline_steps: {
    classification: PipelineStep;
    market_intelligence: PipelineStep;
    deal_generation: PipelineStep;
  };
  total_latency_ms: number;
}

// --- Endpoints ---

export async function fetchEndpoints(): Promise<Record<string, EndpointConfig>> {
  const res = await fetch(`${API_BASE}/endpoints`);
  if (!res.ok) throw new Error(`Failed to fetch endpoints: ${res.statusText}`);
  return res.json();
}

export async function fetchEndpoint(id: string): Promise<EndpointConfig> {
  const res = await fetch(`${API_BASE}/endpoints/${id}`);
  if (!res.ok) throw new Error(`Failed to fetch endpoint: ${res.statusText}`);
  return res.json();
}

export async function updateEndpoint(
  id: string,
  update: Partial<Pick<EndpointConfig, 'system_prompt' | 'model' | 'temperature' | 'max_tokens' | 'provider'>>
): Promise<EndpointConfig> {
  const res = await fetch(`${API_BASE}/endpoints/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(update),
  });
  if (!res.ok) throw new Error(`Failed to update endpoint: ${res.statusText}`);
  return res.json();
}

// --- Test ---

export async function testEndpoint(endpointId: string, inputData: Record<string, unknown>): Promise<TestResult> {
  const res = await fetch(`${API_BASE}/test`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ endpoint_id: endpointId, input_data: inputData }),
  });
  if (!res.ok) throw new Error(`Test failed: ${res.statusText}`);
  return res.json();
}

// --- Benchmarks ---

export async function fetchBenchmarks(): Promise<BenchmarkData> {
  const res = await fetch(`${API_BASE}/benchmarks`);
  if (!res.ok) throw new Error(`Failed to fetch benchmarks: ${res.statusText}`);
  return res.json();
}

export async function updateBenchmarks(data: BenchmarkData): Promise<BenchmarkData> {
  const res = await fetch(`${API_BASE}/benchmarks`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Failed to update benchmarks: ${res.statusText}`);
  return res.json();
}

// --- Service Suggestions ---

export interface ServiceSuggestion {
  name: string;
  typical_price_min: number;
  typical_price_max: number;
}

export interface SuggestServicesResult {
  endpoint_id: string;
  model: string;
  latency_ms: number;
  output: {
    suggestions: ServiceSuggestion[];
  };
}

export async function suggestServices(
  businessDescription: string,
  location: string,
): Promise<SuggestServicesResult> {
  const res = await fetch(`${API_BASE}/pipeline/suggest-services`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ business_description: businessDescription, location }),
  });
  if (!res.ok) throw new Error(`Suggestions failed: ${res.statusText}`);
  return res.json();
}

// --- Merchant Pipeline ---

export async function generateDeal(intake: MerchantIntake): Promise<PipelineResult> {
  const res = await fetch(`${API_BASE}/pipeline/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(intake),
  });
  if (!res.ok) throw new Error(`Pipeline failed: ${res.statusText}`);
  return res.json();
}

// --- Deals (persisted) ---

export interface PublishedDeal {
  id: string;
  deal: GeneratedDeal;
  intake: MerchantIntake;
  contact: { phone?: string; address?: string; website?: string };
  published_at: string;
  status: string;
}

export async function publishDeal(
  deal: GeneratedDeal,
  intake: MerchantIntake,
  contact?: { phone?: string; address?: string; website?: string },
): Promise<PublishedDeal> {
  const res = await fetch(`${API_BASE}/deals`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ deal, intake, contact }),
  });
  if (!res.ok) throw new Error(`Publish failed: ${res.statusText}`);
  return res.json();
}

export async function fetchDeals(): Promise<PublishedDeal[]> {
  const res = await fetch(`${API_BASE}/deals`);
  if (!res.ok) throw new Error(`Failed to fetch deals: ${res.statusText}`);
  return res.json();
}

export async function fetchDeal(id: string): Promise<PublishedDeal> {
  const res = await fetch(`${API_BASE}/deals/${id}`);
  if (!res.ok) throw new Error(`Failed to fetch deal: ${res.statusText}`);
  return res.json();
}

export async function updateDeal(
  id: string,
  deal: GeneratedDeal,
  intake: MerchantIntake,
  contact?: { phone?: string; address?: string; website?: string },
): Promise<PublishedDeal> {
  const res = await fetch(`${API_BASE}/deals/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ deal, intake, contact }),
  });
  if (!res.ok) throw new Error(`Failed to update deal: ${res.statusText}`);
  return res.json();
}

export async function updateDealStatus(id: string, status: string): Promise<PublishedDeal> {
  const res = await fetch(`${API_BASE}/deals/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error(`Failed to update status: ${res.statusText}`);
  return res.json();
}

export async function deleteDeal(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/deals/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error(`Failed to delete deal: ${res.statusText}`);
}

// --- Profile ---

export async function fetchProfile(): Promise<Record<string, unknown>> {
  const res = await fetch(`${API_BASE}/profile`);
  if (!res.ok) throw new Error(`Failed to fetch profile: ${res.statusText}`);
  return res.json();
}

export async function updateProfile(profile: Record<string, unknown>): Promise<Record<string, unknown>> {
  const res = await fetch(`${API_BASE}/profile`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(profile),
  });
  if (!res.ok) throw new Error(`Failed to update profile: ${res.statusText}`);
  return res.json();
}

// --- Story Extractor (conversational onboarding) ---

export interface ExtractedProfile {
  business_name: string | null;
  business_description: string;
  location: string | null;
  full_address: string | null;
  phone: string | null;
  website: string | null;
  category: string;
  category_confidence: number;
  services: Array<{ name: string; price: number }>;
  scheduling_insight: string | null;
  experience_years: number | null;
  business_type: string;
  highlights: string[];
  missing_fields: string[];
  follow_up_questions: string[];
  parse_error?: boolean;
  raw_response?: string;
}

export async function extractStory(
  story: string,
  followUpAnswers: string[] = [],
): Promise<ExtractedProfile> {
  const res = await fetch(`${API_BASE}/pipeline/extract-story`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ story, follow_up_answers: followUpAnswers }),
  });
  if (!res.ok) throw new Error(`Story extraction failed: ${res.statusText}`);
  return res.json();
}

// --- Deal Story Extractor ---

export interface ExtractedDeal {
  selected_services: Array<{
    name: string;
    regular_price: number;
    groupon_price: number;
    discount_pct: number;
    voucher_cap: number;
  }>;
  highlights: string;
  descriptions: Record<string, string>;
  expiry_days: number;
  scheduling_suggestion: string;
  deal_title: string;
  restrictions: string[];
  photo_guidance: string;
  parse_error?: boolean;
}

export async function extractDeal(story: string): Promise<ExtractedDeal> {
  const res = await fetch(`${API_BASE}/pipeline/extract-deal`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ story }),
  });
  if (!res.ok) throw new Error(`Deal extraction failed: ${res.statusText}`);
  return res.json();
}

// --- Enhance Text (Inspire Me) ---

export interface EnhanceTextResult {
  enhanced_text: string;
}

export async function enhanceText(
  text: string,
  fieldType: string,
  context: Record<string, unknown>,
): Promise<EnhanceTextResult> {
  const res = await fetch(`${API_BASE}/pipeline/enhance-text`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, field_type: fieldType, context }),
  });
  if (!res.ok) throw new Error(`Enhance failed: ${res.statusText}`);
  return res.json();
}
