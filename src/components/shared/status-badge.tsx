import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { themes } from "@/lib/design-system";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

// Map status values to badge variants
const statusVariantMap: Record<string, keyof typeof themes.badge> = {
  // Active/Success states
  'active': 'success',
  'accepted': 'success',
  'signed': 'success',
  'paid': 'success',
  'completed': 'success',
  'delivered': 'success',
  'installed': 'success',
  
  // Warning states
  'pending': 'warning',
  'review': 'warning',
  'scheduled': 'warning',
  'in_progress': 'warning',
  'partial': 'warning',
  
  // Info states
  'sent': 'info',
  'draft': 'info',
  'new': 'info',
  'quoted': 'info',
  
  // Error states
  'declined': 'error',
  'failed': 'error',
  'cancelled': 'error',
  'overdue': 'error',
  'expired': 'error',
  
  // Neutral states
  'inactive': 'neutral',
  'archived': 'neutral',
  'unknown': 'neutral',
  'default': 'neutral',
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  // Normalize status to lowercase for consistent mapping
  const normalizedStatus = status.toLowerCase().replace(/\s+/g, '_');
  
  // Get variant from map or default to neutral
  const variant = statusVariantMap[normalizedStatus] || 'neutral';
  
  // Format display text (capitalize first letter of each word)
  const displayText = status
    .split(/[\s_-]+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
  
  return (
    <Badge
      className={cn(
        themes.badge[variant],
        "inline-flex items-center justify-center whitespace-nowrap",
        className
      )}
    >
      {displayText}
    </Badge>
  );
} 