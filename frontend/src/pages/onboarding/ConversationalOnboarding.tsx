import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { extractStory, updateProfile, type ExtractedProfile, type ExtractedDeal } from '@/lib/api';
import { DealChat } from '@/pages/portal/DealChat';
import { VoiceInput } from '@/components/ui/voice-input';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Send,
  Loader2,
  Sparkles,
  CheckCircle2,
  Edit3,
  Plus,
  Trash2,
  ArrowRight,
  MessageCircle,
  Mic,
  Store,
  MapPin,
  Phone,
  Globe,
  Calendar,
  DollarSign,
  Star,
  Camera,
} from 'lucide-react';

type Phase = 'chat' | 'extracting' | 'review' | 'deal-chat' | 'saved';

interface ChatMessage {
  role: 'assistant' | 'user';
  text: string;
}

const STORAGE_KEY = 'onboarding_state';

const INITIAL_MESSAGE: ChatMessage = {
  role: 'assistant',
  text: "Welcome to Groupon! I'm here to help set up your business. Just tell me about what you do - your business name, what services you offer, where you're located, and your prices. You can type or use the microphone. Don't worry about formatting - just tell me your story.",
};

function loadSaved() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return null;
}

export function ConversationalOnboarding() {
  const navigate = useNavigate();
  const saved = useRef(loadSaved()).current;

  const [phase, setPhase] = useState<Phase>(saved?.phase === 'extracting' ? 'chat' : saved?.phase || 'chat');
  const [messages, setMessages] = useState<ChatMessage[]>(saved?.messages || [INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [extractedProfile, setExtractedProfile] = useState<ExtractedProfile | null>(saved?.extractedProfile || null);
  const [followUpAnswers, setFollowUpAnswers] = useState<string[]>(saved?.followUpAnswers || []);
  const [originalStory, setOriginalStory] = useState(saved?.originalStory || '');
  const [error, setError] = useState<string | null>(null);

  // Editable profile fields for review phase
  const [editProfile, setEditProfile] = useState<ExtractedProfile | null>(saved?.editProfile || null);

  // Persist state to sessionStorage on changes
  useEffect(() => {
    const state = { phase, messages, extractedProfile, editProfile, followUpAnswers, originalStory };
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [phase, messages, extractedProfile, editProfile, followUpAnswers, originalStory]);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function handleSend() {
    if (!input.trim()) return;
    const userText = input.trim();
    setInput('');

    setMessages((prev) => [...prev, { role: 'user', text: userText }]);

    // If this is the first message, it's the main story
    if (!originalStory) {
      setOriginalStory(userText);
      await extractFromStory(userText, []);
    } else {
      // It's a follow-up answer
      const newAnswers = [...followUpAnswers, userText];
      setFollowUpAnswers(newAnswers);
      await extractFromStory(originalStory, newAnswers);
    }
  }

  async function extractFromStory(story: string, answers: string[]) {
    setPhase('extracting');
    setMessages((prev) => [
      ...prev,
      { role: 'assistant', text: '✨ Analyzing your business...' },
    ]);
    setError(null);

    try {
      const result = await extractStory(story, answers);

      if (result.parse_error) {
        setMessages((prev) => [
          ...prev.slice(0, -1),
          {
            role: 'assistant',
            text: "I had trouble understanding that. Could you try describing your business again? Include your business name, what services you offer, and your prices.",
          },
        ]);
        setPhase('chat');
        return;
      }

      // If there are follow-up questions, ask them
      if (result.follow_up_questions && result.follow_up_questions.length > 0) {
        setExtractedProfile(result);
        setMessages((prev) => [
          ...prev.slice(0, -1),
          {
            role: 'assistant',
            text: `Great, I've captured a lot! Just a couple more things:\n\n${result.follow_up_questions.map((q, i) => `${i + 1}. ${q}`).join('\n')}`,
          },
        ]);
        setPhase('chat');
        return;
      }

      // All good - go to review
      setExtractedProfile(result);
      setEditProfile(result);
      setMessages((prev) => [
        ...prev.slice(0, -1),
        {
          role: 'assistant',
          text: "I've got everything I need! Let me show you what I captured - you can review and edit anything before we save your profile.",
        },
      ]);
      setPhase('review');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong');
      setMessages((prev) => [
        ...prev.slice(0, -1),
        {
          role: 'assistant',
          text: 'Sorry, something went wrong. Please try again.',
        },
      ]);
      setPhase('chat');
    }
  }

  function handleVoiceTranscript(text: string) {
    setInput((prev) => (prev ? prev + ' ' + text : text));
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  async function handleSaveProfile() {
    if (!editProfile) return;
    const profileData = {
      business_name: editProfile.business_name,
      business_description: editProfile.business_description,
      location: editProfile.location,
      full_address: editProfile.full_address,
      phone: editProfile.phone,
      website: editProfile.website,
      category: editProfile.category,
      services: editProfile.services,
      scheduling_insight: editProfile.scheduling_insight,
      experience_years: editProfile.experience_years,
      business_type: editProfile.business_type,
      highlights: editProfile.highlights,
      onboarded: true,
    };
    await updateProfile(profileData);
    sessionStorage.removeItem(STORAGE_KEY);
    // Flow directly into deal creation instead of going to portal
    setPhase('deal-chat');
  }

  function handleDealExtracted(deal: ExtractedDeal) {
    sessionStorage.removeItem(STORAGE_KEY);
    // Store extracted deal data in sessionStorage so the builder can pick it up
    sessionStorage.setItem('prefilled_deal', JSON.stringify(deal));
    // Navigate to the builder (not auto-publish)
    navigate('/portal/create?from=onboarding');
  }

  function updateService(index: number, field: 'name' | 'price', value: string) {
    if (!editProfile) return;
    const updated = [...editProfile.services];
    if (field === 'price') {
      updated[index] = { ...updated[index], price: parseFloat(value) || 0 };
    } else {
      updated[index] = { ...updated[index], name: value };
    }
    setEditProfile({ ...editProfile, services: updated });
  }

  function addService() {
    if (!editProfile) return;
    setEditProfile({
      ...editProfile,
      services: [...editProfile.services, { name: '', price: 0 }],
    });
  }

  function removeService(index: number) {
    if (!editProfile) return;
    setEditProfile({
      ...editProfile,
      services: editProfile.services.filter((_, i) => i !== index),
    });
  }

  // ==================== DEAL CHAT PHASE ====================
  if (phase === 'deal-chat' && editProfile) {
    return (
      <DealChat
        businessName={editProfile.business_name || ''}
        services={editProfile.services || []}
        onDealExtracted={handleDealExtracted}
        onSkip={() => navigate('/portal/campaigns')}
      />
    );
  }

  // ==================== SAVED PHASE (fallback) ====================
  if (phase === 'saved') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fafaf8] px-4 sm:px-6">
        <div className="w-full max-w-md text-center animate-fade-in-up">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-groupon-green">
            <CheckCircle2 className="h-10 w-10 text-white" />
          </div>
          <h1 className="font-heading text-3xl font-extrabold text-gray-900">
            You're all set!
          </h1>
          <p className="mt-3 text-gray-500">
            Your business profile is saved. Now let's create your first deal.
          </p>
          <div className="mt-8 flex flex-col gap-3">
            <Button
              onClick={() => navigate('/portal/create')}
              className="h-14 rounded-xl bg-groupon-green text-base font-bold text-white shadow-lg shadow-groupon-green/20 hover:bg-groupon-green-dark"
            >
              <Sparkles className="mr-2 h-5 w-5" />
              Create My First Deal
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/portal/home')}
              className="rounded-xl"
            >
              Go to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ==================== REVIEW PHASE ====================
  if (phase === 'review' && editProfile) {
    return (
      <div className="min-h-screen bg-[#fafaf8]">
        {/* Header */}
        <header className="border-b border-gray-200 bg-white">
          <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4 sm:px-6">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-groupon-green" />
              <span className="font-heading text-base font-bold text-gray-900">
                Review Your Profile
              </span>
            </div>
            <Button
              onClick={handleSaveProfile}
              className="rounded-lg bg-groupon-green font-bold text-white hover:bg-groupon-green-dark"
            >
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Save & Continue
            </Button>
          </div>
        </header>

        <div className="mx-auto max-w-4xl px-4 sm:px-6 py-8 animate-fade-in-up">
          <p className="text-sm text-gray-500 mb-6">
            Here's what our AI extracted from your description. Edit anything that needs adjusting.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-4 lg:gap-6">
            {/* Left: Profile fields */}
            <div className="space-y-5">
              {/* Business basics */}
              <Card>
                <CardContent className="py-5 space-y-4">
                  <h3 className="font-heading text-base font-bold text-gray-900 flex items-center gap-2">
                    <Store className="h-4 w-4 text-groupon-green" />
                    Business Info
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Business Name</label>
                      <Input
                        value={editProfile.business_name || ''}
                        onChange={(e) => setEditProfile({ ...editProfile, business_name: e.target.value })}
                        className="rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">
                        Category
                        <Badge className="ml-2 bg-groupon-green/10 text-groupon-green border-0 text-[10px]">
                          {Math.round((editProfile.category_confidence || 0) * 100)}% confident
                        </Badge>
                      </label>
                      <Input
                        value={editProfile.category || ''}
                        onChange={(e) => setEditProfile({ ...editProfile, category: e.target.value })}
                        className="rounded-lg"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Description</label>
                    <Textarea
                      value={editProfile.business_description || ''}
                      onChange={(e) => setEditProfile({ ...editProfile, business_description: e.target.value })}
                      className="rounded-lg min-h-[80px]"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Services */}
              <Card>
                <CardContent className="py-5 space-y-4">
                  <h3 className="font-heading text-base font-bold text-gray-900 flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-groupon-green" />
                    Services & Pricing
                  </h3>
                  <div className="space-y-2">
                    {editProfile.services.map((service, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <Input
                          value={service.name}
                          onChange={(e) => updateService(i, 'name', e.target.value)}
                          placeholder="Service name"
                          className="rounded-lg flex-1"
                        />
                        <div className="flex items-center gap-1 shrink-0">
                          <span className="text-sm text-gray-400">$</span>
                          <Input
                            type="number"
                            value={service.price || ''}
                            onChange={(e) => updateService(i, 'price', e.target.value)}
                            className="rounded-lg w-24"
                          />
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeService(i)}
                          className="text-gray-400 hover:text-red-500 shrink-0"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={addService}
                      className="rounded-lg text-xs w-full border-dashed"
                    >
                      <Plus className="mr-1 h-3 w-3" />
                      Add service
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Business Photos */}
              <Card>
                <CardContent className="py-5 space-y-4">
                  <h3 className="font-heading text-base font-bold text-gray-900 flex items-center gap-2">
                    <Camera className="h-4 w-4 text-groupon-green" />
                    Business Photos
                    <Badge variant="outline" className="text-[10px] text-gray-400 border-gray-200">Optional</Badge>
                  </h3>
                  <p className="text-xs text-gray-500">
                    Photos help customers see what to expect. Deals with photos get 2x more views.
                  </p>

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
                        const uploaded: { url: string; filename: string }[] = [];
                        for (const file of Array.from(files)) {
                          const form = new FormData();
                          form.append('file', file);
                          const res = await fetch('/api/upload', { method: 'POST', body: form });
                          if (res.ok) uploaded.push(await res.json());
                        }
                        if (uploaded.length > 0) {
                          setEditProfile((prev) => prev ? {
                            ...prev,
                            photos: [...((prev as any).photos || []), ...uploaded.map(u => u.url)],
                          } as any : prev);
                        }
                      };
                      inp.click();
                    }}
                  >
                    <Camera className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm font-medium text-gray-600">
                      Click to upload photos
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      JPG, PNG up to 10MB. Landscape orientation recommended.
                    </p>
                  </div>

                  {(editProfile as any).photos && (editProfile as any).photos.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {((editProfile as any).photos as string[]).map((photo, i) => (
                        <div key={i} className="relative group rounded-lg overflow-hidden border border-gray-200">
                          <img
                            src={photo}
                            alt={`Business photo ${i + 1}`}
                            className="w-full h-24 object-cover"
                          />
                          <button
                            onClick={() => {
                              const updated = ((editProfile as any).photos as string[]).filter((_, idx) => idx !== i);
                              setEditProfile({ ...editProfile, photos: updated } as any);
                            }}
                            className="absolute top-1 right-1 h-5 w-5 rounded-full bg-black/60 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <p className="text-xs text-gray-400">
                    You can also add photos later when creating individual deals.
                  </p>
                </CardContent>
              </Card>

              {/* Contact & Location */}
              <Card>
                <CardContent className="py-5 space-y-4">
                  <h3 className="font-heading text-base font-bold text-gray-900 flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-groupon-green" />
                    Location & Contact
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Location</label>
                      <Input
                        value={editProfile.location || ''}
                        onChange={(e) => setEditProfile({ ...editProfile, location: e.target.value })}
                        placeholder="City or neighborhood"
                        className="rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Full Address</label>
                      <Input
                        value={editProfile.full_address || ''}
                        onChange={(e) => setEditProfile({ ...editProfile, full_address: e.target.value })}
                        placeholder="Street address"
                        className="rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Phone</label>
                      <Input
                        value={editProfile.phone || ''}
                        onChange={(e) => setEditProfile({ ...editProfile, phone: e.target.value })}
                        placeholder="(312) 555-0123"
                        className="rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Website</label>
                      <Input
                        value={editProfile.website || ''}
                        onChange={(e) => setEditProfile({ ...editProfile, website: e.target.value })}
                        placeholder="www.example.com"
                        className="rounded-lg"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Highlights */}
              {editProfile.highlights && editProfile.highlights.length > 0 && (
                <Card>
                  <CardContent className="py-5 space-y-3">
                    <h3 className="font-heading text-base font-bold text-gray-900 flex items-center gap-2">
                      <Star className="h-4 w-4 text-groupon-green" />
                      AI-Generated Highlights
                    </h3>
                    {editProfile.highlights.map((h, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-groupon-green shrink-0" />
                        <Input
                          value={h}
                          onChange={(e) => {
                            const updated = [...editProfile.highlights];
                            updated[i] = e.target.value;
                            setEditProfile({ ...editProfile, highlights: updated });
                          }}
                          className="rounded-lg"
                        />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Scheduling insight */}
              {editProfile.scheduling_insight && (
                <Card className="border-blue-100 bg-blue-50/50">
                  <CardContent className="py-4">
                    <div className="flex items-center gap-2 text-sm text-blue-700">
                      <Calendar className="h-4 w-4" />
                      <span className="font-medium">Scheduling Insight:</span>
                      {editProfile.scheduling_insight}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right: Customer Preview */}
            <div className="space-y-4">
              <div className="sticky top-4">
                <Card>
                  <CardContent className="py-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
                      Customer Preview
                    </h4>
                    {/* Mini preview card */}
                    <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
                      <div className="h-32 rounded-lg bg-gray-200 mb-3 flex items-center justify-center overflow-hidden">
                        {(editProfile as any).photos?.length > 0 ? (
                          <img
                            src={(editProfile as any).photos[0]}
                            alt="Business"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Store className="h-8 w-8 text-gray-400" />
                        )}
                      </div>
                      <h3 className="font-heading text-sm font-bold text-gray-900">
                        {editProfile.business_name || 'Your Business'}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
                        {editProfile.location || 'Location'}
                      </p>
                      <div className="flex items-center gap-1 mt-2">
                        {[1, 2, 3, 4].map((i) => (
                          <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
                        ))}
                        <Star className="h-3 w-3 text-gray-300" />
                        <span className="text-[10px] text-gray-400 ml-1">New</span>
                      </div>
                      <Separator className="my-3" />
                      {editProfile.services.slice(0, 3).map((s, i) => (
                        <div key={i} className="flex justify-between text-xs py-1">
                          <span className="text-gray-600">{s.name || 'Service'}</span>
                          <span className="font-bold text-groupon-green">${s.price}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Button
                  onClick={handleSaveProfile}
                  className="mt-4 w-full h-12 rounded-xl bg-groupon-green text-base font-bold text-white shadow-md shadow-groupon-green/20 hover:bg-groupon-green-dark"
                >
                  Save Profile & Continue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==================== CHAT PHASE ====================
  return (
    <div className="flex min-h-screen flex-col bg-[#fafaf8]">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex h-14 max-w-3xl items-center px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-groupon-green">
              <MessageCircle className="h-4 w-4 text-white" />
            </div>
            <span className="font-heading text-base font-bold text-gray-900">
              Set Up Your Business
            </span>
          </div>
          <Badge className="ml-3 bg-groupon-green/10 text-groupon-green border-0 text-xs">
            AI-Powered
          </Badge>
        </div>
      </header>

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 py-6 space-y-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-groupon-green text-white rounded-br-md'
                    : 'bg-white border border-gray-200 text-gray-700 rounded-bl-md'
                }`}
              >
                {msg.role === 'assistant' && (
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles className="h-3 w-3 text-groupon-green" />
                    <span className="text-[11px] font-bold text-groupon-green">AI Assistant</span>
                  </div>
                )}
                <div className="whitespace-pre-wrap">{msg.text}</div>
              </div>
            </div>
          ))}

          {phase === 'extracting' && (
            <div className="flex justify-start">
              <div className="rounded-2xl border border-gray-200 bg-white px-4 py-3 rounded-bl-md">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Loader2 className="h-4 w-4 animate-spin text-groupon-green" />
                  Analyzing your business...
                </div>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>
      </div>

      {/* Prompt area */}
      {messages.length === 1 && (
        <div className="mx-auto max-w-3xl px-4 sm:px-6 pb-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              "I run a waxing and lash studio in Lincoln Park, Chicago. 12 years experience, Brazilian waxes for $65, lash lifts for $85.",
              "I'm a massage therapist in downtown Seattle. I do deep tissue, Swedish, and hot stone massages. Prices range from $80-$150.",
            ].map((example, i) => (
              <button
                key={i}
                onClick={() => setInput(example)}
                className="rounded-xl border border-gray-200 bg-white p-3 text-left text-xs text-gray-500 hover:border-groupon-green/30 hover:bg-groupon-green/[0.02] transition-all"
              >
                <span className="text-[10px] font-bold text-gray-400 block mb-1">Example</span>
                {example}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input bar */}
      <div className="border-t border-gray-200 bg-white px-4 sm:px-6 py-4">
        <div className="mx-auto max-w-3xl">
          <div className="flex items-end gap-3">
            <div className="flex-1 relative">
              <Textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  originalStory
                    ? 'Answer the follow-up questions...'
                    : 'Tell me about your business - name, services, prices, location...'
                }
                className="rounded-xl border-gray-200 pr-12 min-h-[48px] max-h-[120px] resize-none text-sm"
                rows={1}
              />
            </div>
            <VoiceInput onTranscript={handleVoiceTranscript} className="h-10 rounded-xl" />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || phase === 'extracting'}
              className="h-10 rounded-xl bg-groupon-green text-white hover:bg-groupon-green-dark disabled:opacity-40"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          {error && (
            <p className="mt-2 text-xs text-red-500">{error}</p>
          )}
        </div>
      </div>
    </div>
  );
}
