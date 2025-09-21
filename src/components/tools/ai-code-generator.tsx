
'use client';

import { useState, useEffect } from 'react';
import { generateCode } from '@/ai/flows/ai-code-generator';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Bot, Clipboard, Code, Loader2, Terminal, Sparkles } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { ScrollArea } from '../ui/scroll-area';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';

function CodeGenerationLoader() {
    const [progress, setProgress] = useState(0);
    const controls = useAnimation();

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(prev => {
                const next = prev + 1;
                if (next >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                return next;
            });
        }, 80); // Simulate progress over ~8 seconds

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        controls.start({
            background: [
                "radial-gradient(circle, hsl(var(--primary) / 0.1) 0%, transparent 70%)",
                "radial-gradient(circle, hsl(var(--primary) / 0.2) 0%, transparent 70%)",
                "radial-gradient(circle, hsl(var(--primary) / 0.1) 0%, transparent 70%)",
            ],
            transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
        });
    }, [controls]);

    const orbSize = 64 + (progress / 100) * 16;

    return (
        <div className="w-full h-64 bg-gradient-to-br from-indigo-950 via-blue-950 to-gray-900 rounded-lg p-4 flex flex-col justify-center items-center relative overflow-hidden">
            <div className="relative w-32 h-32 flex items-center justify-center">
                {/* Stage 3: Grid */}
                <AnimatePresence>
                    {progress > 60 && (
                        <motion.svg
                            width="128"
                            height="128"
                            viewBox="0 0 128 128"
                            className="absolute opacity-30"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.3 }}
                            transition={{ duration: 1 }}
                        >
                            {Array.from({ length: 9 }).map((_, i) => (
                                <motion.line
                                    key={`h-${i}`}
                                    x1="0"
                                    y1={16 * i}
                                    x2="128"
                                    y2={16 * i}
                                    stroke="hsl(var(--primary))"
                                    strokeWidth="0.5"
                                    initial={{ pathLength: 0, opacity: 0 }}
                                    animate={{ pathLength: 1, opacity: 1, transition: { duration: 0.5, delay: i * 0.05 } }}
                                />
                            ))}
                            {Array.from({ length: 9 }).map((_, i) => (
                                <motion.line
                                    key={`v-${i}`}
                                    x1={16 * i}
                                    y1="0"
                                    x2={16 * i}
                                    y2="128"
                                    stroke="hsl(var(--primary))"
                                    strokeWidth="0.5"
                                    initial={{ pathLength: 0, opacity: 0 }}
                                    animate={{ pathLength: 1, opacity: 1, transition: { duration: 0.5, delay: i * 0.05 + 0.5 } }}
                                />
                            ))}
                        </motion.svg>
                    )}
                </AnimatePresence>

                 {/* Stage 2: Neural Pathways */}
                <AnimatePresence>
                    {progress > 30 &&
                        Array.from({ length: 6 }).map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute w-full h-full"
                                initial={{ opacity: 0, scale: 0.8, rotate: i * 60 }}
                                animate={{ opacity: 0.4, scale: 1, transition: { delay: i * 0.1, duration: 1, ease: 'easeOut' } }}
                            >
                                <svg viewBox="0 0 100 100">
                                    <motion.path
                                        d="M50 50, C 60 40, 80 40, 90 50"
                                        stroke="hsl(var(--primary) / 0.8)"
                                        strokeWidth="1"
                                        fill="transparent"
                                        initial={{ pathLength: 0 }}
                                        animate={{ pathLength: 1 }}
                                        transition={{ duration: 1.5, ease: "circOut" }}
                                    />
                                </svg>
                            </motion.div>
                        ))}
                </AnimatePresence>
                
                {/* Central Orb */}
                <motion.div
                    className="absolute rounded-full bg-primary shadow-glow"
                    animate={{ width: orbSize, height: orbSize, opacity: 0.8 + (progress / 100) * 0.2 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                >
                    {/* Stage 1: Spark Particles */}
                    <AnimatePresence>
                        {progress > 0 && Array.from({ length: 10 }).map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute w-1 h-1 bg-cyan-300 rounded-full"
                                initial={{
                                    x: '50%', y: '50%', scale: 0,
                                    
                                }}
                                animate={{
                                    x: `${50 + Math.cos((i / 10) * 2 * Math.PI) * (30 + (progress/2))}px`,
                                    y: `${50 + Math.sin((i / 10) * 2 * Math.PI) * (30 + (progress/2))}px`,
                                    scale: [0, 1, 0],
                                    opacity: [0, 0.7, 0],
                                }}
                                transition={{
                                    duration: 1.5 + Math.random(),
                                    delay: Math.random() * (1 - progress/100),
                                    repeat: Infinity,
                                    repeatDelay: 1,
                                }}
                            />
                        ))}
                    </AnimatePresence>
                </motion.div>

                {/* Orb background glow */}
                 <motion.div
                    className="absolute w-32 h-32 rounded-full"
                    animate={controls}
                />
            </div>

            {/* Progress Bar & Text */}
            <div className="absolute bottom-4 left-4 right-4 text-center">
                 <AnimatePresence mode="wait">
                    <motion.div
                        key={Math.floor(progress / 25)}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="text-sm text-gray-300 mb-2"
                    >
                       {progress < 30 ? 'Analyzing your request…'
                         : progress < 60 ? 'Wiring up logic circuits…'
                         : progress < 90 ? 'Brewing clean code…'
                         : 'Finalizing magic…'}
                    </motion.div>
                </AnimatePresence>
                <div className="w-full h-1 bg-primary/20 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-primary"
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.1, ease: "linear" }}
                    />
                </div>
            </div>
            
             {/* Code Ready Message */}
             <AnimatePresence>
                {progress >= 100 && (
                     <motion.div
                        className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2, type: 'spring' }}
                            className="flex items-center gap-2 text-xl font-bold text-white"
                        >
                            <Sparkles className="text-cyan-300" />
                            Code Ready
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
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
      // Add a small delay to allow the "Code Ready" animation to finish
      setTimeout(() => setIsLoading(false), 1000);
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
                        <pre className="text-sm whitespace-pre-wrap break-all font-code overflow-auto">
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

    