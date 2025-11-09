import React, { useState, useEffect, useCallback } from 'react';

const InclinometerView: React.FC = () => {
  const [pitch, setPitch] = useState(0);
  const [roll, setRoll] = useState(0);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleOrientation = useCallback((event: DeviceOrientationEvent) => {
    const p = event.beta ?? 0; // Pitch: Front-to-back tilt (-180 to 180)
    const r = event.gamma ?? 0; // Roll: Left-to-right tilt (-90 to 90)
    setPitch(p);
    setRoll(r);
  }, []);

  const requestPermission = useCallback(async () => {
    if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      try {
        const permissionState = await (DeviceOrientationEvent as any).requestPermission();
        if (permissionState === 'granted') {
          window.addEventListener('deviceorientation', handleOrientation);
          setPermissionGranted(true);
        } else {
          setError('Permission not granted for device orientation.');
        }
      } catch (err) {
        setError('Error requesting device orientation permission.');
        console.error(err);
      }
    } else {
      // For non-iOS 13+ devices
      window.addEventListener('deviceorientation', handleOrientation);
      setPermissionGranted(true);
    }
  }, [handleOrientation]);

  useEffect(() => {
    requestPermission();
    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!permissionGranted) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <h2 className="text-xl font-bold mb-4">Device Orientation Access</h2>
        <p className="mb-6 text-brand-light">This tool needs access to your device's motion sensors to function.</p>
        <button
          onClick={requestPermission}
          className="bg-brand-cyan text-brand-primary font-bold py-2 px-5 rounded-full hover:bg-opacity-90 transition-all uppercase tracking-wider shadow-lg"
        >
          Grant Permission
        </button>
        {error && <p className="text-red-400 mt-4">{error}</p>}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full space-y-8">
        <div className="relative w-64 h-64 rounded-full bg-brand-secondary border-4 border-brand-accent flex items-center justify-center overflow-hidden shadow-2xl">
            <div className="absolute h-full w-px bg-brand-accent top-0"></div>
            <div className="absolute w-full h-px bg-brand-accent left-0"></div>
            <div
                className="absolute w-16 h-16 rounded-full bg-brand-cyan border-2 border-white/50 backdrop-blur-sm transition-transform duration-100"
                style={{
                    transform: `translate(${roll * 1.5}px, ${pitch * 1.5}px)`
                }}
            ></div>
            <div className="w-8 h-8 rounded-full border-2 border-dashed border-brand-light opacity-50"></div>
        </div>
        <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
            <div className="bg-brand-secondary p-4 rounded-lg text-center shadow-lg">
                <p className="text-brand-light text-sm font-medium">PITCH</p>
                <p className="text-3xl font-mono font-bold">{pitch.toFixed(1)}°</p>
            </div>
            <div className="bg-brand-secondary p-4 rounded-lg text-center shadow-lg">
                <p className="text-brand-light text-sm font-medium">ROLL</p>
                <p className="text-3xl font-mono font-bold">{roll.toFixed(1)}°</p>
            </div>
        </div>
    </div>
  );
};

export default InclinometerView;