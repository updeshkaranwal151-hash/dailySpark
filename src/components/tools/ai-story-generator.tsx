
'use client';

import { useState } from 'react';
import { generateStory } from '@/ai/flows/ai-story-generator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { BookMarked, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { ScrollArea } from '../ui/scroll-area';
import { Skeleton } from '../ui/skeleton';
import { AnimatePresence, motion } from 'framer-motion';
import { GEMINI_API_KEY_STORAGE_KEY } from '@/lib/constants';

export default function AIStoryGeneratorTool() {
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState<{ title: string; story: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerateStory = async () => {
    const apiKey = localStorage.getItem(GEMINI_API_KEY_STORAGE_KEY);
    if (!apiKey) {
        toast({
            title: 'API Key is missing',
            description: 'Please set your Gemini API key in your profile.',
            variant: 'destructive',
        });
        return;
    }
    if (!prompt.trim()) {
      toast({
        title: 'Prompt is empty',
        description: 'Please enter a prompt for the story.',
        variant: 'destructive',
      });
      return;
    }
    setIsLoading(true);
    setResult(null);
    try {
      const storyResult = await generateStory({ prompt, apiKey });
      setResult(storyResult);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error generating story',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid gap-6">
      <div className="flex gap-2">
        <Input
          placeholder="e.g., 'A detective who can talk to cats'"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleGenerateStory()}
        />
        <Button onClick={handleGenerateStory} disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <BookMarked className="h-4 w-4" />
          )}
          <span className="ml-2 hidden sm:inline">Write Story</span>
        </Button>
      </div>

      <Card>
        <ScrollArea className="h-80">
          <CardContent className="p-6">
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div key="loading" className="space-y-4">
                  <Skeleton className="h-6 w-3/4" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-[80%]" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </motion.div>
              ) : result ? (
                <motion.div
                  key="story"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <CardTitle className="text-2xl font-headline mb-4">{result.title}</CardTitle>
                  <p className="whitespace-pre-wrap">{result.story}</p>
                </motion.div>
              ) : (
                <motion.div
                  key="placeholder"
                  className="flex h-full min-h-60 items-center justify-center text-center text-muted-foreground"
                >
                 <div>
                    <BookMarked className="h-12 w-12 mx-auto mb-4" />
                    <p>Your generated story will appear here.</p>
                 </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </ScrollArea>
      </Card>
    </div>
  );
}
