
'use client';

import { useState, useRef, useEffect } from 'react';
import { chat } from '@/ai/flows/ai-chat';
import { Bot, Send, User, Loader2, Image as ImageIcon, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { AnimatePresence, motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { GEMINI_API_KEY_STORAGE_KEY } from '@/lib/constants';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  imageUrl?: string;
}

export default function AIChatTool() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm Sparky, your AI assistant. How can I help you today? You can now send me images too!",
      sender: 'bot',
    },
  ]);
  const [input, setInput] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('div');
        if (viewport) {
            viewport.scrollTo({ top: viewport.scrollHeight, behavior: 'smooth' });
        }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) { // 4MB limit
        toast({
          title: 'Image is too large',
          description: 'Please upload an image smaller than 4MB.',
          variant: 'destructive',
        });
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSend = async () => {
    const apiKey = localStorage.getItem(GEMINI_API_KEY_STORAGE_KEY);
    if (!apiKey) {
        toast({
            title: 'API Key is missing',
            description: 'Please set your Gemini API key in your profile.',
            variant: 'destructive',
        });
        return;
    }
    if ((input.trim() === '' && !image) || isLoading) return;

    const userMessage: Message = {
      id: Date.now(),
      text: input,
      sender: 'user',
      imageUrl: image || undefined,
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setImage(null);
    setIsLoading(true);

    try {
      const result = await chat({ message: input, photoDataUri: image || undefined, apiKey });
      const botResponse: Message = {
        id: Date.now() + 1,
        text: result.response,
        sender: 'bot',
      };
      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
        console.error(error);
        toast({
            title: "Error getting response",
            description: "Something went wrong. Please try again.",
            variant: "destructive"
        })
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="flex h-[60vh] flex-col">
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-6">
          <AnimatePresence>
            {messages.map(message => (
              <motion.div
                key={message.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className={`flex items-start gap-3 ${
                  message.sender === 'user' ? 'justify-end' : ''
                }`}
              >
                {message.sender === 'bot' && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      <Bot size={20} />
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`max-w-xs rounded-lg px-4 py-3 text-sm md:max-w-md ${
                    message.sender === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  {message.imageUrl && (
                    <Image
                        src={message.imageUrl}
                        alt="User upload"
                        width={200}
                        height={200}
                        className="rounded-md mb-2"
                    />
                  )}
                  {message.text}
                </div>
                {message.sender === 'user' && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      <User size={20} />
                    </AvatarFallback>
                  </Avatar>
                )}
              </motion.div>
            ))}
             {isLoading && (
                 <motion.div
                    key="loading"
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-start gap-3"
                >
                    <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary text-primary-foreground">
                        <Bot size={20} />
                        </AvatarFallback>
                    </Avatar>
                    <div className="max-w-xs rounded-lg px-4 py-3 text-sm md:max-w-md bg-muted flex items-center">
                        <Loader2 className="h-5 w-5 animate-spin"/>
                    </div>
                </motion.div>
            )}
          </AnimatePresence>
        </div>
      </ScrollArea>
      <div className="border-t p-4">
        {image && (
          <div className="relative mb-2 w-24 h-24">
            <Image src={image} alt="Preview" layout="fill" className="rounded-md object-cover" />
            <Button
              variant="destructive"
              size="icon"
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
              onClick={() => setImage(null)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
        <div className="flex items-center gap-2">
           <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            className="hidden"
            accept="image/png, image/jpeg, image/webp"
          />
          <Button variant="ghost" size="icon" onClick={() => fileInputRef.current?.click()} disabled={isLoading}>
            <ImageIcon className="h-5 w-5" />
          </Button>
          <Input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && handleSend()}
            placeholder="Type your message..."
            className="flex-1"
            disabled={isLoading}
          />
          <Button onClick={handleSend} size="icon" disabled={isLoading}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
