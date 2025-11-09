import React, { useState, useEffect, useRef } from 'react';

const ARRulerView: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [streamActive, setStreamActive] = useState(false);

  const startCamera = async () => {
    setError(null);
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' }
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setStreamActive(true);
        }
      } else {
        setError('Camera access is not supported by your browser.');
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(`Error accessing camera: ${err.name} - ${err.message}`);
      } else {
        setError('An unknown error occurred while accessing the camera.');
      }
      setStreamActive(false);
    }
  };

  useEffect(() => {
    startCamera();
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div className="relative h-full w-full flex items-center justify-center bg-black rounded-lg overflow-hidden">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="w-full h-full object-cover"
      ></video>

      {!streamActive && (
        <div className="absolute inset-0 bg-brand-primary bg-opacity-80 flex flex-col items-center justify-center text-center p-4">
          {error ? (
            <>
              <h2 className="text-xl font-bold text-red-400 mb-4">Camera Error</h2>
              <p className="bg-brand-secondary p-4 rounded-lg text-brand-text">{error}</p>
              <button onClick={startCamera} className="mt-6 bg-brand-cyan text-brand-primary font-bold py-2 px-5 rounded-full hover:bg-opacity-90 transition-all uppercase tracking-wider shadow-lg">
                Retry
              </button>
            </>
          ) : (
            <>
            <svg className="animate-spin h-10 w-10 text-brand-cyan mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p>Starting camera...</p>
            </>
          )}
        </div>
      )}

      {streamActive && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          {/* Crosshair */}
          <div className="w-16 h-16 text-brand-cyan/70">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-px h-5 bg-current"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-px bg-current"></div>
            <div className="absolute top-1/2 left-1/2 w-8 h-8 border border-current rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          </div>
          <div className="absolute bottom-10 bg-black/50 p-2 px-4 rounded-full text-xs">
            AR measurement is for estimation only.
          </div>
        </div>
      )}
    </div>
  );
};

export default ARRulerView;