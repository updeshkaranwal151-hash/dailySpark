
'use client';

import { useState, useRef, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Camera, Copy, Loader2, ScanLine } from 'lucide-react';
import { Button } from '../ui/button';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import jsQR from 'jsqr';

export default function QRScannerTool() {
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const getCameraPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        setHasCameraPermission(true);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Camera Access Denied',
          description: 'Please enable camera permissions in your browser settings to use this feature.',
        });
      }
    };

    getCameraPermission();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [toast]);

  useEffect(() => {
    let animationFrameId: number;

    const tick = () => {
      if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA && isScanning) {
        if (canvasRef.current) {
          const canvas = canvasRef.current;
          const video = videoRef.current;
          const context = canvas.getContext('2d');

          canvas.height = video.videoHeight;
          canvas.width = video.videoWidth;
          context?.drawImage(video, 0, 0, canvas.width, canvas.height);
          
          const imageData = context?.getImageData(0, 0, canvas.width, canvas.height);
          if (imageData) {
            const code = jsQR(imageData.data, imageData.width, imageData.height, {
              inversionAttempts: 'dontInvert',
            });

            if (code) {
              setScanResult(code.data);
              setIsScanning(false);
              toast({ title: 'QR Code Detected!', description: code.data });
            }
          }
        }
      }
      animationFrameId = requestAnimationFrame(tick);
    };

    if (isScanning) {
      animationFrameId = requestAnimationFrame(tick);
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isScanning, toast]);

  const handleCopy = () => {
    if (scanResult) {
      navigator.clipboard.writeText(scanResult);
      toast({ title: 'Copied to clipboard!' });
    }
  };

  const startScan = () => {
    setScanResult(null);
    setIsScanning(true);
  }

  return (
    <div className="space-y-4">
      <div className="relative w-full aspect-video bg-muted rounded-md overflow-hidden flex items-center justify-center">
        <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
        <canvas ref={canvasRef} className="hidden" />
        {isScanning && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2/3 h-2/3 border-4 border-primary/50 rounded-lg relative overflow-hidden">
                <div className="absolute top-0 w-full h-1 bg-primary animate-ping"></div>
                <ScanLine className="absolute top-0 w-full h-10 text-primary animate-[scan_2s_ease-in-out_infinite]" />
            </div>
          </div>
        )}
      </div>

      {hasCameraPermission === false && (
        <Alert variant="destructive">
          <Camera className="h-4 w-4" />
          <AlertTitle>Camera Access Required</AlertTitle>
          <AlertDescription>
            Please allow camera access in your browser to use the scanner.
          </AlertDescription>
        </Alert>
      )}

      {scanResult && (
        <Card>
          <CardHeader>
            <CardTitle>Scan Result</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-4">
            <p className="flex-1 text-sm break-all">{scanResult}</p>
            <Button variant="ghost" size="icon" onClick={handleCopy}>
              <Copy className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      )}

      <Button onClick={startScan} disabled={isScanning || hasCameraPermission !== true} className="w-full">
        {isScanning ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Scanning...
          </>
        ) : (
          <>
            <Camera className="mr-2 h-4 w-4" />
            {scanResult ? 'Scan Again' : 'Start Scanning'}
          </>
        )}
      </Button>
    </div>
  );
}

// Add keyframes to globals.css for the scan animation if they don't exist
// @keyframes scan { 0% { transform: translateY(-100%); } 100% { transform: translateY(100%); } }
// tailwind.config.js
// animation: { scan: 'scan 2s ease-in-out infinite' }
// Since I cannot modify tailwind config, I will use a simple ping animation on a line.
