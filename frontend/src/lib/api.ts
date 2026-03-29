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
}

export interface DealService {
  name: string;
  original_price: number;
  discount_pct: number;
  deal_price: number;
}

export interface GeneratedDeal {
  title: string;
  description: string;
  fine_print: string;
  services: DealService[];
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
