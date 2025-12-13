import { useState } from "react";
import { 
  Calendar as CalendarIcon, 
  Package, 
  ShoppingBag, 
  Clock, 
  CreditCard, 
  Download,
  Filter,
  Calculator,
  Box,
  TrendingUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

const Dashboard = () => {
  // --- STATE MANAGEMENT ---
  // We keep simple state for the demo. In a real app, these would trigger API calls.
  
  // 1. Booking Tab State
  const [bookingPeriod, setBookingPeriod] = useState("7days");
  const [bookingFrom, setBookingFrom] = useState("2025-01-01");
  const [bookingTo, setBookingTo] = useState("2025-01-07");

  // 2. Upcoming Tab State
  const [upcomingPeriod, setUpcomingPeriod] = useState("next7");
  const [upcomingType, setUpcomingType] = useState("delivery");

  // 3. Pending Tab State
  const [isPendingDateFiltered, setIsPendingDateFiltered] = useState(false);

  // 4. General Tab State (Payment)
  const [paymentTotal, setPaymentTotal] = useState<number | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // --- HANDLERS ---
  const handleCalculatePayment = () => {
    setIsCalculating(true);
    // Simulate API call
    setTimeout(() => {
        setPaymentTotal(125000.50);
        setIsCalculating(false);
    }, 800);
  };

  return (
    <div className="p-6 space-y-6">
      
      {/* --- PAGE HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Analytics Dashboard</h1>
          <p className="text-muted-foreground mt-1">Real-time business insights and performance metrics.</p>
        </div>
        
        {/* Right side usually handled by Tabs, but if you want global actions they go here */}
      </div>

      {/* --- TABS SYSTEM --- */}
      <Tabs defaultValue="bookings" className="w-full">
        
        {/* Tab Navigation */}
        <div className="flex justify-start md:justify-end mb-6">
            <TabsList className="grid grid-cols-4 w-full md:w-[500px] h-11 bg-white border border-gray-200 shadow-sm p-1">
                <TabsTrigger value="bookings" className="data-[state=active]:bg-amber-100 data-[state=active]:text-amber-700">Bookings</TabsTrigger>
                <TabsTrigger value="upcoming" className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700">Upcoming</TabsTrigger>
                <TabsTrigger value="pending" className="data-[state=active]:bg-orange-100 data-[state=active]:text-orange-700">Pending</TabsTrigger>
                <TabsTrigger value="general" className="data-[state=active]:bg-green-100 data-[state=active]:text-green-700">General</TabsTrigger>
            </TabsList>
        </div>

        {/* ============================== */}
        {/* 1. BOOKINGS CONTENT            */}
        {/* ============================== */}
        <TabsContent value="bookings" className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 3A. Booking Filters */}
            <Card className="shadow-sm border-gray-200">
                <CardHeader className="pb-3 border-b border-gray-100 bg-gray-50/50">
                    <CardTitle className="text-sm font-bold uppercase tracking-wider text-gray-500 flex items-center gap-2">
                        <Filter className="w-4 h-4" /> Booking Filters
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-gray-500 uppercase">Period</label>
                        <Select value={bookingPeriod} onValueChange={setBookingPeriod}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="today">Today</SelectItem>
                                <SelectItem value="3days">Last 3 Days</SelectItem>
                                <SelectItem value="7days">Last 7 Days</SelectItem>
                                <SelectItem value="15days">Last 15 Days</SelectItem>
                                <SelectItem value="30days">Last 30 Days</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-gray-500 uppercase">From Date</label>
                            <Input type="date" value={bookingFrom} onChange={e => setBookingFrom(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-gray-500 uppercase">To Date</label>
                            <Input type="date" value={bookingTo} onChange={e => setBookingTo(e.target.value)} />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-gray-500 uppercase">Rate Filter</label>
                        <Select defaultValue="all">
                            <SelectTrigger><SelectValue placeholder="All Rates" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Rates</SelectItem>
                                <SelectItem value="positive">Rate &gt; 0</SelectItem>
                                <SelectItem value="zero">Rate = 0</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* 3B. Items Summary Panel */}
            <Card className="shadow-sm border-gray-200">
                <CardHeader className="pb-3 border-b border-gray-100 bg-gray-50/50">
                    <CardTitle className="text-sm font-bold uppercase tracking-wider text-gray-500 flex items-center gap-2">
                        <Package className="w-4 h-4" /> Items Summary
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 min-h-[200px] flex flex-col justify-center items-center text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400">
                        <Box className="w-8 h-8" />
                    </div>
                    <p className="text-gray-500 font-medium">No items found</p>
                    <p className="text-xs text-muted-foreground mt-1">Try adjusting the filter period</p>
                </CardContent>
            </Card>

            {/* 3C. Booking Orders Panel (Large) */}
            <Card className="lg:col-span-3 shadow-md border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-2">
                        <ShoppingBag className="w-5 h-5 text-amber-600" />
                        <h3 className="font-bold text-gray-800">Booking Orders</h3>
                    </div>
                    
                    {/* Stats in Header */}
                    <div className="flex items-center gap-4 text-sm">
                        <div className="px-3 py-1 bg-white rounded-md border border-gray-200 shadow-sm">
                            <span className="text-gray-500 mr-2">Orders:</span>
                            <span className="font-bold text-gray-900">0</span>
                        </div>
                        <div className="px-3 py-1 bg-white rounded-md border border-gray-200 shadow-sm">
                            <span className="text-gray-500 mr-2">Items:</span>
                            <span className="font-bold text-gray-900">0</span>
                        </div>
                        <div className="px-3 py-1 bg-white rounded-md border border-gray-200 shadow-sm">
                            <span className="text-gray-500 mr-2">Amount:</span>
                            <span className="font-bold text-green-600">₹0</span>
                        </div>
                        <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                            <Download className="w-4 h-4 mr-2" /> Export
                        </Button>
                    </div>
                </div>
                
                <CardContent className="py-16 flex flex-col justify-center items-center text-center bg-white">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4 shadow-inner">
                        <ShoppingBag className="w-10 h-10 text-gray-300" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">No booking orders found</h3>
                    <p className="text-gray-500 mt-1 max-w-sm">
                        There are no orders recorded for the selected date range. Try selecting a different period or check your connection.
                    </p>
                </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ============================== */}
        {/* 2. UPCOMING CONTENT            */}
        {/* ============================== */}
        <TabsContent value="upcoming" className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
             {/* 4A. Upcoming Filters */}
             <Card className="lg:col-span-1 shadow-sm border-gray-200">
                <CardHeader className="pb-3 border-b border-gray-100 bg-gray-50/50">
                    <CardTitle className="text-sm font-bold uppercase tracking-wider text-blue-600 flex items-center gap-2">
                        <Clock className="w-4 h-4" /> Schedule Filters
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-gray-500 uppercase">Period</label>
                        <Select value={upcomingPeriod} onValueChange={setUpcomingPeriod}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="today">Today</SelectItem>
                                <SelectItem value="next3">Next 3 Days</SelectItem>
                                <SelectItem value="next7">Next 7 Days</SelectItem>
                                <SelectItem value="next15">Next 15 Days</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-gray-500 uppercase">Type</label>
                        <Select value={upcomingType} onValueChange={setUpcomingType}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="delivery">Delivery</SelectItem>
                                <SelectItem value="trial">Trial</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    {/* Auto-calculated dates usually shown as readonly or info */}
                    <div className="pt-2">
                        <div className="text-xs text-gray-400">Date Range:</div>
                        <div className="text-sm font-medium text-gray-700">01 Jan - 07 Jan</div>
                    </div>
                </CardContent>
            </Card>

            <Card className="lg:col-span-3 shadow-md border-gray-200">
                <CardContent className="py-16 flex flex-col justify-center items-center text-center">
                    <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                        <TrendingUp className="w-8 h-8 text-blue-300" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">No upcoming schedules</h3>
                    <p className="text-gray-500 mt-1">Everything looks clear for the selected period.</p>
                </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ============================== */}
        {/* 3. PENDING CONTENT             */}
        {/* ============================== */}
        <TabsContent value="pending" className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 5A. Pending Filters */}
            <Card className="shadow-sm border-gray-200 h-fit">
                <CardHeader className="pb-3 border-b border-gray-100 bg-gray-50/50">
                    <CardTitle className="text-sm font-bold uppercase tracking-wider text-orange-600 flex items-center gap-2">
                        <Clock className="w-4 h-4" /> Pending Filters
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="flex items-center space-x-2 border p-3 rounded-md bg-gray-50">
                        <Checkbox 
                            id="filterDate" 
                            checked={isPendingDateFiltered}
                            onCheckedChange={(c) => setIsPendingDateFiltered(!!c)}
                        />
                        <label
                            htmlFor="filterDate"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                        >
                            Enable Date Filtering
                        </label>
                    </div>
                    
                    <div className="space-y-2">
                        <label className={`text-xs font-medium uppercase ${!isPendingDateFiltered ? "text-gray-300" : "text-gray-500"}`}>
                            Filter Date
                        </label>
                        <Input type="date" disabled={!isPendingDateFiltered} />
                    </div>
                </CardContent>
            </Card>

            <Card className="md:col-span-2 shadow-md border-gray-200">
                <CardContent className="py-16 flex flex-col justify-center items-center text-center">
                    <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mb-4">
                        <Clock className="w-8 h-8 text-orange-300" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">No pending items</h3>
                    <p className="text-gray-500 mt-1">Great job! You have no pending tasks.</p>
                </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ============================== */}
        {/* 4. GENERAL CONTENT (PAYMENTS)  */}
        {/* ============================== */}
        <TabsContent value="general" className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* 6A. Date Range Filter */}
            <Card className="shadow-sm border-gray-200">
                <CardHeader className="pb-3 border-b border-gray-100 bg-gray-50/50">
                    <CardTitle className="text-sm font-bold uppercase tracking-wider text-green-600 flex items-center gap-2">
                        <CalendarIcon className="w-4 h-4" /> Payment Calculator
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-gray-500 uppercase">From Date</label>
                            <Input type="date" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-gray-500 uppercase">To Date</label>
                            <Input type="date" />
                        </div>
                    </div>
                    <Button 
                        onClick={handleCalculatePayment}
                        disabled={isCalculating}
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold shadow-md"
                    >
                        {isCalculating ? "Calculating..." : "Calculate Total Payment"}
                    </Button>
                </CardContent>
            </Card>

            {/* 6B. Total Payment Display */}
            <div className="space-y-6">
                <Card className="shadow-md border-green-100 bg-gradient-to-br from-green-50 to-white">
                    <CardContent className="pt-6 pb-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-green-100 rounded-lg text-green-600">
                                <CreditCard className="w-8 h-8" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Total Payment</p>
                                <h2 className="text-3xl font-bold text-gray-900">
                                    {paymentTotal !== null ? `₹${paymentTotal.toLocaleString()}` : "—"}
                                </h2>
                            </div>
                        </div>
                        {paymentTotal !== null && (
                            <div className="mt-4 pt-4 border-t border-green-100 flex justify-between items-center text-sm">
                                <span className="text-gray-500">Total Invoices Processed</span>
                                <Badge variant="outline" className="bg-white text-green-700 border-green-200">
                                    42 Invoices
                                </Badge>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* 6C. Info Box */}
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex gap-3 text-blue-700">
                    <div className="mt-0.5">
                        <Calculator className="w-5 h-5" />
                    </div>
                    <div className="text-sm leading-relaxed">
                        <p className="font-semibold mb-1">How this works</p>
                        Select a date range and click <strong>Calculate</strong> to view the total payment amount collected from all invoices generated within that period.
                    </div>
                </div>
            </div>

          </div>
        </TabsContent>

      </Tabs>
    </div>
  );
};

export default Dashboard;