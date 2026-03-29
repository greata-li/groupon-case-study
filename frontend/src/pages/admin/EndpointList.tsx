import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchEndpoints, type EndpointConfig } from '@/lib/api';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, Cpu, Thermometer, MessageSquare } from 'lucide-react';

export function EndpointList() {
  const [endpoints, setEndpoints] = useState<Record<string, EndpointConfig>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEndpoints()
      .then(setEndpoints)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-muted-foreground">Loading endpoints...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive">
        Failed to load endpoints: {error}
      </div>
    );
  }

  const endpointList = Object.values(endpoints);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Pipeline Endpoints</h2>
        <p className="text-muted-foreground">
          {endpointList.length} endpoints in the AI deal creation pipeline. Click any endpoint to edit its prompt, model, and parameters.
        </p>
      </div>

      <div className="grid gap-4">
        {endpointList.map((endpoint, index) => (
          <Card
            key={endpoint.id}
            className="cursor-pointer transition-shadow hover:shadow-md"
            onClick={() => navigate(`/admin/endpoint/${endpoint.id}`)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-sm font-bold text-primary">
                    {index + 1}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{endpoint.name}</CardTitle>
                    <CardDescription className="mt-1">{endpoint.description}</CardDescription>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                <Badge variant="secondary" className="flex items-center gap-1.5">
                  <Cpu className="h-3 w-3" />
                  {endpoint.model}
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1.5">
                  <Thermometer className="h-3 w-3" />
                  temp: {endpoint.temperature}
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1.5">
                  <MessageSquare className="h-3 w-3" />
                  {endpoint.max_tokens} max tokens
                </Badge>
                <Badge variant="outline">
                  {endpoint.provider}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
