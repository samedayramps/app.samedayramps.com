import { toast } from 'sonner';

// Simple notification types
type NotificationOptions = {
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
  cancel?: {
    label: string;
    onClick: () => void;
  };
};

/**
 * Success notification
 */
export function notifySuccess(message: string, options?: NotificationOptions) {
  toast.success(message, {
    duration: options?.duration || 5000,
    action: options?.action,
    cancel: options?.cancel,
  });
}

/**
 * Error notification
 */
export function notifyError(message: string, options?: NotificationOptions) {
  toast.error(message, {
    duration: options?.duration || 7000,
    action: options?.action,
    cancel: options?.cancel,
  });
}

/**
 * Warning notification
 */
export function notifyWarning(message: string, options?: NotificationOptions) {
  toast.warning(message, {
    duration: options?.duration || 6000,
    action: options?.action,
    cancel: options?.cancel,
  });
}

/**
 * Info notification
 */
export function notifyInfo(message: string, options?: NotificationOptions) {
  toast.info(message, {
    duration: options?.duration || 4000,
    action: options?.action,
    cancel: options?.cancel,
  });
}

/**
 * Loading notification with promise
 */
export function notifyLoading<T>(
  promise: Promise<T>,
  messages: {
    loading: string;
    success: string;
    error?: string;
  }
) {
  return toast.promise(promise, {
    loading: messages.loading,
    success: messages.success,
    error: messages.error || 'Something went wrong',
  });
}

/**
 * Confirm action with toast
 */
export function notifyConfirm(
  message: string,
  onConfirm: () => void,
  onCancel?: () => void
) {
  toast(message, {
    action: {
      label: 'Confirm',
      onClick: onConfirm,
    },
    cancel: onCancel ? {
      label: 'Cancel',
      onClick: onCancel,
    } : undefined,
    duration: 10000,
  });
}

// Business-specific notification helpers
export const businessNotifications = {
  customer: {
    created: (name: string) => 
      notifySuccess(`Customer ${name} created successfully`),
    updated: (name: string) => 
      notifySuccess(`Customer ${name} updated successfully`),
    deleted: (name: string) => 
      notifySuccess(`Customer ${name} deleted successfully`),
  },
  
  quote: {
    created: (quoteId: string) => 
      notifySuccess(`Quote #${quoteId} created successfully`),
    sent: (customerName: string) => 
      notifySuccess(`Quote sent to ${customerName}`),
    accepted: (quoteId: string) => 
      notifySuccess(`Quote #${quoteId} accepted!`),
    expired: (quoteId: string) => 
      notifyWarning(`Quote #${quoteId} has expired`),
  },
  
  rental: {
    scheduled: (customerName: string, date: string) => 
      notifySuccess(`Installation scheduled for ${customerName} on ${date}`),
    completed: (customerName: string) => 
      notifySuccess(`Installation completed for ${customerName}`),
    ended: (customerName: string) => 
      notifyInfo(`Rental ended for ${customerName}`),
  },
  
  payment: {
    success: (amount: string) => 
      notifySuccess(`Payment of ${amount} received`),
    failed: (customerName: string) => 
      notifyError(`Payment failed for ${customerName}`),
    retry: (customerName: string) => 
      notifyInfo(`Payment retry scheduled for ${customerName}`),
  },
  
  system: {
    saved: () => notifySuccess('Changes saved successfully'),
    error: (error?: string) => notifyError(error || 'An error occurred'),
    offline: () => notifyWarning('You are offline. Changes will sync when online.'),
    online: () => notifySuccess('Back online. Syncing changes...'),
  },
};

// Network status notifications
export function setupNetworkNotifications() {
  if (typeof window === 'undefined') return;
  
  window.addEventListener('online', () => {
    businessNotifications.system.online();
  });
  
  window.addEventListener('offline', () => {
    businessNotifications.system.offline();
  });
}

const notifications = {
  success: notifySuccess,
  error: notifyError,
  warning: notifyWarning,
  info: notifyInfo,
  loading: notifyLoading,
  confirm: notifyConfirm,
  business: businessNotifications,
  setupNetwork: setupNetworkNotifications,
};

export default notifications; 