import { useEffect, useState, useRef } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Play, FileText, Upload, Download, Trash2, File, Image, FileVideo, X, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { fetchCollection } from "@/integrations/firebase/firestore";
import { storage } from "@/integrations/firebase/client";
import { ref, uploadBytesResumable, getDownloadURL, listAll, deleteObject, getMetadata } from "firebase/storage";
import { Progress } from "@/components/ui/progress";
import { MOCK_COURSES, getMockDocumentsByCourse, type MockCourse, type MockDocument } from "@/data/mockData";

interface Course {
  id: string;
  subject: string;
  title: string;
  description: string | null;
  total_lessons: number;
  progress?: number;
  thumbnail?: string;
}

interface CourseDocument {
  name: string;
  fullPath: string;
  size: number;
  contentType: string;
  timeCreated: string;
}

const FILE_ICONS: Record<string, typeof FileText> = {
  "application/pdf": FileText,
  "image/png": Image,
  "image/jpeg": Image,
  "image/gif": Image,
  "video/mp4": FileVideo,
};

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const ELearning = ({ type = "student" }: { type?: "student" | "admin" | "teacher" }) => {
  const { toast } = useToast();
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [documents, setDocuments] = useState<CourseDocument[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [loadingDocs, setLoadingDocs] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchCollection<Course>("elearning_courses").then((data) => {
      if (data.length > 0) {
        setCourses(data.map((c) => ({ ...c, progress: Math.floor(Math.random() * 100) })));
      } else {
        // Fallback to mock courses
        setCourses(MOCK_COURSES.map((c) => ({ ...c, progress: c.progress ?? Math.floor(Math.random() * 100) })));
      }
    });
  }, []);

  const fetchDocuments = async (courseId: string) => {
    setLoadingDocs(true);
    try {
      const folderRef = ref(storage, `courses/${courseId}`);
      const result = await listAll(folderRef);
      const docs: CourseDocument[] = [];
      for (const item of result.items) {
        const meta = await getMetadata(item);
        docs.push({
          name: item.name,
          fullPath: item.fullPath,
          size: meta.size,
          contentType: meta.contentType || "",
          timeCreated: meta.timeCreated,
        });
      }
      if (docs.length > 0) {
        setDocuments(docs);
      } else {
        // Fallback to mock documents
        setDocuments(getMockDocumentsByCourse(courseId));
      }
    } catch {
      // Fallback to mock documents
      setDocuments(getMockDocumentsByCourse(courseId));
    }
    setLoadingDocs(false);
  };

  const handleCourseSelect = (course: Course) => {
    setSelectedCourse(course);
    fetchDocuments(course.id);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !selectedCourse) return;
    const files = Array.from(e.target.files);
    setUploading(true);
    setUploadProgress(0);

    let completed = 0;
    for (const file of files) {
      const filePath = `courses/${selectedCourse.id}/${Date.now()}_${file.name}`;
      const storageRef = ref(storage, filePath);

      try {
        await new Promise<void>((resolve, reject) => {
          const uploadTask = uploadBytesResumable(storageRef, file);
          uploadTask.on(
            "state_changed",
            (snapshot) => {
              const pct = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
              setUploadProgress(Math.round(((completed + pct / 100) / files.length) * 100));
            },
            (error) => reject(error),
            () => {
              completed++;
              setUploadProgress(Math.round((completed / files.length) * 100));
              resolve();
            }
          );
        });
      } catch {
        toast({
          title: "Upload Failed",
          description: `${file.name} could not be uploaded`,
          variant: "destructive",
        });
      }
    }

    toast({
      title: "Upload Complete",
      description: `${completed}/${files.length} files uploaded successfully`,
    });

    setUploading(false);
    setUploadProgress(0);
    fetchDocuments(selectedCourse.id);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDelete = async (doc: CourseDocument) => {
    try {
      const fileRef = ref(storage, doc.fullPath);
      await deleteObject(fileRef);
      toast({ title: "File Deleted" });
      if (selectedCourse) fetchDocuments(selectedCourse.id);
    } catch {
      toast({ title: "Delete Failed", variant: "destructive" });
    }
  };

  const handleDownload = async (doc: CourseDocument) => {
    // For mock documents, show a toast instead of trying to download
    const isMock = MOCK_COURSES.some((c) => doc.fullPath.includes(c.id));
    if (isMock) {
      toast({ title: "Demo Mode", description: `${doc.name} — this is a demo file preview` });
      return;
    }
    try {
      const fileRef = ref(storage, doc.fullPath);
      const url = await getDownloadURL(fileRef);
      window.open(url, "_blank");
    } catch {
      toast({ title: "Download Failed", variant: "destructive" });
    }
  };

  const getFileIcon = (contentType?: string) => {
    if (!contentType) return File;
    return FILE_ICONS[contentType] || File;
  };

  const canUpload = type === "admin" || type === "teacher";

  return (
    <DashboardLayout type={type} title="E-Learning">
      {courses.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">No courses available yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {courses.map((course) => (
            <Card key={course.id} className="border-border hover:shadow-lg transition-shadow group">
              <CardContent className="p-4 md:p-6">
                <div className="flex items-start justify-between mb-4">
                  {course.thumbnail ? (
                    <div className="w-16 h-10 md:w-20 md:h-12 rounded-lg overflow-hidden border border-border shadow-sm group-hover:scale-105 transition-transform">
                      <img src={course.thumbnail} alt={course.subject} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <BookOpen className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                    </div>
                  )}
                  <Badge variant="outline" className="bg-muted text-muted-foreground text-[10px] md:text-xs">{course.total_lessons} lessons</Badge>
                </div>
                <h3 className="font-heading font-bold text-base md:text-lg text-foreground mb-1">{course.subject}</h3>
                <p className="text-xs md:text-sm text-muted-foreground mb-4 line-clamp-2">{course.description}</p>
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-muted-foreground mb-1"><span>Progress</span><span>{course.progress}%</span></div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${course.progress}%` }} />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 text-xs md:text-sm"><Play className="w-3 h-3 mr-1" /> Continue</Button>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="outline" className="border-border text-foreground text-xs md:text-sm" onClick={() => handleCourseSelect(course)}>
                        <FileText className="w-3 h-3 mr-1" /> Materials
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-[95vw] md:max-w-2xl max-h-[85vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="font-heading flex items-center gap-2 text-base md:text-lg">
                          <BookOpen className="w-5 h-5 text-primary" />
                          {course.subject} — Materials
                        </DialogTitle>
                      </DialogHeader>

                      {/* Upload Section (Admin/Teacher) */}
                      {canUpload && (
                        <div className="border-2 border-dashed border-primary/30 rounded-xl p-4 md:p-6 bg-primary/5 hover:bg-primary/10 transition-colors">
                          <div className="text-center">
                            <Upload className="w-8 h-8 md:w-10 md:h-10 text-primary/60 mx-auto mb-2" />
                            <Label htmlFor="file-upload" className="text-sm font-medium text-foreground cursor-pointer">
                              Click to upload or drag & drop
                            </Label>
                            <p className="text-xs text-muted-foreground mt-1">PDF, Images, Videos, Documents (Max 50MB each)</p>
                            <Input
                              ref={fileInputRef}
                              id="file-upload"
                              type="file"
                              multiple
                              className="hidden"
                              accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.png,.jpg,.jpeg,.gif,.mp4,.mov,.avi"
                              onChange={handleUpload}
                              disabled={uploading}
                            />
                            <Button
                              size="sm"
                              className="mt-3 bg-primary text-primary-foreground"
                              onClick={() => fileInputRef.current?.click()}
                              disabled={uploading}
                            >
                              {uploading ? (
                                <><Loader2 className="w-3 h-3 mr-1 animate-spin" /> Uploading...</>
                              ) : (
                                <><Upload className="w-3 h-3 mr-1" /> Select Files</>
                              )}
                            </Button>
                          </div>
                          {uploading && (
                            <div className="mt-4">
                              <Progress value={uploadProgress} className="h-2" />
                              <p className="text-xs text-center text-muted-foreground mt-1">{uploadProgress}% complete</p>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Documents List */}
                      <div className="space-y-2 mt-4">
                        <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                          <FileText className="w-4 h-4" /> Course Documents ({documents.length})
                        </h4>
                        {loadingDocs ? (
                          <div className="flex items-center justify-center py-8">
                            <Loader2 className="w-6 h-6 text-primary animate-spin" />
                          </div>
                        ) : documents.length === 0 ? (
                          <div className="text-center py-8 text-muted-foreground">
                            <File className="w-12 h-12 mx-auto mb-2 opacity-30" />
                            <p className="text-sm">No documents uploaded yet</p>
                            {canUpload && <p className="text-xs mt-1">Use the upload area above to add materials</p>}
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {documents.map((doc) => {
                              const Icon = getFileIcon(doc.contentType);
                              const displayName = doc.name.replace(/^\d+_/, "").replace(/_/g, " ").replace(/\.pdf$/i, "");
                              return (
                                <div key={doc.fullPath} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors group/doc">
                                  <div className="w-9 h-9 rounded-lg bg-red-500/10 flex items-center justify-center shrink-0">
                                    <Icon className="w-4 h-4 text-red-500" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-foreground truncate">{displayName}</p>
                                    <p className="text-xs text-muted-foreground">
                                      PDF • {doc.size ? formatFileSize(doc.size) : "—"}
                                    </p>
                                  </div>
                                  <div className="flex gap-1">
                                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleDownload(doc)}>
                                      <Download className="w-3.5 h-3.5" />
                                    </Button>
                                    {canUpload && (
                                      <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => handleDelete(doc)}>
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default ELearning;
