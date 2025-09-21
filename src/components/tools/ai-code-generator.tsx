'use client';

import { useState } from 'react';
import { generateCode } from '@/ai/flows/ai-code-generator';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Bot, Clipboard, Code, Loader2 } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Skeleton } from '../ui/skeleton';
import { ScrollArea } from '../ui/scroll-area';

export default function AICodeGeneratorTool() {
  const [description, setDescription] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerateCode = async () => {
    if (!description.trim()) {
      toast({
        title: 'Description is empty',
        description: 'Please describe the program you want to generate.',
        variant: 'destructive',
      });
      return;
    }
    setIsLoading(true);
    setGeneratedCode('');
    try {
      const result = await generateCode({ programDescription: description });
      setGeneratedCode(result.code);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error generating code',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyCode = () => {
    if (!generatedCode) return;
    navigator.clipboard.writeText(generatedCode);
    toast({
      title: 'Copied to clipboard!',
      description: 'The generated code has been copied.',
    });
  };

  return (
    <div className="grid gap-6">
      <div className="space-y-2">
        <p className="flex items-center gap-2 text-muted-foreground">
          <Bot className="h-5 w-5" />
          Describe the program you want to create.
        </p>
        <Textarea
          placeholder="e.g., 'A Python function that takes a list of numbers and returns the sum'"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
        />
      </div>
      <Button onClick={handleGenerateCode} disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Code className="mr-2 h-4 w-4" />
            Generate Code
          </>
        )}
      </Button>

      <Card>
        <CardContent className="p-0">
          <div className="relative">
             <div className="p-4 flex items-center justify-between bg-muted/50 border-b">
                <p className="font-mono text-sm text-muted-foreground">Generated Code</p>
                 <Button variant="ghost" size="icon" onClick={handleCopyCode} disabled={!generatedCode}>
                    <Clipboard className="h-4 w-4" />
                </Button>
            </div>
            <ScrollArea className="h-64">
                <div className="p-4">
                    {isLoading ? (
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-[80%]" />
                        <Skeleton className="h-4 w-[90%]" />
                        <Skeleton className="h-4 w-[75%]" />
                        <Skeleton className="h-4 w-[85%]" />
                    </div>
                    ) : generatedCode ? (
                    <pre className="text-sm">
                        <code>{generatedCode}</code>
                    </pre>
                    ) : (
                        <div className="flex items-center justify-center h-full text-center text-muted-foreground">
                            Your generated code will appear here.
                        </div>
                    )}
                </div>
            </ScrollArea>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
