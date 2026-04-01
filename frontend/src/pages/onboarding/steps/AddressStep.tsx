import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Plus, Trash2, MapPin } from 'lucide-react';

interface AddressStepProps {
  data: Record<string, unknown>;
  onUpdate: (field: string, value: unknown) => void;
}

interface AddressData {
  street: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone: string;
}

const COUNTRIES = [
  'United States',
  'Canada',
  'United Kingdom',
  'Australia',
  'Germany',
  'France',
  'Other',
];

function emptyAddress(): AddressData {
  return {
    street: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'United States',
    phone: '',
  };
}

function parseAddresses(data: Record<string, unknown>): AddressData[] {
  const stored = data.addresses;
  if (Array.isArray(stored) && stored.length > 0) {
    return stored as AddressData[];
  }
  // Fallback: try to use flat fields from existing data
  return [
    {
      street: (data.street as string) || '',
      city: (data.city as string) || (data.location as string) || '',
      state: (data.state as string) || '',
      postal_code: (data.postal_code as string) || '',
      country: (data.country as string) || 'United States',
      phone: (data.phone as string) || '',
    },
  ];
}

export function AddressStep({ data, onUpdate }: AddressStepProps) {
  const [addresses, setAddresses] = useState<AddressData[]>(() =>
    parseAddresses(data)
  );

  function persist(updated: AddressData[]) {
    setAddresses(updated);
    onUpdate('addresses', updated);
    // Also mirror primary address to flat fields for compatibility
    if (updated.length > 0) {
      const primary = updated[0];
      onUpdate('street', primary.street);
      onUpdate('city', primary.city);
      onUpdate('state', primary.state);
      onUpdate('postal_code', primary.postal_code);
      onUpdate('country', primary.country);
      onUpdate('phone', primary.phone);
    }
  }

  function updateAddress(index: number, field: keyof AddressData, value: string) {
    const next = addresses.map((a, i) =>
      i === index ? { ...a, [field]: value } : a
    );
    persist(next);
  }

  function addLocation() {
    if (addresses.length >= 5) return;
    persist([...addresses, emptyAddress()]);
  }

  function removeLocation(index: number) {
    if (addresses.length <= 1) return;
    persist(addresses.filter((_, i) => i !== index));
  }

  return (
    <div className="animate-fade-in-up">
      <h2 className="font-heading text-2xl font-bold tracking-tight text-gray-900">
        Business address & contact
      </h2>
      <p className="mt-2 max-w-lg text-sm leading-relaxed text-gray-500">
        Add your business location so customers can find you. Your address will
        appear on your Groupon deal page.
      </p>

      <div className="mt-8 max-w-xl space-y-6">
        {addresses.map((addr, idx) => (
          <Card key={idx} className="border-gray-200">
            <CardContent className="pt-2">
              {/* Location header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-groupon-green" />
                  <span className="font-heading text-sm font-bold text-gray-900">
                    {idx === 0 ? 'Primary Location' : `Location ${idx + 1}`}
                  </span>
                </div>
                {idx > 0 && (
                  <Button
                    onClick={() => removeLocation(idx)}
                    variant="ghost"
                    size="icon-sm"
                    className="text-gray-400 hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <div className="space-y-4">
                {/* Street */}
                <div>
                  <Label htmlFor={`street-${idx}`} className="text-xs text-gray-600 mb-1">
                    Street address
                  </Label>
                  <Input
                    id={`street-${idx}`}
                    value={addr.street}
                    onChange={(e) =>
                      updateAddress(idx, 'street', (e.target as HTMLInputElement).value)
                    }
                    placeholder="123 Main Street, Suite 100"
                    className="h-10 rounded-lg"
                  />
                </div>

                {/* City + State */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor={`city-${idx}`} className="text-xs text-gray-600 mb-1">
                      City
                    </Label>
                    <Input
                      id={`city-${idx}`}
                      value={addr.city}
                      onChange={(e) =>
                        updateAddress(idx, 'city', (e.target as HTMLInputElement).value)
                      }
                      placeholder="Chicago"
                      className="h-10 rounded-lg"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`state-${idx}`} className="text-xs text-gray-600 mb-1">
                      State / Province
                    </Label>
                    <Input
                      id={`state-${idx}`}
                      value={addr.state}
                      onChange={(e) =>
                        updateAddress(idx, 'state', (e.target as HTMLInputElement).value)
                      }
                      placeholder="IL"
                      className="h-10 rounded-lg"
                    />
                  </div>
                </div>

                {/* Postal code + Country */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor={`postal-${idx}`} className="text-xs text-gray-600 mb-1">
                      Postal code
                    </Label>
                    <Input
                      id={`postal-${idx}`}
                      value={addr.postal_code}
                      onChange={(e) =>
                        updateAddress(idx, 'postal_code', (e.target as HTMLInputElement).value)
                      }
                      placeholder="60601"
                      className="h-10 rounded-lg"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-gray-600 mb-1">
                      Country
                    </Label>
                    <Select
                      value={addr.country}
                      onValueChange={(val) => updateAddress(idx, 'country', val)}
                    >
                      <SelectTrigger className="h-10 w-full rounded-lg">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {COUNTRIES.map((c) => (
                          <SelectItem key={c} value={c}>
                            {c}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator />

                {/* Phone */}
                <div>
                  <Label htmlFor={`phone-${idx}`} className="text-xs text-gray-600 mb-1">
                    Phone number
                  </Label>
                  <Input
                    id={`phone-${idx}`}
                    type="tel"
                    value={addr.phone}
                    onChange={(e) =>
                      updateAddress(idx, 'phone', (e.target as HTMLInputElement).value)
                    }
                    placeholder="(312) 555-0100"
                    className="h-10 rounded-lg"
                  />
                  <p className="mt-1 text-xs text-gray-400">
                    Format: (XXX) XXX-XXXX or +1-XXX-XXX-XXXX
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {addresses.length < 5 && (
          <Button
            onClick={addLocation}
            variant="outline"
            className="rounded-lg border-dashed border-gray-300 text-sm font-medium text-gray-500 hover:border-groupon-green hover:text-groupon-green transition-colors w-full h-11"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add another location
          </Button>
        )}
      </div>
    </div>
  );
}
