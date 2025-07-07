"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  CheckCircle, 
  AlertCircle, 
  Info, 
  X, 
  Wifi, 
  WifiOff 
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Toast {
  id: string;
  type: "success" | "error" | "info" | "warning";
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// Extend Window interface for toast functionality
declare global {
  interface Window {
    addToast?: (toast: Omit<Toast, "id">) => void;
  }
}

interface MobileToastProps {
  toast: Toast;
  onDismiss: (id: string) => void;
}

export function MobileToast({ toast, onDismiss }: MobileToastProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  const handleDismiss = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => {
      onDismiss(toast.id);
    }, 300);
  }, [onDismiss, toast.id]);

  useEffect(() => {
    // Slide in animation
    setTimeout(() => setIsVisible(true), 50);

    // Auto-dismiss after duration
    if (toast.duration) {
      const timer = setTimeout(() => {
        handleDismiss();
      }, toast.duration);

      return () => clearTimeout(timer);
    }
  }, [toast.duration, handleDismiss]);

  const getToastConfig = () => {
    switch (toast.type) {
      case "success":
        return {
          icon: CheckCircle,
          color: "text-green-600 dark:text-green-400",
          bgColor: "bg-green-50 dark:bg-green-900/20",
          borderColor: "border-green-200 dark:border-green-800"
        };
      case "error":
        return {
          icon: AlertCircle,
          color: "text-red-600 dark:text-red-400",
          bgColor: "bg-red-50 dark:bg-red-900/20",
          borderColor: "border-red-200 dark:border-red-800"
        };
      case "warning":
        return {
          icon: AlertCircle,
          color: "text-yellow-600 dark:text-yellow-400",
          bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
          borderColor: "border-yellow-200 dark:border-yellow-800"
        };
      default:
        return {
          icon: Info,
          color: "text-blue-600 dark:text-blue-400",
          bgColor: "bg-blue-50 dark:bg-blue-900/20",
          borderColor: "border-blue-200 dark:border-blue-800"
        };
    }
  };

  const config = getToastConfig();
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "fixed top-4 left-4 right-4 z-50 transition-all duration-300 ease-out",
        isVisible && !isExiting 
          ? "translate-y-0 opacity-100" 
          : "translate-y-[-100%] opacity-0"
      )}
    >
      <Card className={`${config.borderColor} ${config.bgColor} shadow-lg`}>
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <Icon className={`h-5 w-5 mt-0.5 flex-shrink-0 ${config.color}`} />
            
            <div className="flex-1 min-w-0">
              <h4 className={`font-medium text-sm ${config.color}`}>
                {toast.title}
              </h4>
              {toast.message && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {toast.message}
                </p>
              )}
              
              {toast.action && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toast.action.onClick}
                  className={`mt-2 h-8 px-2 ${config.color} hover:bg-transparent`}
                >
                  {toast.action.label}
                </Button>
              )}
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleDismiss}
              className="h-6 w-6 flex-shrink-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Toast container component
export function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [isClient, setIsClient] = useState(false);

  const addToast = (toast: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast = {
      ...toast,
      id,
      duration: toast.duration || 5000
    };
    
    setToasts(prev => [...prev, newToast]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  // Set client-side flag and expose methods globally
  useEffect(() => {
    setIsClient(true);
    window.addToast = addToast;
    return () => {
      delete window.addToast;
    };
  }, []);

  // Don't render toasts during SSR
  if (!isClient) return null;

  return (
    <>
      {toasts.map((toast) => (
        <MobileToast
          key={toast.id}
          toast={toast}
          onDismiss={removeToast}
        />
      ))}
    </>
  );
}

// Network status toast
export function NetworkStatusToast() {
  const [isOnline, setIsOnline] = useState<boolean | null>(null); // null = unknown state
  const [showToast, setShowToast] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Mark as client-side and set initial network status
    setIsClient(true);
    setIsOnline(navigator.onLine);

    const handleOnline = () => {
      setIsOnline(true);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowToast(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Don't render anything until we're on the client and know the network status
  if (!isClient || isOnline === null || !showToast) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50">
      <Card className={cn(
        "shadow-lg",
        isOnline 
          ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
          : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
      )}>
        <CardContent className="p-3">
          <div className="flex items-center space-x-3">
            {isOnline ? (
              <Wifi className="h-5 w-5 text-green-600 dark:text-green-400" />
            ) : (
              <WifiOff className="h-5 w-5 text-red-600 dark:text-red-400" />
            )}
            
            <div className="flex-1">
              <p className={cn(
                "text-sm font-medium",
                isOnline 
                  ? "text-green-900 dark:text-green-100"
                  : "text-red-900 dark:text-red-100"
              )}>
                {isOnline ? "Back online" : "No internet connection"}
              </p>
              {!isOnline && (
                <p className="text-xs text-red-700 dark:text-red-300 mt-1">
                  Some features may not work properly
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Utility functions for easy toast creation
export const toast = {
  success: (title: string, message?: string, action?: Toast['action']) => {
    if (typeof window !== 'undefined' && window.addToast) {
      window.addToast({ type: 'success', title, message, action });
    }
  },
  
  error: (title: string, message?: string, action?: Toast['action']) => {
    if (typeof window !== 'undefined' && window.addToast) {
      window.addToast({ 
        type: 'error', 
        title, 
        message, 
        action,
        duration: 8000 // Longer for errors
      });
    }
  },
  
  info: (title: string, message?: string, action?: Toast['action']) => {
    if (typeof window !== 'undefined' && window.addToast) {
      window.addToast({ type: 'info', title, message, action });
    }
  },
  
  warning: (title: string, message?: string, action?: Toast['action']) => {
    if (typeof window !== 'undefined' && window.addToast) {
      window.addToast({ type: 'warning', title, message, action });
    }
  }
}; 