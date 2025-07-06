"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, Users, Calendar, CreditCard, FileText, Menu } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}

const navItems: NavItem[] = [
  { href: "/", icon: Home, label: "Dashboard" },
  { href: "/customers", icon: Users, label: "Customers" },
  { href: "/quotes", icon: FileText, label: "Quotes" },
  { href: "/schedule", icon: Calendar, label: "Schedule" },
  { href: "/billing", icon: CreditCard, label: "Billing" },
  { href: "/more", icon: Menu, label: "More" },
];

export function MobileNavigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 dark:bg-gray-900 dark:border-gray-800 safe-area-padding-bottom">
      <div className="flex justify-around items-center py-2 pb-safe-area-inset-bottom">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center px-3 py-2 min-w-[44px] transition-colors",
                isActive
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
              )}
            >
              <Icon className="h-6 w-6 mb-1" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
} 