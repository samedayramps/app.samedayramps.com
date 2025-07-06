import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  AlertTriangle, 
  Wifi, 
  RefreshCw, 
  Server, 
  Shield, 
  Phone,
  Mail
} from "lucide-react";

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
          color: "text-orange-600 dark:text-orange-400",
          bgColor: "bg-orange-50 dark:bg-orange-900/20",
          borderColor: "border-orange-200 dark:border-orange-800"
        };
      case "server":
        return {
          icon: Server,
          title: title || "Server Error",
          message: message || "Our servers are experiencing issues. Please try again in a few minutes.",
          color: "text-red-600 dark:text-red-400",
          bgColor: "bg-red-50 dark:bg-red-900/20",
          borderColor: "border-red-200 dark:border-red-800"
        };
      case "auth":
        return {
          icon: Shield,
          title: title || "Authentication Required",
          message: message || "Your session has expired. Please log in again.",
          color: "text-blue-600 dark:text-blue-400",
          bgColor: "bg-blue-50 dark:bg-blue-900/20",
          borderColor: "border-blue-200 dark:border-blue-800"
        };
      case "validation":
        return {
          icon: AlertTriangle,
          title: title || "Invalid Data",
          message: message || "Please check your input and try again.",
          color: "text-yellow-600 dark:text-yellow-400",
          bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
          borderColor: "border-yellow-200 dark:border-yellow-800"
        };
      default:
        return {
          icon: AlertTriangle,
          title: title || "Something went wrong",
          message: message || "An unexpected error occurred. Please try again.",
          color: "text-gray-600 dark:text-gray-400",
          bgColor: "bg-gray-50 dark:bg-gray-900/20",
          borderColor: "border-gray-200 dark:border-gray-800"
        };
    }
  };

  const config = getErrorConfig();
  const Icon = config.icon;

  return (
    <div className={`p-4 lg:p-8 ${className}`}>
      <Card className={`${config.borderColor} ${config.bgColor}`}>
        <CardContent className="p-6 text-center">
          {/* Error Icon */}
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white dark:bg-gray-800 shadow-sm">
            <Icon className={`h-8 w-8 ${config.color}`} />
          </div>

          {/* Error Title */}
          <h3 className={`mb-2 text-lg font-semibold ${config.color}`}>
            {config.title}
          </h3>

          {/* Error Message */}
          <p className="mb-6 text-sm text-gray-600 dark:text-gray-400 max-w-md mx-auto">
            {config.message}
          </p>

          {/* Action Buttons */}
          <div className="space-y-3">
            {onRetry && (
              <Button 
                onClick={onRetry}
                className="w-full h-12 text-base"
                size="lg"
              >
                <RefreshCw className="h-5 w-5 mr-2" />
                Try Again
              </Button>
            )}

            {/* Contact Support - Show for server errors or general errors */}
            {(type === "server" || type === "general") && (
              <div className="flex gap-3">
                <Button 
                  variant="outline"
                  onClick={onContactSupport}
                  className="flex-1 h-12 text-base"
                  size="lg"
                >
                  <Phone className="h-5 w-5 mr-2" />
                  Call Support
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => window.location.href = "mailto:support@samedayramps.com"}
                  className="flex-1 h-12 text-base"
                  size="lg"
                >
                  <Mail className="h-5 w-5 mr-2" />
                  Email Us
                </Button>
              </div>
            )}

            {/* Auth-specific action */}
            {type === "auth" && (
              <Button 
                variant="outline"
                onClick={() => window.location.href = "/login"}
                className="w-full h-12 text-base"
                size="lg"
              >
                Log In Again
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Additional Help Text */}
      {type === "network" && (
        <Alert className="mt-4">
          <Wifi className="h-4 w-4" />
          <AlertTitle>Connection Tips</AlertTitle>
          <AlertDescription>
            <ul className="mt-2 space-y-1 text-sm">
              <li>• Check your WiFi or cellular connection</li>
              <li>• Try moving to an area with better signal</li>
              <li>• Restart your device if the problem persists</li>
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {type === "server" && (
        <Alert className="mt-4">
          <Server className="h-4 w-4" />
          <AlertTitle>What&apos;s Happening?</AlertTitle>
          <AlertDescription>
            <p className="text-sm">
              Our team has been notified and is working to resolve this issue. 
              Most problems are fixed within a few minutes.
            </p>
          </AlertDescription>
        </Alert>
      )}
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