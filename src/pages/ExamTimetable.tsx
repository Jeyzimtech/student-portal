import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { fetchCollection } from "@/integrations/firebase/firestore";
import { MOCK_EXAMS } from "@/data/mockData";
import { Filter, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Exam {
  exam_date: string;
  start_time: string;
  end_time: string;
  subject: string;
  venue: string | null;
  grade?: string;
}

const grades = ["Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5", "Grade 6", "Grade 7"];

const ExamTimetable = ({ type = "student" }: { type?: "student" | "admin" | "teacher" }) => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [selectedGrade, setSelectedGrade] = useState("Grade 7");

  useEffect(() => {
    // Load mock data immediately
    setExams(MOCK_EXAMS);

    fetchCollection<Exam>("exam_timetable", {
      orderByField: "exam_date",
    }).then((data) => {
      if (data.length > 0) {
        setExams(data);
      }
    }).catch(() => {});
  }, []);

  const handleDownloadPDF = () => {
    window.print();
  };

  const filteredExams = exams.filter(e => !e.grade || e.grade.startsWith(selectedGrade) || selectedGrade === "all");

  return (
    <DashboardLayout type={type} title="Exam Timetable">
      <div className="flex justify-between items-center mb-4 no-print">
        <Button onClick={handleDownloadPDF} variant="outline" className="gap-2 bg-card border-border hover:bg-muted font-bold text-xs">
          <Printer className="w-4 h-4" /> Download Schedule (PDF)
        </Button>
        <Select value={selectedGrade} onValueChange={setSelectedGrade}>
          <SelectTrigger className="w-48 bg-card border-border">
            <Filter className="w-3 h-3 mr-2" />
            <SelectValue placeholder="Select Grade" />
          </SelectTrigger>
          <SelectContent>
            {grades.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="print-only text-center mb-10 border-b pb-6">
        <h1 className="text-3xl font-black font-heading text-primary uppercase tracking-widest">CABS Primary School</h1>
        <p className="text-sm font-bold opacity-60">Official Examination Timetable — 2026</p>
        <p className="text-lg font-bold mt-2 text-primary">{selectedGrade}</p>
      </div>

      <Card className="border-border">
        <CardHeader><CardTitle className="font-heading">{selectedGrade} — Mid-Year Examinations</CardTitle></CardHeader>
        <CardContent>
          {filteredExams.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No exam timetable published for {selectedGrade} yet.</p>
          ) : (
            <div className="overflow-x-auto -mx-4 md:mx-0">
            <Table>
              <TableHeader><TableRow><TableHead>Date</TableHead><TableHead>Time</TableHead><TableHead>Subject</TableHead><TableHead className="hidden sm:table-cell">Venue</TableHead></TableRow></TableHeader>
              <TableBody>
                {filteredExams.map((exam, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium whitespace-nowrap text-xs md:text-sm">{exam.exam_date}</TableCell>
                    <TableCell className="text-muted-foreground whitespace-nowrap text-xs md:text-sm">{exam.start_time} - {exam.end_time}</TableCell>
                    <TableCell className="text-xs md:text-sm">{exam.subject}</TableCell>
                    <TableCell className="hidden sm:table-cell text-muted-foreground text-xs md:text-sm">{exam.venue}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default ExamTimetable;
