
'use client';

import { useState } from 'react';
import { summarizeText } from '@/ai/flows/ai-summarizer';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Blocks, Bot, Clipboard, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { ScrollArea } from '../ui/scroll-area';
import { Skeleton } from '../ui/skeleton';
import { GEMINI_API_KEY_STORAGE_KEY } from '@/lib/constants';

export default function AISummarizerTool() {
  const [text, setText] = useState('');
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSummarizeText = async () => {
    const apiKey = localStorage.getItem(GEMINI_API_KEY_STORAGE_KEY);
    if (!apiKey) {
        toast({
            title: 'API Key is missing',
            description: 'Please set your Gemini API key in your profile.',
            variant: 'destructive',
        });
        return;
    }
    if (!text.trim()) {
      toast({
        title: 'Text is empty',
        description: 'Please paste the text you want to summarize.',
        variant: 'destructive',
      });
      return;
    }
    setIsLoading(true);
    setSummary('');
    try {
      const result = await summarizeText({ text, apiKey });
      setSummary(result.summary);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error summarizing text',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopySummary = () => {
    if (!summary) return;
    navigator.clipboard.writeText(summary);
    toast({
      title: 'Copied to clipboard!',
      description: 'The summary has been copied.',
    });
  };

  return (
    <div className="grid gap-6">
      <div className="space-y-2">
        <p className="flex items-center gap-2 text-muted-foreground">
          <Bot className="h-5 w-5" />
          Paste the text you want to summarize.
        </p>
        <Textarea
          placeholder="Paste a long article or text here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={8}
          className="max-h-[25vh]"
        />
      </div>
      <Button onClick={handleSummarizeText} disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Summarizing...
          </>
        ) : (
          <>
            <Blocks className="mr-2 h-4 w-4" />
            Summarize Text
          </>
        )}
      </Button>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-headline">Summary</CardTitle>
          <Button variant="ghost" size="icon" onClick={handleCopySummary} disabled={!summary}>
            <Clipboard className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-40">
              {isLoading ? (
                <div className="space-y-2 p-1">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-[75%]" />
                </div>
              ) : summary ? (
                  <p className="text-sm p-1">{summary}</p>
              ) : (
                <div className="flex h-full items-center justify-center text-center text-muted-foreground">
                  The generated summary will appear here.
                </div>
              )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
