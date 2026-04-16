import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { getMockStudentsByGrade, getMockTransactionsByStudent } from "@/data/mockData";
import { CheckCircle, XCircle, AlertTriangle } from "lucide-react";

const TOTAL_TERM_FEES = 975; // Standard term fees

const TeacherFees = () => {
  const { profile } = useAuth();
  const assignedGrade = profile?.grade || "Grade 7A";
  const students = getMockStudentsByGrade(assignedGrade);

  const feeData = students.map((s) => {
    const transactions = getMockTransactionsByStudent(s.id);
    const paid = transactions.filter((t) => t.amount > 0).reduce((sum, t) => sum + t.amount, 0);
    const balance = transactions.length > 0 ? transactions[transactions.length - 1].balance : TOTAL_TERM_FEES;
    return { ...s, paid, balance, hasPaid: paid > 0 };
  });

  const paidCount = feeData.filter((s) => s.balance <= 0).length;
  const partialCount = feeData.filter((s) => s.balance > 0 && s.paid > 0).length;
  const unpaidCount = feeData.filter((s) => s.paid === 0).length;

  return (
    <DashboardLayout type="teacher" title="Fee Status">
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-300 px-3 py-1">
          {assignedGrade}
        </Badge>
        <span className="text-sm text-muted-foreground">Term 1 — 2026</span>
      </div>

      <div className="grid grid-cols-3 gap-3 md:gap-4 mb-6">
        <Card className="border-border">
          <CardContent className="p-3 md:p-5 flex items-center gap-2 md:gap-3">
            <CheckCircle className="w-6 h-6 md:w-8 md:h-8 text-green-500 shrink-0" />
            <div>
              <div className="text-lg md:text-2xl font-heading font-black text-green-600">{paidCount}</div>
              <div className="text-xs md:text-sm text-muted-foreground">Fully Paid</div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="p-3 md:p-5 flex items-center gap-2 md:gap-3">
            <AlertTriangle className="w-6 h-6 md:w-8 md:h-8 text-amber-500 shrink-0" />
            <div>
              <div className="text-lg md:text-2xl font-heading font-black text-amber-600">{partialCount}</div>
              <div className="text-xs md:text-sm text-muted-foreground">Partial Payment</div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="p-3 md:p-5 flex items-center gap-2 md:gap-3">
            <XCircle className="w-6 h-6 md:w-8 md:h-8 text-red-500 shrink-0" />
            <div>
              <div className="text-lg md:text-2xl font-heading font-black text-red-600">{unpaidCount}</div>
              <div className="text-xs md:text-sm text-muted-foreground">Not Paid</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border">
        <CardHeader>
          <CardTitle className="font-heading">Student Fee Register</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto -mx-4 md:mx-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="hidden sm:table-cell">Amount Paid</TableHead>
                <TableHead>Balance</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {feeData.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="font-mono text-xs md:text-sm text-muted-foreground">{s.student_id}</TableCell>
                  <TableCell className="font-medium text-sm">{s.full_name}</TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <span className={s.paid > 0 ? "text-green-600 font-medium" : "text-muted-foreground"}>
                      ${s.paid}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={s.balance > 0 ? "text-red-600 font-medium" : "text-green-600 font-medium"}>
                      ${Math.abs(s.balance)}
                    </span>
                  </TableCell>
                  <TableCell>
                    {s.balance <= 0 ? (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 gap-1">
                        <CheckCircle className="w-3 h-3" /> Paid
                      </Badge>
                    ) : s.paid > 0 ? (
                      <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 gap-1">
                        <AlertTriangle className="w-3 h-3" /> Partial
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 gap-1">
                        <XCircle className="w-3 h-3" /> Unpaid
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default TeacherFees;
