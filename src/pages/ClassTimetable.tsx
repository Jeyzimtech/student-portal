import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchCollection } from "@/integrations/firebase/firestore";
import { getMockTimetableByGrade } from "@/data/mockData";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

interface TimetableEntry {
  day_of_week: string;
  period_number: number;
  start_time: string;
  end_time: string;
  subject: string;
}

const ClassTimetable = ({ type = "student" }: { type?: "student" | "admin" | "teacher" }) => {
  const [entries, setEntries] = useState<TimetableEntry[]>([]);

  useEffect(() => {
    const gradeToFetch = "Grade 5A";
    
    // Load mock data immediately
    setEntries(getMockTimetableByGrade(gradeToFetch));

    // Background fetch real data
    fetchCollection<TimetableEntry>("class_timetable", {
      filters: [{ field: "grade", op: "==", value: gradeToFetch }],
      orderByField: "period_number",
    }).then((data) => {
      if (data.length > 0) {
        setEntries(data);
      }
    }).catch(() => {
      // Stay with mock
    });
  }, []);

  const periods = [...new Set(entries.map((e) => e.period_number))].sort();

  const getSubject = (day: string, period: number) => {
    return entries.find((e) => e.day_of_week === day && e.period_number === period)?.subject ?? "";
  };
  const getTime = (period: number) => {
    const entry = entries.find((e) => e.period_number === period);
    return entry ? `${entry.start_time.slice(0, 5)} - ${entry.end_time.slice(0, 5)}` : "";
  };

  return (
    <DashboardLayout type={type} title="Class Timetable">
      <Card className="border-border">
        <CardHeader><CardTitle className="font-heading">Grade 5A — Weekly Timetable</CardTitle></CardHeader>
        <CardContent className="overflow-x-auto">
          {entries.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No timetable published yet.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-3 font-heading font-bold text-foreground">Time</th>
                  {days.map((d) => <th key={d} className="text-left p-3 font-heading font-bold text-foreground">{d}</th>)}
                </tr>
              </thead>
              <tbody>
                {periods.map((period) => (
                  <tr key={period} className="border-b border-border">
                    <td className="p-3 text-muted-foreground font-medium whitespace-nowrap">{getTime(period)}</td>
                    {days.map((day) => {
                      const subject = getSubject(day, period);
                      return (
                        <td key={day} className="p-3">
                          <span className={`inline-block px-3 py-1.5 rounded-lg text-xs font-semibold ${
                            subject === "BREAK" ? "bg-secondary/20 text-secondary-foreground" : "bg-primary/10 text-primary"
                          }`}>{subject}</span>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default ClassTimetable;
