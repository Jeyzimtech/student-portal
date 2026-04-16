import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { fetchCollection, addDocument } from "@/integrations/firebase/firestore";
import { getMockStudentsByGrade } from "@/data/mockData";
import { Printer } from "lucide-react";

interface Student {
  id: string;
  student_id: string;
  full_name: string;
}

const subjects = ["Mathematics", "English", "Shona", "Science", "Social Studies", "ICT", "Agriculture", "P.E."];
const grades = ["Grade 1A", "Grade 2A", "Grade 3A", "Grade 4A", "Grade 5A", "Grade 6A", "Grade 7A"];

const AdminResults = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [students, setStudents] = useState<Student[]>([]);
  const [marks, setMarks] = useState<Record<string, string>>({});
  const [comments, setComments] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!selectedClass) return;

    // Load mock students immediately
    const mock = getMockStudentsByGrade(selectedClass);
    setStudents(mock.map((s) => ({ id: s.id, student_id: s.student_id, full_name: s.full_name })));

    // Try background sync
    fetchCollection<Student>("students", {
      filters: [{ field: "grade", op: "==", value: selectedClass }],
      orderByField: "full_name",
    }).then((data) => {
      if (data.length > 0) {
        setStudents(data);
      }
    }).catch(() => {
      // Stay with mock
    });
  }, [selectedClass]);

  const handlePrint = () => {
    window.print();
  };

  const getGrade = (mark: number): string => {
    if (mark >= 80) return "1";
    if (mark >= 70) return "2";
    if (mark >= 60) return "3";
    if (mark >= 50) return "4";
    if (mark >= 40) return "5";
    if (mark >= 30) return "6";
    return "7";
  };

  const handleSubmit = async () => {
    setSaving(true);
    const rows = students
      .filter((s) => marks[s.id])
      .map((s) => ({
        student_id: s.id,
        subject: selectedSubject,
        term: 1,
        year: 2026,
        mark: Number(marks[s.id]),
        grade: getGrade(Number(marks[s.id])),
        comment: comments[s.id] || null,
        uploaded_by: user?.uid || null,
      }));

    if (rows.length === 0) {
      toast({ title: "No marks entered", variant: "destructive" });
      setSaving(false);
      return;
    }

    try {
      for (const row of rows) {
        await addDocument("results", row as unknown as Record<string, unknown>);
      }
      toast({ title: "Results Saved", description: `${rows.length} results for ${selectedSubject} — ${selectedClass}` });
      setMarks({});
      setComments({});
    } catch (err: unknown) {
      const error = err as { message?: string };
      toast({ title: "Error saving results", description: error.message, variant: "destructive" });
    }
    setSaving(false);
  };

  return (
    <DashboardLayout type="admin" title="Upload Results">
      <div className="flex justify-end mb-4 no-print">
        <Button onClick={handlePrint} variant="outline" className="gap-2 bg-card border-border hover:bg-muted font-bold text-xs">
          <Printer className="w-4 h-4" /> Print Mark Sheet (PDF)
        </Button>
      </div>

      <div className="print-only text-center mb-10 border-b pb-6">
        <h1 className="text-3xl font-black font-heading text-primary uppercase tracking-widest">CABS Primary School</h1>
        <p className="text-sm font-bold opacity-60">Internal Mark Recording Sheet — 2026</p>
        <div className="mt-4 flex justify-center gap-10">
          <p className="text-sm"><strong>Class:</strong> {selectedClass || "____________"}</p>
          <p className="text-sm"><strong>Subject:</strong> {selectedSubject || "____________"}</p>
        </div>
      </div>

      <Card className="border-border mb-6 no-print">
        <CardHeader><CardTitle className="font-heading">Select Class & Subject</CardTitle></CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Class</Label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger><SelectValue placeholder="Select class" /></SelectTrigger>
                <SelectContent>{grades.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label>Subject</Label>
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger><SelectValue placeholder="Select subject" /></SelectTrigger>
                <SelectContent>{subjects.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {selectedClass && selectedSubject && (
        <Card className="border-border">
          <CardHeader><CardTitle className="font-heading">{selectedSubject} — {selectedClass}</CardTitle></CardHeader>
          <CardContent>
            {students.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No students found in {selectedClass}.</p>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Mark (%)</TableHead>
                      <TableHead className="no-print">Comment</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students.map((s) => (
                      <TableRow key={s.id}>
                        <TableCell className="font-medium">{s.student_id}</TableCell>
                        <TableCell>{s.full_name}</TableCell>
                        <TableCell>
                          <div className="print-only font-bold">{marks[s.id] || "____"}</div>
                          <Input type="number" className="w-20 no-print" placeholder="0-100" value={marks[s.id] || ""} onChange={(e) => setMarks((p) => ({ ...p, [s.id]: e.target.value }))} />
                        </TableCell>
                        <TableCell className="no-print">
                          <Input placeholder="Optional" className="w-48" value={comments[s.id] || ""} onChange={(e) => setComments((p) => ({ ...p, [s.id]: e.target.value }))} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="mt-6 flex justify-end no-print">
                  <Button onClick={handleSubmit} disabled={saving} className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold px-8">
                    {saving ? "Saving..." : "Save Results"}
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}
    </DashboardLayout>
  );
};

export default AdminResults;
