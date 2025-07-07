import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  AlertTriangle, 
  Wifi, 
  RefreshCw, 
  Server, 
  Shield, 
  Phone
} from "lucide-react";
import { typography, spacing, icons, themes, animations, cx } from "@/lib/design-system";

interface ErrorStateProps {
  type?: "network" | "server" | "auth" | "validation" | "general";
  title?: string;
  message?: string;
  onRetry?: () => void;
  onContactSupport?: () => void;
  className?: string;
}

export function ErrorState({ 
  type = "general",
  title,
  message,
  onRetry,
  onContactSupport,
  className = ""
}: ErrorStateProps) {
  const getErrorConfig = () => {
    switch (type) {
      case "network":
        return {
          icon: Wifi,
          title: title || "Connection Problem",
          message: message || "Check your internet connection and try again.",
          variant: "warning" as const,
        };
      case "server":
        return {
          icon: Server,
          title: title || "Server Error",
          message: message || "Our servers are experiencing issues. Please try again in a few minutes.",
          variant: "error" as const,
        };
      case "auth":
        return {
          icon: Shield,
          title: title || "Authentication Required",
          message: message || "Your session has expired. Please log in again.",
          variant: "info" as const,
        };
      case "validation":
        return {
          icon: AlertTriangle,
          title: title || "Invalid Data",
          message: message || "Please check your input and try again.",
          variant: "warning" as const,
        };
      default:
        return {
          icon: AlertTriangle,
          title: title || "Something went wrong",
          message: message || "An unexpected error occurred. Please try again.",
          variant: "neutral" as const,
        };
    }
  };

  const config = getErrorConfig();
  const Icon = config.icon;

  return (
    <div className={cx(spacing.component.lg, className)}>
      <Card className={cx(
        themes.card.default,
        "border-l-4",
        config.variant === "error" ? "border-l-red-500" : 
        config.variant === "warning" ? "border-l-yellow-500" :
        config.variant === "info" ? "border-l-blue-500" : "border-l-gray-500"
      )}>
        <CardContent className={cx(spacing.component.md, "text-center")}>
          {/* Error Icon */}
          <div className={cx(
            "mx-auto mb-4 flex items-center justify-center rounded-full bg-white dark:bg-gray-800 shadow-sm",
            "h-16 w-16"
          )}>
            <Icon className={cx(
              icons.xl,
              config.variant === "error" ? "text-red-600" :
              config.variant === "warning" ? "text-yellow-600" :
              config.variant === "info" ? "text-blue-600" : "text-gray-600"
            )} />
          </div>

          {/* Error Title */}
          <h3 className={cx(
            typography.heading.h3,
            "mb-2",
            config.variant === "error" ? "text-red-700" :
            config.variant === "warning" ? "text-yellow-700" :
            config.variant === "info" ? "text-blue-700" : "text-gray-700"
          )}>
            {config.title}
          </h3>

          {/* Error Message */}
          <p className={cx(
            typography.body.medium,
            "mb-6 text-gray-600 dark:text-gray-400 max-w-md mx-auto"
          )}>
            {config.message}
          </p>

          {/* Action Buttons */}
          <div className={cx("flex flex-col sm:flex-row", spacing.gap.sm, "justify-center")}>
            {onRetry && (
              <Button
                onClick={onRetry}
                className={cx(
                  "flex items-center",
                  spacing.gap.sm,
                  animations.transition
                )}
              >
                <RefreshCw className={icons.sm} />
                Try Again
              </Button>
            )}
            
            {onContactSupport && (
              <Button
                variant="outline"
                onClick={onContactSupport}
                className={cx(
                  "flex items-center",
                  spacing.gap.sm,
                  animations.transition
                )}
              >
                <Phone className={icons.sm} />
                Contact Support
              </Button>
            )}
          </div>

          {/* Help text */}
          {onContactSupport && (
            <p className={cx(
              typography.body.small,
              "mt-4 text-gray-500 dark:text-gray-400"
            )}>
              If this problem persists, please contact our support team for assistance.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Convenience components for common error types
export function NetworkError({ onRetry }: { onRetry?: () => void }) {
  return <ErrorState type="network" onRetry={onRetry} />;
}

export function ServerError({ onRetry, onContactSupport }: { 
  onRetry?: () => void; 
  onContactSupport?: () => void;
}) {
  return <ErrorState type="server" onRetry={onRetry} onContactSupport={onContactSupport} />;
}

export function AuthError() {
  return <ErrorState type="auth" />;
}

export function ValidationError({ message }: { message?: string }) {
  return <ErrorState type="validation" message={message} />;
} 