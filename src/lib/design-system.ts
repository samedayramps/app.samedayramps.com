/**
 * Same Day Ramps Design System
 * Consistent styling patterns and utilities for the application
 */

// Typography Scale
export const typography = {
  // Display text (hero sections, main headings)
  display: {
    large: "text-4xl font-bold tracking-tight", // 36px
    medium: "text-3xl font-bold tracking-tight", // 30px
    small: "text-2xl font-bold tracking-tight", // 24px
  },
  
  // Headings (page titles, section headers)
  heading: {
    h1: "text-2xl font-semibold tracking-tight", // 24px - Page titles
    h2: "text-xl font-semibold tracking-tight", // 20px - Section headers
    h3: "text-lg font-medium", // 18px - Card titles
    h4: "text-base font-medium", // 16px - Subsection headers
  },
  
  // Body text
  body: {
    large: "text-base", // 16px - Main content
    medium: "text-sm", // 14px - Secondary content, labels
    small: "text-xs", // 12px - Captions, helper text
  },
  
  // Interactive elements
  interactive: {
    button: "text-sm font-medium", // 14px
    link: "text-sm font-medium", // 14px
    nav: "text-sm font-medium", // 14px
  },
} as const;

// Spacing Scale (consistent with Tailwind)
export const spacing = {
  // Component spacing
  component: {
    xs: "p-2", // 8px
    sm: "p-3", // 12px
    md: "p-4", // 16px
    lg: "p-6", // 24px
    xl: "p-8", // 32px
  },
  
  // Margin utilities
  margin: {
    xs: "m-1", // 4px
    sm: "m-2", // 8px
    md: "m-4", // 16px
    lg: "m-6", // 24px
    xl: "m-8", // 32px
  },
  
  // Gap utilities
  gap: {
    xs: "gap-1", // 4px
    sm: "gap-2", // 8px
    md: "gap-3", // 12px
    lg: "gap-4", // 16px
    xl: "gap-6", // 24px
  },
} as const;

// Component Heights
export const heights = {
  button: {
    sm: "h-8", // 32px
    md: "h-9", // 36px
    lg: "h-10", // 40px
    xl: "h-12", // 48px
  },
  
  input: {
    sm: "h-8", // 32px
    md: "h-9", // 36px
    lg: "h-10", // 40px
  },
  
  card: {
    header: "min-h-12", // 48px minimum
    compact: "min-h-16", // 64px minimum
    standard: "min-h-20", // 80px minimum
  },
} as const;

// Icon Sizes
export const icons = {
  xs: "h-3 w-3", // 12px
  sm: "h-4 w-4", // 16px
  md: "h-5 w-5", // 20px
  lg: "h-6 w-6", // 24px
  xl: "h-8 w-8", // 32px
} as const;

// Border Radius
export const radius = {
  sm: "rounded-md", // 6px
  md: "rounded-lg", // 8px
  lg: "rounded-xl", // 12px
  full: "rounded-full",
} as const;

// Shadow Utilities
export const shadows = {
  xs: "shadow-xs", // Subtle shadow
  sm: "shadow-sm", // Small shadow
  md: "shadow-md", // Medium shadow
  lg: "shadow-lg", // Large shadow
  card: "shadow-sm hover:shadow-md transition-shadow", // Card hover effect
} as const;

// Color Utilities (semantic colors)
export const colors = {
  status: {
    success: "text-green-600 bg-green-50",
    warning: "text-yellow-600 bg-yellow-50", 
    error: "text-red-600 bg-red-50",
    info: "text-blue-600 bg-blue-50",
    neutral: "text-gray-600 bg-gray-50",
  },
  
  priority: {
    high: "text-red-600",
    medium: "text-yellow-600",
    low: "text-green-600",
  },
  
  interactive: {
    primary: "text-blue-600 hover:text-blue-700",
    secondary: "text-gray-600 hover:text-gray-700",
    muted: "text-gray-500 hover:text-gray-600",
  },
  
  // Status badge color patterns
  badge: {
    success: "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800",
    warning: "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800",
    error: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800",
    info: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800",
    neutral: "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800",
  },
} as const;

