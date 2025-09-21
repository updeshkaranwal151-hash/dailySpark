
'use client';

import { useState } from 'react';
import { smartSearch } from '@/ai/flows/ai-smart-search';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Search, Bot } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { ScrollArea } from '../ui/scroll-area';
import { Skeleton } from '../ui/skeleton';
import { AnimatePresence, motion } from 'framer-motion';

export default function AISmartSearchTool() {
  const [query, setQuery] = useState('');
  const [answer, setAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSearch = async () => {
    if (!query.trim()) {
      toast({
        title: 'Query is empty',
        description: 'Please enter a question to search for.',
        variant: 'destructive',
      });
      return;
    }
    setIsLoading(true);
    setAnswer('');
    try {
      const result = await smartSearch({ query });
      setAnswer(result.answer);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error performing search',
        description: 'Something went wrong. The model may not have been able to find an answer.',
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
          placeholder="e.g., 'What is the capital of France?'"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <Button onClick={handleSearch} disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Search className="h-4 w-4" />
          )}
          <span className="ml-2 hidden sm:inline">Search</span>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-headline flex items-center gap-2">
            <Bot />
            Answer
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-48">
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div key="loading" className="space-y-2 p-1">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-[90%]" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-[75%]" />
                </motion.div>
              ) : answer ? (
                <motion.p
                  key="answer"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm p-1"
                >
                  {answer}
                </motion.p>
              ) : (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex h-full items-center justify-center text-center text-muted-foreground"
                >
                  The answer to your question will appear here.
                </motion.div>
              )}
            </AnimatePresence>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
