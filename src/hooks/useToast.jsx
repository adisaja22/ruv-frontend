import React, { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle, AlertTriangle, AlertCircle, Info } from 'lucide-react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success', duration = 3000) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type, duration }]);
    
    setTimeout(() => {
      removeToast(id);
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      {/* Toast container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full">
        {toasts.map((toast) => {
          let bgClass = 'bg-white text-neutral-900 border-neutral-200';
          let Icon = Info;
          let iconColor = 'text-secondary';

          if (toast.type === 'success') {
            bgClass = 'bg-white text-neutral-900 border-success';
            Icon = CheckCircle;
            iconColor = 'text-success';
          } else if (toast.type === 'warning') {
            bgClass = 'bg-white text-neutral-900 border-warning';
            Icon = AlertTriangle;
            iconColor = 'text-warning';
          } else if (toast.type === 'error') {
            bgClass = 'bg-white text-neutral-900 border-error';
            Icon = AlertCircle;
            iconColor = 'text-error';
          }

          return (
            <div
              key={toast.id}
              className={`flex items-start gap-3 p-4 rounded-card border shadow-soft bg-premium-glass animate-modal-in transition-all duration-300`}
            >
              <Icon className={`w-5 h-5 shrink-0 ${iconColor}`} />
              <div className="flex-1 text-sm font-medium">{toast.message}</div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-neutral-400 hover:text-neutral-700 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
