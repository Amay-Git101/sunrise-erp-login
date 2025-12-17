import { useState } from "react";
import { 
  Users, Scissors, Ruler, TrendingUp, ShoppingBag, 
  Filter, Download, CreditCard, Clock, CheckCircle2,
  MoreHorizontal, Calendar
} from "lucide-react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area
} from "recharts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

// --- MOCK DATA ---
const revenueData = [
  { name: "Mon", total: 1500, orders: 4 }, 
  { name: "Tue", total: 2300, orders: 7 },
  { name: "Wed", total: 3400, orders: 12 }, 
  { name: "Thu", total: 2900, orders: 9 },
  { name: "Fri", total: 4500, orders: 15 }, 
  { name: "Sat", total: 5100, orders: 18 },
  { name: "Sun", total: 1200, orders: 3 },
];

const bookings = [
  { id: "SM/25-0080", customer: "Priy Ranjan", item: "Shirt (Stitching)", mobile: "8840646436", qty: 1, rate: 400, total: 400, status: "Paid" },
  { id: "SM/25-0079", customer: "Ram Bhavan", item: "Pant (Stitching)", mobile: "8423045332", qty: 1, rate: 550, total: 550, status: "Pending" },
  { id: "CM/25-00877", customer: "S.K Singhniya", item: "Blazer (Stitching)", mobile: "8052666634", qty: 1, rate: 0, total: 0, status: "Paid" },
  { id: "SM/25-0081", customer: "Rahul Kumar", item: "Kurta (Stitching)", mobile: "9988776655", qty: 2, rate: 600, total: 1200, status: "Pending" },
  { id: "SM/25-0082", customer: "Amit Verma", item: "Suit (Stitching)", mobile: "9988001122", qty: 1, rate: 4500, total: 4500, status: "Paid" },
];

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState<"general" | "bookings" | "upcoming" | "pending">("general");

  // --- 1. GENERAL TAB ---
  const GeneralView = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
            { title: "Total Revenue", value: "₹45,231", icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-100", trend: "+12.5%" },
            { title: "Active Orders", value: "124", icon: ShoppingBag, color: "text-blue-600", bg: "bg-blue-100", trend: "+4.3%" },
            { title: "Pending Delivery", value: "12", icon: Clock, color: "text-amber-600", bg: "bg-amber-100", trend: "-2.1%" },
            { title: "New Customers", value: "84", icon: Users, color: "text-purple-600", bg: "bg-purple-100", trend: "+8.4%" },
        ].map((stat, i) => (
            <div key={i} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                        <h3 className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</h3>
                    </div>
                    <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                        <stat.icon className="w-5 h-5" />
                    </div>
                </div>
                <div className="mt-4 flex items-center text-xs font-medium">
                    <span className={stat.trend.startsWith('+') ? "text-emerald-600" : "text-rose-600"}>
                        {stat.trend}
                    </span>
                    <span className="text-gray-400 ml-1">from last month</span>
                </div>
            </div>
        ))}
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                <div>
                    <h3 className="font-bold text-gray-900 text-lg">Revenue Overview</h3>
                </div>
                <Badge variant="secondary" className="w-fit">Weekly View</Badge>
            </div>
            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={revenueData}>
                        <defs>
                            <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#f97316" stopOpacity={0.2}/>
                                <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                        <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v)=>`₹${v}`} />
                        <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                        <Area type="monotone" dataKey="total" stroke="#f97316" strokeWidth={3} fillOpacity={1} fill="url(#colorTotal)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col">
            <h3 className="font-bold text-gray-900 text-lg mb-2">Order Volume</h3>
            <div className="flex-1 min-h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={revenueData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                        <XAxis dataKey="name" fontSize={10} tickLine={false} axisLine={false} />
                        <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '8px' }} />
                        <Bar dataKey="orders" fill="#3b82f6" radius={[4,4,4,4]} barSize={20} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
      </div>
    </div>
  );

  // --- 2. BOOKINGS / LIST VIEW (The Specific Fix) ---
  const BookingsView = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
      
      {/* FILTER BAR: Compact on mobile */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col lg:flex-row gap-4 justify-between lg:items-center">
         
         {/* Inputs stack full width on mobile */}
         <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 w-full lg:w-auto">
            <div className="relative w-full">
                <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                <Input type="date" className="pl-9 w-full" />
            </div>
            <div className="relative w-full">
                <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                <Input type="date" className="pl-9 w-full" />
            </div>
            <Button variant="outline" className="text-gray-600 border-dashed border-gray-300 w-full">
                <Filter className="w-4 h-4 mr-2"/> Filters
            </Button>
         </div>

         {/* Summary Box */}
         <div className="flex flex-row justify-between items-center bg-gray-50 px-4 py-3 rounded-lg border border-gray-100 w-full lg:w-auto gap-4">
            <div>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Total Booking</p>
                <p className="text-lg font-bold text-gray-900 leading-none">₹5,150</p>
            </div>
            <Button size="sm" className="bg-slate-900 text-white hover:bg-slate-800">
                <Download className="w-4 h-4"/>
            </Button>
         </div>
      </div>

      {/* TABLE CONTAINER: This is the fix. overflow-hidden on parent, overflow-x-auto on child */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        
        {/* THIS DIV enables the inner scrolling without moving the whole page */}
        <div className="overflow-x-auto w-full">
            <table className="w-full text-sm text-left whitespace-nowrap min-w-[600px]">
                <thead className="bg-gray-50/80 text-gray-500 font-semibold border-b border-gray-100">
                    <tr>
                        <th className="px-6 py-4">Invoice</th>
                        <th className="px-6 py-4">Customer</th>
                        <th className="px-6 py-4">Item</th>
                        <th className="px-6 py-4 text-center">Qty</th>
                        <th className="px-6 py-4 text-right">Amount</th>
                        <th className="px-6 py-4 text-center">Status</th>
                        <th className="px-6 py-4"></th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {bookings.map((row, i) => (
                        <tr key={i} className="hover:bg-blue-50/30 transition-colors group">
                            <td className="px-6 py-4 font-mono text-xs font-medium text-slate-500">{row.id}</td>
                            <td className="px-6 py-4">
                                <p className="font-medium text-gray-900">{row.customer}</p>
                                <p className="text-xs text-gray-400">{row.mobile}</p>
                            </td>
                            <td className="px-6 py-4 text-gray-600">{row.item}</td>
                            <td className="px-6 py-4 text-center font-medium bg-gray-50/50">{row.qty}</td>
                            <td className="px-6 py-4 text-right font-bold text-gray-900">₹{row.total}</td>
                            <td className="px-6 py-4 text-center">
                                <Badge variant="outline" className={row.status === "Paid" ? "bg-green-50 text-green-700 border-green-200" : "bg-amber-50 text-amber-700 border-amber-200"}>
                                    {row.status}
                                </Badge>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-900">
                                    <MoreHorizontal className="w-4 h-4" />
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );

  return (
    // FIX 1: max-w-[100vw] and overflow-x-hidden prevents the body from scrolling sideways
    <div className="p-4 md:p-8 space-y-8 min-h-screen bg-gray-50/30 w-full max-w-[100vw] overflow-x-hidden">
      
      {/* HEADER */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
        <div>
           <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">Dashboard</h1>
           <p className="text-gray-500 mt-1 text-sm md:text-base">Overview of your tailoring business</p>
        </div>
        
        {/* TABS - Scrollable container for tabs only */}
        <div className="overflow-x-auto pb-1 -mx-4 px-4 xl:mx-0 xl:px-0">
            <div className="bg-white p-1 rounded-xl md:rounded-full border shadow-sm inline-flex whitespace-nowrap">
                {['general', 'bookings', 'upcoming', 'pending'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab as any)}
                        className={`
                            px-4 md:px-5 py-2 rounded-lg md:rounded-full text-sm font-medium transition-all duration-300
                            ${activeTab === tab 
                                ? 'bg-slate-900 text-white shadow-md' 
                                : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                            }
                        `}
                    >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                ))}
            </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="min-h-[500px]">
         {activeTab === 'general' && <GeneralView />}
         {activeTab === 'bookings' && <BookingsView />}
         {activeTab === 'upcoming' && <BookingsView />} 
         {activeTab === 'pending' && <BookingsView />} 
      </div>

    </div>
  );
};

export default Dashboard;