
'use client';

import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowRightLeft } from 'lucide-react';
import { Card, CardContent } from '../ui/card';

type UnitCategory = 'length' | 'weight' | 'temperature';

const units = {
  length: [
    { value: 'meters', label: 'Meters' },
    { value: 'kilometers', label: 'Kilometers' },
    { value: 'centimeters', label: 'Centimeters' },
    { value: 'feet', label: 'Feet' },
    { value: 'inches', label: 'Inches' },
    { value: 'miles', label: 'Miles' },
  ],
  weight: [
    { value: 'grams', label: 'Grams' },
    { value: 'kilograms', label: 'Kilograms' },
    { value: 'pounds', label: 'Pounds' },
    { value: 'ounces', label: 'Ounces' },
  ],
  temperature: [
    { value: 'celsius', label: 'Celsius' },
    { value: 'fahrenheit', label: 'Fahrenheit' },
    { value: 'kelvin', label: 'Kelvin' },
  ],
};

const conversionFactors: { [key: string]: { [key: string]: (val: number) => number } } = {
  // Length
  meters: {
    kilometers: (v) => v / 1000,
    centimeters: (v) => v * 100,
    feet: (v) => v * 3.28084,
    inches: (v) => v * 39.3701,
    miles: (v) => v / 1609.34,
  },
  // Weight
  grams: {
    kilograms: (v) => v / 1000,
    pounds: (v) => v * 0.00220462,
    ounces: (v) => v * 0.035274,
  },
  // Temperature
  celsius: {
    fahrenheit: (v) => (v * 9/5) + 32,
    kelvin: (v) => v + 273.15,
  },
  fahrenheit: {
    celsius: (v) => (v - 32) * 5/9,
    kelvin: (v) => (v - 32) * 5/9 + 273.15,
  },
  kelvin: {
    celsius: (v) => v - 273.15,
    fahrenheit: (v) => (v - 273.15) * 9/5 + 32,
  },
};

// Function to build full conversion map
const buildFullConversionMap = () => {
    const fullMap: { [key: string]: { [key: string]: (val: number) => number } } = {};
    Object.keys(conversionFactors).forEach(fromUnit => {
        if(!fullMap[fromUnit]) fullMap[fromUnit] = {};
        fullMap[fromUnit][fromUnit] = v => v;
        Object.keys(conversionFactors[fromUnit]).forEach(toUnit => {
            if(!fullMap[toUnit]) fullMap[toUnit] = {};
            fullMap[fromUnit][toUnit] = conversionFactors[fromUnit][toUnit];
            fullMap[toUnit][fromUnit] = (v) => {
                // Find inverse by converting to a base unit (e.g., meters) and then to target
                // This is a simplified inverse, works for this structure.
                for (const base of Object.keys(conversionFactors)) {
                    if (conversionFactors[base]?.[toUnit]) {
                       const baseVal = v / conversionFactors[base][toUnit](1);
                       return conversionFactors[base][fromUnit](baseVal);
                    }
                }
                // Fallback for temp which has inverse defined
                 for (const directInverse of Object.keys(conversionFactors[toUnit] || {})) {
                    if (directInverse === fromUnit) return conversionFactors[toUnit][fromUnit](v);
                }
                return NaN;
            }
        })
    });
    return fullMap;
}

const fullConversionMap = buildFullConversionMap();


export default function UnitConverterTool() {
  const [category, setCategory] = useState<UnitCategory>('length');
  const [fromUnit, setFromUnit] = useState('meters');
  const [toUnit, setToUnit] = useState('feet');
  const [inputValue, setInputValue] = useState(1);

  const availableUnits = units[category];

  const outputValue = useMemo(() => {
    if (fromUnit === toUnit) return inputValue;
    const conversionFunc = fullConversionMap[fromUnit]?.[toUnit];
    if (conversionFunc) {
      const result = conversionFunc(inputValue);
      return Math.round(result * 10000) / 10000; // round to 4 decimal places
    }
    return 'N/A';
  }, [inputValue, fromUnit, toUnit]);

  const handleCategoryChange = (newCategory: UnitCategory) => {
    setCategory(newCategory);
    setFromUnit(units[newCategory][0].value);
    setToUnit(units[newCategory][1].value);
    setInputValue(1);
  };
  
  const swapUnits = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  }

  return (
    <div className="space-y-6">
      <Select value={category} onValueChange={(val) => handleCategoryChange(val as UnitCategory)}>
        <SelectTrigger>
          <SelectValue placeholder="Select a category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="length">Length</SelectItem>
          <SelectItem value="weight">Weight</SelectItem>
          <SelectItem value="temperature">Temperature</SelectItem>
        </SelectContent>
      </Select>
      
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center gap-4">
        <Card className="p-4">
           <Select value={fromUnit} onValueChange={setFromUnit}>
              <SelectTrigger className="mb-2">
                <SelectValue placeholder="From" />
              </SelectTrigger>
              <SelectContent>
                {availableUnits.map(u => <SelectItem key={u.value} value={u.value}>{u.label}</SelectItem>)}
              </SelectContent>
            </Select>
            <Input type="number" value={inputValue} onChange={e => setInputValue(Number(e.target.value))} className="text-2xl h-12" />
        </Card>
        
        <Button variant="ghost" size="icon" className="mx-auto" onClick={swapUnits}>
            <ArrowRightLeft className="w-6 h-6 text-muted-foreground" />
        </Button>
        
        <Card className="p-4">
            <Select value={toUnit} onValueChange={setToUnit}>
              <SelectTrigger className="mb-2">
                <SelectValue placeholder="To" />
              </SelectTrigger>
              <SelectContent>
                {availableUnits.map(u => <SelectItem key={u.value} value={u.value}>{u.label}</SelectItem>)}
              </SelectContent>
            </Select>
            <div className="text-2xl h-12 flex items-center px-3 font-semibold text-primary break-all">
                {outputValue}
            </div>
        </Card>
      </div>
    </div>
  );
}
