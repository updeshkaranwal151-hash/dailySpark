
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BrainCircuit, Loader2, KeyRound, HelpCircle, ExternalLink } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth.tsx';
import { GEMINI_API_KEY_STORAGE_KEY } from '@/lib/constants';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export default function WelcomePage() {
  const [apiKey, setApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { user, isLoading: isAuthLoading } = useAuth();

  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.push('/login');
    }
    if (!isAuthLoading && user && localStorage.getItem(GEMINI_API_KEY_STORAGE_KEY)) {
        router.push('/');
    }
  }, [user, isAuthLoading, router]);

  const handleContinue = () => {
    if (!apiKey.trim()) return;
    setIsLoading(true);
    localStorage.setItem(GEMINI_API_KEY_STORAGE_KEY, apiKey);
    router.push('/');
  };
  
  if (isAuthLoading || !user) {
    return (
        <div className="flex h-screen w-full items-center justify-center bg-background">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-lg">
        <div className="flex justify-center items-center gap-2 mb-6">
          <BrainCircuit className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-headline font-bold">Welcome to Daily Spark</h1>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-headline">Setup your AI assistant</CardTitle>
            <CardDescription>
              To use the AI-powered features, please provide your Google Gemini API key.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-2">
              <Label htmlFor="api-key" className="flex items-center">
                <KeyRound className="mr-2 h-4 w-4" />
                Gemini API Key
              </Label>
              <Input
                id="api-key"
                type="password"
                placeholder="Enter your API key"
                required
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <Button onClick={handleContinue} className="w-full" disabled={isLoading || !apiKey.trim()}>
              {isLoading ? <Loader2 className="animate-spin" /> : 'Continue'}
            </Button>
            
             <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>
                    <div className='flex items-center text-sm'>
                        <HelpCircle className="mr-2 h-4 w-4" />
                        How to get a Gemini API Key?
                    </div>
                </AccordionTrigger>
                <AccordionContent>
                    <div className="space-y-4 text-sm text-muted-foreground p-2">
                        <p>You can get a free Google Gemini API key from Google AI Studio.</p>
                        <ol className="list-decimal list-inside space-y-2">
                            <li>Go to <a href="https://aistudio.google.com/app" target="_blank" rel="noopener noreferrer" className="text-primary underline">Google AI Studio <ExternalLink className="inline h-3 w-3" /></a>.</li>
                            <li>Sign in with your Google account.</li>
                            <li>Click on the <strong>"Get API key"</strong> button.</li>
                            <li>Click <strong>"Create API key in new project"</strong>.</li>
                            <li>Copy the generated API key and paste it into the field above.</li>
                        </ol>
                        <p className="text-xs italic">Your API key is stored securely in your browser's local storage and is never sent to our servers.</p>
                    </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
