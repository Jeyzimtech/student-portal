import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { fetchCollection } from "@/integrations/firebase/firestore";
import { getMockTransactionsByStudent } from "@/data/mockData";

interface Transaction {
  transaction_date: string;
  description: string;
  amount: number;
  balance: number | null;
}

const StudentFinancials = () => {
  const { studentRecord } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [totals, setTotals] = useState({ fees: 0, paid: 0, outstanding: 0 });

  const computeTotals = (data: Transaction[]) => {
    const fees = data.filter((t) => t.amount < 0).reduce((s, t) => s + Math.abs(Number(t.amount)), 0);
    const paid = data.filter((t) => t.amount > 0).reduce((s, t) => s + Number(t.amount), 0);
    setTotals({ fees, paid, outstanding: fees - paid });
  };

  useEffect(() => {
    if (!studentRecord) return;

    // Load mock data immediately for speed
    const mock = getMockTransactionsByStudent(studentRecord.id);
    setTransactions(mock);
    computeTotals(mock);

    // Background fetch real data
    const fetchRealData = async () => {
      try {
        const data = await fetchCollection<Transaction>("fee_transactions", {
          filters: [{ field: "student_id", op: "==", value: studentRecord.id }],
        });
        if (data.length > 0) {
          setTransactions(data);
          computeTotals(data);
        }
      } catch (err) {
        console.log("Firestore fetch deferred for mock data", err);
      }
    };

    fetchRealData();
  }, [studentRecord]);

  return (
    <DashboardLayout type="student" title="Fee Statement">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 mb-6 md:mb-8">
        <Card className="border-border"><CardContent className="p-4 md:p-5"><div className="text-xs md:text-sm text-muted-foreground">Total Fees</div><div className="text-xl md:text-2xl font-heading font-black text-foreground">${totals.fees.toFixed(2)}</div></CardContent></Card>
        <Card className="border-border"><CardContent className="p-4 md:p-5"><div className="text-xs md:text-sm text-muted-foreground">Total Paid</div><div className="text-xl md:text-2xl font-heading font-black text-primary">${totals.paid.toFixed(2)}</div></CardContent></Card>
        <Card className="border-border"><CardContent className="p-4 md:p-5"><div className="text-xs md:text-sm text-muted-foreground">Outstanding</div><div className="text-xl md:text-2xl font-heading font-black text-accent">${totals.outstanding.toFixed(2)}</div></CardContent></Card>
      </div>

      <Card className="border-border">
        <CardHeader><CardTitle className="font-heading">Transaction History</CardTitle></CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No transactions yet.</p>
          ) : (
            <div className="overflow-x-auto -mx-4 md:mx-0">
            <Table>
              <TableHeader><TableRow><TableHead>Date</TableHead><TableHead>Description</TableHead><TableHead>Amount</TableHead><TableHead>Balance</TableHead></TableRow></TableHeader>
              <TableBody>
                {transactions.map((t, i) => (
                  <TableRow key={i}>
                    <TableCell className="text-muted-foreground whitespace-nowrap text-xs md:text-sm">{t.transaction_date}</TableCell>
                    <TableCell className="font-medium text-xs md:text-sm">{t.description}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={t.amount > 0 ? "bg-primary/15 text-primary" : "bg-accent/15 text-accent"}>
                        {t.amount > 0 ? "+" : "-"}${Math.abs(Number(t.amount))}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium text-xs md:text-sm">${Math.abs(Number(t.balance ?? 0))}</TableCell>
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

export default StudentFinancials;
