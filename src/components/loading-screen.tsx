
'use client';

import { BrainCircuit } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

const motivationalMessages = [
  'Charging Creativity…',
  'Unleashing Ideas…',
  'Assembling Awesomeness...',
  'Brewing Brilliance...',
  'Engaging Neural Nets...',
  'Almost There!',
];

const LoadingScreen = ({ isLoaded = false }: { isLoaded?: boolean }) => {
  const [messageIndex, setMessageIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    const messageInterval = setInterval(() => {
      setMessageIndex((prevIndex) => (prevIndex + 1) % motivationalMessages.length);
    }, 2500);

    return () => {
      clearInterval(messageInterval);
    };
  }, []);
  
  useEffect(() => {
    if (isLoaded) {
      setProgress(100);
    } else {
        // Animate progress to 90% and wait for isLoaded
        const interval = setInterval(() => {
            setProgress(prev => {
                if(prev < 90) {
                    return prev + 1;
                }
                clearInterval(interval);
                return prev;
            })
        }, 50);
        return () => clearInterval(interval);
    }
  }, [isLoaded]);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-gradient-to-br from-[#0a192f] to-[#1e3a8a] text-white overflow-hidden relative">
      {/* Particle background */}
      {isClient && [...Array(50)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-blue-300/50"
          initial={{ 
            x: Math.random() * window.innerWidth, 
            y: Math.random() * window.innerHeight,
            scale: Math.random() * 0.5 + 0.5,
            opacity: Math.random() * 0.5 + 0.2
          }}
          animate={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
          }}
          transition={{
            duration: Math.random() * 20 + 15,
            repeat: Infinity,
            repeatType: 'mirror',
            ease: 'easeInOut'
          }}
          style={{
            width: `${Math.random() * 3 + 1}px`,
            height: `${Math.random() * 3 + 1}px`,
          }}
        />
      ))}
      
      <div className="relative z-10 flex flex-col items-center justify-center space-y-8 text-center">
        <div className="relative flex items-center justify-center w-32 h-32">
          {/* Rotating Rings */}
          <motion.div
            className="absolute w-24 h-24 border-2 border-blue-400/50 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
          />
          <motion.div
            className="absolute w-32 h-32 border-2 border-blue-500/50 rounded-full"
            animate={{ rotate: -360 }}
            transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
          />
          
          {/* Pulsing Logo */}
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <BrainCircuit className="h-16 w-16 text-blue-300" />
          </motion.div>
        </div>
        
        <h1 className="text-4xl font-headline font-bold text-gray-100">Daily Spark</h1>

        {/* Progress Bar */}
        <div className="w-64 h-2 bg-blue-900/50 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-blue-400 shadow-glow"
            initial={{ width: '0%' }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </div>

        {/* Motivational Messages */}
        <AnimatePresence mode="wait">
          <motion.p
            key={messageIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
            className="text-sm text-blue-300"
          >
            {motivationalMessages[messageIndex]}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default LoadingScreen;
