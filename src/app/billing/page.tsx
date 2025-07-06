import { DesktopLayout } from "@/components/desktop-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  DollarSign, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  CreditCard,
  RefreshCw,
  Eye,
  Download,
  User
} from "lucide-react";

// Mock billing data
const paymentAlerts = [
  {
    id: 1,
    customer: "Williams, Sarah",
    amount: 150,
    type: "monthly_rent",
    status: "failed",
    dueDate: "2024-12-15",
    failureReason: "Insufficient funds",
    retryCount: 1
  },
  {
    id: 2,
    customer: "Garcia, Maria",
    amount: 200,
    type: "installation_fee",
    status: "overdue",
    dueDate: "2024-12-10",
    failureReason: null,
    retryCount: 0
  }
];

const pendingInvoices = [
  {
    id: 1,
    customer: "Johnson, Michael",
    amount: 150,
    type: "monthly_rent",
    dueDate: "2024-12-20",
    status: "pending"
  },
  {
    id: 2,
    customer: "Davis, Robert",
    amount: 300,
    type: "installation_fee",
    dueDate: "2024-12-25",
    status: "sent"
  },
  {
    id: 3,
    customer: "Brown, Kevin",
    amount: 125,
    type: "monthly_rent",
    dueDate: "2024-12-28",
    status: "pending"
  }
];

const paymentHistory = [
  {
    id: 1,
    customer: "Johnson, Michael",
    amount: 150,
    type: "monthly_rent",
    paidDate: "2024-11-15",
    status: "paid",
    paymentMethod: "Credit Card"
  },
  {
    id: 2,
    customer: "Williams, Sarah",
    amount: 125,
    type: "monthly_rent",
    paidDate: "2024-11-20",
    status: "paid",
    paymentMethod: "ACH"
  },
  {
    id: 3,
    customer: "Garcia, Maria",
    amount: 300,
    type: "installation_fee",
    paidDate: "2024-11-10",
    status: "refunded",
    paymentMethod: "Credit Card"
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "paid":
      return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
    case "pending":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
    case "failed":
      return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
    case "overdue":
      return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
    case "sent":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
    case "refunded":
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "paid":
      return <CheckCircle className="h-4 w-4" />;
    case "pending":
      return <Clock className="h-4 w-4" />;
    case "failed":
      return <AlertCircle className="h-4 w-4" />;
    case "overdue":
      return <AlertCircle className="h-4 w-4" />;
    case "sent":
      return <Clock className="h-4 w-4" />;
    case "refunded":
      return <RefreshCw className="h-4 w-4" />;
    default:
      return <Clock className="h-4 w-4" />;
  }
};

const getTypeLabel = (type: string) => {
  switch (type) {
    case "monthly_rent":
      return "Monthly Rent";
    case "installation_fee":
      return "Installation Fee";
    case "late_fee":
      return "Late Fee";
    case "damage_fee":
      return "Damage Fee";
    default:
      return type;
  }
};

export default function BillingPage() {
  return (
    <DesktopLayout title="Billing">
      <div className="p-4">
        <Tabs defaultValue="alerts" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="alerts" className="space-y-6">
            {/* Payment Alerts Overview */}
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-red-600 dark:text-red-400">2</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Failed Payments</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">$350</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Amount Due</p>
                </CardContent>
              </Card>
            </div>

            {/* Payment Alerts */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Payment Alerts
              </h2>
              
              {paymentAlerts.map((alert) => (
                <Card key={alert.id} className="border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800 touch-manipulation">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="h-12 w-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                          <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
                        </div>
                        <div>
                          <p className="font-semibold text-red-900 dark:text-red-100">
                            {alert.customer}
                          </p>
                          <p className="text-sm text-red-700 dark:text-red-300">
                            {getTypeLabel(alert.type)} - ${alert.amount}
                          </p>
                        </div>
                      </div>
                      <Badge className={getStatusColor(alert.status)}>
                        {alert.status}
                      </Badge>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-red-700 dark:text-red-300">Due Date:</span>
                        <span className="text-red-900 dark:text-red-100">
                          {new Date(alert.dueDate).toLocaleDateString()}
                        </span>
                      </div>
                      {alert.failureReason && (
                        <div className="text-sm text-red-700 dark:text-red-300">
                          <strong>Reason:</strong> {alert.failureReason}
                        </div>
                      )}
                      {alert.retryCount > 0 && (
                        <div className="text-sm text-red-700 dark:text-red-300">
                          <strong>Retry Attempts:</strong> {alert.retryCount}
                        </div>
                      )}
                    </div>

                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        variant="destructive" 
                        className="flex-1 h-10 min-w-[44px]"
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Retry Payment
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1 h-10 min-w-[44px]"
                      >
                        <User className="h-4 w-4 mr-2" />
                        Contact
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="pending" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Pending Invoices
              </h2>
              <Button size="sm" className="min-w-[44px]">
                <DollarSign className="h-4 w-4 mr-2" />
                New Invoice
              </Button>
            </div>

            {pendingInvoices.map((invoice) => (
              <Card key={invoice.id} className="touch-manipulation">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                        <CreditCard className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {invoice.customer}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {getTypeLabel(invoice.type)}
                        </p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(invoice.status)}>
                      {invoice.status}
                    </Badge>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Amount:</span>
                      <span className="text-lg font-semibold text-gray-900 dark:text-white">
                        ${invoice.amount}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Due Date:</span>
                      <span className="text-sm text-gray-900 dark:text-white">
                        {new Date(invoice.dueDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1 h-10 min-w-[44px]"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1 h-10 min-w-[44px]"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                    <Button 
                      size="sm" 
                      className="flex-1 h-10 min-w-[44px]"
                    >
                      Send
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Payment History
              </h2>
              <Button size="sm" variant="outline" className="min-w-[44px]">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>

            {paymentHistory.map((payment) => (
              <Card key={payment.id} className="touch-manipulation">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="h-12 w-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                        {getStatusIcon(payment.status)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {payment.customer}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {getTypeLabel(payment.type)}
                        </p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(payment.status)}>
                      {payment.status}
                    </Badge>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Amount:</span>
                      <span className="text-lg font-semibold text-gray-900 dark:text-white">
                        ${payment.amount}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Paid Date:</span>
                      <span className="text-sm text-gray-900 dark:text-white">
                        {new Date(payment.paidDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Method:</span>
                      <span className="text-sm text-gray-900 dark:text-white">
                        {payment.paymentMethod}
                      </span>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1 h-10 min-w-[44px]"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Receipt
                    </Button>
                    {payment.status === "paid" && (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1 h-10 min-w-[44px]"
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Refund
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </DesktopLayout>
  );
} 