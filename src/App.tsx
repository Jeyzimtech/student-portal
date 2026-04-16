import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import StudentLogin from "./pages/StudentLogin";
import AdminLogin from "./pages/AdminLogin";
import Login from "./pages/Login";
import StudentDashboard from "./pages/StudentDashboard";
import StudentResults from "./pages/StudentResults";
import StudentFinancials from "./pages/StudentFinancials";
import ExamTimetable from "./pages/ExamTimetable";
import ELearning from "./pages/ELearning";
import ClassTimetable from "./pages/ClassTimetable";
import SchoolCalendar from "./pages/SchoolCalendar";
import AdminDashboard from "./pages/AdminDashboard";
import AdminResults from "./pages/AdminResults";
import AdminStudents from "./pages/AdminStudents";
import AdminFinancials from "./pages/AdminFinancials";
import TeacherDashboard from "./pages/TeacherDashboard";
import TeacherResults from "./pages/TeacherResults";
import TeacherStudents from "./pages/TeacherStudents";
import TeacherFees from "./pages/TeacherFees";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/student-login" element={<StudentLogin />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/login" element={<Login />} />

            {/* Student Portal */}
            <Route path="/student-dashboard" element={<StudentDashboard />} />
            <Route path="/student-dashboard/results" element={<StudentResults />} />
            <Route path="/student-dashboard/financials" element={<StudentFinancials />} />
            <Route path="/student-dashboard/exam-timetable" element={<ExamTimetable type="student" />} />
            <Route path="/student-dashboard/class-timetable" element={<ClassTimetable type="student" />} />
            <Route path="/student-dashboard/elearning" element={<ELearning type="student" />} />
            <Route path="/student-dashboard/calendar" element={<SchoolCalendar type="student" />} />

            {/* Admin Portal */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/results" element={<AdminResults />} />
            <Route path="/admin/students" element={<AdminStudents />} />
            <Route path="/admin/financials" element={<AdminFinancials />} />
            <Route path="/admin/exam-timetable" element={<ExamTimetable type="admin" />} />
            <Route path="/admin/class-timetable" element={<ClassTimetable type="admin" />} />
            <Route path="/admin/elearning" element={<ELearning type="admin" />} />
            <Route path="/admin/calendar" element={<SchoolCalendar type="admin" />} />

            {/* Teacher Portal */}
            <Route path="/teacher" element={<TeacherDashboard />} />
            <Route path="/teacher/results" element={<TeacherResults />} />
            <Route path="/teacher/students" element={<TeacherStudents />} />
            <Route path="/teacher/fees" element={<TeacherFees />} />
            <Route path="/teacher/exam-timetable" element={<ExamTimetable type="teacher" />} />
            <Route path="/teacher/class-timetable" element={<ClassTimetable type="teacher" />} />
            <Route path="/teacher/elearning" element={<ELearning type="teacher" />} />
            <Route path="/teacher/calendar" element={<SchoolCalendar type="teacher" />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
