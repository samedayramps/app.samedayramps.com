import { DesktopLayout } from "@/components/desktop-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Settings, 
  HelpCircle, 
  FileText, 
  BarChart3, 
  LogOut,
  User,
  Shield,
  Download
} from "lucide-react";

const menuItems = [
  {
    icon: User,
    label: "Profile",
    description: "Manage your account settings",
    href: "/profile"
  },
  {
    icon: BarChart3,
    label: "Reports",
    description: "View business analytics and reports",
    href: "/reports"
  },
  {
    icon: FileText,
    label: "Documents",
    description: "Access contracts and documentation",
    href: "/documents"
  },
  {
    icon: Settings,
    label: "Settings",
    description: "Configure application preferences",
    href: "/settings"
  },
  {
    icon: Shield,
    label: "Privacy",
    description: "Privacy and security settings",
    href: "/privacy"
  },
  {
    icon: HelpCircle,
    label: "Help & Support",
    description: "Get help or contact support",
    href: "/help"
  },
  {
    icon: Download,
    label: "Export Data",
    description: "Download your business data",
    href: "/export"
  }
];

export default function MorePage() {
  return (
    <DesktopLayout title="More">
      <div className="p-4 space-y-6">
        {/* User Profile Section */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="h-16 w-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  John Admin
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  admin@samedayramps.com
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  Administrator
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Menu Items */}
        <div className="space-y-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Card key={item.label} className="touch-manipulation">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="h-12 w-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                      <Icon className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {item.label}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* App Information */}
        <Card>
          <CardContent className="p-4">
            <div className="text-center space-y-2">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Same Day Ramps Admin
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Version 1.0.0
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500">
                © 2024 Same Day Ramps. All rights reserved.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Logout Button */}
        <Card className="border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800">
          <CardContent className="p-4">
            <Button 
              variant="destructive" 
              className="w-full h-12 touch-target"
            >
              <LogOut className="h-5 w-5 mr-2" />
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>
    </DesktopLayout>
  );
} 