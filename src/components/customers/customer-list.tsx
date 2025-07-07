'use client';

import { CustomerCard } from "@/components/shared/customer-card";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, Plus, Search, Filter } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  status: string;
  rentalStatus?: string;
  monthlyRate: number;
  nextPayment: string;
  lastActivity: string;
}

interface CustomerListProps {
  customers: Customer[];
}

export function CustomerList({ customers }: CustomerListProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const handleCustomerClick = (customerId: string) => {
    router.push(`/customers/${customerId}`);
  };

  const handleAddCustomer = () => {
    router.push('/customers/new');
  };

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.phone.includes(searchTerm) ||
                         customer.address.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Customers
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your customer base and rental relationships
          </p>
        </div>
        <Button className="w-full sm:w-auto" onClick={handleAddCustomer}>
          <Plus className="h-4 w-4 mr-2" />
          Add Customer
        </Button>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search customers, email, phone, address..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="flex-1">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <SelectValue />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Active Rental">Active Rental</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Customers List */}
      <div className="space-y-4">
        {filteredCustomers.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No customers found</p>
                <Button className="mt-4" onClick={handleAddCustomer}>
                  Add First Customer
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredCustomers.map((customer) => (
            <CustomerCard 
              key={customer.id} 
              customer={customer}
              onClick={() => handleCustomerClick(customer.id)}
            />
          ))
        )}
      </div>

      {/* Load More Button */}
      {customers.length >= 50 && (
        <div className="text-center pt-6">
          <Button variant="outline" onClick={() => router.refresh()}>
            Load More Customers
          </Button>
        </div>
      )}
    </div>
  );
} 