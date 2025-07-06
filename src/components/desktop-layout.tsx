"use client";

import { ReactNode } from "react";
import { MobileLayout } from "./mobile-layout";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  Home, 
  Users, 
  Calendar, 
  CreditCard, 
  Bell, 
  Settings,
  BarChart3,
  FileText,
  HelpCircle
} from "lucide-react";

interface DesktopLayoutProps {
  children: ReactNode;
  title?: string;
  showHeader?: boolean;
  showNavigation?: boolean;
}

const sidebarNavItems = [
  {
    title: "Dashboard",
    href: "/",
    icon: Home
  },
  {
    title: "Customers",
    href: "/customers", 
    icon: Users
  },
  {
    title: "Quotes",
    href: "/quotes",
    icon: FileText
  },
  {
    title: "Schedule",
    href: "/schedule",
    icon: Calendar
  },
  {
    title: "Billing",
    href: "/billing",
    icon: CreditCard
  }
];

const secondaryNavItems = [
  {
    title: "Reports",
    href: "/reports",
    icon: BarChart3
  },
  {
    title: "Documents", 
    href: "/documents",
    icon: FileText
  },
  {
    title: "Settings",
    href: "/settings", 
    icon: Settings
  },
  {
    title: "Help",
    href: "/help",
    icon: HelpCircle
  }
];

export function DesktopLayout({ 
  children, 
  title = "Same Day Ramps", 
  showHeader = true,
  showNavigation = true 
}: DesktopLayoutProps) {
  const isMobile = useIsMobile();
  const pathname = usePathname();

  // Fall back to mobile layout on small screens
  if (isMobile) {
    return (
      <MobileLayout 
        title={title} 
        showHeader={showHeader} 
        showNavigation={showNavigation}
      >
        {children}
      </MobileLayout>
    );
  }

  // Desktop/tablet layout with sidebar
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex">
        {/* Sidebar */}
        {showNavigation && (
          <div className="hidden sm:flex sm:w-64 sm:flex-col sm:fixed sm:inset-y-0">
            <div className="flex flex-col flex-grow bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
              {/* Logo/Brand */}
              <div className="flex items-center h-16 flex-shrink-0 px-4 bg-blue-600 dark:bg-blue-700">
                <h1 className="text-lg font-bold text-white">Same Day Ramps</h1>
              </div>

              {/* Primary Navigation */}
              <div className="mt-5 flex-1 flex flex-col">
                <nav className="flex-1 px-2 space-y-1">
                  {sidebarNavItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          "group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors",
                          isActive
                            ? "bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                            : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
                        )}
                      >
                        <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
                        {item.title}
                      </Link>
                    );
                  })}
                </nav>

                <Separator className="mx-2 my-4" />

                {/* Secondary Navigation */}
                <nav className="px-2 space-y-1">
                  {secondaryNavItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          "group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors",
                          isActive
                            ? "bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                            : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
                        )}
                      >
                        <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
                        {item.title}
                      </Link>
                    );
                  })}
                </nav>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className={cn(
          "flex flex-col flex-1",
          showNavigation && "sm:pl-64"
        )}>
          {/* Header */}
          {showHeader && (
            <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
              <div className="px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                  <div className="flex items-center">
                    <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {title}
                    </h1>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Button variant="ghost" size="icon">
                      <Bell className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Settings className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </header>
          )}

          {/* Page Content */}
          <main className="flex-1">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
 