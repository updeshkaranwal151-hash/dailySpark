'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Bot, Loader2, SmilePlus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { detectEmotion } from '@/ai/flows/ai-emotion-detector';
import { AnimatePresence, motion } from 'framer-motion';

export default function AIEmotionDetectorTool() {
  const [text, setText] = useState('');
  const [result, setResult] = useState<{ emotion: string; emoji: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleDetectEmotion = async () => {
    if (!text.trim()) {
      toast({
        title: 'Text is empty',
        description: 'Please enter some text to analyze.',
        variant: 'destructive',
      });
      return;
    }
    setIsLoading(true);
    setResult(null);
    try {
      const analysisResult = await detectEmotion({ text });
      setResult(analysisResult);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error detecting emotion',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid gap-6">
      <div className="space-y-2">
        <p className="flex items-center gap-2 text-muted-foreground">
          <Bot className="h-5 w-5" />
          Enter the text you want to analyze for emotion.
        </p>
        <Textarea
          placeholder="e.g., 'I am so happy to see you! It's been a long time.'"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={6}
        />
      </div>
      <Button onClick={handleDetectEmotion} disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Analyzing...
          </>
        ) : (
          <>
            <SmilePlus className="mr-2 h-4 w-4" />
            Detect Emotion
          </>
        )}
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-headline">Analysis Result</CardTitle>
        </CardHeader>
        <CardContent className="h-32 flex items-center justify-center">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </motion.div>
            ) : result ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                className="text-center"
              >
                <div className="text-6xl">{result.emoji}</div>
                <p className="mt-2 text-2xl font-bold text-foreground">{result.emotion}</p>
              </motion.div>
            ) : (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center text-muted-foreground"
              >
                The detected emotion will appear here.
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
}
