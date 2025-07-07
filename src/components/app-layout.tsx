"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { typography, spacing, icons, cx } from '@/lib/design-system';
import { 
  Home, 
  Users, 
  Calendar, 
  CreditCard, 
  Bell, 
  Settings,
  BarChart3,
  FileText,
  HelpCircle,
  Menu as MenuIcon
} from "lucide-react";

interface AppLayoutProps {
  children: ReactNode;
  title?: string;
  showHeader?: boolean;
  showNavigation?: boolean;
}

const primaryNavItems = [
  { title: "Dashboard", href: "/", icon: Home },
  { title: "Customers", href: "/customers", icon: Users },
  { title: "Quotes", href: "/quotes", icon: FileText },
  { title: "Schedule", href: "/schedule", icon: Calendar },
  { title: "Billing", href: "/billing", icon: CreditCard },
];

const secondaryNavItems = [
  { title: "Reports", href: "/reports", icon: BarChart3 },
  { title: "Documents", href: "/documents", icon: FileText },
  { title: "Settings", href: "/settings", icon: Settings },
  { title: "Help", href: "/help", icon: HelpCircle },
];

const mobileNavItems = [
  { href: "/", icon: Home, label: "Dashboard" },
  { href: "/customers", icon: Users, label: "Customers" },
  { href: "/quotes", icon: FileText, label: "Quotes" },
  { href: "/schedule", icon: Calendar, label: "Schedule" },
  { href: "/billing", icon: CreditCard, label: "Billing" },
  { href: "/more", icon: MenuIcon, label: "More" },
];

function DesktopSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:block w-64 fixed h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
      {/* Logo/Brand */}
      <div className={cx("flex items-center h-16", spacing.component.md, "bg-blue-600 dark:bg-blue-700")}>
        <h1 className={cx(typography.heading.h3, "text-white")}>Same Day Ramps</h1>
      </div>

      {/* Navigation */}
      <div className="flex flex-col h-[calc(100%-4rem)]">
        {/* Primary Navigation */}
        <nav className={cx("flex-1", spacing.component.md, "space-y-1")}>
          {primaryNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  cx("group flex items-center", spacing.component.sm, typography.interactive.nav, "rounded-md transition-colors"),
                  isActive
                    ? "bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
                )}
              >
                <Icon className={cx(icons.md, "mr-3 flex-shrink-0")} />
                {item.title}
              </Link>
            );
          })}
        </nav>

        <Separator className="mx-2" />

        {/* Secondary Navigation */}
        <nav className={cx(spacing.component.md, "space-y-1")}>
          {secondaryNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  cx("group flex items-center", spacing.component.sm, typography.interactive.nav, "rounded-md transition-colors"),
                  isActive
                    ? "bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
                )}
              >
                <Icon className={cx(icons.md, "mr-3 flex-shrink-0")} />
                {item.title}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}

function MobileNavigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-white border-t border-gray-200 dark:bg-gray-900 dark:border-gray-800 pb-safe-area-inset-bottom">
      <div className={cx("flex justify-around items-center", spacing.component.sm)}>
        {mobileNavItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                cx("flex flex-col items-center justify-center min-w-[44px] transition-colors", spacing.component.sm),
                isActive
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
              )}
            >
              <Icon className={cx(icons.lg, "mb-1")} />
              <span className={cx(typography.body.small, "font-medium")}>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export function AppLayout({ 
  children, 
  title = "Same Day Ramps", 
  showHeader = true,
  showNavigation = true 
}: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Desktop Sidebar */}
      {showNavigation && <DesktopSidebar />}

      {/* Main Content Area */}
      <div className={cn(
        "flex flex-col min-h-screen",
        showNavigation && "lg:pl-64"
      )}>
        {/* Header */}
        {showHeader && (
          <header className="sticky top-0 z-40 bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700 pt-safe-area-inset-top">
            <div className={cx("flex items-center justify-between h-16", spacing.component.md)}>
              <div>
                <h1 className={cx(typography.heading.h2, "lg:", typography.heading.h1, "text-gray-900 dark:text-white")}>
                  {title}
                </h1>
              </div>
              <div className={cx("flex items-center", spacing.gap.sm)}>
                <Button variant="ghost" size="icon">
                  <Bell className={icons.md} />
                </Button>
                <Button variant="ghost" size="icon">
                  <Settings className={icons.md} />
                </Button>
              </div>
            </div>
          </header>
        )}

        {/* Page Content */}
        <main className={cn(
          "flex-1",
          showNavigation && "pb-20 lg:pb-0" // Space for mobile nav
        )}>
          {children}
        </main>
      </div>

      {/* Mobile Navigation */}
      {showNavigation && <MobileNavigation />}
    </div>
  );
} 