import { ReactNode } from "react";
import DashboardSidebar from "./DashboardSidebar";

interface DashboardLayoutProps {
  type: "student" | "admin" | "teacher";
  title: string;
  children: ReactNode;
}

const DashboardLayout = ({ type, title, children }: DashboardLayoutProps) => {
  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar type={type} />
      <main className="flex-1 p-4 pt-16 md:p-6 md:pt-6 lg:p-8 overflow-auto">
        <h1 className="font-heading font-black text-xl md:text-2xl lg:text-3xl text-foreground mb-4 md:mb-6">{title}</h1>
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
