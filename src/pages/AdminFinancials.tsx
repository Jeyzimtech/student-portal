import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DollarSign, TrendingUp, TrendingDown, Search, Download, Filter, CreditCard, Banknote, Smartphone } from "lucide-react";
import { fetchCollection } from "@/integrations/firebase/firestore";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
  AreaChart, Area,
} from "recharts";

interface Payment {
  transaction_date: string;
  description: string;
  amount: number;
  payment_method: string | null;
  student_id: string;
}

// Mock data for financial charts
const MONTHLY_FEES = [
  { month: "Jan", fees: 18400, expenses: 5200 },
  { month: "Feb", fees: 22600, expenses: 6100 },
  { month: "Mar", fees: 19200, expenses: 5800 },
  { month: "Apr", fees: 24900, expenses: 7200 },
  { month: "May", fees: 21700, expenses: 6500 },
  { month: "Jun", fees: 17800, expenses: 5400 },
  { month: "Jul", fees: 15200, expenses: 4900 },
  { month: "Aug", fees: 25500, expenses: 7800 },
  { month: "Sep", fees: 23300, expenses: 7100 },
  { month: "Oct", fees: 22100, expenses: 6800 },
  { month: "Nov", fees: 20800, expenses: 6200 },
  { month: "Dec", fees: 12900, expenses: 4500 },
];

const FEE_CATEGORIES = [
  { category: "Tuition", amount: 145000, color: "#6366f1" },
  { category: "Sports Levy", amount: 28000, color: "#3b82f6" },
  { category: "Building Fund", amount: 35000, color: "#10b981" },
  { category: "Exam Fees", amount: 18500, color: "#f59e0b" },
  { category: "Transport", amount: 42000, color: "#8b5cf6" },
  { category: "Stationery", amount: 12000, color: "#ec4899" },
];

const GRADE_COLLECTION = [
  { grade: "Grade 1", collected: 92, outstanding: 8 },
  { grade: "Grade 2", collected: 88, outstanding: 12 },
  { grade: "Grade 3", collected: 85, outstanding: 15 },
  { grade: "Grade 4", collected: 91, outstanding: 9 },
  { grade: "Grade 5", collected: 79, outstanding: 21 },
  { grade: "Grade 6", collected: 86, outstanding: 14 },
  { grade: "Grade 7", collected: 95, outstanding: 5 },
];

