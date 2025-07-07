"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AppLayout } from "@/components/app-layout";
import { CustomerCard } from "@/components/shared/customer-card";
import { Bell, Users } from "lucide-react";
import { businessNotifications } from "@/lib/notifications";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  status: string;
  rentalStatus?: string;
  nextPayment?: string;
  lastActivity?: string;
  monthlyRate?: number;
}

export default function Dashboard() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/customers');
      if (response.ok) {
        const data = await response.json();
        setCustomers(data);
      } else {
        businessNotifications.system.error('Failed to load customers');
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
      businessNotifications.system.error('Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  const handleCustomerClick = (customer: Customer) => {
    console.log(`Opening ${customer.name}'s profile`);
    // In a real app, this would navigate to the customer detail page
    // router.push(`/customers/${customer.id}`);
  };

  return (
    <AppLayout title="Dashboard">
      <div className="p-4 space-y-6">
        {/* Urgent Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-red-600">
              <Bell className="h-5 w-5 mr-2" />
              Urgent Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div>
                  <p className="font-medium">Quote expires in 2 hours</p>
                  <p className="text-sm text-gray-600">Sarah Williams - $233/month</p>
                </div>
                <Button 
                  size="sm"
                  onClick={() => businessNotifications.quote.expired("Q-2024-001")}
                >
                  Follow Up
                </Button>
              </div>
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div>
                  <p className="font-medium">Installation scheduled today</p>
                  <p className="text-sm text-gray-600">Michael Johnson - 1234 Oak Street</p>
                </div>
                <Button 
                  size="sm"
                  onClick={() => businessNotifications.rental.scheduled("Michael Johnson", "Today")}
                >
                  View Details
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>



        {/* Recent Customers */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Customers</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {/* Loading skeleton */}
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="flex items-center space-x-4 p-4">
                      <div className="rounded-full bg-gray-300 h-12 w-12"></div>
                      <div className="space-y-2 flex-1">
                        <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                        <div className="h-3 bg-gray-300 rounded w-1/3"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : customers.length > 0 ? (
              <div className="space-y-4">
                {customers.map((customer) => (
                  <CustomerCard 
                    key={customer.id} 
                    customer={customer}
                    onClick={() => handleCustomerClick(customer)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No customers found</p>
                <Button 
                  className="mt-4"
                  onClick={() => console.log("Navigation to add customer")}
                >
                  Add First Customer
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
