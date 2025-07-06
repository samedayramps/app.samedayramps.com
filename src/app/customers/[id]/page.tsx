import { DesktopLayout } from "@/components/desktop-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { 
  Phone, 
  Mail, 
  MapPin, 
  DollarSign,
  Calendar,
  ArrowLeft,
  Edit,
  Plus,
  CheckCircle,
  Clock,
  AlertTriangle,
  CreditCard,
  FileText,
  Truck
} from "lucide-react";
import Link from "next/link";

// Mock customer data (in real app, this would come from API)
const customerData = {
  id: "1",
  name: "Johnson, Michael",
  email: "mjohnson@email.com",
  phone: "(214) 555-0123",
  address: "1234 Oak Street",
  city: "Dallas",
  state: "TX",
  zipCode: "75201",
  initials: "MJ",
  status: "active",
  createdAt: "2024-06-01T00:00:00Z",
  notes: "Preferred customer - always pays on time",
  emergencyContact: {
    name: "Sarah Johnson",
    phone: "(214) 555-0199",
    relationship: "Spouse"
  },
  currentRental: {
    id: "R001",
    status: "active",
    startDate: "2024-06-15",
    monthlyRate: 150,
    installationFee: 75,
    rampHeight: 24,
    rampConfiguration: "Straight ramp with handrails",
    serviceAddress: "1234 Oak Street, Dallas, TX 75201",
    nextPaymentDate: "2024-12-15",
    estimatedEndDate: null,
    notes: "Hip replacement recovery"
  },
  rentalHistory: [
    {
      id: "R001",
      status: "active", 
      startDate: "2024-06-15",
      endDate: null,
      monthlyRate: 150,
      rampHeight: 24,
      reason: "Post-surgery recovery"
    }
  ],
  paymentHistory: [
    {
      id: "P001",
      amount: 225,
      type: "installation_fee + first_month",
      date: "2024-06-15",
      status: "paid",
      method: "credit_card"
    },
    {
      id: "P002", 
      amount: 150,
      type: "monthly_rent",
      date: "2024-07-15",
      status: "paid",
      method: "credit_card"
    },
    {
      id: "P003",
      amount: 150,
      type: "monthly_rent", 
      date: "2024-08-15",
      status: "paid",
      method: "credit_card"
    },
    {
      id: "P004",
      amount: 150,
      type: "monthly_rent",
      date: "2024-09-15", 
      status: "paid",
      method: "credit_card"
    },
    {
      id: "P005",
      amount: 150,
      type: "monthly_rent",
      date: "2024-10-15",
      status: "paid", 
      method: "credit_card"
    },
    {
      id: "P006",
      amount: 150,
      type: "monthly_rent",
      date: "2024-11-15",
      status: "paid",
      method: "credit_card"
    },
    {
      id: "P007",
      amount: 150,
      type: "monthly_rent",
      date: "2024-12-15",
      status: "pending",
      method: "credit_card"
    }
  ],
  quotes: [
    {
      id: "Q001",
      amount: 150,
      status: "accepted",
      createdDate: "2024-06-10",
      acceptedDate: "2024-06-12"
    }
  ]
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
    case "paid":
      return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
    case "pending":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
    case "overdue":
      return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
    case "declined":
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
  }
};

const getPaymentIcon = (status: string) => {
  switch (status) {
    case "paid":
      return <CheckCircle className="h-4 w-4" />;
    case "pending":
      return <Clock className="h-4 w-4" />;
    case "overdue":
      return <AlertTriangle className="h-4 w-4" />;
    default:
      return <Clock className="h-4 w-4" />;
  }
};

const formatPaymentType = (type: string) => {
  switch (type) {
    case "installation_fee + first_month":
      return "Installation + First Month";
    case "monthly_rent":
      return "Monthly Rental";
    case "late_fee":
      return "Late Fee";
    case "damage_fee":
      return "Damage Fee";
    default:
      return type;
  }
};