// Layout Patterns
export const layout = {
  container: {
    sm: "max-w-sm mx-auto", // 384px
    md: "max-w-md mx-auto", // 448px  
    lg: "max-w-lg mx-auto", // 512px
    xl: "max-w-xl mx-auto", // 576px
    full: "w-full",
  },
  
  grid: {
    auto: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    responsive: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
    equal: "grid grid-cols-2 gap-4",
  },
  
  flex: {
    center: "flex items-center justify-center",
    between: "flex items-center justify-between",
    start: "flex items-center justify-start",
    column: "flex flex-col",
  },
} as const;

// Animation Patterns
export const animations = {
  transition: "transition-all duration-200 ease-out",
  hover: "hover:scale-[1.02] transition-transform duration-150",
  press: "active:scale-[0.98] transition-transform duration-100",
  fade: "transition-opacity duration-200",
} as const;

// Component Composition Helpers
export const compose = {
  card: {
    base: `${radius.sm} ${shadows.card} bg-white border border-gray-200`,
    compact: `${spacing.component.sm} ${heights.card.compact}`,
    standard: `${spacing.component.md} ${heights.card.standard}`,
  },
  
  button: {
    base: `${typography.interactive.button} ${radius.sm} ${animations.transition}`,
    primary: `${heights.button.md} px-4`,
    secondary: `${heights.button.sm} px-3`,
    icon: `${heights.button.sm} w-8`,
  },
  
  input: {
    base: `${typography.body.medium} ${radius.sm} ${heights.input.md} px-3`,
    error: "border-red-300 focus:border-red-500 focus:ring-red-200",
    success: "border-green-300 focus:border-green-500 focus:ring-green-200",
  },
} as const;

// Responsive Utilities
export const responsive = {
  mobile: "block sm:hidden", // Mobile only
  desktop: "hidden sm:block", // Desktop only
  tablet: "hidden sm:block lg:hidden", // Tablet only
  
  text: {
    responsive: "text-sm sm:text-base lg:text-lg", // Scales with screen size
    mobile: "text-base sm:text-sm", // Larger on mobile
  },
  
  spacing: {
    responsive: "p-4 sm:p-6 lg:p-8", // Scales with screen size
    mobile: "p-4 sm:p-6", // More compact scaling
  },
} as const;

// Common Pattern Utilities
export const patterns = {
  // Form field wrapper
  field: `space-y-2`,
  
  // Error message
  error: `${typography.body.small} ${colors.status.error}`,
  
  // Success message  
  success: `${typography.body.small} ${colors.status.success}`,
  
  // Loading state
  loading: `animate-pulse bg-gray-200 ${radius.sm}`,
  
  // Focus states
  focus: "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
  
  // Disabled state
  disabled: "disabled:opacity-50 disabled:cursor-not-allowed",
  
  // Interactive element
  interactive: `cursor-pointer ${animations.transition} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`,
} as const;

// Utility function to combine classes
export function cx(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

// Theme variants for different contexts
export const themes = {
  card: {
    default: `${compose.card.base} ${compose.card.standard}`,
    compact: `${compose.card.base} ${compose.card.compact}`,
    interactive: `${compose.card.base} ${compose.card.standard} ${patterns.interactive}`,
  },
  
  button: {
    primary: `${compose.button.base} ${compose.button.primary} bg-blue-600 text-white hover:bg-blue-700`,
    secondary: `${compose.button.base} ${compose.button.secondary} bg-gray-100 text-gray-700 hover:bg-gray-200`,
    ghost: `${compose.button.base} ${compose.button.secondary} text-gray-600 hover:bg-gray-100`,
    icon: `${compose.button.base} ${compose.button.icon} text-gray-600 hover:bg-gray-100`,
  },
  
  // Status badge themes
  badge: {
    success: `${typography.body.small} ${colors.badge.success} ${radius.sm} px-2 py-1 font-medium`,
    warning: `${typography.body.small} ${colors.badge.warning} ${radius.sm} px-2 py-1 font-medium`,
    error: `${typography.body.small} ${colors.badge.error} ${radius.sm} px-2 py-1 font-medium`,
    info: `${typography.body.small} ${colors.badge.info} ${radius.sm} px-2 py-1 font-medium`,
    neutral: `${typography.body.small} ${colors.badge.neutral} ${radius.sm} px-2 py-1 font-medium`,
  },
} as const; 