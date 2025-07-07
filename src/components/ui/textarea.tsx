import * as React from "react"

import { cn } from "@/lib/utils"
import { typography, radius, patterns } from "@/lib/design-system"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        // Base styles using design system
        typography.body.medium,
        radius.sm,
        "w-full px-3 py-2 transition-colors",
        "field-sizing-content min-h-16",
        
        // Colors and borders
        "border border-input bg-transparent",
        "placeholder:text-muted-foreground",
        "text-foreground",
        
        // Focus states
        patterns.focus,
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        
        // Error states
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        
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

export { Textarea }
