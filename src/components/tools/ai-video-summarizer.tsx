
'use client';

import { useState, useRef } from 'react';
import { summarizeVideo } from '@/ai/flows/ai-video-summarizer';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Upload, Loader2, Clapperboard, Clipboard } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { AnimatePresence, motion } from 'framer-motion';
import { ScrollArea } from '../ui/scroll-area';
import { Skeleton } from '../ui/skeleton';

const MAX_FILE_SIZE_MB = 20;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export default function AIVideoSummarizerTool() {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoDataUri, setVideoDataUri] = useState<string | null>(null);
  const [summary, setSummary] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE_BYTES) {
        toast({
          title: 'File is too large',
          description: `Please upload a video file smaller than ${MAX_FILE_SIZE_MB}MB.`,
          variant: 'destructive',
        });
        return;
      }
      setVideoFile(file);
      setSummary(null);
      
      const reader = new FileReader();
      reader.onload = (event) => {
        setVideoDataUri(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSummarize = async () => {
    if (!videoDataUri) {
      toast({
        title: 'No video file selected',
        description: 'Please upload a video file to summarize.',
        variant: 'destructive',
      });
      return;
    }
    setIsLoading(true);
    setSummary(null);
    try {
      const result = await summarizeVideo({ videoDataUri });
      setSummary(result.summary);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error summarizing video',
        description: 'Something went wrong. The model may not support this video format or the video may be too long.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (summary) {
      navigator.clipboard.writeText(summary);
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
        <p className="mt-2 text-sm text-muted-foreground">Click to upload a video file (MP4, MOV, etc.)</p>
        <p className="text-xs text-muted-foreground/80">Max file size: {MAX_FILE_SIZE_MB}MB</p>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="video/*"
        />
      </div>

      {videoFile && (
        <div className="text-center">
            <p className="text-sm font-semibold">{videoFile.name}</p>
            {videoDataUri && <video src={videoDataUri} controls className="w-full max-h-64 rounded-md mt-2 bg-muted"></video>}
        </div>
      )}


      <Button onClick={handleSummarize} disabled={isLoading || !videoFile}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Summarizing...
          </>
        ) : (
          <>
            <Clapperboard className="mr-2 h-4 w-4" />
            Summarize Video
          </>
        )}
      </Button>

      <Card className="min-h-[12rem]">
        <CardContent className="p-4">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div key="loading" className="p-1 space-y-2">
                 <Skeleton className="h-4 w-[90%]" />
                 <Skeleton className="h-4 w-full" />
                 <Skeleton className="h-4 w-[70%]" />
              </motion.div>
            ) : summary ? (
              <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="flex justify-end mb-2">
                    <Button variant="ghost" size="icon" onClick={handleCopy}>
                        <Clipboard className="h-4 w-4" />
                    </Button>
                </div>
                <ScrollArea className="h-48">
                    <p className="text-sm whitespace-pre-wrap">{summary}</p>
                </ScrollArea>
              </motion.div>
            ) : (
              <motion.div
                key="placeholder"
                className="flex flex-col h-full min-h-[10rem] items-center justify-center text-center text-muted-foreground"
              >
                <Clapperboard className="w-10 h-10 mb-2" />
                <p>Video summary will appear here.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
}
