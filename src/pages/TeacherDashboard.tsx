import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, TrendingUp, BookOpen, FileText, Award, BarChart3 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { getMockStudentsByGrade, getMockResultsByStudent, MOCK_RESULTS } from "@/data/mockData";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from "recharts";

const COLORS = ["#2563eb", "#16a34a", "#eab308", "#f97316", "#ef4444", "#8b5cf6", "#06b6d4"];

const TeacherDashboard = () => {
  const { profile } = useAuth();
  const assignedGrade = profile?.grade || "Grade 7A";
  const students = getMockStudentsByGrade(assignedGrade);

  // Compute pass rate per subject for this class
  const subjects = ["Mathematics", "English", "Shona", "Science", "Social Studies", "ICT", "Agriculture", "P.E."];
  const classResults = MOCK_RESULTS.filter((r) =>
    students.some((s) => s.id === r.student_id)
  );

  const subjectStats = subjects.map((subject) => {
    const subjectResults = classResults.filter((r) => r.subject === subject);
    const total = subjectResults.length;
    const passed = subjectResults.filter((r) => r.mark >= 50).length;
    const avg = total > 0 ? Math.round(subjectResults.reduce((s, r) => s + r.mark, 0) / total) : 0;
    return { subject, passRate: total > 0 ? Math.round((passed / total) * 100) : 0, avg, total };
  });

  const overallAvg = classResults.length > 0
    ? Math.round(classResults.reduce((s, r) => s + r.mark, 0) / classResults.length)
    : 0;
  const overallPassRate = classResults.length > 0
    ? Math.round((classResults.filter((r) => r.mark >= 50).length / classResults.length) * 100)
    : 0;

  // Grade distribution for pie chart
  const gradeDistribution = [
    { name: "Grade 1 (80-100)", value: classResults.filter((r) => r.mark >= 80).length, color: "#2563eb" },
    { name: "Grade 2 (70-79)", value: classResults.filter((r) => r.mark >= 70 && r.mark < 80).length, color: "#16a34a" },
    { name: "Grade 3 (60-69)", value: classResults.filter((r) => r.mark >= 60 && r.mark < 70).length, color: "#eab308" },
    { name: "Grade 4 (50-59)", value: classResults.filter((r) => r.mark >= 50 && r.mark < 60).length, color: "#f97316" },
    { name: "Grade 5+ (<50)", value: classResults.filter((r) => r.mark < 50).length, color: "#ef4444" },
  ].filter((d) => d.value > 0);

  const stats = [
    { label: "My Students", value: students.length, icon: Users, color: "bg-blue-500/10 text-blue-600" },
    { label: "Class Average", value: `${overallAvg}%`, icon: TrendingUp, color: "bg-green-500/10 text-green-600" },
    { label: "Pass Rate", value: `${overallPassRate}%`, icon: Award, color: "bg-amber-500/10 text-amber-600" },
    { label: "Subjects", value: subjects.length, icon: BookOpen, color: "bg-purple-500/10 text-purple-600" },
  ];

  return (
    <DashboardLayout type="teacher" title={`${assignedGrade} — Class Dashboard`}>
      {/* Info strip */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-300 px-3 py-1">
          {profile?.subject || "Teacher"}
        </Badge>
        <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-300 px-3 py-1">
          {assignedGrade}
        </Badge>
        <span className="text-sm text-muted-foreground">Term 1 — 2026</span>
      </div>

      {/* Stats */}
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

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 md:gap-6">
        {/* Pass Rate by Subject */}
        <Card className="lg:col-span-3 border-border">
          <CardHeader>
            <CardTitle className="font-heading flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-500" />
              Pass Rate by Subject
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={subjectStats} margin={{ top: 5, right: 10, left: 0, bottom: 30 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="subject" tick={{ fontSize: 11 }} angle={-30} textAnchor="end" />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                <Tooltip formatter={(val: number) => `${val}%`} />
                <Bar dataKey="passRate" radius={[6, 6, 0, 0]}>
                  {subjectStats.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Grade Distribution */}
        <Card className="lg:col-span-2 border-border">
          <CardHeader>
            <CardTitle className="font-heading">Grade Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={gradeDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={90} paddingAngle={3}>
                  {gradeDistribution.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Performers */}
      <Card className="mt-6 border-border">
        <CardHeader><CardTitle className="font-heading">Student Averages</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {students.map((student) => {
              const results = getMockResultsByStudent(student.id);
              const avg = results.length > 0 ? Math.round(results.reduce((s, r) => s + r.mark, 0) / results.length) : 0;
              return (
                <div key={student.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div>
                    <div className="font-medium text-foreground">{student.full_name}</div>
                    <div className="text-xs text-muted-foreground">{student.student_id}</div>
                  </div>
                  <div className="flex items-center gap-2 md:gap-3">
                    <div className="w-16 md:w-32 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${avg >= 70 ? "bg-green-500" : avg >= 50 ? "bg-amber-500" : "bg-red-500"}`}
                        style={{ width: `${avg}%` }}
                      />
                    </div>
                    <Badge variant="outline" className={`min-w-[3.5rem] text-center ${
                      avg >= 70 ? "bg-green-50 text-green-700 border-green-200" :
                      avg >= 50 ? "bg-amber-50 text-amber-700 border-amber-200" :
                      "bg-red-50 text-red-700 border-red-200"
                    }`}>
                      {avg}%
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default TeacherDashboard;
