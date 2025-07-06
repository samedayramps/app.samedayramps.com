import { DesktopLayout } from "@/components/desktop-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Search, 
  Phone, 
  Mail, 
  MapPin, 
  Plus,
  MoreVertical,
  DollarSign,
  Calendar,
  Filter,
  Download,
  CheckCircle,
  Clock,
  Users
} from "lucide-react";
import Link from "next/link";

// Mock customer data
const customers = [
  {
    id: 1,
    name: "Johnson, Michael",
    email: "mjohnson@email.com",
    phone: "(214) 555-0123",
    address: "1234 Oak Street, Dallas, TX 75201",
    initials: "MJ",
    avatar: null,
    status: "active",
    rentalStatus: "Active Rental",
    monthlyRate: "$150",
    nextPayment: "Dec 15, 2024",
    startDate: "2024-06-15",
    rampHeight: "24 inches"
  },
  {
    id: 2,
    name: "Williams, Sarah",
    email: "swilliams@email.com",
    phone: "(214) 555-0124",
    address: "567 Pine Avenue, Dallas, TX 75202",
    initials: "SW",
    avatar: null,
    status: "active",
    rentalStatus: "Ending Soon",
    monthlyRate: "$125",
    nextPayment: "Dec 20, 2024",
    startDate: "2024-05-20",
    rampHeight: "18 inches"
  },
  {
    id: 3,
    name: "Davis, Robert",
    email: "rdavis@email.com",
    phone: "(214) 555-0125",
    address: "890 Elm Street, Dallas, TX 75203",
    initials: "RD",
    avatar: null,
    status: "active",
    rentalStatus: "Installation Scheduled",
    monthlyRate: "$175",
    nextPayment: "Dec 25, 2024",
    startDate: "2024-12-15",
    rampHeight: "30 inches"
  },
  {
    id: 4,
    name: "Garcia, Maria",
    email: "mgarcia@email.com",
    phone: "(214) 555-0126",
    address: "321 Maple Drive, Dallas, TX 75204",
    initials: "MG",
    avatar: null,
    status: "pending",
    rentalStatus: "Quote Pending",
    monthlyRate: "$140",
    nextPayment: "Quote expires Dec 18",
    startDate: null,
    rampHeight: "20 inches"
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
    case "pending":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
    case "inactive":
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
  }
};

const getRentalStatusColor = (status: string) => {
  switch (status) {
    case "Active Rental":
      return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
    case "Ending Soon":
      return "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400";
    case "Installation Scheduled":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
    case "Quote Pending":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
  }
};

export default function CustomersPage() {
  return (
    <DesktopLayout title="Customers">
      <div className="p-4 space-y-6">
        {/* Search and Add Customer */}
        <div className="space-y-4">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search customers..."
                className="pl-10 h-12 text-base"
                inputMode="search"
              />
            </div>
            <Button variant="outline" size="icon" className="h-12 w-12 shrink-0">
              <Filter className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="icon" className="h-12 w-12 shrink-0">
              <Download className="h-5 w-5" />
            </Button>
            <Link href="/customers/add">
              <Button size="icon" className="h-12 w-12 shrink-0">
                <Plus className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Customer Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {customers.length}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Customers</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {customers.filter(c => c.status === 'active').length}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Active Rentals</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-8 w-8 text-yellow-500" />
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {customers.filter(c => c.status === 'pending').length}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    ${customers.filter(c => c.status === 'active').reduce((sum, c) => sum + parseInt(c.monthlyRate.replace('$', '')), 0).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Monthly Revenue</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Customer List - Mobile Cards */}
        <div className="space-y-4 lg:hidden">
          {customers.map((customer) => (
            <Card key={customer.id} className="touch-manipulation">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={customer.avatar || ""} />
                      <AvatarFallback className="bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                        {customer.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                        {customer.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {customer.address}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <Badge className={getStatusColor(customer.status)}>
                      {customer.status}
                    </Badge>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Rental Status */}
                <div className="mb-3">
                  <Badge className={getRentalStatusColor(customer.rentalStatus)}>
                    {customer.rentalStatus}
                  </Badge>
                </div>

                {/* Customer Details Grid */}
                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Monthly Rate:</span>
                    <p className="font-medium text-gray-900 dark:text-white flex items-center mt-1">
                      <DollarSign className="h-4 w-4 mr-1" />
                      {customer.monthlyRate}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Next Payment:</span>
                    <p className="font-medium text-gray-900 dark:text-white flex items-center mt-1">
                      <Calendar className="h-4 w-4 mr-1" />
                      {customer.nextPayment}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Ramp Height:</span>
                    <p className="font-medium text-gray-900 dark:text-white mt-1">
                      {customer.rampHeight}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Start Date:</span>
                    <p className="font-medium text-gray-900 dark:text-white mt-1">
                      {customer.startDate ? new Date(customer.startDate).toLocaleDateString() : "TBD"}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
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
                    <Mail className="h-4 w-4 mr-2" />
                    Email
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-1 h-10 min-w-[44px]"
                  >
                    <MapPin className="h-4 w-4 mr-2" />
                    Navigate
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Customer List - Desktop Table */}
        <div className="hidden lg:block">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Rental Status</TableHead>
                  <TableHead>Monthly Rate</TableHead>
                  <TableHead>Next Payment</TableHead>
                  <TableHead>Ramp Height</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={customer.avatar || ""} />
                          <AvatarFallback className="bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                            {customer.initials}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {customer.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {customer.email}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getRentalStatusColor(customer.rentalStatus)}>
                        {customer.rentalStatus}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      {customer.monthlyRate}
                    </TableCell>
                    <TableCell>
                      {customer.nextPayment}
                    </TableCell>
                    <TableCell>
                      {customer.rampHeight}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Phone className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Mail className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <MapPin className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>

        {/* Load More Button */}
        <div className="flex justify-center">
          <Button variant="outline" className="w-full h-12">
            Load More Customers
          </Button>
        </div>
      </div>
    </DesktopLayout>
  );
} 