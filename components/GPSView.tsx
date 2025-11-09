import React, { useState, useEffect } from 'react';
import ToolCard from './ToolCard';
import Toast from './Toast';

const GPSView: React.FC = () => {
  const [position, setPosition] = useState<GeolocationPosition | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      setLoading(false);
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        setPosition(pos);
        setError(null);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
        setToastMessage("Coordinates copied to clipboard!");
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <svg className="animate-spin h-10 w-10 text-brand-cyan mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="text-brand-light">Acquiring GPS signal...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-4">
        <h2 className="text-xl font-bold text-red-400 mb-4">Error Accessing Location</h2>
        <p className="bg-brand-secondary p-4 rounded-lg text-brand-text">{error}</p>
        <p className="mt-4 text-brand-light text-sm">Please ensure location services are enabled for your browser and this site.</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        <ToolCard title="Latitude" value={position?.coords.latitude.toFixed(6) ?? 'N/A'} />
        <ToolCard title="Longitude" value={position?.coords.longitude.toFixed(6) ?? 'N/A'} />
        <ToolCard title="Altitude" value={position?.coords.altitude?.toFixed(2) ?? 'N/A'} unit="m" />
        <ToolCard title="Accuracy" value={position?.coords.accuracy.toFixed(1) ?? 'N/A'} unit="m" />
        <ToolCard title="Heading" value={position?.coords.heading?.toFixed(1) ?? 'N/A'} unit="°" />
        <ToolCard title="Speed" value={(position?.coords.speed ?? 0 * 3.6).toFixed(1)} unit="km/h" />
        <button 
          onClick={() => copyToClipboard(`${position?.coords.latitude}, ${position?.coords.longitude}`)}
          className="w-full mt-4 bg-brand-cyan text-brand-primary font-bold py-3 px-6 rounded-full hover:bg-opacity-90 transition-all flex items-center justify-center space-x-2 uppercase tracking-wider shadow-lg"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>
          <span>Copy Coordinates</span>
        </button>
      </div>
      <Toast message={toastMessage} onClear={() => setToastMessage('')} />
    </>
  );
};

export default GPSView;