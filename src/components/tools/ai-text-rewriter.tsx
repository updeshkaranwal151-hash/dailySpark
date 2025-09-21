
'use client';

import { useState } from 'react';
import { rewriteText } from '@/ai/flows/ai-text-rewriter';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Clipboard, Loader2, PilcrowSquare } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { ScrollArea } from '../ui/scroll-area';
import { Skeleton } from '../ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

const tones = ["formal", "casual", "confident", "witty", "humorous", "concise"];

export default function AITextRewriterTool() {
  const [text, setText] = useState('');
  const [rewrittenText, setRewrittenText] = useState('');
  const [tone, setTone] = useState('formal');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleRewrite = async () => {
    if (!text.trim()) {
      toast({
        title: 'Text is empty',
        description: 'Please enter text to rewrite.',
        variant: 'destructive',
      });
      return;
    }
    setIsLoading(true);
    setRewrittenText('');
    try {
      const result = await rewriteText({ text, tone });
      setRewrittenText(result.rewrittenText);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error rewriting text',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (textToCopy: string) => {
    if (!textToCopy) return;
    navigator.clipboard.writeText(textToCopy);
    toast({ title: 'Copied to clipboard!' });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
      <div className="space-y-2 h-full flex flex-col">
        <CardTitle>Original Text</CardTitle>
        <Textarea
          placeholder="Enter text you want to rewrite..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={10}
          className="flex-1"
        />
      </div>
      
      <div className="space-y-2 h-full flex flex-col">
        <CardTitle>Rewritten Text</CardTitle>
         <Card className="h-full flex flex-col flex-1">
             <CardHeader className="flex-row items-center justify-between pb-2">
                <p className="text-sm text-muted-foreground">Suggestion:</p>
                <Button variant="ghost" size="icon" onClick={() => handleCopy(rewrittenText)} disabled={!rewrittenText}>
                    <Clipboard className="h-4 w-4" />
                </Button>
            </CardHeader>
            <CardContent className="p-4 pt-0 flex-1">
                <ScrollArea className="h-full min-h-[150px]">
                 {isLoading ? (
                    <div className="space-y-2 pt-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-[80%]" />
                        <Skeleton className="h-4 w-full" />
                    </div>
                ) : rewrittenText ? (
                    <p>{rewrittenText}</p>
                ) : (
                    <div className="text-center text-muted-foreground pt-8 h-full flex flex-col justify-center items-center">
                        <PilcrowSquare className="w-12 h-12 mb-4" />
                        <p>Your rewritten text will appear here.</p>
                    </div>
                )}
                </ScrollArea>
            </CardContent>
         </Card>
      </div>

      <div className="md:col-span-2 flex flex-col sm:flex-row gap-4">
        <Select value={tone} onValueChange={setTone}>
            <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Select a tone" />
            </SelectTrigger>
            <SelectContent>
                {tones.map(t => <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>)}
            </SelectContent>
        </Select>
        <Button onClick={handleRewrite} disabled={isLoading} className="w-full flex-1">
            {isLoading ? (
            <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Rewriting...
            </>
            ) : (
            <>
                <PilcrowSquare className="mr-2 h-4 w-4" />
                Rewrite Text
            </>
            )}
        </Button>
      </div>
    </div>
  );
}
