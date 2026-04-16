import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Eye, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { getMockStudentsByGrade, getMockResultsByStudent, type MockStudent } from "@/data/mockData";

const TeacherStudents = () => {
  const { profile } = useAuth();
  const assignedGrade = profile?.grade || "Grade 7A";
  const students = getMockStudentsByGrade(assignedGrade);
  const [search, setSearch] = useState("");
  const [viewStudent, setViewStudent] = useState<MockStudent | null>(null);

  const filtered = students.filter(
    (s) =>
      s.full_name.toLowerCase().includes(search.toLowerCase()) ||
      s.student_id.toLowerCase().includes(search.toLowerCase())
  );

  const getStudentAvg = (studentId: string) => {
    const results = getMockResultsByStudent(studentId);
    return results.length > 0 ? Math.round(results.reduce((s, r) => s + r.mark, 0) / results.length) : null;
  };

  return (
    <DashboardLayout type="teacher" title="My Students">
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-300 px-3 py-1">
          {assignedGrade}
        </Badge>
        <span className="text-sm text-muted-foreground">{students.length} students</span>
      </div>

      <Card className="border-border">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <CardTitle className="font-heading">Class Register</CardTitle>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search students..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto -mx-4 md:mx-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="hidden md:table-cell">Parent/Guardian</TableHead>
                <TableHead className="hidden md:table-cell">Contact</TableHead>
                <TableHead>Average</TableHead>
                <TableHead className="text-right">View</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((s) => {
                const avg = getStudentAvg(s.id);
                return (
                  <TableRow key={s.id}>
                    <TableCell className="font-mono text-xs md:text-sm text-muted-foreground">{s.student_id}</TableCell>
                    <TableCell className="font-medium text-sm">{s.full_name}</TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">{s.parent_name || "—"}</TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">{s.parent_phone || "—"}</TableCell>
                    <TableCell>
                      {avg !== null ? (
                        <Badge variant="outline" className={
                          avg >= 70 ? "bg-green-50 text-green-700 border-green-200" :
                          avg >= 50 ? "bg-amber-50 text-amber-700 border-amber-200" :
                          "bg-red-50 text-red-700 border-red-200"
                        }>
                          {avg}%
                        </Badge>
                      ) : "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      <button onClick={() => setViewStudent(s)} className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          </div>
        </CardContent>
      </Card>

      {/* View Student Dialog */}
      <Dialog open={!!viewStudent} onOpenChange={() => setViewStudent(null)}>
        <DialogContent className="max-w-[95vw] md:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-heading">{viewStudent?.full_name}</DialogTitle>
          </DialogHeader>
          {viewStudent && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-muted-foreground">Student ID</span><div className="font-mono font-medium">{viewStudent.student_id}</div></div>
                <div><span className="text-muted-foreground">Grade</span><div className="font-medium">{viewStudent.grade}</div></div>
                <div><span className="text-muted-foreground">Parent</span><div className="font-medium">{viewStudent.parent_name || "—"}</div></div>
                <div><span className="text-muted-foreground">Phone</span><div className="font-medium">{viewStudent.parent_phone || "—"}</div></div>
                <div className="col-span-2"><span className="text-muted-foreground">Address</span><div className="font-medium">{viewStudent.address || "—"}</div></div>
              </div>

              <div>
                <h4 className="font-heading font-bold text-sm mb-2">Results</h4>
                {getMockResultsByStudent(viewStudent.id).map((r) => (
                  <div key={r.subject} className="flex justify-between py-1.5 border-b border-border last:border-0 text-sm">
                    <span>{r.subject}</span>
                    <div className="flex gap-2 items-center">
                      <span className="font-bold">{r.mark}%</span>
                      <Badge variant="outline" className="text-xs">{r.grade}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default TeacherStudents;
