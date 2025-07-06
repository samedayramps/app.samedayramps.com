import { DesktopLayout } from "@/components/desktop-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Plus,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  Mail,
  Phone,
  Eye,
  Edit,
  Send,
  AlertCircle
} from "lucide-react";
import Link from "next/link";

// Mock quotes data
const quotes = [
  {
    id: "Q001",
    customerName: "Johnson, Michael",
    customerEmail: "mjohnson@email.com",
    customerPhone: "(214) 555-0123",
    customerInitials: "MJ",
    serviceAddress: "1234 Oak Street, Dallas, TX 75201",
    rampHeight: 24,
    monthlyRate: 150,
    installationFee: 75,
    totalFirstMonth: 225,
    timeline: "within-3-days",
    status: "pending",
    createdAt: "2024-12-15T09:30:00Z",
    expiresAt: "2024-12-22T09:30:00Z",
    sentAt: "2024-12-15T10:00:00Z",
    estimatedDuration: "6-12 months",
    notes: "Customer needs ASAP wheelchair ramp installation"
  },
  {
    id: "Q002", 
    customerName: "Williams, Sarah",
    customerEmail: "swilliams@email.com",
    customerPhone: "(214) 555-0124",
    customerInitials: "SW",
    serviceAddress: "567 Pine Avenue, Dallas, TX 75202",
    rampHeight: 18,
    monthlyRate: 125,
    installationFee: 50,
    totalFirstMonth: 175,
    timeline: "within-1-week",
    status: "sent",
    createdAt: "2024-12-14T14:15:00Z",
    expiresAt: "2024-12-21T14:15:00Z",
    sentAt: "2024-12-14T15:00:00Z",
    estimatedDuration: "12+ months",
    notes: "Ongoing mobility needs - wheelchair ramp rental"
  },
  {
    id: "Q003",
    customerName: "Davis, Robert", 
    customerEmail: "rdavis@email.com",
    customerPhone: "(214) 555-0125",
    customerInitials: "RD",
    serviceAddress: "890 Elm Street, Dallas, TX 75203",
    rampHeight: 30,
    monthlyRate: 175,
    installationFee: 100,
    totalFirstMonth: 275,
    timeline: "asap",
    status: "accepted",
    createdAt: "2024-12-13T11:00:00Z",
    expiresAt: "2024-12-20T11:00:00Z",
    sentAt: "2024-12-13T11:30:00Z",
    acceptedAt: "2024-12-13T16:45:00Z",
    estimatedDuration: "3-6 months",
    notes: "Temporary wheelchair ramp rental needed"
  },
  {
    id: "Q004",
    customerName: "Garcia, Maria",
    customerEmail: "mgarcia@email.com", 
    customerPhone: "(214) 555-0126",
    customerInitials: "MG",
    serviceAddress: "321 Maple Drive, Dallas, TX 75204",
    rampHeight: 20,
    monthlyRate: 140,
    installationFee: 65,
    totalFirstMonth: 205,
    timeline: "flexible",
    status: "expired",
    createdAt: "2024-12-05T08:00:00Z",
    expiresAt: "2024-12-12T08:00:00Z",
    sentAt: "2024-12-05T09:00:00Z",
    estimatedDuration: "4-8 months",
    notes: "Follow-up needed - quote expired without response"
  },
  {
    id: "Q005",
    customerName: "Chen, Lisa",
    customerEmail: "lchen@email.com",
    customerPhone: "(214) 555-0127", 
    customerInitials: "LC",
    serviceAddress: "456 Cedar Lane, Dallas, TX 75205",
    rampHeight: 22,
    monthlyRate: 160,
    installationFee: 80,
    totalFirstMonth: 240,
    timeline: "within-3-days",
    status: "declined",
    createdAt: "2024-12-10T13:30:00Z",
    expiresAt: "2024-12-17T13:30:00Z",
    sentAt: "2024-12-10T14:00:00Z",
    declinedAt: "2024-12-11T10:15:00Z",
    estimatedDuration: "12+ months",
    notes: "Customer found alternative solution"
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
    case "sent":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
    case "accepted":
      return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
    case "declined":
      return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
    case "expired":
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "pending":
      return <Clock className="h-4 w-4" />;
    case "sent": 
      return <Mail className="h-4 w-4" />;
    case "accepted":
      return <CheckCircle className="h-4 w-4" />;
    case "declined":
      return <XCircle className="h-4 w-4" />;
    case "expired":
      return <AlertCircle className="h-4 w-4" />;
    default:
      return <Clock className="h-4 w-4" />;
  }
};