const PaymentCard = ({ payment }: { payment: typeof customerData.paymentHistory[0] }) => (
  <Card className="mb-3">
    <CardContent className="p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          {getPaymentIcon(payment.status)}
          <span className="font-medium text-gray-900 dark:text-white">
            ${payment.amount}
          </span>
        </div>
        <Badge className={getStatusColor(payment.status)}>
          {payment.status}
        </Badge>
      </div>
      <div className="text-sm text-gray-600 dark:text-gray-400">
        <p>{formatPaymentType(payment.type)}</p>
        <p>{new Date(payment.date).toLocaleDateString()}</p>
        <p className="capitalize">{payment.method.replace('_', ' ')}</p>
      </div>
    </CardContent>
  </Card>
);

export default async function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  // In real app, would use params.id to fetch customer
  const { id } = await params;
  console.log('Customer ID:', id); // Placeholder for actual data fetching
  const customer = customerData;

  return (
    <DesktopLayout title={`Customer: ${customer.name}`}>
      <div className="p-4 space-y-6">
        {/* Header with Back Button */}
        <div className="flex items-center space-x-4">
          <Link href="/customers">
            <Button variant="outline" size="icon" className="h-10 w-10">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {customer.name}
          </h1>
        </div>

        {/* Customer Summary Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src="" />
                <AvatarFallback className="bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 text-xl">
                  {customer.initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {customer.name}
                  </h2>
                  <Badge className={getStatusColor(customer.status)}>
                    {customer.status}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-400">{customer.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-400">{customer.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-400">
                      {customer.address}, {customer.city}, {customer.state} {customer.zipCode}
                    </span>
                  </div>
                </div>

                <div className="flex space-x-2 mt-4">
                  <Button size="sm" variant="outline">
                    <Phone className="h-4 w-4 mr-2" />
                    Call
                  </Button>
                  <Button size="sm" variant="outline">
                    <Mail className="h-4 w-4 mr-2" />
                    Email
                  </Button>
                  <Button size="sm" variant="outline">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Current Rental Status */}
        {customer.currentRental && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Truck className="h-5 w-5" />
                <span>Current Rental</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Monthly Rate
                    </label>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                      <DollarSign className="h-4 w-4 mr-1" />
                      ${customer.currentRental.monthlyRate}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Start Date
                    </label>
                    <p className="text-gray-900 dark:text-white flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      {new Date(customer.currentRental.startDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Ramp Configuration
                    </label>
                    <p className="text-gray-900 dark:text-white">
                      {customer.currentRental.rampHeight}&quot; height - {customer.currentRental.rampConfiguration}
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Next Payment
                    </label>
                    <p className="text-gray-900 dark:text-white flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      {new Date(customer.currentRental.nextPaymentDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Service Address
                    </label>
                    <p className="text-gray-900 dark:text-white">
                      {customer.currentRental.serviceAddress}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Notes
                    </label>
                    <p className="text-gray-900 dark:text-white">
                      {customer.currentRental.notes}
                    </p>
                  </div>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div className="flex space-x-2">
                <Button size="sm">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Process Payment
                </Button>
                <Button size="sm" variant="outline">
                  <Edit className="h-4 w-4 mr-2" />
                  Modify Rental
                </Button>
                <Button size="sm" variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  Generate Invoice
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Detailed Tabs */}
        <Tabs defaultValue="payments" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="rentals">Rental History</TabsTrigger>
            <TabsTrigger value="quotes">Quotes</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
          </TabsList>

          <TabsContent value="payments" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Payment History
              </h3>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Payment
              </Button>
            </div>
            
            {/* Mobile Payment Cards */}
            <div className="space-y-3 lg:hidden">
              {customer.paymentHistory.map((payment) => (
                <PaymentCard key={payment.id} payment={payment} />
              ))}
            </div>

            {/* Desktop Payment Table */}
            <div className="hidden lg:block">
              <Card>
                <CardContent className="p-0">
                  <table className="w-full">
                    <thead className="border-b">
                      <tr>
                        <th className="text-left p-4 font-medium text-gray-900 dark:text-white">Date</th>
                        <th className="text-left p-4 font-medium text-gray-900 dark:text-white">Type</th>
                        <th className="text-left p-4 font-medium text-gray-900 dark:text-white">Amount</th>
                        <th className="text-left p-4 font-medium text-gray-900 dark:text-white">Method</th>
                        <th className="text-left p-4 font-medium text-gray-900 dark:text-white">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {customer.paymentHistory.map((payment) => (
                        <tr key={payment.id} className="border-b last:border-b-0">
                          <td className="p-4 text-gray-900 dark:text-white">
                            {new Date(payment.date).toLocaleDateString()}
                          </td>
                          <td className="p-4 text-gray-600 dark:text-gray-400">
                            {formatPaymentType(payment.type)}
                          </td>
                          <td className="p-4 font-medium text-gray-900 dark:text-white">
                            ${payment.amount}
                          </td>
                          <td className="p-4 text-gray-600 dark:text-gray-400 capitalize">
                            {payment.method.replace('_', ' ')}
                          </td>
                          <td className="p-4">
                            <Badge className={getStatusColor(payment.status)}>
                              <span className="flex items-center space-x-1">
                                {getPaymentIcon(payment.status)}
                                <span>{payment.status}</span>
                              </span>
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="rentals" className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Rental History
            </h3>
            {customer.rentalHistory.map((rental) => (
              <Card key={rental.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900 dark:text-white">
                      Rental #{rental.id}
                    </span>
                    <Badge className={getStatusColor(rental.status)}>
                      {rental.status}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Period:</span>
                      <p className="text-gray-900 dark:text-white">
                        {new Date(rental.startDate).toLocaleDateString()} - 
                        {rental.endDate ? new Date(rental.endDate).toLocaleDateString() : 'Ongoing'}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Monthly Rate:</span>
                      <p className="text-gray-900 dark:text-white">${rental.monthlyRate}</p>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Ramp Height:</span>
                      <p className="text-gray-900 dark:text-white">{rental.rampHeight} inches</p>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Reason:</span>
                      <p className="text-gray-900 dark:text-white">{rental.reason}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="quotes" className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Quote History
            </h3>
            {customer.quotes.map((quote) => (
              <Card key={quote.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900 dark:text-white">
                      Quote #{quote.id}
                    </span>
                    <Badge className={getStatusColor(quote.status)}>
                      {quote.status}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Amount:</span>
                      <p className="text-gray-900 dark:text-white">${quote.amount}/month</p>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Created:</span>
                      <p className="text-gray-900 dark:text-white">
                        {new Date(quote.createdDate).toLocaleDateString()}
                      </p>
                    </div>
                    {quote.acceptedDate && (
                      <div className="col-span-2">
                        <span className="text-gray-500 dark:text-gray-400">Accepted:</span>
                        <p className="text-gray-900 dark:text-white">
                          {new Date(quote.acceptedDate).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="notes" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Customer Notes
              </h3>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Note
              </Button>
            </div>
            
            <Card>
              <CardContent className="p-4">
                <div className="mb-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(customer.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-900 dark:text-white">
                  {customer.notes}
                </p>
              </CardContent>
            </Card>

            {customer.emergencyContact && (
              <Card>
                <CardHeader>
                  <CardTitle>Emergency Contact</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Name:</span>
                      <p className="text-gray-900 dark:text-white">{customer.emergencyContact.name}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone:</span>
                      <p className="text-gray-900 dark:text-white">{customer.emergencyContact.phone}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Relationship:</span>
                      <p className="text-gray-900 dark:text-white">{customer.emergencyContact.relationship}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DesktopLayout>
  );
} 