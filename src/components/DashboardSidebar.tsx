import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { GraduationCap, LayoutDashboard, FileText, DollarSign, Calendar, BookOpen, Clock, LogOut, Users, ChevronRight, Menu, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface SidebarProps {
  type: "student" | "admin" | "teacher";
}

const studentLinks = [
  { label: "Dashboard", href: "/student-dashboard", icon: LayoutDashboard },
  { label: "My Results", href: "/student-dashboard/results", icon: FileText },
  { label: "Financials", href: "/student-dashboard/financials", icon: DollarSign },
  { label: "Exam Timetable", href: "/student-dashboard/exam-timetable", icon: Calendar },
  { label: "Class Timetable", href: "/student-dashboard/class-timetable", icon: Clock },
  { label: "E-Learning", href: "/student-dashboard/elearning", icon: BookOpen },
  { label: "School Calendar", href: "/student-dashboard/calendar", icon: Calendar },
];

const adminLinks = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Upload Results", href: "/admin/results", icon: FileText },
  { label: "Manage Students", href: "/admin/students", icon: GraduationCap },
  { label: "Financials", href: "/admin/financials", icon: DollarSign },
  { label: "Exam Timetable", href: "/admin/exam-timetable", icon: Calendar },
  { label: "Class Timetable", href: "/admin/class-timetable", icon: Clock },
  { label: "E-Learning", href: "/admin/elearning", icon: BookOpen },
  { label: "School Calendar", href: "/admin/calendar", icon: Calendar },
];

const teacherLinks = [
  { label: "My Dashboard", href: "/teacher", icon: LayoutDashboard },
  { label: "Upload Results", href: "/teacher/results", icon: FileText },
  { label: "My Students", href: "/teacher/students", icon: Users },
  { label: "Fee Status", href: "/teacher/fees", icon: DollarSign },
  { label: "Exam Timetable", href: "/teacher/exam-timetable", icon: Calendar },
  { label: "Class Timetable", href: "/teacher/class-timetable", icon: Clock },
  { label: "E-Learning", href: "/teacher/elearning", icon: BookOpen },
  { label: "School Calendar", href: "/teacher/calendar", icon: Calendar },
];

const sidebarThemes = {
  student: "bg-sidebar text-sidebar-foreground",
  admin: "bg-sidebar text-sidebar-foreground",
  teacher: "bg-[#1a2744] text-white",
};

const roleLabels: Record<string, string> = {
  student: "Student Portal",
  admin: "Admin Portal",
  teacher: "Teacher Portal",
};

const DashboardSidebar = ({ type }: SidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut, profile } = useAuth();
  const links = type === "student" ? studentLinks : type === "teacher" ? teacherLinks : adminLinks;
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSignOut = async () => {
    setMobileOpen(false);
    await signOut();
    navigate("/");
  };

  const handleLinkClick = () => {
    setMobileOpen(false);
  };

  const sidebarContent = (
    <>
      <div className="p-5 md:p-6 border-b border-white/10">
        <Link to="/" className="flex items-center gap-2" onClick={handleLinkClick}>
          <div className={`w-9 h-9 rounded-full flex items-center justify-center ${type === "teacher" ? "bg-blue-500" : "bg-sidebar-primary"}`}>
            <GraduationCap className={`w-4 h-4 ${type === "teacher" ? "text-white" : "text-sidebar-primary-foreground"}`} />
          </div>
          <div>
            <span className="font-heading font-bold text-sm block">CABS Primary</span>
            {profile && <span className="text-xs opacity-60">{profile.full_name}</span>}
          </div>
        </Link>
      </div>

      {/* Role badge */}
      <div className="px-4 pt-4">
        <div className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-md text-center ${
          type === "teacher" ? "bg-blue-500/20 text-blue-300" : "bg-sidebar-primary/20 text-sidebar-primary"
        }`}>
          {roleLabels[type]}
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {links.map((link) => {
          const isActive = location.pathname === link.href;
          return (
            <Link
              key={link.href}
              to={link.href}
              onClick={handleLinkClick}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? type === "teacher"
                    ? "bg-blue-500/20 text-blue-300"
                    : "bg-sidebar-accent text-sidebar-primary"
                  : "opacity-70 hover:opacity-100 hover:bg-white/5"
              }`}
            >
              <link.icon className="w-4 h-4" />
              {link.label}
              {isActive && <ChevronRight className="w-3 h-3 ml-auto" />}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium opacity-70 hover:opacity-100 hover:bg-white/5 transition-colors w-full mb-2"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
        <div className="text-[10px] opacity-30 text-center uppercase tracking-tighter">
          Developed by <a href="https://teramark.tech" target="_blank" rel="noopener noreferrer" className="hover:opacity-100 transition-opacity">Teramark.tech</a>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className={`md:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 ${sidebarThemes[type]}`}>
        <Link to="/" className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${type === "teacher" ? "bg-blue-500" : "bg-sidebar-primary"}`}>
            <GraduationCap className={`w-3.5 h-3.5 ${type === "teacher" ? "text-white" : "text-sidebar-primary-foreground"}`} />
          </div>
          <span className="font-heading font-bold text-sm">CABS Primary</span>
        </Link>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setMobileOpen(false)} />
      )}

      {/* Mobile slide-out sidebar */}
      <aside
        className={`md:hidden fixed top-0 left-0 bottom-0 w-72 z-50 flex flex-col transform transition-transform duration-300 ease-in-out ${sidebarThemes[type]} ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Close button */}
        <div className="absolute top-3 right-3">
          <button onClick={() => setMobileOpen(false)} className="p-2 rounded-lg hover:bg-white/10 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        {sidebarContent}
      </aside>

      {/* Desktop sidebar */}
      <aside className={`hidden md:flex w-64 min-h-screen flex-col shrink-0 ${sidebarThemes[type]}`}>
        {sidebarContent}
      </aside>
    </>
  );
};

export default DashboardSidebar;
