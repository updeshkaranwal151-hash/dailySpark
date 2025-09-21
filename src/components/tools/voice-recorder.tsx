
'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Mic, Pause, Play, StopCircle, Download, Trash2, Radio } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Progress } from '../ui/progress';

type RecordingStatus = 'inactive' | 'recording' | 'paused';

export default function VoiceRecorderTool() {
  const [permission, setPermission] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [recordingStatus, setRecordingStatus] = useState<RecordingStatus>('inactive');
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [audio, setAudio] = useState<string | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const { toast } = useToast();
  const [recordingTime, setRecordingTime] = useState(0);
  const timerInterval = useRef<NodeJS.Timeout | null>(null);

  // For audio visualizer
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContext = useRef<AudioContext | null>(null);
  const analyser = useRef<AnalyserNode | null>(null);
  const animationFrameId = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      // Cleanup on component unmount
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      if (timerInterval.current) {
        clearInterval(timerInterval.current);
      }
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [stream]);

  const getMicrophonePermission = async () => {
    if ("MediaRecorder" in window) {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                audio: true,
                video: false,
            });
            setPermission(true);
            setStream(mediaStream);
        } catch (err: any) {
            toast({
                title: "Permission Denied",
                description: err.message,
                variant: 'destructive',
            })
        }
    } else {
        toast({
            title: "Unsupported Browser",
            description: "The MediaRecorder API is not supported in your browser.",
            variant: 'destructive',
        })
    }
  };

  const startRecording = async () => {
    if (!stream) {
      await getMicrophonePermission();
      // Need to re-trigger start after getting permission
      return;
    }
    
    if (recordingStatus !== 'inactive') return;

    setRecordingStatus("recording");
    const newMediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
    mediaRecorder.current = newMediaRecorder;
    mediaRecorder.current.start();
    
    setAudioChunks([]); // Clear previous chunks
    let localAudioChunks: Blob[] = [];
    mediaRecorder.current.ondataavailable = (event) => {
        if (typeof event.data === "undefined") return;
        if (event.data.size === 0) return;
        localAudioChunks.push(event.data);
    };
    mediaRecorder.current.onstop = () => {
        const audioBlob = new Blob(localAudioChunks, { type: "audio/webm" });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudio(audioUrl);
        setAudioChunks([]);
    }

    // Start timer
    setRecordingTime(0);
    timerInterval.current = setInterval(() => {
        setRecordingTime(prevTime => prevTime + 1);
    }, 1000);

    // Start visualizer
    if (!audioContext.current) {
        audioContext.current = new AudioContext();
    }
    if (!analyser.current) {
        analyser.current = audioContext.current.createAnalyser();
    }
    const source = audioContext.current.createMediaStreamSource(stream);
    source.connect(analyser.current);
    visualize();
  };
  
  const visualize = () => {
    if (!analyser.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const canvasCtx = canvas.getContext('2d');
    if (!canvasCtx) return;

    const bufferLength = analyser.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      if (!analyser.current) return;
      animationFrameId.current = requestAnimationFrame(draw);
      analyser.current.getByteTimeDomainData(dataArray);

      canvasCtx.fillStyle = 'hsl(var(--background))';
      canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
      canvasCtx.lineWidth = 2;
      canvasCtx.strokeStyle = 'hsl(var(--primary))';
      canvasCtx.beginPath();

      const sliceWidth = canvas.width * 1.0 / bufferLength;
      let x = 0;

      for(let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = v * canvas.height/2;

        if(i === 0) {
          canvasCtx.moveTo(x, y);
        } else {
          canvasCtx.lineTo(x, y);
        }
        x += sliceWidth;
      }

      canvasCtx.lineTo(canvas.width, canvas.height/2);
      canvasCtx.stroke();
    };

    draw();
  };

  const stopRecording = () => {
    if (!mediaRecorder.current || recordingStatus === 'inactive') return;
    
    setRecordingStatus("inactive");
    mediaRecorder.current.stop();

    // Stop timer
    if (timerInterval.current) {
        clearInterval(timerInterval.current);
    }
    
    // Stop visualizer
    if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
        animationFrameId.current = null;
    }
    if (analyser.current) {
        analyser.current.disconnect();
    }
     if (canvasRef.current) {
        const context = canvasRef.current.getContext('2d');
        context?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  };

  const clearRecording = () => {
    setAudio(null);
    setRecordingTime(0);
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  }


  return (
    <div className="space-y-6">
      {!permission ? (
        <Button onClick={getMicrophonePermission} className="w-full">
            <Mic className="mr-2" /> Grant Microphone Access
        </Button>
      ) : (
        <div className="flex flex-col sm:flex-row gap-2">
            {recordingStatus === 'inactive' ? (
                <Button onClick={startRecording} className="flex-1">
                    <Mic className="mr-2" /> Start Recording
                </Button>
            ) : (
                <Button onClick={stopRecording} variant="destructive" className="flex-1">
                    <StopCircle className="mr-2" /> Stop Recording
                </Button>
            )}
        </div>
      )}
      
      <Card>
        <CardContent className="p-6 text-center">
             <div className="relative h-20 w-full mb-4 bg-background rounded-md">
                <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
                {recordingStatus === 'inactive' && !audio && (
                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                        <p>Recording visualizer will appear here</p>
                    </div>
                )}
             </div>
            
            <div className="text-4xl font-mono font-bold mb-4">
                {formatTime(recordingTime)}
            </div>

            {recordingStatus === 'recording' && (
                <div className="flex items-center justify-center text-primary animate-pulse">
                    <Radio className="mr-2" /> Recording...
                </div>
            )}
            
            {audio && (
                <div className="space-y-4">
                     <audio src={audio} controls className="w-full" />
                     <div className="flex gap-2 justify-center">
                        <Button variant="outline" asChild>
                            <a href={audio} download={`recording-${Date.now()}.webm`}>
                                <Download className="mr-2" /> Download
                            </a>
                        </Button>
                        <Button variant="ghost" onClick={clearRecording}>
                            <Trash2 className="mr-2" /> Clear
                        </Button>
                     </div>
                </div>
            )}
        </CardContent>
      </Card>

    </div>
  );
}
