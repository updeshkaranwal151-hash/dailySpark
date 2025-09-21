'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function CalculatorTool() {
  const [display, setDisplay] = useState('0');
  const [expression, setExpression] = useState('');

  const handleButtonClick = (value: string) => {
    if (value === 'C') {
      setDisplay('0');
      setExpression('');
    } else if (value === '=') {
      try {
        // Warning: eval is used for simplicity. Do not use in production with untrusted input.
        const result = eval(expression.replace(/×/g, '*').replace(/÷/g, '/'));
        setDisplay(String(result));
        setExpression(String(result));
      } catch (error) {
        setDisplay('Error');
        setExpression('');
      }
    } else if (['+', '-', '×', '÷'].includes(value)) {
      setExpression(prev => prev + value);
      setDisplay(value);
    } else {
      if (['+', '-', '×', '÷'].includes(display)) {
        setExpression(prev => prev + value);
        setDisplay(value);
      } else {
        const newDisplay = display === '0' ? value : display + value;
        setExpression(prev => prev + value);
        setDisplay(newDisplay);
      }
    }
  };

  const buttons = [
    'C', '÷', '×', '7', '8', '9', '-', '4', '5', '6', '+', '1', '2', '3', '=', '0', '.'
  ];

  return (
    <div className="w-full max-w-xs mx-auto space-y-4">
      <div className="bg-muted text-right text-4xl font-mono p-4 rounded-lg break-all">
        {display}
      </div>
      <div className="grid grid-cols-4 gap-2">
        {buttons.map((btn, i) => {
            const isOperator = ['+', '-', '×', '÷', '='].includes(btn);
            const isClear = btn === 'C';
            const isZero = btn === '0';
            const isEqual = btn === '=';

            return (
                 <Button
                    key={i}
                    onClick={() => handleButtonClick(btn)}
                    variant={isOperator ? 'default' : (isClear ? 'destructive' : 'secondary')}
                    className={`h-16 text-2xl ${isZero ? 'col-span-2' : ''} ${isEqual ? 'row-span-2 h-auto' : ''}`}
                    style={isEqual ? {gridRow: 'span 2'} : {}}
                >
                    {btn}
                </Button>
            )
        })}
      </div>
    </div>
  );
}
