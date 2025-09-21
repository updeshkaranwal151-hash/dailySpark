
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Loader2, Search, Newspaper, ExternalLink } from 'lucide-react';
import { getNews, GetNewsOutput } from '@/ai/flows/ai-news-aggregator';
import { Skeleton } from '../ui/skeleton';
import { GEMINI_API_KEY_STORAGE_KEY } from '@/lib/constants';
import { AnimatePresence, motion } from 'framer-motion';

export default function NewsAggregatorTool() {
  const [topic, setTopic] = useState('Latest Tech');
  const [news, setNews] = useState<GetNewsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGetNews = async () => {
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
        description: 'Please enter a topic to search for news.',
        variant: 'destructive',
      });
      return;
    }
    setIsLoading(true);
    setNews(null);
    try {
      const result = await getNews({ topic, apiKey });
      setNews(result);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error fetching news',
        description: 'Could not retrieve news for that topic. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fetch initial news on component mount
  useState(() => {
    handleGetNews();
  });

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <Input
          placeholder="Enter a news topic, e.g., 'Artificial Intelligence'"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleGetNews()}
        />
        <Button onClick={handleGetNews} disabled={isLoading}>
          {isLoading ? <Loader2 className="animate-spin" /> : <Search />}
          <span className="ml-2 hidden sm:inline">Get News</span>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence>
        {isLoading &&
          Array.from({ length: 6 }).map((_, i) => (
            <motion.div key={`skeleton-${i}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.1 }}>
                <Card className="h-full flex flex-col">
                <CardHeader>
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent className="flex-grow">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full mt-2" />
                </CardContent>
                <CardFooter>
                    <Skeleton className="h-8 w-24" />
                </CardFooter>
                </Card>
            </motion.div>
          ))}
        </AnimatePresence>

        <AnimatePresence>
            {!isLoading && news?.articles?.map((article, i) => (
            <motion.div key={article.url} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                <Card className="h-full flex flex-col hover:bg-muted/50 transition-colors">
                <CardHeader>
                    <CardTitle className="text-lg leading-tight">{article.title}</CardTitle>
                    <CardDescription>{article.source}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                    <p className="text-sm text-muted-foreground">{article.summary}</p>
                </CardContent>
                <CardFooter>
                    <Button asChild variant="outline" size="sm">
                    <a href={article.url} target="_blank" rel="noopener noreferrer">
                        Read More
                        <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                    </Button>
                </CardFooter>
                </Card>
            </motion.div>
            ))}
        </AnimatePresence>
      </div>

      {!isLoading && (!news || news.articles.length === 0) && (
        <div className="text-center text-muted-foreground py-16">
          <Newspaper className="mx-auto h-12 w-12" />
          <h3 className="mt-4 text-lg font-semibold">No News Found</h3>
          <p className="mt-1 text-sm">Try searching for a different topic.</p>
        </div>
      )}
    </div>
  );
}
