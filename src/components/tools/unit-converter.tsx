
'use client';

import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowRightLeft } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';

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
  // Length (base: meters)
  meters: {
    meters: v => v,
    kilometers: (v) => v / 1000,
    centimeters: (v) => v * 100,
    feet: (v) => v * 3.28084,
    inches: (v) => v * 39.3701,
    miles: (v) => v / 1609.34,
  },
  kilometers: { meters: v => v * 1000 },
  centimeters: { meters: v => v / 100 },
  feet: { meters: v => v / 3.28084 },
  inches: { meters: v => v / 39.3701 },
  miles: { meters: v => v * 1609.34 },
  
  // Weight (base: kilograms)
  kilograms: {
    kilograms: v => v,
    grams: (v) => v * 1000,
    pounds: (v) => v * 2.20462,
    ounces: (v) => v * 35.274,
  },
  grams: { kilograms: v => v / 1000 },
  pounds: { kilograms: v => v / 2.20462 },
  ounces: { kilograms: v => v / 35.274 },
  
  // Temperature (base: celsius)
  celsius: {
    celsius: v => v,
    fahrenheit: (v) => (v * 9/5) + 32,
    kelvin: (v) => v + 273.15,
  },
  fahrenheit: { celsius: v => (v - 32) * 5/9 },
  kelvin: { celsius: v => v - 273.15 },
};

const getBaseUnit = (category: UnitCategory) => {
    if (category === 'length') return 'meters';
    if (category === 'weight') return 'kilograms';
    return 'celsius';
}

export default function UnitConverterTool() {
  const [category, setCategory] = useState<UnitCategory>('length');
  const [fromUnit, setFromUnit] = useState('meters');
  const [toUnit, setToUnit] = useState('feet');
  const [inputValue, setInputValue] = useState(1);

  const availableUnits = units[category];

  const outputValue = useMemo(() => {
    if (inputValue === null || isNaN(inputValue)) return '';
    if (fromUnit === toUnit) return inputValue;

    const baseUnit = getBaseUnit(category);
    
    // Convert input value to base unit
    const fromToBaseFn = conversionFactors[fromUnit]?.[baseUnit];
    const baseValue = fromToBaseFn ? fromToBaseFn(inputValue) : inputValue;

    // Convert base unit value to output unit
    const baseToToFn = conversionFactors[baseUnit]?.[toUnit];
    if (baseToToFn) {
        const result = baseToToFn(baseValue);
        return parseFloat(result.toPrecision(5));
    }
    
    // Direct conversion (for temp)
    const directConversionFn = conversionFactors[fromUnit]?.[toUnit];
     if (directConversionFn) {
       const result = directConversionFn(inputValue);
       return parseFloat(result.toPrecision(5));
    }

    return 'N/A';
  }, [inputValue, fromUnit, toUnit, category]);

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
            <Input type="number" value={inputValue} onChange={e => setInputValue(parseFloat(e.target.value))} className="text-2xl h-12" />
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
