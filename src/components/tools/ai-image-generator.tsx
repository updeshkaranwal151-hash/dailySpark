'use client';

import { useState } from 'react';
import Image from 'next/image';
import { generateImage } from '@/ai/flows/ai-image-generator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Bot, Download, Image as ImageIcon, Loader2 } from 'lucide-react';
import { Card, CardContent } from '../ui/card';

export default function AIImageGeneratorTool() {
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerateImage = async () => {
    if (!prompt.trim()) {
      toast({
        title: 'Prompt is empty',
        description: 'Please describe the image you want to generate.',
        variant: 'destructive',
      });
      return;
    }
    setIsLoading(true);
    setImageUrl('');
    try {
      const result = await generateImage({ prompt });
      setImageUrl(result.imageUrl);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error generating image',
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
          Describe the image you want to create.
        </p>
        <div className="flex gap-2">
          <Input
            placeholder="e.g., 'A hyperrealistic photo of an astronaut playing guitar on Mars'"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && handleGenerateImage()}
          />
          <Button onClick={handleGenerateImage} disabled={isLoading} className="whitespace-nowrap">
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ImageIcon className="h-4 w-4" />
            )}
             <span className="ml-2 hidden sm:inline">Generate</span>
          </Button>
        </div>
      </div>
      
      <Card>
        <CardContent className="p-4">
          <div className="aspect-video w-full flex items-center justify-center bg-muted/50 rounded-md overflow-hidden relative">
            {isLoading && (
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <Loader2 className="h-8 w-8 animate-spin" />
                <p>Generating your masterpiece...</p>
              </div>
            )}
            {!isLoading && imageUrl && (
              <>
                <Image src={imageUrl} alt={prompt} layout="fill" objectFit="contain" />
                <Button 
                  size="icon" 
                  className="absolute bottom-4 right-4" 
                  onClick={() => window.open(imageUrl, '_blank')}
                  aria-label="Download image"
                >
                  <Download className="h-4 w-4"/>
                </Button>
              </>
            )}
            {!isLoading && !imageUrl && (
              <div className="text-center text-muted-foreground">
                <ImageIcon className="mx-auto h-12 w-12" />
                <p className="mt-2">Your generated image will appear here.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
