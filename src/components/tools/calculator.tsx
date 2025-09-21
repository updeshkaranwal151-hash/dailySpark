
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function CalculatorTool() {
  const [display, setDisplay] = useState('0');
  const [expression, setExpression] = useState('');
  const [currentInput, setCurrentInput] = useState('');

  const handleButtonClick = (value: string) => {
    if (value === 'C') {
      setDisplay('0');
      setExpression('');
      setCurrentInput('');
    } else if (value === '=') {
      if (!expression) return;
      try {
        // Replace visual operators with evaluatable ones
        const evalExpression = expression.replace(/×/g, '*').replace(/÷/g, '/');
        // Avoid issues with trailing operators
        const finalExpression = /[+\-÷×]$/.test(evalExpression) ? evalExpression.slice(0, -1) : evalExpression;
        // Warning: eval is used for simplicity. Do not use in production with untrusted input.
        const result = eval(finalExpression);
        const resultString = String(Number(result.toFixed(10))); // Prevent long decimals
        setDisplay(resultString);
        setExpression(resultString);
        setCurrentInput(resultString);
      } catch (error) {
        setDisplay('Error');
        setExpression('');
        setCurrentInput('');
      }
    } else if (['+', '-', '×', '÷'].includes(value)) {
      if (expression === 'Error') {
        setExpression('');
        setCurrentInput('');
        return;
      }
       // Prevent multiple operators in a row
      if (currentInput === '' && /[\d.]$/.test(expression)) {
         setExpression(prev => prev + value);
      } else if (currentInput !== '') {
         setExpression(prev => prev + currentInput + value);
         setCurrentInput('');
      }
       setDisplay(value);
    } else { // It's a number or a decimal point
      if (expression === 'Error') {
         setExpression(value);
         setCurrentInput(value);
         setDisplay(value);
         return;
      }

      if (value === '.' && currentInput.includes('.')) return;
      
      const newCurrentInput = currentInput + value;
      setCurrentInput(newCurrentInput);
      setDisplay(newCurrentInput);
    }
  };

  const buttons = [
    'C', '÷', '×', 
    '7', '8', '9', '-', 
    '4', '5', '6', '+',
    '1', '2', '3', 
    '0', '.', '='
  ];
  
  const specialButtons = ['C', '÷', '×', '-', '+', '='];

  return (
    <div className="w-full max-w-xs mx-auto space-y-4">
      <div className="bg-muted text-right text-5xl font-mono p-4 rounded-lg break-words h-24 flex items-end justify-end">
        {display}
      </div>
      <div className="grid grid-cols-4 gap-2 grid-rows-5">
        
        <Button onClick={() => handleButtonClick('C')} variant='destructive' className="h-16 text-2xl col-span-3">C</Button>
        <Button onClick={() => handleButtonClick('÷')} variant='default' className="h-16 text-2xl">÷</Button>
        
        <Button onClick={() => handleButtonClick('7')} variant='secondary' className="h-16 text-2xl">7</Button>
        <Button onClick={() => handleButtonClick('8')} variant='secondary' className="h-16 text-2xl">8</Button>
        <Button onClick={() => handleButtonClick('9')} variant='secondary' className="h-16 text-2xl">9</Button>
        <Button onClick={() => handleButtonClick('×')} variant='default' className="h-16 text-2xl">×</Button>

        <Button onClick={() => handleButtonClick('4')} variant='secondary' className="h-16 text-2xl">4</Button>
        <Button onClick={() => handleButtonClick('5')} variant='secondary' className="h-16 text-2xl">5</Button>
        <Button onClick={() => handleButtonClick('6')} variant='secondary' className="h-16 text-2xl">6</Button>
        <Button onClick={() => handleButtonClick('-')} variant='default' className="h-16 text-2xl">-</Button>
        
        <Button onClick={() => handleButtonClick('1')} variant='secondary' className="h-16 text-2xl">1</Button>
        <Button onClick={() => handleButtonClick('2')} variant='secondary' className="h-16 text-2xl">2</Button>
        <Button onClick={() => handleButtonClick('3')} variant='secondary' className="h-16 text-2xl">3</Button>
        <Button onClick={() => handleButtonClick('+')} variant='default' className="h-16 text-2xl">+</Button>

        <Button onClick={() => handleButtonClick('0')} variant='secondary' className="h-16 text-2xl col-span-2">0</Button>
        <Button onClick={() => handleButtonClick('.')} variant='secondary' className="h-16 text-2xl">.</Button>
        <Button onClick={() => handleButtonClick('=')} variant='default' className="h-16 text-2xl">=</Button>
      </div>
    </div>
  );
}
