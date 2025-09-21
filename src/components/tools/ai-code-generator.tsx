
'use client';

import { useState, useEffect } from 'react';
import { generateCode } from '@/ai/flows/ai-code-generator';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Bot, Clipboard, Code, Loader2, Terminal } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { ScrollArea } from '../ui/scroll-area';
import { motion, AnimatePresence } from 'framer-motion';

const fakeCodeLines = [
  "import { Galaxy } from 'cosmic-engine';",
  'const singularity = new BlackHole({ mass: "1M" });',
  'async function warpDrive() {',
  '  await spacetime.fold(5);',
  '}',
  '// Initializing quantum entanglement...',
  'const qubitA = createQubit("up");',
  'const qubitB = createQubit("down");',
  'entangle(qubitA, qubitB);',
  'console.log("...Hello, other side!");',
];

const loadingPhases = [
  'Analyzing your request…',
  'Wiring up logic circuits…',
  'Brewing clean code…',
  'Finalizing magic…',
];

function CodeGenerationLoader() {
  const [currentLine, setCurrentLine] = useState('');
  const [lines, setLines] = useState<string[]>([]);
  const [codeIndex, setCodeIndex] = useState(0);
  const [phaseIndex, setPhaseIndex] = useState(0);

  useEffect(() => {
    const phaseInterval = setInterval(() => {
      setPhaseIndex(prev => (prev + 1) % loadingPhases.length);
    }, 2000);
    return () => clearInterval(phaseInterval);
  }, []);

  useEffect(() => {
    if (codeIndex >= fakeCodeLines.length) {
      setTimeout(() => {
        setLines([]);
        setCodeIndex(0);
      }, 1500);
      return;
    }

    let charIndex = 0;
    const line = fakeCodeLines[codeIndex];
    const typingInterval = setInterval(() => {
      setCurrentLine(line.substring(0, charIndex + 1));
      charIndex++;
      if (charIndex === line.length) {
        clearInterval(typingInterval);
        setLines(prev => [...prev, line]);
        setCurrentLine('');
        setCodeIndex(prev => prev + 1);
      }
    }, 50);

    return () => clearInterval(typingInterval);
  }, [codeIndex]);

  return (
    <div className="w-full h-64 bg-gradient-to-br from-gray-900 via-purple-900 to-cyan-900 rounded-lg p-4 flex flex-col justify-between relative overflow-hidden">
      {/* Edge circuits */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-1 bg-cyan-400/50 shadow-glow"
        initial={{ width: 0 }}
        animate={{ width: '100%' }}
        transition={{ duration: 1, repeat: Infinity, repeatType: 'mirror' }}
      />
       <motion.div
        className="absolute bottom-0 left-0 right-0 h-1 bg-purple-400/50 shadow-glow"
        initial={{ width: 0, x: '100%' }}
        animate={{ width: '100%', x: 0 }}
        transition={{ duration: 1, repeat: Infinity, repeatType: 'mirror', delay: 0.5 }}
      />

      {/* Terminal */}
      <div className="font-code text-green-400 text-xs bg-black/50 rounded-md p-2 overflow-hidden h-40 relative">
        {lines.map((line, i) => (
          <p key={i} className="whitespace-nowrap">{`> ${line}`}</p>
        ))}
        <p className="whitespace-nowrap">
          {`> ${currentLine}`}
          <motion.span
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 0.8, repeat: Infinity }}
            className="inline-block w-2 h-3 bg-green-400"
          />
        </p>
      </div>
      
      {/* AI Bot and Progress */}
      <div className="flex items-center gap-4">
        <motion.div
            animate={{ y: [-2, 2, -2], rotate: [-5, 5, -5] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
            <Bot className="w-8 h-8 text-cyan-300" />
        </motion.div>
        <div className="flex-1 text-center">
            <AnimatePresence mode="wait">
                <motion.p 
                    key={phaseIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.5 }}
                    className="text-sm text-gray-200 font-medium"
                >
                    {loadingPhases[phaseIndex]}
                </motion.p>
            </AnimatePresence>
        </div>
      </div>
    </div>
  );
}


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
                <p className="font-mono text-sm text-muted-foreground flex items-center gap-2">
                  <Terminal className="h-4 w-4" />
                  Generated Code
                </p>
                 <Button variant="ghost" size="icon" onClick={handleCopyCode} disabled={!generatedCode}>
                    <Clipboard className="h-4 w-4" />
                </Button>
            </div>
            {isLoading ? (
              <CodeGenerationLoader />
            ) : (
              <ScrollArea className="h-64">
                  <div className="p-4">
                      {generatedCode ? (
                        <pre className="text-sm whitespace-pre-wrap break-words font-code">
                            <code>{generatedCode}</code>
                        </pre>
                      ) : (
                          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground min-h-[15rem]">
                              <Code className="w-12 h-12 mb-4"/>
                              <p>Your generated code will appear here.</p>
                          </div>
                      )}
                  </div>
              </ScrollArea>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
