import { useState, useEffect } from 'react';
import { fetchProfile, updateProfile, enhanceText } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Loader2,
  Save,
  Sparkles,
  CheckCircle2,
  Building2,
  MapPin,
  Phone,
  Globe,
  CreditCard,
  Camera,
  Upload,
} from 'lucide-react';

export function Profile() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [inspiringDesc, setInspiringDesc] = useState(false);

  const [form, setForm] = useState({
    business_name: '',
    business_description: '',
    category: 'Health, Beauty & Wellness > Spas',
    full_address: '',
    phone: '',
    website: '',
    business_type: 'sole_provider',
    photos: [] as string[],
    bank_name: '',
    institution_number: '',
    transit_number: '',
    account_number: '',
  });

  useEffect(() => {
    fetchProfile()
      .then((p) => {
        if (p) {
          setForm((prev) => ({
            ...prev,
            business_name: (p.business_name as string) ?? '',
            business_description: (p.business_description as string) ?? '',
            category: (p.category as string) ?? prev.category,
            full_address: (p.full_address as string) ?? (p.address as string) ?? '',
            phone: (p.phone as string) ?? '',
            website: (p.website as string) ?? '',
            business_type: (p.business_type as string) ?? 'sole_provider',
            photos: (Array.isArray(p.photos) ? p.photos : []) as string[],
            bank_name: (p.bank_name as string) ?? '',
            institution_number: (p.institution_number as string) ?? '',
            transit_number: (p.transit_number as string) ?? '',
            account_number: (p.account_number as string) ?? '',
          }));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  function updateField(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  }

  async function handleSave() {
    setSaving(true);
    try {
      await updateProfile(form);
      setSaved(true);
    } catch {
      // ignore
    } finally {
      setSaving(false);
    }
  }

  async function handleInspireDescription() {
    setInspiringDesc(true);
    try {
      const result = await enhanceText(form.business_description, 'business_description', {
        business_name: form.business_name,
        category: form.category,
      });
      if (result?.enhanced_text) {
        updateField('business_description', result.enhanced_text);
      }
    } catch {
      // ignore
    } finally {
      setInspiringDesc(false);
    }
  }

  function maskValue(value: string) {
    if (!value) return '';
    if (value.length <= 4) return '****';
    return '****' + value.slice(-4);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-400">
        <Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading profile...
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-4xl animate-fade-in-up">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-xl font-bold text-gray-900">Business Profile</h1>
          <p className="mt-1 text-sm text-gray-500">Manage your business information.</p>
        </div>
        <Button
          onClick={handleSave}
          disabled={saving}
          className="rounded-lg bg-groupon-green font-bold text-white hover:bg-groupon-green-dark"
        >
          {saving ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : saved ? (
            <CheckCircle2 className="mr-2 h-4 w-4" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          {saved ? 'Saved' : 'Save Changes'}
        </Button>
      </div>

      <div className="space-y-6">
        {/* Business Info */}
        <Card>
          <CardHeader className="border-b">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-gray-400" />
              <CardTitle className="text-sm font-bold">Business Information</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label>Business Name</Label>
                <Input
                  value={form.business_name}
                  onChange={(e) => updateField('business_name', (e.target as HTMLInputElement).value)}
                  placeholder="Sofia's Glow Studio"
                  className="mt-1.5"
                />
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <Label>Business Description</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleInspireDescription}
                    disabled={inspiringDesc}
                    className="text-xs text-groupon-green"
                  >
                    {inspiringDesc ? (
                      <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                    ) : (
                      <Sparkles className="mr-1 h-3 w-3" />
                    )}
                    Inspire Me
                  </Button>
                </div>
                <Textarea
                  value={form.business_description}
                  onChange={(e) => updateField('business_description', (e.target as HTMLTextAreaElement).value)}
                  placeholder="Describe your business..."
                  rows={4}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label>Category</Label>
                <div className="mt-1.5 flex items-center gap-3">
                  <Input value={form.category} readOnly className="bg-gray-50" />
                  <Button variant="outline" size="sm" className="rounded-lg text-xs shrink-0">
                    Change
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Business Photos */}
        <Card>
          <CardHeader className="border-b">
            <div className="flex items-center gap-2">
              <Camera className="h-4 w-4 text-gray-400" />
              <CardTitle className="text-sm font-bold">Business Photos</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-gray-500 mb-3">
              These photos are used as defaults when creating new deals. Deals with photos get up to 3x more views.
            </p>
            {form.photos.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mb-4">
                {form.photos.map((photo, i) => (
                  <div key={i} className="relative group rounded-lg overflow-hidden border border-gray-200">
                    {photo.startsWith('/uploads/') ? (
                      <img src={photo} alt={`Business photo ${i + 1}`} className="w-full h-24 object-cover" />
                    ) : (
                      <div className="w-full h-24 bg-gray-100 flex items-center justify-center">
                        <Camera className="h-6 w-6 text-gray-300" />
                      </div>
                    )}
                    <button
                      onClick={() => {
                        const updated = form.photos.filter((_, idx) => idx !== i);
                        setForm((prev) => ({ ...prev, photos: updated }));
                        setSaved(false);
                      }}
                      className="absolute top-1 right-1 h-5 w-5 rounded-full bg-black/60 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      x
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div
              className="rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/50 p-6 text-center cursor-pointer hover:border-groupon-green/30 hover:bg-groupon-green/[0.02] transition-all"
              onClick={() => {
                const inp = document.createElement('input');
                inp.type = 'file';
                inp.accept = 'image/*';
                inp.multiple = true;
                inp.onchange = async (e) => {
                  const files = (e.target as HTMLInputElement).files;
                  if (!files) return;
                  for (const file of Array.from(files)) {
                    const fd = new FormData();
                    fd.append('file', file);
                    const res = await fetch('/api/upload', { method: 'POST', body: fd });
                    if (res.ok) {
                      const { url } = await res.json();
                      setForm((prev) => ({ ...prev, photos: [...prev.photos, url] }));
                      setSaved(false);
                    }
                  }
                };
                inp.click();
              }}
            >
              <Upload className="mx-auto h-8 w-8 text-gray-300 mb-2" />
              <p className="text-sm font-medium text-gray-600">
                {form.photos.length > 0 ? 'Add more photos' : 'Upload business photos'}
              </p>
              <p className="text-xs text-gray-400 mt-1">JPG, PNG up to 10MB</p>
            </div>
          </CardContent>
        </Card>

        {/* Contact */}
        <Card>
          <CardHeader className="border-b">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gray-400" />
              <CardTitle className="text-sm font-bold">Contact & Location</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label>Full Address</Label>
                <Input
                  value={form.full_address}
                  onChange={(e) => updateField('full_address', (e.target as HTMLInputElement).value)}
                  placeholder="123 Main Street, Suite 4, Chicago, IL 60601"
                  className="mt-1.5"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label>
                    <Phone className="h-3 w-3 mr-1" />
                    Phone
                  </Label>
                  <Input
                    value={form.phone}
                    onChange={(e) => updateField('phone', (e.target as HTMLInputElement).value)}
                    placeholder="(312) 555-0123"
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label>
                    <Globe className="h-3 w-3 mr-1" />
                    Website
                  </Label>
                  <Input
                    value={form.website}
                    onChange={(e) => updateField('website', (e.target as HTMLInputElement).value)}
                    placeholder="https://www.yourbusiness.com"
                    className="mt-1.5"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Business Type */}
        <Card>
          <CardHeader className="border-b">
            <CardTitle className="text-sm font-bold">Business Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[
                { value: 'sole_provider', label: 'Sole Provider', desc: 'I am the only service provider' },
                { value: 'contractor', label: 'Independent Contractor', desc: 'I work with contracted professionals' },
                { value: 'company', label: 'Company', desc: 'I operate a registered business with employees' },
                { value: 'third_party', label: 'Third Party', desc: 'I manage deals for other businesses' },
              ].map((option) => (
                <label
                  key={option.value}
                  className={`flex items-start gap-3 rounded-lg border-2 p-3 cursor-pointer transition-colors ${
                    form.business_type === option.value
                      ? 'border-groupon-green bg-groupon-green-light/30'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="business_type"
                    value={option.value}
                    checked={form.business_type === option.value}
                    onChange={() => updateField('business_type', option.value)}
                    className="mt-1 h-4 w-4 text-groupon-green focus:ring-groupon-green"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-900">{option.label}</span>
                    <p className="text-xs text-gray-500">{option.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Payment Info */}
        <Card>
          <CardHeader className="border-b">
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-gray-400" />
              <CardTitle className="text-sm font-bold">Payment Information</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label>Bank Name</Label>
                <Input
                  value={form.bank_name}
                  onChange={(e) => updateField('bank_name', (e.target as HTMLInputElement).value)}
                  placeholder="First National Bank"
                  className="mt-1.5"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <Label>Institution Number</Label>
                  <Input
                    value={form.institution_number ? maskValue(form.institution_number) : ''}
                    onChange={(e) => updateField('institution_number', (e.target as HTMLInputElement).value)}
                    placeholder="***"
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label>Transit Number</Label>
                  <Input
                    value={form.transit_number ? maskValue(form.transit_number) : ''}
                    onChange={(e) => updateField('transit_number', (e.target as HTMLInputElement).value)}
                    placeholder="*****"
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label>Account Number</Label>
                  <Input
                    value={form.account_number ? maskValue(form.account_number) : ''}
                    onChange={(e) => updateField('account_number', (e.target as HTMLInputElement).value)}
                    placeholder="************"
                    className="mt-1.5"
                  />
                </div>
              </div>
              <p className="text-xs text-gray-400">
                Payment information is encrypted and stored securely. We never share your banking details.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom save */}
      <div className="mt-6 flex justify-end">
        <Button
          onClick={handleSave}
          disabled={saving}
          className="rounded-lg bg-groupon-green font-bold text-white hover:bg-groupon-green-dark"
        >
          {saving ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : saved ? (
            <CheckCircle2 className="mr-2 h-4 w-4" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          {saved ? 'Saved' : 'Save Changes'}
        </Button>
      </div>
    </div>
  );
}
