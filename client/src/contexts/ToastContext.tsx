import React, { createContext, useContext, useState } from 'react';
import Toast, { ToastContainer, ToastType } from '../components/ui/Toast';

// Toast item interface
interface ToastItem {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
}

// Toast context interface
interface ToastContextType {
  showToast: (type: ToastType, message: string, title?: string, duration?: number) => void;
  hideToast: (id: string) => void;
}

// Create context
const ToastContext = createContext<ToastContextType | undefined>(undefined);

// Provider component
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  // Show a new toast
  const showToast = (
    type: ToastType,
    message: string,
    title?: string,
    duration: number = 5000
  ) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: ToastItem = {
      id,
      type,
      title,
      message,
      duration,
    };
    setToasts((prevToasts) => [...prevToasts, newToast]);
  };

  // Hide a toast by id
  const hideToast = (id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      <ToastContainer>
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            id={toast.id}
            type={toast.type}
            title={toast.title}
            message={toast.message}
            duration={toast.duration}
            onClose={hideToast}
          />
        ))}
      </ToastContainer>
    </ToastContext.Provider>
  );
}

// Custom hook to use toast context
export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
