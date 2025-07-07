import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { spacing, layout, themes } from "@/lib/design-system";

interface LoadingStateProps {
  type?: "list" | "card" | "form" | "table" | "dashboard";
  count?: number;
  className?: string;
}

export function LoadingState({ type = "card", count = 3, className }: LoadingStateProps) {
  if (type === "list") {
    return (
      <div className={cn(spacing.gap.md, className)}>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className={cn(layout.flex.between, "p-4 bg-white rounded-lg border")}>
            <div className={cn(layout.flex.start, spacing.gap.sm)}>
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className={spacing.gap.sm}>
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
            <div className={cn(layout.flex.column, "items-end", spacing.gap.sm)}>
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === "dashboard") {
    return (
      <div className={cn(spacing.gap.lg, className)}>
        {/* Header */}
        <div className={spacing.gap.md}>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-96" />
        </div>
        
        {/* Metrics Grid */}
        <div className={cn(layout.grid.responsive, spacing.gap.md)}>
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className={themes.card.default}>
              <CardContent className={spacing.component.md}>
                <div className={spacing.gap.sm}>
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Main Content */}
        <div className={cn(layout.grid.auto, spacing.gap.md)}>
          {Array.from({ length: count }).map((_, i) => (
            <Card key={i} className={themes.card.default}>
              <CardHeader className={spacing.component.sm}>
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-48" />
              </CardHeader>
              <CardContent className={spacing.component.sm}>
                <div className={spacing.gap.sm}>
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (type === "table") {
    return (
      <div className={cn(spacing.gap.md, className)}>
        {/* Table Header */}
        <div className={cn(layout.grid.responsive, spacing.gap.md, "p-4 bg-gray-50 rounded-lg")}>
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-16" />
        </div>
        
        {/* Table Rows */}
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className={cn(layout.grid.responsive, spacing.gap.md, "p-4 bg-white border-b")}>
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-20" />
          </div>
        ))}
      </div>
    );
  }

  if (type === "form") {
    return (
      <div className={cn(spacing.gap.xl, className)}>
        {Array.from({ length: count }).map((_, i) => (
          <Card key={i} className={themes.card.default}>
            <CardContent className={spacing.component.md}>
              <div className={spacing.gap.lg}>
                <Skeleton className="h-6 w-40" />
                <div className={spacing.gap.lg}>
                  <div className={spacing.gap.sm}>
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                  <div className={spacing.gap.sm}>
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                  <div className={cn(layout.grid.equal, spacing.gap.md)}>
                    <div className={spacing.gap.sm}>
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                    <div className={spacing.gap.sm}>
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {/* Submit Buttons Loading */}
        <div className="sticky bottom-0 bg-white dark:bg-gray-900 pt-4">
          <div className={cn(layout.flex.start, spacing.gap.md)}>
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 flex-1" />
          </div>
        </div>
      </div>
    );
  }

  // Default card view
  return (
    <div className={cn(spacing.gap.md, className)}>
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} className={themes.card.default}>
          <CardHeader className={spacing.component.sm}>
            <div className={cn(layout.flex.between, "items-start")}>
              <div className={spacing.gap.sm}>
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-48" />
              </div>
              <Skeleton className="h-6 w-16" />
            </div>
          </CardHeader>
          <CardContent className={spacing.component.sm}>
            <div className={spacing.gap.sm}>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
            <div className={cn(layout.flex.start, spacing.gap.sm, "mt-4")}>
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-24" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 