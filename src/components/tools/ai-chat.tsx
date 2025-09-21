'use client';

import { useState } from 'react';
import { Bot, Send, User } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AnimatePresence, motion } from 'framer-motion';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
}

export default function AIChatTool() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm your AI assistant. How can I help you today?",
      sender: 'bot',
    },
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim() === '') return;

    const userMessage: Message = {
      id: Date.now(),
      text: input,
      sender: 'user',
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    // Simulate bot response
    setTimeout(() => {
      const botResponse: Message = {
        id: Date.now() + 1,
        text: `This is a simulated response to: "${input}". Full chat functionality is not implemented in this demo.`,
        sender: 'bot',
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);
  };

  return (
    <div className="flex h-[60vh] flex-col">
      <ScrollArea className="flex-1 p-4">
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
          </AnimatePresence>
        </div>
      </ScrollArea>
      <div className="border-t p-4">
        <div className="flex items-center gap-2">
          <Input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && handleSend()}
            placeholder="Type your message..."
            className="flex-1"
          />
          <Button onClick={handleSend} size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
