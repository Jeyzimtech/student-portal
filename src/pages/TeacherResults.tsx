import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { getMockStudentsByGrade, getMockResultsByStudent } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";
import { Save, Users } from "lucide-react";

const SUBJECTS = ["Mathematics", "English", "Shona", "Science", "Social Studies", "ICT", "Agriculture", "P.E."];

const getGrade = (mark: number) => {
  if (mark >= 80) return "1";
  if (mark >= 70) return "2";
  if (mark >= 60) return "3";
  if (mark >= 50) return "4";
  if (mark >= 40) return "5";
  return "U";
};

const TeacherResults = () => {
  const { profile } = useAuth();
  const { toast } = useToast();
  const assignedGrade = profile?.grade || "Grade 7A";
  const students = getMockStudentsByGrade(assignedGrade);

  const [selectedSubject, setSelectedSubject] = useState("");
  const [marks, setMarks] = useState<Record<string, string>>({});
  const [comments, setComments] = useState<Record<string, string>>({});

  const handleSubjectChange = (subject: string) => {
    setSelectedSubject(subject);
    // Pre-fill with existing mock data
    const newMarks: Record<string, string> = {};
    const newComments: Record<string, string> = {};
    students.forEach((student) => {
      const results = getMockResultsByStudent(student.id);
      const existing = results.find((r) => r.subject === subject);
      if (existing) {
        newMarks[student.id] = String(existing.mark);
        newComments[student.id] = existing.comment || "";
      }
    });
    setMarks(newMarks);
    setComments(newComments);
  };

  const handleSave = () => {
    toast({ title: "Results Saved", description: `${selectedSubject} results for ${assignedGrade} saved successfully.` });
  };

  return (
    <DashboardLayout type="teacher" title="Upload Results">
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-300 px-3 py-1">
          {assignedGrade}
        </Badge>
        <span className="text-sm text-muted-foreground">Term 1 — 2026</span>
      </div>

      <Card className="border-border mb-6">
        <CardHeader>
          <CardTitle className="font-heading">Select Subject</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedSubject} onValueChange={handleSubjectChange}>
            <SelectTrigger className="w-full md:w-80">
              <SelectValue placeholder="Choose a subject" />
            </SelectTrigger>
            <SelectContent>
              {SUBJECTS.map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {selectedSubject && (
        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-heading flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-500" />
              {selectedSubject} — {assignedGrade}
            </CardTitle>
            <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
              <Save className="w-4 h-4" />
              Save Results
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead className="w-24">Mark</TableHead>
                  <TableHead className="w-20">Grade</TableHead>
                  <TableHead>Comment</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student) => {
                  const mark = Number(marks[student.id]) || 0;
                  const grade = marks[student.id] ? getGrade(mark) : "";
                  return (
                    <TableRow key={student.id}>
                      <TableCell className="font-mono text-sm text-muted-foreground">{student.student_id}</TableCell>
                      <TableCell className="font-medium">{student.full_name}</TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          value={marks[student.id] || ""}
                          onChange={(e) => setMarks((prev) => ({ ...prev, [student.id]: e.target.value }))}
                          className="w-20"
                          placeholder="0"
                        />
                      </TableCell>
                      <TableCell>
                        {grade && (
                          <Badge variant="outline" className={
                            mark >= 70 ? "bg-green-50 text-green-700 border-green-200" :
                            mark >= 50 ? "bg-amber-50 text-amber-700 border-amber-200" :
                            "bg-red-50 text-red-700 border-red-200"
                          }>
                            {grade}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Input
                          value={comments[student.id] || ""}
                          onChange={(e) => setComments((prev) => ({ ...prev, [student.id]: e.target.value }))}
                          placeholder="Optional comment"
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </DashboardLayout>
  );
};

export default TeacherResults;
