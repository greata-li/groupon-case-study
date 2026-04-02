export interface ValidationError {
  field: string;
  message: string;
}

export function validateBusinessName(value: string): string | null {
  if (!value.trim()) return 'Business name is required';
  if (value.trim().length < 2) return 'Business name must be at least 2 characters';
  if (value.trim().length > 100) return 'Business name must be under 100 characters';
  return null;
}

export function validateBusinessDescription(value: string): string | null {
  if (!value.trim()) return 'Please describe your business';
  if (value.trim().length < 10) return 'Please provide a bit more detail (at least 10 characters)';
  return null;
}

export function validateLocation(value: string): string | null {
  if (!value.trim()) return 'Location is required';
  if (value.trim().length < 3) return 'Please enter a city or neighborhood';
  return null;
}

export function validatePhone(value: string): string | null {
  if (!value.trim()) return null; // optional at this stage
  // Basic phone validation - digits, spaces, dashes, parens, plus
  const cleaned = value.replace(/[\s\-\(\)\+\.]/g, '');
  if (cleaned.length > 0 && (cleaned.length < 7 || !/^\d+$/.test(cleaned))) {
    return 'Please enter a valid phone number';
  }
  return null;
}

export function validateAddress(value: string): string | null {
  if (!value.trim()) return null; // optional at intake, required before publish
  return null;
}

export function validateServicePrice(price: string): string | null {
  if (!price.trim()) return 'Price is required';
  const num = parseFloat(price.replace('$', ''));
  if (isNaN(num) || num <= 0) return 'Price must be greater than $0';
  if (num > 10000) return 'Price seems too high - please double-check';
  return null;
}

export function validateStep(
  step: string,
  value: string,
): string | null {
  switch (step) {
    case 'business_name':
      return validateBusinessName(value);
    case 'business_description':
      return validateBusinessDescription(value);
    case 'location':
      return validateLocation(value);
    default:
      return null;
  }
}
