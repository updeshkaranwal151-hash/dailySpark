
'use client';

import { useState, useEffect } from 'react';
import { Compass as CompassIcon, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Button } from '../ui/button';

// A simple compass rose SVG. The 'transform-origin: center' is key for rotation.
const CompassRose = ({ rotation }: { rotation: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 100"
    className="w-full h-full"
    style={{ transform: `rotate(${rotation}deg)`, transition: 'transform 0.5s ease-out' }}
  >
    <g className="text-foreground">
      {/* Cardinal Directions */}
      <text x="46" y="12" fontSize="10" className="font-bold">N</text>
      <text x="46" y="94" fontSize="10" className="font-bold">S</text>
      <text x="6" y="54" fontSize="10" className="font-bold">W</text>
      <text x="84" y="54" fontSize="10" className="font-bold">E</text>

      {/* Main Dial */}
      <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="2" fill="none" className="opacity-30" />
      <circle cx="50" cy="50" r="2" fill="currentColor" />

      {/* North Pointer (Red) */}
      <polygon points="50,15 45,25 55,25" fill="hsl(var(--destructive))" />
      {/* South Pointer */}
      <polygon points="50,85 45,75 55,75" fill="currentColor" />
    </g>
  </svg>
);


export default function CompassTool() {
  const [heading, setHeading] = useState<number | null>(null);
  const [permissionState, setPermissionState] = useState<'prompt' | 'granted' | 'denied' | 'unsupported'>('prompt');

  useEffect(() => {
    const handleOrientation = (event: DeviceOrientationEvent) => {
      // 'webkitCompassHeading' is for iOS Safari
      const compassHeading = (event as any).webkitCompassHeading || (360 - (event.alpha ?? 0));
      if (compassHeading !== null) {
        setHeading(compassHeading);
        setPermissionState('granted');
      }
    };
    
    // Check for API support
    if ('DeviceOrientationEvent' in window) {
      window.addEventListener('deviceorientation', handleOrientation);
    } else {
      setPermissionState('unsupported');
    }

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, []);

  const requestPermission = () => {
    // This is for iOS 13+ devices
    if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      (DeviceOrientationEvent as any).requestPermission()
        .then((response: 'granted' | 'denied') => {
          if (response === 'granted') {
             setPermissionState('granted');
          } else {
             setPermissionState('denied');
          }
        })
        .catch(console.error);
    } else {
      // For other browsers, permission is often implicit or handled by browser settings.
      // If we are still in 'prompt' state, it might mean the user has to manually enable sensors.
      if (permissionState === 'prompt') {
        setPermissionState('denied'); // Assume denied if no explicit permission method exists
      }
    }
  };

  const renderContent = () => {
    switch (permissionState) {
      case 'prompt':
        return (
          <div className="text-center space-y-4">
            <CompassIcon className="w-16 h-16 mx-auto text-muted-foreground" />
            <p>This tool requires access to your device's orientation sensors.</p>
            <Button onClick={requestPermission}>Grant Permission</Button>
          </div>
        );
      case 'denied':
        return (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Permission Denied</AlertTitle>
            <AlertDescription>
              Please enable motion and orientation sensor access in your browser settings to use the compass.
            </AlertDescription>
          </Alert>
        );
      case 'unsupported':
        return (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Unsupported Browser</AlertTitle>
            <AlertDescription>
              Your browser does not support the necessary device orientation APIs for this compass to work.
            </AlertDescription>
          </Alert>
        );
      case 'granted':
        if (heading === null) {
          return <p className="text-center text-muted-foreground">Calibrating...</p>;
        }
        return (
          <div className="flex flex-col items-center justify-center space-y-4">
            <motion.div
              className="w-48 h-48"
              initial={false}
              animate={{ rotate: -heading }}
              transition={{ type: 'spring', stiffness: 100, damping: 20 }}
            >
              <CompassRose rotation={0} />
            </motion.div>
            <div className="text-center">
              <p className="text-6xl font-bold font-mono tracking-tighter">{Math.round(heading)}°</p>
              <p className="text-lg font-semibold text-muted-foreground">
                {getDirection(heading)}
              </p>
            </div>
          </div>
        );
    }
  };
  
  const getDirection = (h: number) => {
    if (h > 337.5 || h <= 22.5) return 'North';
    if (h > 22.5 && h <= 67.5) return 'Northeast';
    if (h > 67.5 && h <= 112.5) return 'East';
    if (h > 112.5 && h <= 157.5) return 'Southeast';
    if (h > 157.5 && h <= 202.5) return 'South';
    if (h > 202.5 && h <= 247.5) return 'Southwest';
    if (h > 247.5 && h <= 292.5) return 'West';
    if (h > 292.5 && h <= 337.5) return 'Northwest';
    return '';
  }

  return (
    <div className="w-full flex items-center justify-center min-h-[250px]">
      {renderContent()}
    </div>
  );
}
