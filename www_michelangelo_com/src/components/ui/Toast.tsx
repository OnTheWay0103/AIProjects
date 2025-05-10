import { useEffect, useState } from 'react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
  onClose?: () => void;
}

export default function Toast({
  message,
  type = 'info',
  duration = 3000,
  onClose,
}: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (duration === 0) return;
    
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) return null;

  const bgColor = {
    success: 'bg-success',
    error: 'bg-error',
    info: 'bg-info',
    warning: 'bg-warning'
  }[type];

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div
        data-testid="toast"
        className={`${bgColor} text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2`}
      >
        <span>{message}</span>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-2 text-white hover:text-opacity-80"
            aria-label="关闭"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
} 