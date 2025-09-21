
'use client';

import { useState } from 'react';
import { brainstormIdeas } from '@/ai/flows/ai-brainstorm';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { BrainCircuit, Loader2, Wand2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { ScrollArea } from '../ui/scroll-area';
import { AnimatePresence, motion } from 'framer-motion';
import { Skeleton } from '../ui/skeleton';
import { GEMINI_API_KEY_STORAGE_KEY } from '@/lib/constants';

export default function AIBrainstormTool() {
  const [topic, setTopic] = useState('');
  const [ideas, setIdeas] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerateIdeas = async () => {
    const apiKey = localStorage.getItem(GEMINI_API_KEY_STORAGE_KEY);
    if (!apiKey) {
        toast({
            title: 'API Key is missing',
            description: 'Please set your Gemini API key in your profile.',
            variant: 'destructive',
        });
        return;
    }
    if (!topic.trim()) {
      toast({
        title: 'Topic is empty',
        description: 'Please enter a topic to brainstorm ideas for.',
        variant: 'destructive',
      });
      return;
    }
    setIsLoading(true);
    setIdeas([]);
    try {
      const result = await brainstormIdeas({ topic, apiKey });
      setIdeas(result.ideas);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error generating ideas',
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
          placeholder="e.g., 'Creative uses for a cardboard box'"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleGenerateIdeas()}
        />
        <Button onClick={handleGenerateIdeas} disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <BrainCircuit className="h-4 w-4" />
          )}
          <span className="ml-2 hidden sm:inline">Generate Ideas</span>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-headline">Generated Ideas</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-64">
            <div className="space-y-4">
              <AnimatePresence>
                {isLoading &&
                  Array.from({ length: 5 }).map((_, i) => (
                    <motion.div
                      key={`skeleton-${i}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-start gap-3"
                    >
                      <Wand2 className="h-5 w-5 mt-1 text-primary shrink-0" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                      </div>
                    </motion.div>
                  ))}
              </AnimatePresence>
              {!isLoading && ideas.length === 0 && (
                <div className="flex h-48 flex-col items-center justify-center text-center text-muted-foreground">
                  <BrainCircuit className="h-12 w-12 mb-4" />
                  <p>Your creative ideas will appear here.</p>
                </div>
              )}
              <AnimatePresence>
                {ideas.map((idea, index) => (
                  <motion.div
                    key={index}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, type: 'spring', stiffness: 300, damping: 20 }}
                    className="flex items-start gap-3"
                  >
                    <Wand2 className="h-5 w-5 mt-1 text-primary shrink-0" />
                    <p className="flex-1">{idea}</p>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
