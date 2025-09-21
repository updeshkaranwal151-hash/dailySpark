
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { ArrowRightLeft, Bot, Clipboard, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from '../ui/skeleton';
import { translateText } from '@/ai/flows/ai-translator';


const languages = [
    { value: "English", label: "English" },
    { value: "Spanish", label: "Spanish" },
    { value: "French", label: "French" },
    { value: "German", label: "German" },
    { value: "Mandarin Chinese", label: "Mandarin Chinese" },
    { value: "Japanese", label: "Japanese" },
    { value: "Russian", label: "Russian" },
    { value: "Arabic", label: "Arabic" },
    { value: "Hindi", label: "Hindi" },
];

export default function TranslatorTool() {
  const [text, setText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [targetLanguage, setTargetLanguage] = useState('Spanish');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleTranslate = async () => {
    if (!text.trim()) {
      toast({
        title: 'Text is empty',
        description: 'Please enter the text you want to translate.',
        variant: 'destructive',
      });
      return;
    }
    setIsLoading(true);
    setTranslatedText('');
    try {
      const result = await translateText({ text, targetLanguage });
      setTranslatedText(result.translatedText);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error translating text',
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
    toast({
      title: 'Copied to clipboard!',
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <Textarea
          placeholder="Enter text to translate..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={8}
        />
        <div className="flex justify-end">
            <Button variant="ghost" size="icon" onClick={() => handleCopy(text)} disabled={!text}>
                <Clipboard className="h-4 w-4" />
            </Button>
        </div>
      </div>
      
      <div className="space-y-4">
         <Card className="h-full flex flex-col">
            <CardHeader className="flex-row items-center justify-between pb-2">
                <CardTitle className="text-base font-medium">Translation</CardTitle>
                 <Button variant="ghost" size="icon" onClick={() => handleCopy(translatedText)} disabled={!translatedText}>
                    <Clipboard className="h-4 w-4" />
                </Button>
            </CardHeader>
            <CardContent className="flex-1">
                 {isLoading ? (
                    <div className="space-y-2 pt-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-[75%]" />
                    </div>
                ) : translatedText ? (
                    <p className="text-sm">{translatedText}</p>
                ) : (
                    <div className="text-center text-muted-foreground pt-8">
                        Your translation will appear here.
                    </div>
                )}
            </CardContent>
         </Card>
      </div>

      <div className="md:col-span-2 flex flex-col sm:flex-row gap-4 justify-center items-center">
        <div className="flex-1 w-full sm:w-auto">
            <Select defaultValue="auto">
                <SelectTrigger>
                    <SelectValue placeholder="Detect Language" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="auto">Detect Language</SelectItem>
                </SelectContent>
            </Select>
        </div>

        <Button onClick={handleTranslate} disabled={isLoading} variant="ghost" size="icon" className="hidden sm:flex">
             {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                <ArrowRightLeft className="h-5 w-5" />
            )}
        </Button>
        
        <div className="flex-1 w-full sm:w-auto">
            <Select value={targetLanguage} onValueChange={setTargetLanguage}>
                <SelectTrigger>
                    <SelectValue placeholder="Select Language" />
                </SelectTrigger>
                <SelectContent>
                {languages.map(lang => (
                    <SelectItem key={lang.value} value={lang.value}>
                        {lang.label}
                    </SelectItem>
                ))}
                </SelectContent>
            </Select>
        </div>

        <Button onClick={handleTranslate} disabled={isLoading} className="w-full sm:hidden">
             {isLoading ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Translating...
                </>
                ) : (
                <>
                    <Bot className="mr-2 h-4 w-4" />
                    Translate
                </>
            )}
        </Button>
      </div>
    </div>
  );
}
