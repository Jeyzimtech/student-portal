import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { fetchCollection } from "@/integrations/firebase/firestore";
import { getMockResultsByStudent } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";

interface Result {
  subject: string;
  mark: number;
  grade: string | null;
  comment: string | null;
  term: number;
  year: number;
}

const getGradeColor = (grade: string) => {
  if (!grade) return "";
  const g = parseInt(grade);
  if (g <= 2) return "bg-primary/15 text-primary border-primary/30";
  if (g <= 4) return "bg-secondary/15 text-secondary-foreground border-secondary/30";
  return "bg-accent/15 text-accent border-accent/30";
};

const StudentResults = () => {
  const { studentRecord } = useAuth();
  const [results, setResults] = useState<Result[]>([]);

  useEffect(() => {
    if (!studentRecord) return;

    // Fast loading: load mock data immediately first
    const mock = getMockResultsByStudent(studentRecord.id);
    setResults(mock);

    // Then try to fetch real data from Firestore to update (if any)
    const loadRealResults = async () => {
      try {
        const data = await fetchCollection<Result>("results", {
          filters: [{ field: "student_id", op: "==", value: studentRecord.id }],
        });
        if (data.length > 0) {
          setResults(data);
        }
      } catch (err) {
        console.log("Firestore fetch ignored in favor of mock data", err);
      }
    };

    loadRealResults();
  }, [studentRecord]);

  const handleDownloadPDF = () => {
    window.print();
  };

  // Calculate average
  const average = results.length > 0
    ? Math.round(results.reduce((sum, r) => sum + r.mark, 0) / results.length)
    : null;

  return (
    <DashboardLayout type="student" title="My Results">
      <div className="flex justify-start mb-4 no-print">
        <Button onClick={handleDownloadPDF} variant="outline" className="gap-2 bg-card border-border hover:bg-muted font-bold text-xs">
          <Printer className="w-4 h-4" /> Download Report (PDF)
        </Button>
      </div>
      
      <div className="print-only text-center mb-10 border-b pb-6">
        <h1 className="text-3xl font-black font-heading text-primary uppercase tracking-widest">CABS Primary School</h1>
        <p className="text-sm font-bold opacity-60">Professional Student Termly Report</p>
        <div className="mt-4 grid grid-cols-2 text-left bg-muted/30 p-4 rounded-xl max-w-md mx-auto">
          <div className="text-xs uppercase tracking-tighter opacity-70">Student Name:</div>
          <div className="text-sm font-bold">{studentRecord?.full_name}</div>
          <div className="text-xs uppercase tracking-tighter opacity-70">Grade:</div>
          <div className="text-sm font-bold">{studentRecord?.grade}</div>
          <div className="text-xs uppercase tracking-tighter opacity-70">Term:</div>
          <div className="text-sm font-bold">Term 1 — 2026</div>
        </div>
      </div>

      <Card className="border-border">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="font-heading">Term 1 — 2026 Results</CardTitle>
          {average !== null && (
            <Badge variant="outline" className="text-sm px-3 py-1 bg-primary/10 text-primary border-primary/30">
              Average: {average}%
            </Badge>
          )}
        </CardHeader>
        <CardContent>
          {results.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No results available yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Subject</TableHead>
                  <TableHead>Mark (%)</TableHead>
                  <TableHead>Grade</TableHead>
                  <TableHead className="hidden md:table-cell">Comment</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.map((r) => (
                  <TableRow key={r.subject}>
                    <TableCell className="font-medium">{r.subject}</TableCell>
                    <TableCell>
                      <span className="font-bold">{r.mark}</span>
                    </TableCell>
                    <TableCell>
                      {r.grade && <Badge variant="outline" className={getGradeColor(r.grade)}>{r.grade}</Badge>}
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">{r.comment}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default StudentResults;
