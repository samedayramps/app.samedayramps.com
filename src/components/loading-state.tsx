import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

interface LoadingStateProps {
  type?: "card" | "table" | "form" | "dashboard";
  count?: number;
}

export function LoadingState({ type = "card", count = 3 }: LoadingStateProps) {
  if (type === "dashboard") {
    return (
      <div className="p-4 lg:p-8 space-y-6">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8 lg:space-y-0 space-y-6">
          {/* Left Column */}
          <div className="lg:col-span-8 space-y-6">
            {/* Urgent Actions Loading */}
            <div className="space-y-4">
              <Skeleton className="h-6 w-48" />
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Card key={i}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-4 w-3/4" />
                          <Skeleton className="h-3 w-1/2" />
                        </div>
                        <Skeleton className="h-8 w-20" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Metrics Loading */}
            <div className="space-y-4">
              <Skeleton className="h-6 w-40" />
              <div className="grid grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <Card key={i}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-2">
                          <Skeleton className="h-3 w-16" />
                          <Skeleton className="h-8 w-20" />
                        </div>
                        <Skeleton className="h-12 w-12 rounded-full" />
                      </div>
                      <Skeleton className="h-3 w-24 mt-2" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-4 space-y-6">
            <div className="space-y-4">
              <Skeleton className="h-6 w-36" />
              <div className="space-y-3">
                {[1, 2].map((i) => (
                  <Card key={i}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Skeleton className="h-12 w-12 rounded-full" />
                          <div className="space-y-2">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-3 w-24" />
                            <Skeleton className="h-3 w-20" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Skeleton className="h-6 w-16" />
                          <Skeleton className="h-8 w-10" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Quick Actions Loading */}
            <div className="space-y-4">
              <Skeleton className="h-6 w-28" />
              <div className="grid grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-14" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (type === "table") {
    return (
      <div className="space-y-4">
        {/* Mobile Cards Loading */}
        <div className="space-y-4 lg:hidden">
          {Array.from({ length: count }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-8 w-10" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Desktop Table Loading */}
        <div className="hidden lg:block">
          <Card>
            <CardContent className="p-0">
              <div className="border-b p-4">
                <div className="flex space-x-4">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>
              {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="border-b p-4 last:border-b-0">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-3">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <div className="space-y-1">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </div>
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-16" />
                    <div className="flex space-x-2">
                      <Skeleton className="h-8 w-8" />
                      <Skeleton className="h-8 w-8" />
                      <Skeleton className="h-8 w-8" />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (type === "form") {
    return (
      <div className="space-y-6">
        {Array.from({ length: count }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4 space-y-4">
              <Skeleton className="h-6 w-40" />
              <div className="space-y-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-12 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-12 w-full" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-12 w-full" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-12 w-full" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {/* Submit Buttons Loading */}
        <div className="sticky bottom-0 bg-white dark:bg-gray-900 pt-4">
          <div className="flex gap-4">
            <Skeleton className="h-12 flex-1" />
            <Skeleton className="h-12 flex-1" />
          </div>
        </div>
      </div>
    );
  }

  // Default card loading
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
              <div className="space-y-2">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-8 w-10" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 