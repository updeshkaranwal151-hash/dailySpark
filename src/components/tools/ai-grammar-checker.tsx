
'use client';

import { useState } from 'react';
import { checkGrammar } from '@/ai/flows/ai-grammar-checker';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { ArrowRight, Clipboard, Loader2, SpellCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { ScrollArea } from '../ui/scroll-area';
import { Skeleton } from '../ui/skeleton';
import { GEMINI_API_KEY_STORAGE_KEY } from '@/lib/constants';

export default function AIGrammarCheckerTool() {
  const [text, setText] = useState('');
  const [correctedText, setCorrectedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleCheckGrammar = async () => {
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
        description: 'Please enter text to check.',
        variant: 'destructive',
      });
      return;
    }
    setIsLoading(true);
    setCorrectedText('');
    try {
      const result = await checkGrammar({ text, apiKey });
      setCorrectedText(result.correctedText);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error checking grammar',
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
      <div className="space-y-2 h-full flex flex-col">
        <CardTitle>Original Text</CardTitle>
        <Textarea
          placeholder="Enter text with potential grammar or spelling mistakes..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={10}
          className="flex-1"
        />
        <div className="flex justify-end">
            <Button variant="ghost" size="icon" onClick={() => handleCopy(text)} disabled={!text}>
                <Clipboard className="h-4 w-4" />
            </Button>
        </div>
      </div>
      
      <div className="space-y-2 h-full flex flex-col">
        <CardTitle>Corrected Text</CardTitle>
         <Card className="h-full flex flex-col flex-1">
            <CardContent className="p-4 flex-1">
                <ScrollArea className="h-full">
                 {isLoading ? (
                    <div className="space-y-2 pt-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-[80%]" />
                        <Skeleton className="h-4 w-full" />
                    </div>
                ) : correctedText ? (
                    <p>{correctedText}</p>
                ) : (
                    <div className="text-center text-muted-foreground pt-8 h-full flex flex-col justify-center items-center">
                        <SpellCheck className="w-12 h-12 mb-4" />
                        <p>Corrections will appear here.</p>
                    </div>
                )}
                </ScrollArea>
            </CardContent>
            <div className="flex justify-end p-2 border-t">
                 <Button variant="ghost" size="icon" onClick={() => handleCopy(correctedText)} disabled={!correctedText}>
                    <Clipboard className="h-4 w-4" />
                </Button>
            </div>
         </Card>
      </div>

      <div className="md:col-span-2">
        <Button onClick={handleCheckGrammar} disabled={isLoading} className="w-full">
            {isLoading ? (
            <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Checking...
            </>
            ) : (
            <>
                <SpellCheck className="mr-2 h-4 w-4" />
                Check Grammar
            </>
            )}
        </Button>
      </div>
    </div>
  );
}
