import React, { useEffect, useState } from 'react';

interface ToastProps {
  message: string;
  onClear: () => void;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({ message, onClear, duration = 3000 }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        // Allow time for fade out animation before clearing the message
        setTimeout(onClear, 500); 
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [message, duration, onClear]);

  return (
    <div
      className={`fixed bottom-20 left-1/2 -translate-x-1/2 px-4 py-2 bg-neutral-800 text-white rounded-full text-sm shadow-lg transition-all duration-300 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      } pointer-events-none`}
    >
      {message}
    </div>
  );
};

export default Toast;