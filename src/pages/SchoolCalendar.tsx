import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Clock, MapPin, Bell, Info, Landmark, Printer } from "lucide-react";

interface CalendarEvent {
  id: string;
  title: string;
  startDate: string;
  endDate?: string;
  type: "term" | "holiday" | "exam" | "event";
  description: string;
}

const calendarEvents: CalendarEvent[] = [
  // Terms
  { id: "t1", title: "Term 1 Begins", startDate: "2026-01-13", type: "term", description: "Official start of the 2026 academic year." },
  { id: "t1-end", title: "Term 1 Ends", startDate: "2026-04-09", type: "term", description: "Closing day for Term 1." },
  { id: "t2", title: "Term 2 Begins", startDate: "2026-05-12", type: "term", description: "Beginning of the winter term." },
  { id: "t2-end", title: "Term 2 Ends", startDate: "2026-08-06", type: "term", description: "Closing day for Term 2." },
  { id: "t3", title: "Term 3 Begins", startDate: "2026-09-08", type: "term", description: "Final term of the academic year." },
  { id: "t3-end", title: "Term 3 Ends", startDate: "2026-12-03", type: "term", description: "School closing and graduation season." },
  
  // Holidays
  { id: "h1", title: "Independence Day", startDate: "2026-04-18", type: "holiday", description: "National celebration of Zimbabwe's independence." },
  { id: "h2", title: "Workers Day", startDate: "2026-05-01", type: "holiday", description: "International Workers' Day holiday." },
  { id: "h3", title: "Africa Day", startDate: "2026-05-25", type: "holiday", description: "Celebrating African unity and heritage." },
  { id: "h4", title: "Heroes Day", startDate: "2026-08-10", type: "holiday", description: "Commemorating Zimbabwe's national heroes." },
  { id: "h5", title: "Defense Forces Day", startDate: "2026-08-11", type: "holiday", description: "Honoring the Zimbabwe Defense Forces." },
  { id: "h6", title: "National Unity Day", startDate: "2026-12-22", type: "holiday", description: "Celebrating the Unity Accord." },
  
  // Exams & Other
  { id: "e1", title: "Grade 7 Final Exams", startDate: "2026-10-12", endDate: "2026-10-23", type: "exam", description: "ZIMSEC Grade 7 national examinations session." },
  { id: "e2", title: "End of Year Assessments", startDate: "2026-11-16", endDate: "2026-11-20", type: "exam", description: "Internal assessments for all grades." },
  { id: "ev1", title: "Annual Price Giving", startDate: "2026-11-27", type: "event", description: "Celebrating academic and extracurricular excellence." },
];

const SchoolCalendar = ({ type = "student" }: { type?: "student" | "admin" | "teacher" }) => {
  const [activeTerm, setActiveTerm] = useState("Term 1");

  const handleDownloadPDF = () => {
    window.print();
  };

  // Sort events by date
  const sortedEvents = [...calendarEvents].sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

  const getBadgeVariant = (type: string) => {
    switch(type) {
      case "term": return "default";
      case "holiday": return "secondary";
      case "exam": return "destructive";
      default: return "outline";
    }
  };

  return (
    <DashboardLayout type={type} title="School Calendar">
      <div className="flex justify-end mb-4 no-print">
        <Button onClick={handleDownloadPDF} variant="outline" className="gap-2 bg-card border-border hover:bg-muted font-bold text-xs">
          <Printer className="w-4 h-4" /> Download Calendar (PDF)
        </Button>
      </div>

      <div className="print-only text-center mb-10 border-b pb-6">
        <h1 className="text-3xl font-black font-heading text-primary uppercase tracking-widest">CABS Primary School</h1>
        <p className="text-sm font-bold opacity-60">Official Academic Calendar — 2026</p>
      </div>

      <div className="space-y-6">
        <div className="grid gap-6">
          {sortedEvents.map((event) => (
            <Card key={event.id} className="border-border overflow-hidden group hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row">
                <div className="bg-primary/5 p-6 flex flex-col items-center justify-center min-w-[140px] border-r border-border/50">
                  <span className="text-2xl font-black text-primary">{new Date(event.startDate).getDate()}</span>
                  <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    {new Date(event.startDate).toLocaleString('default', { month: 'short' })}
                  </span>
                  <span className="mt-2">
                    <CalendarIcon className="w-4 h-4 text-primary/40" />
                  </span>
                </div>
                <div className="p-6 flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                    <div>
                      <Badge variant={getBadgeVariant(event.type)} className="mb-2 uppercase text-[10px] tracking-tighter">
                        {event.type}
                      </Badge>
                      <h3 className="text-lg font-black font-heading text-foreground group-hover:text-primary transition-colors">
                        {event.title}
                      </h3>
                    </div>
                    {event.endDate && (
                      <Badge variant="outline" className="bg-muted/50">
                        Until {new Date(event.endDate).toLocaleDateString()}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
                    {event.description}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-4 text-xs font-bold text-muted-foreground/60">
                    <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> School Grounds</span>
                    <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> 08:00 AM</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-12 p-8 bg-primary/5 rounded-3xl border border-primary/20 relative overflow-hidden no-print">
            <Landmark className="absolute -right-10 -bottom-10 w-64 h-64 text-primary/5 rotate-12" />
            <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4 text-primary">
                    <Bell className="w-6 h-6" />
                    <h3 className="text-xl font-black font-heading">Calendar Note</h3>
                </div>
                <p className="text-sm text-foreground/80 leading-relaxed max-w-xl">
                    This calendar is subject to change based on Ministry of Primary and Secondary Education directives. 
                    Please ensure you are subscribed to our WhatsApp bot for real-time updates.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                    <Badge className="bg-primary text-white hover:bg-primary font-bold">2026 Session</Badge>
                    <Badge variant="outline" className="border-primary/30 text-primary font-bold">Ministry Approved</Badge>
                </div>
            </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SchoolCalendar;