interface TooltipEntry {
  color: string;
  name: string;
  value: number | string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipEntry[];
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-popover text-popover-foreground p-3 rounded-lg shadow-lg border border-border text-sm">
        <p className="font-heading font-bold mb-1">{label}</p>
        {payload.map((entry: TooltipEntry, idx: number) => (
          <p key={idx} className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
            {entry.name}: <span className="font-semibold">${Number(entry.value).toLocaleString()}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const AdminFinancials = () => {
  const [payments, setPayments] = useState<(Payment & { student_name?: string })[]>([]);
  const [search, setSearch] = useState("");
  const [filterMethod, setFilterMethod] = useState("all");

  useEffect(() => {
    fetchCollection<Payment>("fee_transactions", {
      orderByField: "transaction_date",
      orderDir: "desc",
      limitCount: 50,
    }).then((data) => {
      if (data) setPayments(data);
    });
  }, []);

  // Use mock transactions if no live data
  const displayPayments = payments.length > 0 ? payments : [
    { transaction_date: "2026-04-15", description: "Tuition Fee — Term 1", amount: 450, payment_method: "EcoCash", student_id: "s1" },
    { transaction_date: "2026-04-14", description: "Sports Levy", amount: 75, payment_method: "Cash", student_id: "s2" },
    { transaction_date: "2026-04-14", description: "Tuition Fee — Term 1", amount: 450, payment_method: "Bank Transfer", student_id: "s3" },
    { transaction_date: "2026-04-13", description: "Building Fund", amount: 120, payment_method: "Card", student_id: "s4" },
    { transaction_date: "2026-04-13", description: "Exam Fees", amount: 60, payment_method: "EcoCash", student_id: "s5" },
    { transaction_date: "2026-04-12", description: "Transport Fee — Term 1", amount: 200, payment_method: "Bank Transfer", student_id: "s6" },
    { transaction_date: "2026-04-12", description: "Stationery Fee", amount: 35, payment_method: "Cash", student_id: "s7" },
    { transaction_date: "2026-04-11", description: "Tuition Fee — Term 1", amount: 450, payment_method: "EcoCash", student_id: "s8" },
  ];

  const filtered = displayPayments.filter((p) => {
    const matchSearch = p.description.toLowerCase().includes(search.toLowerCase());
    const matchMethod = filterMethod === "all" || p.payment_method === filterMethod;
    return matchSearch && matchMethod;
  });

  const totalIncome = MONTHLY_FEES.reduce((sum, m) => sum + m.fees, 0);
  const totalExpenses = MONTHLY_FEES.reduce((sum, m) => sum + m.expenses, 0);
  const netIncome = totalIncome - totalExpenses;

  const PAYMENT_ICONS: Record<string, typeof DollarSign> = {
    "EcoCash": Smartphone,
    "Bank Transfer": Banknote,
    "Cash": DollarSign,
    "Card": CreditCard,
  };

  return (
    <DashboardLayout type="admin" title="Financial Analytics">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card className="border-border bg-gradient-to-br from-emerald-500/5 to-transparent">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              <span className="text-xs text-muted-foreground">Total Income</span>
            </div>
            <div className="text-2xl font-heading font-black text-emerald-600">${totalIncome.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card className="border-border bg-gradient-to-br from-red-500/5 to-transparent">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="w-4 h-4 text-red-500" />
              <span className="text-xs text-muted-foreground">Total Expenses</span>
            </div>
            <div className="text-2xl font-heading font-black text-red-600">${totalExpenses.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card className="border-border bg-gradient-to-br from-blue-500/5 to-transparent">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-4 h-4 text-blue-500" />
              <span className="text-xs text-muted-foreground">Net Income</span>
            </div>
            <div className="text-2xl font-heading font-black text-blue-600">${netIncome.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card className="border-border bg-gradient-to-br from-purple-500/5 to-transparent">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-2">
              <CreditCard className="w-4 h-4 text-purple-500" />
              <span className="text-xs text-muted-foreground">Transactions</span>
            </div>
            <div className="text-2xl font-heading font-black text-purple-600">{displayPayments.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid md:grid-cols-3 gap-6 mb-6">
        {/* Income vs Expenses */}
        <Card className="border-border md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="font-heading flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-primary" /> Income vs Expenses
            </CardTitle>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> Income</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-red-400 inline-block" /> Expenses</span>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={MONTHLY_FEES}>
                <defs>
                  <linearGradient id="gradFees" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradExpenses" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f87171" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f87171" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}K`} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="fees" name="Income" stroke="#10b981" strokeWidth={2.5} fill="url(#gradFees)" />
                <Area type="monotone" dataKey="expenses" name="Expenses" stroke="#f87171" strokeWidth={2.5} fill="url(#gradExpenses)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Fee Categories */}
        <Card className="border-border">
          <CardHeader className="pb-2">
            <CardTitle className="font-heading text-sm">Fee Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={FEE_CATEGORIES}
                  cx="50%"
                  cy="50%"
                  innerRadius={35}
                  outerRadius={65}
                  dataKey="amount"
                  nameKey="category"
                  paddingAngle={3}
                  strokeWidth={0}
                >
                  {FEE_CATEGORIES.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-1">
              {FEE_CATEGORIES.map((c) => (
                <div key={c.category} className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }} />
                    <span className="text-muted-foreground">{c.category}</span>
                  </span>
                  <span className="font-medium">${c.amount.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Collection by Grade */}
      <Card className="border-border mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="font-heading flex items-center gap-2">
            Fee Collection Rate by Grade
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={GRADE_COLLECTION} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="grade" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} domain={[0, 100]} unit="%" />
              <Tooltip />
              <Bar dataKey="collected" name="Collected %" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} />
              <Bar dataKey="outstanding" name="Outstanding %" stackId="a" fill="#fbbf24" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card className="border-border">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <CardTitle className="font-heading">Recent Transactions</CardTitle>
          <div className="flex gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-initial">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search..." className="pl-10 w-full sm:w-56" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <Select value={filterMethod} onValueChange={setFilterMethod}>
              <SelectTrigger className="w-36"><Filter className="w-3 h-3 mr-1" /><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Methods</SelectItem>
                <SelectItem value="EcoCash">EcoCash</SelectItem>
                <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                <SelectItem value="Cash">Cash</SelectItem>
                <SelectItem value="Card">Card</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {filtered.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No transactions found.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Method</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((p, i) => {
                  const Icon = PAYMENT_ICONS[p.payment_method || ""] || DollarSign;
                  return (
                    <TableRow key={i} className="hover:bg-muted/50">
                      <TableCell className="text-muted-foreground text-sm">{p.transaction_date}</TableCell>
                      <TableCell className="font-medium">{p.description}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-emerald-500/15 text-emerald-600 border-emerald-500/30 font-mono">
                          +${Math.abs(Number(p.amount)).toLocaleString()}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="flex items-center gap-1.5 text-muted-foreground text-sm">
                          <Icon className="w-3.5 h-3.5" /> {p.payment_method}
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default AdminFinancials;
