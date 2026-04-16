import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, DollarSign, GraduationCap, TrendingUp, TrendingDown, BarChart3, PieChart as PieChartIcon, Activity, ArrowUpRight, BookOpen } from "lucide-react";
import { countCollection } from "@/integrations/firebase/firestore";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
  AreaChart, Area,
  LineChart, Line,
} from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

// ─── Mock data for charts (works with or without live Supabase) ──────────────
const PASS_RATE_BY_SUBJECT = [
  { subject: "Mathematics", passRate: 72, students: 45 },
  { subject: "English", passRate: 85, students: 45 },
  { subject: "Shona", passRate: 91, students: 42 },
  { subject: "Science", passRate: 68, students: 45 },
  { subject: "Social Studies", passRate: 78, students: 44 },
  { subject: "ICT", passRate: 82, students: 38 },
  { subject: "Agriculture", passRate: 88, students: 40 },
  { subject: "P.E.", passRate: 95, students: 45 },
];

const GRADE_DISTRIBUTION = [
  { grade: "1 (80-100)", count: 42, color: "#10b981" },
  { grade: "2 (70-79)", count: 38, color: "#22c55e" },
  { grade: "3 (60-69)", count: 48, color: "#3b82f6" },
  { grade: "4 (50-59)", count: 34, color: "#6366f1" },
  { grade: "5 (40-49)", count: 18, color: "#f59e0b" },
  { grade: "6 (30-39)", count: 8, color: "#f97316" },
  { grade: "7 (0-29)", count: 4, color: "#ef4444" },
];

const MONTHLY_REVENUE = [
  { month: "Jan", collected: 12400, outstanding: 3200 },
  { month: "Feb", collected: 15600, outstanding: 2800 },
  { month: "Mar", collected: 14200, outstanding: 3500 },
  { month: "Apr", collected: 18900, outstanding: 2100 },
  { month: "May", collected: 16700, outstanding: 2600 },
  { month: "Jun", collected: 13800, outstanding: 4100 },
  { month: "Jul", collected: 11200, outstanding: 5200 },
  { month: "Aug", collected: 19500, outstanding: 1800 },
  { month: "Sep", collected: 17300, outstanding: 2400 },
  { month: "Oct", collected: 16100, outstanding: 2900 },
  { month: "Nov", collected: 14800, outstanding: 3300 },
  { month: "Dec", collected: 8900, outstanding: 6700 },
];

const ENROLLMENT_TREND = [
  { month: "Jan", students: 310 },
  { month: "Feb", students: 318 },
  { month: "Mar", students: 325 },
  { month: "Apr", students: 332 },
  { month: "May", students: 328 },
  { month: "Jun", students: 335 },
  { month: "Jul", students: 340 },
  { month: "Aug", students: 356 },
  { month: "Sep", students: 362 },
  { month: "Oct", students: 358 },
  { month: "Nov", students: 365 },
  { month: "Dec", students: 370 },
];

const FEE_PAYMENT_METHODS = [
  { method: "EcoCash", amount: 45200, color: "#6366f1" },
  { method: "Bank Transfer", amount: 32800, color: "#3b82f6" },
  { method: "Cash", amount: 18600, color: "#10b981" },
  { method: "Card", amount: 8900, color: "#f59e0b" },
  { method: "Other", amount: 3800, color: "#8b5cf6" },
];

const RECENT_ACTIVITY = [
  { action: "Results uploaded", detail: "Grade 7A — Mathematics", time: "2 hours ago", type: "results" },
  { action: "Payment received", detail: "$450.00 — EcoCash", time: "3 hours ago", type: "payment" },
  { action: "New student enrolled", detail: "Tatenda Moyo — Grade 3A", time: "5 hours ago", type: "student" },
  { action: "Course material uploaded", detail: "Science — Chapter 12 PDF", time: "1 day ago", type: "elearning" },
  { action: "Payment received", detail: "$320.00 — Bank Transfer", time: "1 day ago", type: "payment" },
];

const ACTIVITY_ICONS: Record<string, typeof FileText> = {
  results: FileText,
  payment: DollarSign,
  student: Users,
  elearning: BookOpen,
};

