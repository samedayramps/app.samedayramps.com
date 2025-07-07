import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Status color configurations
export const statusConfig = {
  // Customer/General statuses
  active: {
    badge: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
    indicator: "bg-green-500",
    text: "text-green-600 dark:text-green-400"
  },
  pending: {
    badge: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
    indicator: "bg-yellow-500",
    text: "text-yellow-600 dark:text-yellow-400"
  },
  inactive: {
    badge: "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400",
    indicator: "bg-gray-500",
    text: "text-gray-600 dark:text-gray-400"
  },
  
  // Rental specific statuses
  "Active Rental": {
    badge: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
    indicator: "bg-green-500",
    text: "text-green-600 dark:text-green-400"
  },
  "Ending Soon": {
    badge: "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400",
    indicator: "bg-orange-500",
    text: "text-orange-600 dark:text-orange-400"
  },
  "Installation Scheduled": {
    badge: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
    indicator: "bg-blue-500",
    text: "text-blue-600 dark:text-blue-400"
  },
  "Quote Pending": {
    badge: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
    indicator: "bg-yellow-500",
    text: "text-yellow-600 dark:text-yellow-400"
  },
  
  // Quote statuses
  sent: {
    badge: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
    indicator: "bg-blue-500",
    text: "text-blue-600 dark:text-blue-400"
  },
  accepted: {
    badge: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
    indicator: "bg-green-500",
    text: "text-green-600 dark:text-green-400"
  },
  declined: {
    badge: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
    indicator: "bg-red-500",
    text: "text-red-600 dark:text-red-400"
  },
  expired: {
    badge: "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400",
    indicator: "bg-gray-500",
    text: "text-gray-600 dark:text-gray-400"
  },
  
  // Default fallback
  default: {
    badge: "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400",
    indicator: "bg-gray-500",
    text: "text-gray-600 dark:text-gray-400"
  }
} as const;

export type StatusType = keyof typeof statusConfig;

/**
 * Get status color classes for badges
 */
export function getStatusBadgeColor(status: string): string {
  return statusConfig[status as StatusType]?.badge || statusConfig.default.badge;
}

/**
 * Get status color classes for indicators/dots
 */
export function getStatusIndicatorColor(status: string): string {
  return statusConfig[status as StatusType]?.indicator || statusConfig.default.indicator;
}

/**
 * Get status color classes for text
 */
export function getStatusTextColor(status: string): string {
  return statusConfig[status as StatusType]?.text || statusConfig.default.text;
}

/**
 * Format currency values consistently
 */
export function formatCurrency(amount: number | string): string {
  const numericAmount = typeof amount === 'string' 
    ? parseFloat(amount.replace(/[^0-9.-]+/g, '')) 
    : amount;
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numericAmount);
}

/**
 * Format dates consistently
 */
export function formatDate(date: string | Date, format: 'short' | 'long' | 'relative' = 'short'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (!dateObj || isNaN(dateObj.getTime())) {
    return 'Invalid Date';
  }
  
  switch (format) {
    case 'long':
      return dateObj.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    case 'relative':
      const now = new Date();
      const diffInDays = Math.floor((now.getTime() - dateObj.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffInDays === 0) return 'Today';
      if (diffInDays === 1) return 'Yesterday';
      if (diffInDays === -1) return 'Tomorrow';
      if (diffInDays > 0 && diffInDays < 7) return `${diffInDays} days ago`;
      if (diffInDays < 0 && diffInDays > -7) return `In ${Math.abs(diffInDays)} days`;
      
      return dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    default:
      return dateObj.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
  }
}

/**
 * Format phone numbers consistently
 */
export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  
  return phone; // Return original if not 10 digits
}

/**
 * Generate initials from a name
 */
export function generateInitials(name: string): string {
  return name
    .split(/[\s,]+/)
    .slice(0, 2)
    .map(part => part[0])
    .join('')
    .toUpperCase();
}

/**
 * Calculate pricing for ramp rentals
 */
export function calculateRampPricing(rampHeight: number) {
  const baseMonthlyRate = 125;
  const perInchRate = 6;
  const baseInstallationFee = 75;
  const perInchInstallation = 2;
  
  const monthlyRate = baseMonthlyRate + (rampHeight * perInchRate);
  const installationFee = baseInstallationFee + (rampHeight * perInchInstallation);
  const totalFirstMonth = monthlyRate + installationFee;
  
  return {
    monthlyRate,
    installationFee,
    totalFirstMonth,
    formattedMonthlyRate: formatCurrency(monthlyRate),
    formattedInstallationFee: formatCurrency(installationFee),
    formattedTotalFirstMonth: formatCurrency(totalFirstMonth)
  };
}

/**
 * Validate email addresses
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate phone numbers (US format)
 */
export function isValidPhone(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length === 10;
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}

/**
 * Get time remaining until expiration
 */
export function getTimeRemaining(expirationDate: string | Date): {
  isExpired: boolean;
  timeRemaining: string;
  urgency: 'high' | 'medium' | 'low';
} {
  const expDate = typeof expirationDate === 'string' ? new Date(expirationDate) : expirationDate;
  const now = new Date();
  const diffInMs = expDate.getTime() - now.getTime();
  const diffInHours = diffInMs / (1000 * 60 * 60);
  
  if (diffInMs <= 0) {
    return {
      isExpired: true,
      timeRemaining: 'Expired',
      urgency: 'high'
    };
  }
  
  let timeRemaining: string;
  let urgency: 'high' | 'medium' | 'low';
  
  if (diffInHours < 24) {
    const hours = Math.floor(diffInHours);
    timeRemaining = `${hours}h remaining`;
    urgency = 'high';
  } else if (diffInHours < 72) {
    const days = Math.floor(diffInHours / 24);
    timeRemaining = `${days}d remaining`;
    urgency = 'medium';
  } else {
    const days = Math.floor(diffInHours / 24);
    timeRemaining = `${days}d remaining`;
    urgency = 'low';
  }
  
  return {
    isExpired: false,
    timeRemaining,
    urgency
  };
} 