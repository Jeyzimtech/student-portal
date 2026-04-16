import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, DollarSign, Calendar, BookOpen, TrendingUp, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { fetchCollection, countCollection } from "@/integrations/firebase/firestore";
import { getMockResultsByStudent, getMockTransactionsByStudent } from "@/data/mockData";

const quickLinks = [
  { label: "View Results", href: "/student-dashboard/results", icon: FileText },
  { label: "Fee Statement", href: "/student-dashboard/financials", icon: DollarSign },
  { label: "Exam Timetable", href: "/student-dashboard/exam-timetable", icon: Calendar },
  { label: "Class Timetable", href: "/student-dashboard/class-timetable", icon: Clock },
  { label: "E-Learning", href: "/student-dashboard/elearning", icon: BookOpen },
];

const StudentDashboard = () => {
  const { profile, studentRecord } = useAuth();
  const [avgMark, setAvgMark] = useState<number | null>(null);
  const [balance, setBalance] = useState<number | null>(null);
  const [courseCount, setCourseCount] = useState(0);

  useEffect(() => {
    if (!studentRecord) return;

    // Load mock data immediately
    const mockResults = getMockResultsByStudent(studentRecord.id);
    if (mockResults.length > 0) {
      const avg = mockResults.reduce((sum, r) => sum + r.mark, 0) / mockResults.length;
      setAvgMark(Math.round(avg));
    }

    const mockTx = getMockTransactionsByStudent(studentRecord.id);
    if (mockTx.length > 0) setBalance(mockTx[mockTx.length - 1].balance);
    setCourseCount(5);

    // Sync from Firestore in background
    const fetchStats = async () => {
      try {
        const results = await fetchCollection<{ mark: number }>("results", {
          filters: [{ field: "student_id", op: "==", value: studentRecord.id }],
        });
        if (results.length > 0) {
          const avg = results.reduce((sum, r) => sum + Number(r.mark), 0) / results.length;
          setAvgMark(Math.round(avg));
        }

        const fees = await fetchCollection<{ balance: number }>("fee_transactions", {
          filters: [{ field: "student_id", op: "==", value: studentRecord.id }],
        });
        if (fees.length > 0) {
          setBalance(Number(fees[fees.length - 1].balance));
        }

        const count = await countCollection("elearning_courses", {
          filters: [{ field: "grade", op: "==", value: studentRecord.grade }],
        });
        if (count > 0) setCourseCount(count);
      } catch (err) {
        console.log("Firestore dashboard sync deferred", err);
      }
    };

    fetchStats();
  }, [studentRecord]);

  const stats = [
    { label: "Term Average", value: avgMark !== null ? `${avgMark}%` : "—", icon: TrendingUp, color: "bg-primary/10 text-primary" },
    { label: "Balance Due", value: balance !== null ? `$${Math.abs(balance)}` : "—", icon: DollarSign, color: "bg-secondary/20 text-secondary-foreground" },
    { label: "Next Exam", value: "May 12", icon: Calendar, color: "bg-accent/10 text-accent" },
    { label: "Courses", value: String(courseCount), icon: BookOpen, color: "bg-primary/10 text-primary" },
  ];

  return (
    <DashboardLayout type="student" title={`Welcome, ${profile?.full_name?.split(" ")[0] ?? "Student"} 👋`}>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-border">
            <CardContent className="p-3 md:p-5">
              <div className={`w-8 h-8 md:w-10 md:h-10 rounded-lg ${stat.color} flex items-center justify-center mb-2 md:mb-3`}>
                <stat.icon className="w-4 h-4 md:w-5 md:h-5" />
              </div>
              <div className="text-lg md:text-2xl font-heading font-black text-foreground">{stat.value}</div>
              <div className="text-xs md:text-sm text-muted-foreground">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-border">
        <CardHeader><CardTitle className="font-heading">Quick Access</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 md:gap-4">
            {quickLinks.map((link) => (
              <Link key={link.href} to={link.href} className="flex flex-col items-center gap-1.5 md:gap-2 p-3 md:p-4 rounded-xl bg-muted hover:bg-primary/10 transition-colors text-center">
                <link.icon className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                <span className="text-xs md:text-sm font-medium text-foreground">{link.label}</span>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default StudentDashboard;