const ACTIVITY_COLORS: Record<string, string> = {
  results: "bg-blue-500/10 text-blue-500",
  payment: "bg-green-500/10 text-green-500",
  student: "bg-purple-500/10 text-purple-500",
  elearning: "bg-orange-500/10 text-orange-500",
};

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
            {entry.name}: <span className="font-semibold">{typeof entry.value === "number" && entry.name?.toLowerCase().includes("rate") ? `${entry.value}%` : entry.name?.toLowerCase().includes("collected") || entry.name?.toLowerCase().includes("outstanding") ? `$${entry.value.toLocaleString()}` : entry.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const AdminDashboard = () => {
  const [studentCount, setStudentCount] = useState(0);
  const [teacherCount, setTeacherCount] = useState(0);
  const [selectedTerm, setSelectedTerm] = useState("Term 1");

  useEffect(() => {
    countCollection("students").then((c) => setStudentCount(c > 0 ? c : 0));
    countCollection("user_roles", { filters: [{ field: "role", op: "==", value: "teacher" }] }).then((c) => setTeacherCount(c > 0 ? c : 0));
  }, []);

  const totalCollected = MONTHLY_REVENUE.reduce((sum, m) => sum + m.collected, 0);
  const totalOutstanding = MONTHLY_REVENUE.reduce((sum, m) => sum + m.outstanding, 0);
  const avgPassRate = Math.round(PASS_RATE_BY_SUBJECT.reduce((sum, s) => sum + s.passRate, 0) / PASS_RATE_BY_SUBJECT.length);

  const stats = [
    { label: "Total Students", value: studentCount > 0 ? String(studentCount) : "370", icon: Users, color: "bg-indigo-500/10 text-indigo-500", trend: "+12", trendUp: true },
    { label: "Teachers", value: teacherCount > 0 ? String(teacherCount) : "24", icon: GraduationCap, color: "bg-emerald-500/10 text-emerald-500", trend: "+2", trendUp: true },
    { label: "Avg Pass Rate", value: `${avgPassRate}%`, icon: TrendingUp, color: "bg-blue-500/10 text-blue-500", trend: "+5%", trendUp: true },
    { label: "Fees Collected", value: `$${(totalCollected / 1000).toFixed(0)}K`, icon: DollarSign, color: "bg-amber-500/10 text-amber-500", trend: `$${(totalOutstanding / 1000).toFixed(0)}K due`, trendUp: false },
  ];

  return (
    <DashboardLayout type="admin" title="Admin Dashboard">
      {/* Term Selector */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-muted-foreground text-sm">Overview for the current academic year</p>
        </div>
        <Select value={selectedTerm} onValueChange={setSelectedTerm}>
          <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="Term 1">Term 1 — 2026</SelectItem>
            <SelectItem value="Term 2">Term 2 — 2026</SelectItem>
            <SelectItem value="Term 3">Term 3 — 2026</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-border hover:shadow-md transition-shadow">
            <CardContent className="p-3 md:p-5">
              <div className="flex items-center justify-between mb-2 md:mb-3">
                <div className={`w-8 h-8 md:w-10 md:h-10 rounded-xl ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="w-4 h-4 md:w-5 md:h-5" />
                </div>
                <Badge variant="outline" className={`text-[10px] md:text-xs ${stat.trendUp ? "bg-green-500/10 text-green-600 border-green-500/30" : "bg-orange-500/10 text-orange-600 border-orange-500/30"}`}>
                  {stat.trendUp && <ArrowUpRight className="w-3 h-3 mr-0.5" />}
                  {stat.trend}
                </Badge>
              </div>
              <div className="text-lg md:text-2xl font-heading font-black text-foreground">{stat.value}</div>
              <div className="text-xs md:text-sm text-muted-foreground">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row 1 — Pass Rate & Grade Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-6">
        <Card className="border-border lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="font-heading flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" /> Pass Rate by Subject
            </CardTitle>
            <Badge variant="outline" className="text-xs">
              {selectedTerm}
            </Badge>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={PASS_RATE_BY_SUBJECT} barSize={32}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="subject" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} domain={[0, 100]} unit="%" />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="passRate" name="Pass Rate" radius={[6, 6, 0, 0]} fill="hsl(var(--primary))">
                  {PASS_RATE_BY_SUBJECT.map((entry, index) => (
                    <Cell key={index} fill={entry.passRate >= 80 ? "#10b981" : entry.passRate >= 60 ? "#3b82f6" : entry.passRate >= 50 ? "#f59e0b" : "#ef4444"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="pb-2">
            <CardTitle className="font-heading flex items-center gap-2">
              <PieChartIcon className="w-5 h-5 text-primary" /> Grade Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={GRADE_DISTRIBUTION}
                  cx="50%"
                  cy="45%"
                  innerRadius={55}
                  outerRadius={90}
                  dataKey="count"
                  nameKey="grade"
                  paddingAngle={3}
                  strokeWidth={0}
                >
                  {GRADE_DISTRIBUTION.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  verticalAlign="bottom"
                  iconType="circle"
                  iconSize={8}
                  formatter={(value: string) => <span className="text-xs text-muted-foreground">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 — Financial Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-6">
        <Card className="border-border lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="font-heading flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-500" /> Revenue & Outstanding Fees
            </CardTitle>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> Collected</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-orange-400 inline-block" /> Outstanding</span>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={MONTHLY_REVENUE}>
                <defs>
                  <linearGradient id="gradCollected" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradOutstanding" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#fb923c" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#fb923c" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}K`} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="collected" name="Collected" stroke="#10b981" strokeWidth={2.5} fill="url(#gradCollected)" />
                <Area type="monotone" dataKey="outstanding" name="Outstanding" stroke="#fb923c" strokeWidth={2.5} fill="url(#gradOutstanding)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="pb-2">
            <CardTitle className="font-heading flex items-center gap-2">
              <PieChartIcon className="w-5 h-5 text-indigo-500" /> Payment Methods
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={FEE_PAYMENT_METHODS}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={70}
                  dataKey="amount"
                  nameKey="method"
                  paddingAngle={3}
                  strokeWidth={0}
                >
                  {FEE_PAYMENT_METHODS.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-2">
              {FEE_PAYMENT_METHODS.map((m) => (
                <div key={m.method} className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: m.color }} />
                    <span className="text-muted-foreground">{m.method}</span>
                  </span>
                  <span className="font-medium text-foreground">${m.amount.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 3 — Enrollment Trend & Recent Activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6">
        <Card className="border-border">
          <CardHeader className="pb-2">
            <CardTitle className="font-heading flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-500" /> Enrollment Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={ENROLLMENT_TREND}>
                <defs>
                  <linearGradient id="gradEnroll" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} domain={['dataMin - 10', 'dataMax + 10']} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="students" name="Students" stroke="#6366f1" strokeWidth={2.5} dot={{ fill: "#6366f1", r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="pb-2">
            <CardTitle className="font-heading flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" /> Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {RECENT_ACTIVITY.map((activity, index) => {
                const Icon = ACTIVITY_ICONS[activity.type] || FileText;
                const colorClass = ACTIVITY_COLORS[activity.type] || "bg-muted text-muted-foreground";
                return (
                  <div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className={`w-9 h-9 rounded-lg ${colorClass} flex items-center justify-center shrink-0 mt-0.5`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{activity.action}</p>
                      <p className="text-xs text-muted-foreground truncate">{activity.detail}</p>
                    </div>
                    <span className="text-xs text-muted-foreground shrink-0">{activity.time}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <Card className="border-border bg-gradient-to-br from-emerald-500/5 to-emerald-500/0">
          <CardContent className="p-5">
            <div className="text-xs text-muted-foreground mb-1">Total Collected</div>
            <div className="text-xl font-heading font-black text-emerald-600">${totalCollected.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card className="border-border bg-gradient-to-br from-orange-500/5 to-orange-500/0">
          <CardContent className="p-5">
            <div className="text-xs text-muted-foreground mb-1">Outstanding</div>
            <div className="text-xl font-heading font-black text-orange-600">${totalOutstanding.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card className="border-border bg-gradient-to-br from-blue-500/5 to-blue-500/0">
          <CardContent className="p-5">
            <div className="text-xs text-muted-foreground mb-1">Collection Rate</div>
            <div className="text-xl font-heading font-black text-blue-600">{Math.round((totalCollected / (totalCollected + totalOutstanding)) * 100)}%</div>
          </CardContent>
        </Card>
        <Card className="border-border bg-gradient-to-br from-indigo-500/5 to-indigo-500/0">
          <CardContent className="p-5">
            <div className="text-xs text-muted-foreground mb-1">Avg Monthly</div>
            <div className="text-xl font-heading font-black text-indigo-600">${Math.round(totalCollected / 12).toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
