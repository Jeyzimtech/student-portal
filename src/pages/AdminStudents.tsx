import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { UserPlus, Search, Pencil, Trash2, Eye, Users, GraduationCap, Loader2, X, ChevronLeft, ChevronRight, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { fetchCollection, addDocument, updateDocument, deleteDocument } from "@/integrations/firebase/firestore";
import { MOCK_STUDENTS } from "@/data/mockData";

interface StudentRow {
  id: string;
  student_id: string;
  full_name: string;
  grade: string;
  parent_name: string | null;
  parent_phone: string | null;
  parent_email: string | null;
  date_of_birth: string | null;
  address: string | null;
  status: string;
  created_at: string;
}

interface StudentForm {
  student_id: string;
  full_name: string;
  grade: string;
  parent_name: string;
  parent_phone: string;
  parent_email: string;
  date_of_birth: string;
  address: string;
  status: string;
}

const emptyForm: StudentForm = {
  student_id: "",
  full_name: "",
  grade: "",
  parent_name: "",
  parent_phone: "",
  parent_email: "",
  date_of_birth: "",
  address: "",
  status: "Active",
};

const grades = ["Grade 1A", "Grade 1B", "Grade 2A", "Grade 2B", "Grade 3A", "Grade 3B", "Grade 4A", "Grade 4B", "Grade 5A", "Grade 5B", "Grade 6A", "Grade 6B", "Grade 7A", "Grade 7B"];
const ITEMS_PER_PAGE = 10;

const AdminStudents = () => {
  const { toast } = useToast();
  const [students, setStudents] = useState<StudentRow[]>([]);
  const [search, setSearch] = useState("");
  const [filterGrade, setFilterGrade] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [formData, setFormData] = useState<StudentForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [viewingStudent, setViewingStudent] = useState<StudentRow | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const data = await fetchCollection<StudentRow>("students", {
        orderByField: "full_name",
      });
      setStudents(data.length > 0 ? data : MOCK_STUDENTS);
    } catch {
      setStudents(MOCK_STUDENTS);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const filtered = students.filter((s) => {
    const matchSearch = s.full_name.toLowerCase().includes(search.toLowerCase()) ||
      s.student_id.toLowerCase().includes(search.toLowerCase()) ||
      (s.parent_name?.toLowerCase().includes(search.toLowerCase()) ?? false);
    const matchGrade = filterGrade === "all" || s.grade === filterGrade;
    const matchStatus = filterStatus === "all" || s.status === filterStatus;
    return matchSearch && matchGrade && matchStatus;
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const resetForm = () => {
    setFormData(emptyForm);
    setEditingId(null);
  };

  const openAddDialog = () => {
    resetForm();
    const nextNum = students.length + 1;
    setFormData({ ...emptyForm, student_id: `CABS-${String(nextNum).padStart(4, "0")}` });
    setDialogOpen(true);
  };

  const openEditDialog = (student: StudentRow) => {
    setEditingId(student.id);
    setFormData({
      student_id: student.student_id,
      full_name: student.full_name,
      grade: student.grade,
      parent_name: student.parent_name || "",
      parent_phone: student.parent_phone || "",
      parent_email: student.parent_email || "",
      date_of_birth: student.date_of_birth || "",
      address: student.address || "",
      status: student.status,
    });
    setDialogOpen(true);
  };

  const openViewDialog = (student: StudentRow) => {
    setViewingStudent(student);
    setViewDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.full_name.trim() || !formData.student_id.trim() || !formData.grade) {
      toast({ title: "Missing Fields", description: "Name, Student ID, and Grade are required", variant: "destructive" });
      return;
    }

    setSaving(true);
    const docData = {
      student_id: formData.student_id,
      full_name: formData.full_name,
      grade: formData.grade,
      parent_name: formData.parent_name || null,
      parent_phone: formData.parent_phone || null,
      parent_email: formData.parent_email || null,
      date_of_birth: formData.date_of_birth || null,
      address: formData.address || null,
      status: formData.status,
    };

    try {
      if (editingId) {
        await updateDocument("students", editingId, docData);
        toast({ title: "Student Updated", description: `${formData.full_name} has been updated` });
      } else {
        await addDocument("students", docData);
        toast({ title: "Student Added", description: `${formData.full_name} has been enrolled` });
      }
      setDialogOpen(false);
      resetForm();
      fetchStudents();
    } catch (err: unknown) {
      const error = err as { message?: string };
      toast({ title: editingId ? "Error updating student" : "Error adding student", description: error.message, variant: "destructive" });
    }
    setSaving(false);
  };

  const handleDelete = async (student: StudentRow) => {
    try {
      await deleteDocument("students", student.id);
      toast({ title: "Student Removed", description: `${student.full_name} has been removed` });
      fetchStudents();
    } catch (err: unknown) {
      const error = err as { message?: string };
      toast({ title: "Error deleting student", description: error.message, variant: "destructive" });
    }
  };

  const activeCount = students.filter((s) => s.status === "Active").length;
  const inactiveCount = students.filter((s) => s.status !== "Active").length;

  return (
    <DashboardLayout type="admin" title="Manage Students">
      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card className="border-border px-4 py-3 bg-primary/5">
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-primary" />
            <div>
              <div className="text-xl font-heading font-black">{students.length}</div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Total Enrolled</div>
            </div>
          </div>
        </Card>
        <Card className="border-border px-4 py-3 bg-green-500/5">
          <div className="flex items-center gap-3">
            <GraduationCap className="w-5 h-5 text-green-500" />
            <div>
              <div className="text-xl font-heading font-black">{activeCount}</div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Active Members</div>
            </div>
          </div>
        </Card>
        <Card className="border-border px-4 py-3 bg-orange-500/5">
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-orange-500" />
            <div>
              <div className="text-xl font-heading font-black">{inactiveCount}</div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Inactive/Pending</div>
            </div>
          </div>
        </Card>
      </div>
      
      {/* Class Overview / Class Selector */}
      <div className="mb-6 overflow-x-auto pb-2">
        <div className="flex gap-4 min-w-max">
          {["Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5", "Grade 6", "Grade 7"].map((gradePrefix) => {
            const count = students.filter(s => s.grade.startsWith(gradePrefix)).length;
            const isActive = filterGrade.startsWith(gradePrefix);
            return (
              <button
                key={gradePrefix}
                onClick={() => setFilterGrade(isActive ? "all" : `${gradePrefix}A`)}
                className={`p-3 rounded-xl border transition-all flex flex-col items-center gap-1 min-w-[100px] ${
                  isActive 
                    ? "bg-primary border-primary text-primary-foreground shadow-md scale-105" 
                    : "bg-card border-border text-foreground hover:bg-muted"
                }`}
              >
                <GraduationCap className={`w-5 h-5 ${isActive ? "text-primary-foreground" : "text-primary"}`} />
                <span className="text-xs font-bold">{gradePrefix}</span>
                <span className={`text-[10px] opacity-70 ${isActive ? "text-primary-foreground" : ""}`}>{count} Students</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Search, Filters, and Add Button */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 items-start md:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-3 flex-1">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search by name, ID, or parent..." className="pl-10" value={search} onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }} />
          </div>
          <Select value={filterGrade} onValueChange={(v) => { setFilterGrade(v); setCurrentPage(1); }}>
            <SelectTrigger className="w-full sm:w-40">
              <Filter className="w-3 h-3 mr-1" /><SelectValue placeholder="Grade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Grades</SelectItem>
              {grades.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={(v) => { setFilterStatus(v); setCurrentPage(1); }}>
            <SelectTrigger className="w-full sm:w-36">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
              <SelectItem value="Transferred">Transferred</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={openAddDialog} className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold shrink-0">
          <UserPlus className="w-4 h-4 mr-2" /> Add Student
        </Button>
      </div>

      {/* Student Table */}
      <Card className="border-border">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="font-heading">Student Register</CardTitle>
          <span className="text-sm text-muted-foreground">{filtered.length} student{filtered.length !== 1 ? "s" : ""} found</span>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground">No students found.</p>
              <p className="text-xs text-muted-foreground mt-1">Try adjusting your search or filters</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto -mx-4 md:mx-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Grade</TableHead>
                    <TableHead className="hidden md:table-cell">Parent/Guardian</TableHead>
                    <TableHead className="hidden md:table-cell">Contact</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginated.map((s) => (
                    <TableRow key={s.id} className="group hover:bg-muted/50">
                      <TableCell className="font-mono text-xs font-medium">{s.student_id}</TableCell>
                      <TableCell className="font-medium">{s.full_name}</TableCell>
                      <TableCell><Badge variant="outline" className="bg-muted">{s.grade}</Badge></TableCell>
                      <TableCell className="hidden md:table-cell text-muted-foreground">{s.parent_name || "—"}</TableCell>
                      <TableCell className="hidden md:table-cell text-muted-foreground text-xs">{s.parent_phone || "—"}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={
                          s.status === "Active" ? "bg-green-500/15 text-green-600 border-green-500/30" :
                          s.status === "Transferred" ? "bg-blue-500/15 text-blue-600 border-blue-500/30" :
                          "bg-orange-500/15 text-orange-600 border-orange-500/30"
                        }>
                          {s.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-1 justify-end md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                          <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => openViewDialog(s)} title="View Details">
                            <Eye className="w-3.5 h-3.5" />
                          </Button>
                          <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => openEditDialog(s)} title="Edit Student">
                            <Pencil className="w-3.5 h-3.5" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive hover:text-destructive" title="Delete Student">
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Remove {s.full_name}?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will permanently remove the student record. This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={() => handleDelete(s)}>
                                  Remove
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                  <span className="text-sm text-muted-foreground">
                    Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} of {filtered.length}
                  </span>
                  <div className="flex gap-1">
                    <Button size="icon" variant="outline" className="h-8 w-8" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                      let page: number;
                      if (totalPages <= 5) { page = i + 1; }
                      else if (currentPage <= 3) { page = i + 1; }
                      else if (currentPage >= totalPages - 2) { page = totalPages - 4 + i; }
                      else { page = currentPage - 2 + i; }
                      return (
                        <Button key={page} size="icon" variant={page === currentPage ? "default" : "outline"} className="h-8 w-8 text-xs" onClick={() => setCurrentPage(page)}>
                          {page}
                        </Button>
                      );
                    })}
                    <Button size="icon" variant="outline" className="h-8 w-8" disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Student Dialog */}
      <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-heading flex items-center gap-2">
              {editingId ? <Pencil className="w-5 h-5 text-primary" /> : <UserPlus className="w-5 h-5 text-primary" />}
              {editingId ? "Edit Student" : "Add New Student"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="student-id">Student ID *</Label>
                <Input id="student-id" value={formData.student_id} onChange={(e) => setFormData(f => ({ ...f, student_id: e.target.value }))} placeholder="CABS-0001" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(v) => setFormData(f => ({ ...f, status: v }))}>
                  <SelectTrigger id="status"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                    <SelectItem value="Transferred">Transferred</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="full-name">Full Name *</Label>
              <Input id="full-name" value={formData.full_name} onChange={(e) => setFormData(f => ({ ...f, full_name: e.target.value }))} placeholder="Enter student's full name" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="grade">Grade *</Label>
                <Select value={formData.grade} onValueChange={(v) => setFormData(f => ({ ...f, grade: v }))}>
                  <SelectTrigger id="grade"><SelectValue placeholder="Select grade" /></SelectTrigger>
                  <SelectContent>{grades.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dob">Date of Birth</Label>
                <Input id="dob" type="date" value={formData.date_of_birth} onChange={(e) => setFormData(f => ({ ...f, date_of_birth: e.target.value }))} />
              </div>
            </div>

            <div className="border-t border-border pt-4">
              <h4 className="text-sm font-semibold text-foreground mb-3">Parent/Guardian Details</h4>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="parent-name">Parent Name</Label>
                  <Input id="parent-name" value={formData.parent_name} onChange={(e) => setFormData(f => ({ ...f, parent_name: e.target.value }))} placeholder="Full name of parent or guardian" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="parent-phone">Phone</Label>
                    <Input id="parent-phone" type="tel" value={formData.parent_phone} onChange={(e) => setFormData(f => ({ ...f, parent_phone: e.target.value }))} placeholder="+263 7XX XXX XXX" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="parent-email">Email</Label>
                    <Input id="parent-email" type="email" value={formData.parent_email} onChange={(e) => setFormData(f => ({ ...f, parent_email: e.target.value }))} placeholder="email@example.com" />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input id="address" value={formData.address} onChange={(e) => setFormData(f => ({ ...f, address: e.target.value }))} placeholder="Home address" />
            </div>
          </div>

          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleSave} disabled={saving} className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold">
              {saving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</> : editingId ? "Update Student" : "Add Student"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Student Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-heading flex items-center gap-2">
              <Eye className="w-5 h-5 text-primary" /> Student Details
            </DialogTitle>
          </DialogHeader>
          {viewingStudent && (
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/50">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                  <GraduationCap className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-lg">{viewingStudent.full_name}</h3>
                  <p className="text-sm text-muted-foreground font-mono">{viewingStudent.student_id}</p>
                </div>
                <Badge variant="outline" className={
                  viewingStudent.status === "Active" ? "bg-green-500/15 text-green-600 ml-auto" : "bg-orange-500/15 text-orange-600 ml-auto"
                }>
                  {viewingStudent.status}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-muted-foreground">Grade:</span><br /><span className="font-medium">{viewingStudent.grade}</span></div>
                <div><span className="text-muted-foreground">Date of Birth:</span><br /><span className="font-medium">{viewingStudent.date_of_birth || "Not provided"}</span></div>
                <div><span className="text-muted-foreground">Parent/Guardian:</span><br /><span className="font-medium">{viewingStudent.parent_name || "Not provided"}</span></div>
                <div><span className="text-muted-foreground">Parent Phone:</span><br /><span className="font-medium">{viewingStudent.parent_phone || "Not provided"}</span></div>
                <div><span className="text-muted-foreground">Parent Email:</span><br /><span className="font-medium">{viewingStudent.parent_email || "Not provided"}</span></div>
                <div><span className="text-muted-foreground">Address:</span><br /><span className="font-medium">{viewingStudent.address || "Not provided"}</span></div>
                <div className="col-span-2"><span className="text-muted-foreground">Enrolled:</span><br /><span className="font-medium">{viewingStudent.created_at ? new Date(viewingStudent.created_at).toLocaleDateString("en-ZW", { year: "numeric", month: "long", day: "numeric" }) : "—"}</span></div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => { setViewDialogOpen(false); openEditDialog(viewingStudent); }}>
                  <Pencil className="w-3 h-3 mr-1" /> Edit
                </Button>
                <DialogClose asChild>
                  <Button>Close</Button>
                </DialogClose>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default AdminStudents;
