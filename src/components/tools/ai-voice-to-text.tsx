
'use client';

import { useState, useRef } from 'react';
import { voiceToText } from '@/ai/flows/ai-voice-to-text';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Upload, Loader2, AudioLines, Clipboard } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { AnimatePresence, motion } from 'framer-motion';
import { ScrollArea } from '../ui/scroll-area';

export default function AIVoiceToTextTool() {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioDataUri, setAudioDataUri] = useState<string | null>(null);
  const [transcription, setTranscription] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) { // 4MB limit
        toast({
          title: 'File is too large',
          description: 'Please upload an audio file smaller than 4MB.',
          variant: 'destructive',
        });
        return;
      }
      setAudioFile(file);
      setTranscription(null);
      
      const reader = new FileReader();
      reader.onload = (event) => {
        setAudioDataUri(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTranscribe = async () => {
    if (!audioDataUri) {
      toast({
        title: 'No audio file selected',
        description: 'Please upload an audio file to transcribe.',
        variant: 'destructive',
      });
      return;
    }
    setIsLoading(true);
    setTranscription(null);
    try {
      const result = await voiceToText({ audioDataUri });
      setTranscription(result.transcription);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error transcribing audio',
        description: 'Something went wrong. Please try a different audio file.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (transcription) {
      navigator.clipboard.writeText(transcription);
      toast({ title: 'Copied to clipboard!' });
    }
  };

  return (
    <div className="grid gap-6">
      <div
        className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary"
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className="w-12 h-12 text-muted-foreground" />
        <p className="mt-2 text-sm text-muted-foreground">Click to upload an audio file (MP3, WAV, M4A)</p>
        <p className="text-xs text-muted-foreground/80">Max file size: 4MB</p>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="audio/mpeg, audio/wav, audio/mp4"
        />
        {audioFile && <p className="mt-4 text-sm font-semibold">{audioFile.name}</p>}
      </div>

      <Button onClick={handleTranscribe} disabled={isLoading || !audioFile}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Transcribing...
          </>
        ) : (
          <>
            <AudioLines className="mr-2 h-4 w-4" />
            Transcribe Audio
          </>
        )}
      </Button>

      <Card className="min-h-[12rem]">
        <CardContent className="p-4">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div key="loading" className="flex items-center justify-center h-full">
                 <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </motion.div>
            ) : transcription ? (
              <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="flex justify-end mb-2">
                    <Button variant="ghost" size="icon" onClick={handleCopy}>
                        <Clipboard className="h-4 w-4" />
                    </Button>
                </div>
                <ScrollArea className="h-48">
                    <p className="text-sm whitespace-pre-wrap">{transcription}</p>
                </ScrollArea>
              </motion.div>
            ) : (
              <motion.div
                key="placeholder"
                className="flex flex-col h-full min-h-[10rem] items-center justify-center text-center text-muted-foreground"
              >
                <AudioLines className="w-10 h-10 mb-2" />
                <p>Transcription will appear here.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
}
