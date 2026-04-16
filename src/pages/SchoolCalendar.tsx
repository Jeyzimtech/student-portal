import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon, Clock, MapPin, Bell, Info, Landmark } from "lucide-react";

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

  // Sort events by date
  const sortedEvents = [...calendarEvents].sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

  const getBadgeColor = (type: string) => {
    switch (type) {
      case "term": return "bg-primary/20 text-primary border-primary/30";
      case "holiday": return "bg-orange-500/20 text-orange-600 border-orange-500/30";
      case "exam": return "bg-red-500/20 text-red-600 border-red-500/30";
      default: return "bg-blue-500/20 text-blue-600 border-blue-500/30";
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-ZW", { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  };

  const isUpcoming = (dateStr: string) => {
    return new Date(dateStr) > new Date();
  };

  return (
    <DashboardLayout type={type} title="School Calendar">
      <div className="grid md:grid-cols-4 gap-6">
        {/* Left: Ministry Info */}
        <div className="md:col-span-1 space-y-6">
          <Card className="border-border bg-primary/5">
            <CardHeader className="pb-3">
              <Landmark className="w-8 h-8 text-primary mb-2" />
              <CardTitle className="text-sm font-heading">Ministry Compliance</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground leading-relaxed">
                This calendar follows the official 2026 schedule set by the **Ministry of Primary and Secondary Education, Zimbabwe**.
              </p>
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                  <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">Verified</Badge>
                  <span>2026 Schedule</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader><CardTitle className="text-xs font-heading">Key Dates</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <Bell className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <div className="text-xs">
                  <span className="font-bold">Term 1 Closure</span>
                  <p className="text-muted-foreground italic">April 9, 2026</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <div className="text-xs">
                  <span className="font-bold">Independence Day</span>
                  <p className="text-muted-foreground italic">April 18, 2026</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: Events Timeline */}
        <div className="md:col-span-3">
          <Card className="border-border">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="font-heading">Academic Timeline 2026</CardTitle>
              <div className="flex gap-2">
                <Badge className="bg-primary">2026</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="relative border-l-2 border-muted ml-3 pl-8 space-y-8 py-4">
                {sortedEvents.map((event) => (
                  <div key={event.id} className="relative group">
                    {/* Timeline Dot */}
                    <div className={`absolute -left-[41px] top-1 w-6 h-6 rounded-full border-4 border-background flex items-center justify-center transition-transform group-hover:scale-125 ${
                      event.type === 'term' ? 'bg-primary' : 
                      event.type === 'exam' ? 'bg-red-500' : 
                      event.type === 'holiday' ? 'bg-orange-500' : 'bg-blue-500'
                    }`} />
                    
                    <div className={`p-4 rounded-xl border border-border transition-all hover:shadow-md ${isUpcoming(event.startDate) ? 'bg-background' : 'bg-muted/30 opacity-70'}`}>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <Badge className={getBadgeColor(event.type)}>{event.type.toUpperCase()}</Badge>
                          <h4 className="font-heading font-bold text-foreground">{event.title}</h4>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                          <Clock className="w-3.5 h-3.5" />
                          {formatDate(event.startDate)}
                          {event.endDate && ` — ${formatDate(event.endDate)}`}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{event.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SchoolCalendar;
