import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { fetchCollection } from "@/integrations/firebase/firestore";
import { MOCK_EXAMS } from "@/data/mockData";

interface Exam {
  exam_date: string;
  start_time: string;
  end_time: string;
  subject: string;
  venue: string | null;
}

const ExamTimetable = ({ type = "student" }: { type?: "student" | "admin" | "teacher" }) => {
  const [exams, setExams] = useState<Exam[]>([]);

  useEffect(() => {
    // Load mock data immediately for speed
    setExams(MOCK_EXAMS);

    // Then try to fetch real data
    fetchCollection<Exam>("exam_timetable", {
      orderByField: "exam_date",
    }).then((data) => {
      if (data.length > 0) {
        setExams(data);
      }
    }).catch(() => {
      // Stay with mock
    });
  }, []);

  return (
    <DashboardLayout type={type} title="Exam Timetable">
      <Card className="border-border">
        <CardHeader><CardTitle className="font-heading">Mid-Year Examinations — 2026</CardTitle></CardHeader>
        <CardContent>
          {exams.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No exam timetable published yet.</p>
          ) : (
            <div className="overflow-x-auto -mx-4 md:mx-0">
            <Table>
              <TableHeader><TableRow><TableHead>Date</TableHead><TableHead>Time</TableHead><TableHead>Subject</TableHead><TableHead className="hidden sm:table-cell">Venue</TableHead></TableRow></TableHeader>
              <TableBody>
                {exams.map((exam, i) => (
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
