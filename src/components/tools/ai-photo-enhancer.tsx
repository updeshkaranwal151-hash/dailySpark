'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { enhancePhoto } from '@/ai/flows/ai-photo-enhancer';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Download, Image as ImageIcon, Loader2, Upload, Wand2, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { AnimatePresence, motion } from 'framer-motion';

export default function AIPhotoEnhancerTool() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [enhancedImage, setEnhancedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setOriginalImage(event.target?.result as string);
        setEnhancedImage(null); // Reset enhanced image on new upload
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEnhance = async () => {
    if (!originalImage) {
      toast({
        title: 'No image selected',
        description: 'Please upload an image to enhance.',
        variant: 'destructive',
      });
      return;
    }
    setIsLoading(true);
    setEnhancedImage(null);
    try {
      const result = await enhancePhoto({ photoDataUri: originalImage });
      setEnhancedImage(result.enhancedImageUrl);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error enhancing photo',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid gap-6">
      {!originalImage && (
        <div
          className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="w-12 h-12 text-muted-foreground" />
          <p className="mt-2 text-sm text-muted-foreground">Click or drag & drop to upload an image</p>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            className="hidden"
            accept="image/png, image/jpeg, image/webp"
          />
        </div>
      )}

      {originalImage && (
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center gap-4">
            {/* Original Image */}
            <div className="space-y-2">
                <h3 className="text-center font-semibold">Original</h3>
                <Card>
                    <CardContent className="p-2">
                        <div className="aspect-square w-full relative">
                            <Image src={originalImage} alt="Original" layout="fill" objectFit="contain" className="rounded-md" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Arrow and loading */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={isLoading ? 'loading' : 'arrow'}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    className="flex items-center justify-center"
                >
                    {isLoading ? <Loader2 className="w-8 h-8 animate-spin text-primary" /> : <ArrowRight className="w-8 h-8 text-muted-foreground hidden md:block" />}
                </motion.div>
            </AnimatePresence>

            {/* Enhanced Image */}
            <div className="space-y-2">
                <h3 className="text-center font-semibold">Enhanced</h3>
                <Card>
                    <CardContent className="p-2">
                        <div className="aspect-square w-full relative bg-muted/50 rounded-md flex items-center justify-center">
                            {enhancedImage ? (
                                <>
                                    <Image src={enhancedImage} alt="Enhanced" layout="fill" objectFit="contain" className="rounded-md" />
                                    <Button 
                                    size="icon" 
                                    className="absolute bottom-2 right-2 z-10" 
                                    onClick={() => window.open(enhancedImage, '_blank')}
                                    aria-label="Download enhanced image"
                                    >
                                    <Download className="h-4 w-4"/>
                                    </Button>
                                </>
                            ) : (
                                <div className="text-center text-muted-foreground">
                                    <Wand2 className="w-12 h-12 mx-auto" />
                                    <p className="mt-2 text-sm">Enhanced image will appear here</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
      )}

      {originalImage && (
         <div className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="flex-1">
                <Upload className="mr-2 h-4 w-4" />
                Change Image
            </Button>
            <Button onClick={handleEnhance} disabled={isLoading} className="flex-1">
            {isLoading ? (
                <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enhancing...
                </>
            ) : (
                <>
                <Wand2 className="mr-2 h-4 w-4" />
                Enhance Photo
                </>
            )}
            </Button>
         </div>
      )}
    </div>
  );
}
