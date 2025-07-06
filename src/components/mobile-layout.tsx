"use client";

import { ReactNode } from "react";
import { MobileNavigation } from "./mobile-navigation";
import { Button } from "@/components/ui/button";
import { Bell, Settings } from "lucide-react";

interface MobileLayoutProps {
  children: ReactNode;
  title?: string;
  showHeader?: boolean;
  showNavigation?: boolean;
}

export function MobileLayout({ 
  children, 
  title = "Same Day Ramps", 
  showHeader = true,
  showNavigation = true 
}: MobileLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      {showHeader && (
        <header className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-200 dark:bg-gray-900 dark:border-gray-800 pt-safe-area-inset-top">
          <div className="flex items-center justify-between px-4 h-16">
            <div>
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h1>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon" className="h-10 w-10">
                <Bell className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="h-10 w-10">
                <Settings className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </header>
      )}

      {/* Main Content */}
      <main className={`${showHeader ? 'pt-16' : ''} ${showNavigation ? 'pb-20' : ''} min-h-screen`}>
        <div className="pt-safe-area-inset-top pb-safe-area-inset-bottom">
          {children}
        </div>
      </main>

      {/* Mobile Navigation */}
      {showNavigation && <MobileNavigation />}
    </div>
  );
} 