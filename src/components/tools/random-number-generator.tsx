'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dices } from 'lucide-react';
import { motion } from 'framer-motion';

export default function RandomNumberTool() {
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(100);
  const [result, setResult] = useState<number | null>(null);
  const [key, setKey] = useState(0);

  const handleGenerate = () => {
    // Defer client-side specific logic
  };

  useEffect(() => {
    // This effect ensures client-side logic runs only after mounting
    const generateNumber = () => {
        const minNum = Number(min);
        const maxNum = Number(max);
        if (minNum > maxNum) {
            setResult(null);
            return;
        }
        const randomNumber = Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;
        setResult(randomNumber);
        setKey(prev => prev + 1); // a trick to re-trigger the animation
    }
    
    // We expose a function on the window to be called from the button onClick
    // to avoid direct use of Math.random in the click handler which can cause hydration issues.
    (window as any).generateRandomNumber = generateNumber;

    return () => {
        delete (window as any).generateRandomNumber;
    }
  }, [min, max]);


  return (
    <div className="space-y-6 text-center">
      <div className="flex justify-center items-center h-48 w-48 mx-auto bg-gradient-to-br from-primary/20 to-primary/5 rounded-full">
        {result !== null ? (
          <motion.div
            key={key}
            initial={{ scale: 0.5, opacity: 0, rotate: -90 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 15 }}
            className="text-6xl font-bold text-primary"
          >
            {result}
          </motion.div>
        ) : (
          <Dices className="h-24 w-24 text-primary/50" />
        )}
      </div>
      <div className="grid grid-cols-2 gap-4 items-end">
        <div>
          <Label htmlFor="min" className="text-left block mb-2">Minimum</Label>
          <Input id="min" type="number" value={min} onChange={e => setMin(Number(e.target.value))} />
        </div>
        <div>
          <Label htmlFor="max" className="text-left block mb-2">Maximum</Label>
          <Input id="max" type="number" value={max} onChange={e => setMax(Number(e.target.value))} />
        </div>
      </div>
      <Button onClick={() => (window as any).generateRandomNumber()} size="lg" className="w-full">
        <Dices className="mr-2 h-5 w-5" />
        Generate Number
      </Button>
    </div>
  );
}
