import { DesktopLayout } from "@/components/desktop-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Phone, 
  Plus,
  Navigation,
  CheckCircle,
  AlertCircle,
  User
} from "lucide-react";

// Mock schedule data
const todayAppointments = [
  {
    id: 1,
    time: "9:00 AM",
    endTime: "11:00 AM",
    type: "Installation",
    customer: "Johnson, Michael",
    address: "1234 Oak Street, Dallas, TX",
    phone: "(214) 555-0123",
    status: "scheduled",
    rampHeight: "24 inches",
    notes: "Customer will be home all morning"
  },
  {
    id: 2,
    time: "2:00 PM",
    endTime: "4:00 PM",
    type: "Removal",
    customer: "Williams, Sarah",
    address: "567 Pine Avenue, Dallas, TX",
    phone: "(214) 555-0124",
    status: "in-progress",
    rampHeight: "18 inches",
    notes: "Call before arrival"
  },
  {
    id: 3,
    time: "4:30 PM",
    endTime: "6:30 PM",
    type: "Installation",
    customer: "Davis, Robert",
    address: "890 Elm Street, Dallas, TX",
    phone: "(214) 555-0125",
    status: "scheduled",
    rampHeight: "30 inches",
    notes: "Back entrance installation"
  }
];

const weekAppointments = [
  {
    date: "Monday, Dec 16",
    appointments: [
      { time: "9:00 AM", customer: "Johnson, M.", type: "Installation", status: "scheduled" },
      { time: "2:00 PM", customer: "Williams, S.", type: "Removal", status: "in-progress" }
    ]
  },
  {
    date: "Tuesday, Dec 17",
    appointments: [
      { time: "10:00 AM", customer: "Garcia, M.", type: "Installation", status: "scheduled" },
      { time: "3:00 PM", customer: "Brown, K.", type: "Maintenance", status: "scheduled" }
    ]
  },
  {
    date: "Wednesday, Dec 18",
    appointments: [
      { time: "11:00 AM", customer: "Miller, J.", type: "Installation", status: "scheduled" }
    ]
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "scheduled":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
    case "in-progress":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
    case "completed":
      return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
    case "cancelled":
      return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "scheduled":
      return <Clock className="h-4 w-4" />;
    case "in-progress":
      return <AlertCircle className="h-4 w-4" />;
    case "completed":
      return <CheckCircle className="h-4 w-4" />;
    default:
      return <Clock className="h-4 w-4" />;
  }
};

const getTypeColor = (type: string) => {
  switch (type) {
    case "Installation":
      return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
    case "Removal":
      return "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400";
    case "Maintenance":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
  }
};

export default function SchedulePage() {
  return (
    <DesktopLayout title="Schedule">
      <div className="p-4">
        <Tabs defaultValue="today" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="today">Today</TabsTrigger>
            <TabsTrigger value="week">Week</TabsTrigger>
            <TabsTrigger value="month">Month</TabsTrigger>
          </TabsList>
          
          <TabsContent value="today" className="space-y-6">
            {/* Today's Overview */}
            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">3</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">2</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Scheduled</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">1</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">In Progress</p>
                </CardContent>
              </Card>
            </div>

            {/* Today's Appointments */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Today&apos;s Appointments
                </h2>
                <Button size="sm" className="min-w-[44px]">
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>
              
              {todayAppointments.map((appointment) => (
                <Card key={appointment.id} className="touch-manipulation">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                          {getStatusIcon(appointment.status)}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <Badge className={getTypeColor(appointment.type)}>
                              {appointment.type}
                            </Badge>
                            <Badge className={getStatusColor(appointment.status)}>
                              {appointment.status}
                            </Badge>
                          </div>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {appointment.customer}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {appointment.time} - {appointment.endTime}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <MapPin className="h-4 w-4 mr-2" />
                        {appointment.address}
                      </div>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <User className="h-4 w-4 mr-2" />
                        Ramp Height: {appointment.rampHeight}
                      </div>
                      {appointment.notes && (
                        <div className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-2 rounded">
                          <strong>Notes:</strong> {appointment.notes}
                        </div>
                      )}
                    </div>

                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1 h-10 min-w-[44px]"
                      >
                        <Phone className="h-4 w-4 mr-2" />
                        Call
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1 h-10 min-w-[44px]"
                      >
                        <Navigation className="h-4 w-4 mr-2" />
                        Navigate
                      </Button>
                      <Button 
                        size="sm" 
                        className="flex-1 h-10 min-w-[44px]"
                      >
                        {appointment.status === "scheduled" ? "Start" : "Complete"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="week" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Week View
              </h2>
              <Button size="sm" className="min-w-[44px]">
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>
            </div>

            {weekAppointments.map((day, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                    {day.date}
                  </h3>
                  <div className="space-y-2">
                    {day.appointments.map((appointment, idx) => (
                      <div key={idx} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-b-0">
                        <div className="flex items-center space-x-3">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {appointment.time}
                          </div>
                          <div>
                            <p className="text-sm text-gray-900 dark:text-white">
                              {appointment.customer}
                            </p>
                            <Badge className={getTypeColor(appointment.type)}>
                              {appointment.type}
                            </Badge>
                          </div>
                        </div>
                        <Badge className={getStatusColor(appointment.status)}>
                          {appointment.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="month" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                December 2024
              </h2>
              <Button size="sm" className="min-w-[44px]">
                <Calendar className="h-4 w-4 mr-2" />
                View Calendar
              </Button>
            </div>

            <Card>
              <CardContent className="p-4">
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">
                    Calendar view coming soon
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                    Use Today or Week view for now
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DesktopLayout>
  );
} 