const getTimelineLabel = (timeline: string) => {
  switch (timeline) {
    case "asap":
      return "Within 24 hours";
    case "within-3-days":
      return "Within 3 days";
    case "within-1-week":
      return "Within 1 week";
    case "flexible":
      return "Flexible timing";
    default:
      return timeline;
  }
};

const getDaysUntilExpiry = (expiresAt: string) => {
  const expiry = new Date(expiresAt);
  const now = new Date();
  const diffTime = expiry.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

// Filter quotes by status
const filterQuotesByStatus = (status: string) => {
  if (status === "all") return quotes;
  return quotes.filter(quote => quote.status === status);
};

const QuoteCard = ({ quote }: { quote: typeof quotes[0] }) => {
  const daysUntilExpiry = getDaysUntilExpiry(quote.expiresAt);
  const isExpiring = daysUntilExpiry <= 2 && quote.status === 'sent';

  return (
    <Card className="touch-manipulation">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src="" />
              <AvatarFallback className="bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400">
                {quote.customerInitials}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                {quote.customerName}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Quote #{quote.id}
              </p>
              {isExpiring && (
                <p className="text-xs text-red-600 dark:text-red-400 font-medium">
                  ⚠️ Expires in {daysUntilExpiry} day{daysUntilExpiry !== 1 ? 's' : ''}
                </p>
              )}
            </div>
          </div>
          <div className="flex flex-col items-end space-y-2">
            <Badge className={getStatusColor(quote.status)}>
              <span className="flex items-center space-x-1">
                {getStatusIcon(quote.status)}
                <span className="capitalize">{quote.status}</span>
              </span>
            </Badge>
          </div>
        </div>

        {/* Quote Details Grid */}
        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          <div>
            <span className="text-gray-500 dark:text-gray-400">Monthly Rate:</span>
            <p className="font-medium text-gray-900 dark:text-white flex items-center mt-1">
              <DollarSign className="h-4 w-4 mr-1" />
              ${quote.monthlyRate}
            </p>
          </div>
          <div>
            <span className="text-gray-500 dark:text-gray-400">Installation Fee:</span>
            <p className="font-medium text-gray-900 dark:text-white flex items-center mt-1">
              <DollarSign className="h-4 w-4 mr-1" />
              ${quote.installationFee}
            </p>
          </div>
          <div>
            <span className="text-gray-500 dark:text-gray-400">Ramp Height:</span>
            <p className="font-medium text-gray-900 dark:text-white mt-1">
              {quote.rampHeight} inches
            </p>
          </div>
          <div>
            <span className="text-gray-500 dark:text-gray-400">Timeline:</span>
            <p className="font-medium text-gray-900 dark:text-white mt-1">
              {getTimelineLabel(quote.timeline)}
            </p>
          </div>
          <div className="col-span-2">
            <span className="text-gray-500 dark:text-gray-400">Service Address:</span>
            <p className="font-medium text-gray-900 dark:text-white mt-1">
              {quote.serviceAddress}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <Button size="sm" variant="outline" className="flex-1 h-10 min-w-[44px]">
            <Eye className="h-4 w-4 mr-2" />
            View
          </Button>
          {quote.status === 'pending' && (
            <Button size="sm" className="flex-1 h-10 min-w-[44px]">
              <Send className="h-4 w-4 mr-2" />
              Send
            </Button>
          )}
          {(quote.status === 'pending' || quote.status === 'sent') && (
            <Button size="sm" variant="outline" className="flex-1 h-10 min-w-[44px]">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          )}
          <Button size="sm" variant="outline" className="h-10 min-w-[44px]">
            <Phone className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default function QuotesPage() {
  return (
    <DesktopLayout title="Quotes">
      <div className="p-4 space-y-6">
        {/* Header with Search and Add Quote */}
        <div className="space-y-4">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search quotes..."
                className="pl-10 h-12 text-base"
                inputMode="search"
              />
            </div>
            <Link href="/quotes/add">
              <Button size="icon" className="h-12 w-12 shrink-0">
                <Plus className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {filterQuotesByStatus('accepted').length}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Accepted</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {filterQuotesByStatus('sent').length}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Awaiting Response</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {filterQuotesByStatus('pending').length}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                ${quotes.reduce((sum, q) => sum + q.monthlyRate, 0).toLocaleString()}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Value</p>
            </CardContent>
          </Card>
        </div>

        {/* Quotes Tabs */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 mb-6">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="sent">Sent</TabsTrigger>
            <TabsTrigger value="accepted">Accepted</TabsTrigger>
            <TabsTrigger value="declined">Declined</TabsTrigger>
            <TabsTrigger value="expired">Expired</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <div className="space-y-4 lg:hidden">
              {quotes.map((quote) => (
                <QuoteCard key={quote.id} quote={quote} />
              ))}
            </div>
            {/* Desktop Table View */}
            <div className="hidden lg:block">
              <Card>
                <CardHeader>
                  <CardTitle>All Quotes</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Quote #</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Timeline</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Expires</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {quotes.map((quote) => (
                        <TableRow key={quote.id}>
                          <TableCell className="font-medium">{quote.id}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src="" />
                                <AvatarFallback className="bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400">
                                  {quote.customerInitials}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium text-gray-900 dark:text-white">
                                  {quote.customerName}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                  {quote.customerEmail}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">${quote.monthlyRate}/mo</div>
                            <div className="text-sm text-gray-500">
                              ${quote.installationFee} setup
                            </div>
                          </TableCell>
                          <TableCell>{getTimelineLabel(quote.timeline)}</TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(quote.status)}>
                              <span className="flex items-center space-x-1">
                                {getStatusIcon(quote.status)}
                                <span className="capitalize">{quote.status}</span>
                              </span>
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {getDaysUntilExpiry(quote.expiresAt)} days
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <Phone className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {['pending', 'sent', 'accepted', 'declined', 'expired'].map((status) => (
            <TabsContent key={status} value={status}>
              <div className="space-y-4 lg:hidden">
                {filterQuotesByStatus(status).map((quote) => (
                  <QuoteCard key={quote.id} quote={quote} />
                ))}
              </div>
              <div className="hidden lg:block">
                <Card>
                  <CardHeader>
                    <CardTitle className="capitalize">{status} Quotes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Quote #</TableHead>
                          <TableHead>Customer</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Timeline</TableHead>
                          <TableHead>Expires</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filterQuotesByStatus(status).map((quote) => (
                          <TableRow key={quote.id}>
                            <TableCell className="font-medium">{quote.id}</TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-3">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src="" />
                                  <AvatarFallback className="bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400">
                                    {quote.customerInitials}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium text-gray-900 dark:text-white">
                                    {quote.customerName}
                                  </div>
                                  <div className="text-sm text-gray-500 dark:text-gray-400">
                                    {quote.customerEmail}
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="font-medium">${quote.monthlyRate}/mo</div>
                              <div className="text-sm text-gray-500">
                                ${quote.installationFee} setup
                              </div>
                            </TableCell>
                            <TableCell>{getTimelineLabel(quote.timeline)}</TableCell>
                            <TableCell>
                              {getDaysUntilExpiry(quote.expiresAt)} days
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button size="sm" variant="outline">
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button size="sm" variant="outline">
                                  <Phone className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* Load More Button */}
        <div className="flex justify-center">
          <Button variant="outline" className="w-full lg:w-auto h-12">
            Load More Quotes
          </Button>
        </div>
      </div>
    </DesktopLayout>
  );
} 