import * as React from "react"

import { cn } from "@/lib/utils"
import { typography, heights, radius, patterns } from "@/lib/design-system"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        // Base styles using design system
        typography.body.medium,
        heights.input.md,
        radius.sm,
        "w-full px-3 py-2 transition-colors",
        
        // Colors and borders
        "border border-input bg-transparent",
        "placeholder:text-muted-foreground",
        "text-foreground selection:bg-primary selection:text-primary-foreground",
        
        // Focus states
        patterns.focus,
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        
        // Error states
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        
        // File input styles
        "file:text-foreground file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium",
        
        // Disabled states
        patterns.disabled,
        
        // Dark mode
        "dark:bg-input/30",
        
        // Shadow
        "shadow-xs",
        
        // Responsive text size
        "md:text-sm",
        
        className
      )}
      {...props}
    />
  )
}

export { Input }
