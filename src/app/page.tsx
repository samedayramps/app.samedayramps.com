"use client";

import { DesktopLayout } from "@/components/desktop-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LoadingState } from "@/components/loading-state";
import { ErrorState } from "@/components/error-state";
import { toast } from "@/components/mobile-toast";
import { useMockData } from "@/hooks/use-async";
import { 
  AlertCircle, 
  Calendar, 
  DollarSign, 
  Users, 
  Phone, 
  MapPin, 
  Clock,
  TrendingUp
} from "lucide-react";
import Link from "next/link";

// Type definitions
interface UrgentAction {
  id: number;
  type: string;
  title: string;
  subtitle: string;
  action: string;
  variant: "destructive" | "outline";
}

interface Metric {
  id: number;
  label: string;
  value: string;
  change: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

interface Appointment {
  id: number;
  customer: string;
  address: string;
  time: string;
  status: string;
  color: string;
}

interface DashboardData {
  urgentActions: UrgentAction[];
  metrics: Metric[];
  schedule: Appointment[];
}

// Mock data
const mockDashboardData: DashboardData = {
  urgentActions: [
    {
      id: 1,
      type: "quotes",
      title: "3 quotes awaiting response",
      subtitle: "Average response time: 2.5 hours",
      action: "View All",
      variant: "destructive" as const
    },
    {
      id: 2,
      type: "installations",
      title: "2 installations scheduled today",
      subtitle: "Next: Johnson M. at 10:00 AM",
      action: "Schedule",
      variant: "outline" as const
    },
    {
      id: 3,
      type: "payments",
      title: "1 payment failed - needs attention",
      subtitle: "Williams S. - $150 monthly rental",
      action: "Resolve",
      variant: "outline" as const
    }
  ],
  metrics: [
    {
      id: 1,
      label: "Revenue",
      value: "$12,450",
      change: "+12%",
      icon: DollarSign,
      color: "green"
    },
    {
      id: 2,
      label: "Active Rentals",
      value: "23",
      change: "+3 this week",
      icon: Users,
      color: "blue"
    },
    {
      id: 3,
      label: "Conversion Rate",
      value: "78%",
      change: "+5% vs last month",
      icon: TrendingUp,
      color: "purple"
    },
    {
      id: 4,
      label: "Avg Duration",
      value: "4mo",
      change: "Industry avg: 3.2mo",
      icon: Clock,
      color: "orange"
    }
  ],
  schedule: [
    {
      id: 1,
      customer: "Johnson, Michael",
      address: "1234 Oak Street",
      time: "10:00 AM - Installation",
      status: "Scheduled",
      color: "blue"
    },
    {
      id: 2,
      customer: "Williams, Sarah",
      address: "567 Pine Avenue",
      time: "2:00 PM - Removal",
      status: "Scheduled",
      color: "green"
    }
  ]
};

export default function Dashboard() {
  const { data, loading, error, execute } = useMockData(
    mockDashboardData,
    1500, // 1.5 second delay
    false // Set to true to simulate error
  );

  const handleQuickAction = (actionType: string) => {
    toast.success(`${actionType} action triggered!`, "This would open the relevant page");
  };

  const handleRetry = () => {
    toast.info("Refreshing dashboard...", "Getting the latest data");
    execute();
  };

  const handleContactSupport = () => {
    toast.info("Calling support...", "You would be connected to our support team");
  };

  if (loading) {
    return (
      <DesktopLayout title="Dashboard">
        <LoadingState type="dashboard" />
      </DesktopLayout>
    );
  }

  if (error) {
  return (
      <DesktopLayout title="Dashboard">
        <ErrorState 
          type="server"
          onRetry={handleRetry}
          onContactSupport={handleContactSupport}
        />
      </DesktopLayout>
    );
  }

  if (!data) {
    return (
      <DesktopLayout title="Dashboard">
        <ErrorState type="general" onRetry={handleRetry} />
      </DesktopLayout>
    );
  }

  return (
    <DesktopLayout title="Dashboard">
      <div className="p-4 lg:p-8 space-y-6">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8 lg:space-y-0 space-y-6">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-8 space-y-6">
          {/* Urgent Actions - Always at top */}
          <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <AlertCircle className="h-5 w-5 mr-2 text-red-500" />
            Urgent Actions
          </h2>
          <div className="space-y-3">
            {data.urgentActions.map((action: UrgentAction) => (
              <Card key={action.id} className="border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-red-900 dark:text-red-100">
                        {action.title}
                      </p>
                      <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                        {action.subtitle}
                      </p>
                    </div>
                    <Button 
                      size="sm" 
                      variant={action.variant}
                      onClick={() => handleQuickAction(action.type)}
                    >
                      {action.action}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Key Metrics */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Key Metrics (Last 30 Days)
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {data.metrics.map((metric: Metric) => {
              const Icon = metric.icon;
              return (
                <Card key={metric.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{metric.label}</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{metric.value}</p>
                      </div>
                      <div className={`h-12 w-12 bg-${metric.color}-100 dark:bg-${metric.color}-900/20 rounded-full flex items-center justify-center`}>
                        <Icon className={`h-6 w-6 text-${metric.color}-600 dark:text-${metric.color}-400`} />
                      </div>
                    </div>
                    <div className="flex items-center mt-2">
                      {metric.change.includes('+') && (
                        <TrendingUp className={`h-4 w-4 text-${metric.color}-600 dark:text-${metric.color}-400 mr-1`} />
                      )}
                      <span className={`text-sm text-${metric.color === 'green' ? 'green' : 'gray'}-600 dark:text-${metric.color === 'green' ? 'green' : 'gray'}-400`}>
                        {metric.change}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>
        </div>

        {/* Right Column - Sidebar Content */}
        <div className="lg:col-span-4 space-y-6">
          {/* Today's Schedule */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Today&apos;s Schedule
          </h2>
          <div className="space-y-3">
            {data.schedule.map((appointment: Appointment) => (
              <Card key={appointment.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`h-12 w-12 bg-${appointment.color}-100 dark:bg-${appointment.color}-900/20 rounded-full flex items-center justify-center`}>
                        <MapPin className={`h-6 w-6 text-${appointment.color}-600 dark:text-${appointment.color}-400`} />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{appointment.customer}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{appointment.address}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{appointment.time}</p>
                      </div>
                    </div>
                    <div className="flex flex-col space-y-2">
                      <Badge variant="outline">{appointment.status}</Badge>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="min-w-[44px]"
                        onClick={() => toast.success("Calling customer...", `Dialing ${appointment.customer}`)}
                      >
                        <Phone className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Quick Actions */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <Link href="/customers/add">
              <Button className="h-14 flex-col space-y-1 w-full">
                <Users className="h-6 w-6" />
                <span>New Customer</span>
              </Button>
            </Link>
            <Link href="/quotes/add">
              <Button variant="outline" className="h-14 flex-col space-y-1 w-full">
                <DollarSign className="h-6 w-6" />
                <span>Create Quote</span>
              </Button>
            </Link>
            <Button 
              variant="outline" 
              className="h-14 flex-col space-y-1"
              onClick={() => handleQuickAction("Schedule Installation")}
        >
              <Calendar className="h-6 w-6" />
              <span>Schedule Install</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-14 flex-col space-y-1"
              onClick={() => handleQuickAction("Call Customer")}
            >
              <Phone className="h-6 w-6" />
              <span>Call Customer</span>
            </Button>
          </div>
        </section>
        </div>
        </div>
    </div>
    </DesktopLayout>
  );
}
