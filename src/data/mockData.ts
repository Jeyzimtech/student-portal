/**
 * Mock/seed data for demo mode.
 * Used as fallback when Firestore collections are empty.
 */

// ─── Students ────────────────────────────────────────────────────────────────
export interface MockStudent {
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

export const MOCK_STUDENTS: MockStudent[] = [
  {
    id: "demo-student-1",
    student_id: "CABS-0001",
    full_name: "Tatenda Chigwedere",
    grade: "Grade 7A",
    parent_name: "Mr. James Chigwedere",
    parent_phone: "+263 772 345 678",
    parent_email: "j.chigwedere@gmail.com",
    date_of_birth: "2014-03-15",
    address: "12 Samora Machel Ave, Harare",
    status: "Active",
    created_at: "2025-01-10T08:00:00Z",
  },
  {
    id: "demo-student-2",
    student_id: "CABS-0002",
    full_name: "Ruvimbo Moyo",
    grade: "Grade 7A",
    parent_name: "Mrs. Grace Moyo",
    parent_phone: "+263 773 456 789",
    parent_email: "g.moyo@yahoo.com",
    date_of_birth: "2014-06-22",
    address: "45 Herbert Chitepo St, Harare",
    status: "Active",
    created_at: "2025-01-10T08:00:00Z",
  },
  {
    id: "demo-student-3",
    student_id: "CABS-0003",
    full_name: "Kudzai Mutasa",
    grade: "Grade 7A",
    parent_name: "Mr. Peter Mutasa",
    parent_phone: "+263 771 567 890",
    parent_email: "p.mutasa@gmail.com",
    date_of_birth: "2014-01-08",
    address: "78 Josiah Tongogara Ave, Harare",
    status: "Active",
    created_at: "2025-01-12T08:00:00Z",
  },
  {
    id: "demo-student-4",
    student_id: "CABS-0004",
    full_name: "Tinotenda Ncube",
    grade: "Grade 6A",
    parent_name: "Mrs. Sarah Ncube",
    parent_phone: "+263 774 678 901",
    parent_email: "s.ncube@outlook.com",
    date_of_birth: "2015-09-30",
    address: "23 Leopold Takawira St, Harare",
    status: "Active",
    created_at: "2025-01-15T08:00:00Z",
  },
  {
    id: "demo-student-5",
    student_id: "CABS-0005",
    full_name: "Nyasha Dziva",
    grade: "Grade 6A",
    parent_name: "Mr. Tapiwa Dziva",
    parent_phone: "+263 775 789 012",
    parent_email: "t.dziva@gmail.com",
    date_of_birth: "2015-04-17",
    address: "56 Julius Nyerere Way, Harare",
    status: "Active",
    created_at: "2025-01-15T08:00:00Z",
  },
  {
    id: "demo-student-6",
    student_id: "CABS-0006",
    full_name: "Tariro Mhandu",
    grade: "Grade 5A",
    parent_name: "Mrs. Tendai Mhandu",
    parent_phone: "+263 776 890 123",
    parent_email: null,
    date_of_birth: "2016-11-05",
    address: "34 Kwame Nkrumah Ave, Harare",
    status: "Active",
    created_at: "2025-02-01T08:00:00Z",
  },
  {
    id: "demo-student-7",
    student_id: "CABS-0007",
    full_name: "Farai Chipanga",
    grade: "Grade 5A",
    parent_name: "Mr. Moses Chipanga",
    parent_phone: "+263 777 901 234",
    parent_email: "m.chipanga@gmail.com",
    date_of_birth: "2016-07-20",
    address: "89 Robert Mugabe Rd, Harare",
    status: "Active",
    created_at: "2025-02-01T08:00:00Z",
  },
  {
    id: "demo-student-8",
    student_id: "CABS-0008",
    full_name: "Chiedza Mapfumo",
    grade: "Grade 4A",
    parent_name: "Mrs. Ruth Mapfumo",
    parent_phone: "+263 778 012 345",
    parent_email: "r.mapfumo@yahoo.com",
    date_of_birth: "2017-02-14",
    address: "67 Nelson Mandela Ave, Harare",
    status: "Active",
    created_at: "2025-02-05T08:00:00Z",
  },
  {
    id: "demo-student-9",
    student_id: "CABS-0009",
    full_name: "Tawanda Zimuto",
    grade: "Grade 3A",
    parent_name: "Mr. David Zimuto",
    parent_phone: "+263 779 123 456",
    parent_email: null,
    date_of_birth: "2018-05-28",
    address: "12 Simon Muzenda St, Harare",
    status: "Active",
    created_at: "2025-02-10T08:00:00Z",
  },
  {
    id: "demo-student-10",
    student_id: "CABS-0010",
    full_name: "Rumbidzai Gara",
    grade: "Grade 7A",
    parent_name: "Mrs. Florence Gara",
    parent_phone: "+263 770 234 567",
    parent_email: "f.gara@gmail.com",
    date_of_birth: "2014-12-02",
    address: "45 Jason Moyo Ave, Harare",
    status: "Inactive",
    created_at: "2025-01-10T08:00:00Z",
  },
  {
    id: "demo-student-11",
    student_id: "CABS-0011",
    full_name: "Blessing Chirwa",
    grade: "Grade 6A",
    parent_name: "Mr. Emmanuel Chirwa",
    parent_phone: "+263 771 345 678",
    parent_email: "e.chirwa@outlook.com",
    date_of_birth: "2015-08-11",
    address: "78 Chinhoyi St, Harare",
    status: "Active",
    created_at: "2025-01-18T08:00:00Z",
  },
  {
    id: "demo-student-12",
    student_id: "CABS-0012",
    full_name: "Takudzwa Manyika",
    grade: "Grade 4A",
    parent_name: "Mrs. Joy Manyika",
    parent_phone: "+263 772 456 789",
    parent_email: null,
    date_of_birth: "2017-10-19",
    address: "90 Angwa St, Harare",
    status: "Active",
    created_at: "2025-02-08T08:00:00Z",
  },
];

// ─── Results for Tatenda Chigwedere (demo student) ───────────────────────────
export interface MockResult {
  id: string;
  student_id: string;
  subject: string;
  mark: number;
  grade: string;
  comment: string | null;
  term: number;
  year: number;
}

export const MOCK_RESULTS: MockResult[] = [
  // ── Tatenda Chigwedere — Grade 7A (demo-student-1) ──
  { id: "r1", student_id: "demo-student-1", subject: "Mathematics", mark: 82, grade: "1", comment: "Excellent problem-solving skills", term: 1, year: 2026 },
  { id: "r2", student_id: "demo-student-1", subject: "English", mark: 75, grade: "2", comment: "Good essay writing, improve grammar", term: 1, year: 2026 },
  { id: "r3", student_id: "demo-student-1", subject: "Shona", mark: 88, grade: "1", comment: "Outstanding performance", term: 1, year: 2026 },
  { id: "r4", student_id: "demo-student-1", subject: "Science", mark: 67, grade: "3", comment: "Good understanding of concepts", term: 1, year: 2026 },
  { id: "r5", student_id: "demo-student-1", subject: "Social Studies", mark: 73, grade: "2", comment: "Well-researched projects", term: 1, year: 2026 },
  { id: "r6", student_id: "demo-student-1", subject: "ICT", mark: 91, grade: "1", comment: "Exceptional practical skills", term: 1, year: 2026 },
  { id: "r7", student_id: "demo-student-1", subject: "Agriculture", mark: 65, grade: "3", comment: "Needs more fieldwork practice", term: 1, year: 2026 },
  { id: "r8", student_id: "demo-student-1", subject: "P.E.", mark: 85, grade: "1", comment: "Very athletic and disciplined", term: 1, year: 2026 },

  // ── Ruvimbo Moyo — Grade 7A (demo-student-2) ──
  { id: "r9",  student_id: "demo-student-2", subject: "Mathematics", mark: 71, grade: "2", comment: "Good analytical skills", term: 1, year: 2026 },
  { id: "r10", student_id: "demo-student-2", subject: "English", mark: 89, grade: "1", comment: "Exceptional vocabulary and fluency", term: 1, year: 2026 },
  { id: "r11", student_id: "demo-student-2", subject: "Shona", mark: 78, grade: "2", comment: "Consistent performance", term: 1, year: 2026 },
  { id: "r12", student_id: "demo-student-2", subject: "Science", mark: 62, grade: "3", comment: "Needs to improve lab work", term: 1, year: 2026 },
  { id: "r13", student_id: "demo-student-2", subject: "Social Studies", mark: 84, grade: "1", comment: "Excellent research skills", term: 1, year: 2026 },
  { id: "r14", student_id: "demo-student-2", subject: "ICT", mark: 56, grade: "4", comment: "Improving steadily", term: 1, year: 2026 },
  { id: "r15", student_id: "demo-student-2", subject: "Agriculture", mark: 72, grade: "2", comment: "Good practical knowledge", term: 1, year: 2026 },
  { id: "r16", student_id: "demo-student-2", subject: "P.E.", mark: 68, grade: "3", comment: "Good effort in team sports", term: 1, year: 2026 },

  // ── Kudzai Mutasa — Grade 7A (demo-student-3) ──
  { id: "r17", student_id: "demo-student-3", subject: "Mathematics", mark: 94, grade: "1", comment: "Top of the class", term: 1, year: 2026 },
  { id: "r18", student_id: "demo-student-3", subject: "English", mark: 68, grade: "3", comment: "Good reading comprehension", term: 1, year: 2026 },
  { id: "r19", student_id: "demo-student-3", subject: "Shona", mark: 74, grade: "2", comment: "Well spoken", term: 1, year: 2026 },
  { id: "r20", student_id: "demo-student-3", subject: "Science", mark: 88, grade: "1", comment: "Brilliant scientific mind", term: 1, year: 2026 },
  { id: "r21", student_id: "demo-student-3", subject: "Social Studies", mark: 59, grade: "4", comment: "Needs to participate more in discussions", term: 1, year: 2026 },
  { id: "r22", student_id: "demo-student-3", subject: "ICT", mark: 82, grade: "1", comment: "Very capable with technology", term: 1, year: 2026 },
  { id: "r23", student_id: "demo-student-3", subject: "Agriculture", mark: 55, grade: "4", comment: "Fair understanding", term: 1, year: 2026 },
  { id: "r24", student_id: "demo-student-3", subject: "P.E.", mark: 76, grade: "2", comment: "Good sportsmanship", term: 1, year: 2026 },

  // ── Tinotenda Ncube — Grade 6A (demo-student-4) ──
  { id: "r32", student_id: "demo-student-4", subject: "Science", mark: 79, grade: "2", comment: "Good practical work", term: 1, year: 2026 },
  { id: "r33", student_id: "demo-student-4", subject: "Agriculture", mark: 72, grade: "2", comment: "Strong understanding", term: 1, year: 2026 },
  { id: "r34", student_id: "demo-student-4", subject: "ICT", mark: 95, grade: "1", comment: "Exceptional computing skills", term: 1, year: 2026 },
  { id: "r25", student_id: "demo-student-4", subject: "Mathematics", mark: 78, grade: "2", comment: "Solid performance", term: 1, year: 2026 },
  { id: "r26", student_id: "demo-student-4", subject: "English", mark: 82, grade: "1", comment: "Excellent writing", term: 1, year: 2026 },

  // ── Tawanda Zimuto — Grade 3A (demo-student-9) ──
  { id: "r35", student_id: "demo-student-9", subject: "Mathematics", mark: 84, grade: "1", comment: "Quick with numbers", term: 1, year: 2026 },
  { id: "r36", student_id: "demo-student-9", subject: "English", mark: 71, grade: "2", comment: "Good reading ability", term: 1, year: 2026 },
  { id: "r37", student_id: "demo-student-9", subject: "Science", mark: 63, grade: "3", comment: "Curious and asks good questions", term: 1, year: 2026 },

  // ── General Mock Data ──
  { id: "r27", student_id: "demo-student-5", subject: "Mathematics", mark: 65, grade: "3", comment: "Needs consistent practice", term: 1, year: 2026 },
  { id: "r28", student_id: "demo-student-5", subject: "English", mark: 70, grade: "2", comment: "Good progress", term: 1, year: 2026 },
  { id: "r29", student_id: "demo-student-6", subject: "Agriculture", mark: 88, grade: "1", comment: "Exceptional fieldwork", term: 1, year: 2026 },
  { id: "r30", student_id: "demo-student-7", subject: "Science", mark: 92, grade: "1", comment: "Outstanding academic ability", term: 1, year: 2026 },
  { id: "r31", student_id: "demo-student-8", subject: "Social Studies", mark: 74, grade: "2", comment: "Great map reading skills", term: 1, year: 2026 },
];

// ─── Fee Transactions for Tatenda Chigwedere ─────────────────────────────────
export interface MockTransaction {
  id: string;
  student_id: string;
  transaction_date: string;
  description: string;
  amount: number;
  balance: number;
  payment_method?: string;
}

export const MOCK_TRANSACTIONS: MockTransaction[] = [
  { id: "t1", student_id: "demo-student-1", transaction_date: "2026-01-10", description: "Term 1 Tuition Fee", amount: -850, balance: -850, payment_method: "Invoice" },
  { id: "t2", student_id: "demo-student-1", transaction_date: "2026-01-10", description: "Sports Levy", amount: -50, balance: -900, payment_method: "Invoice" },
  { id: "t3", student_id: "demo-student-1", transaction_date: "2026-01-10", description: "Computer Lab Fee", amount: -75, balance: -975, payment_method: "Invoice" },
  { id: "t4", student_id: "demo-student-1", transaction_date: "2026-01-15", description: "EcoCash Payment", amount: 500, balance: -475, payment_method: "EcoCash" },
  { id: "t5", student_id: "demo-student-1", transaction_date: "2026-02-20", description: "Bank Transfer", amount: 300, balance: -175, payment_method: "Bank Transfer" },
  { id: "t6", student_id: "demo-student-1", transaction_date: "2026-03-05", description: "Cash Payment", amount: 100, balance: -75, payment_method: "Cash" },
];

// ─── Helper: get students by grade (for results upload) ──────────────────────
export function getMockStudentsByGrade(grade: string): MockStudent[] {
  return MOCK_STUDENTS.filter((s) => s.grade === grade && s.status === "Active");
}

// ─── Helper: get results by student_id ───────────────────────────────────────
export function getMockResultsByStudent(studentId: string): MockResult[] {
  return MOCK_RESULTS.filter((r) => r.student_id === studentId);
}

// ─── Helper: get transactions by student_id ──────────────────────────────────
export function getMockTransactionsByStudent(studentId: string): MockTransaction[] {
  return MOCK_TRANSACTIONS.filter((t) => t.student_id === studentId);
}

// ─── E-Learning Courses ──────────────────────────────────────────────────────
export interface MockCourse {
  id: string;
  subject: string;
  title: string;
  description: string;
  total_lessons: number;
  grade: string;
  progress?: number;
  thumbnail?: string;
}

export const MOCK_COURSES: MockCourse[] = [
  {
    id: "course-math-7",
    subject: "Mathematics",
    title: "Grade 7 Mathematics",
    description: "Comprehensive mathematics covering algebra, geometry, fractions, and problem-solving strategies.",
    total_lessons: 24,
    grade: "Grade 7A",
    progress: 72,
    thumbnail: "/thumbnails/math.png",
  },
  {
    id: "course-eng-7",
    subject: "English",
    title: "Grade 7 English Language",
    description: "English language arts including reading comprehension, creative writing, grammar, and oral skills.",
    total_lessons: 20,
    grade: "Grade 7A",
    progress: 58,
  },
  {
    id: "course-shona-7",
    subject: "Shona",
    title: "Grade 7 Shona",
    description: "Shona language studies covering reading, writing, poetry analysis, and cultural traditions.",
    total_lessons: 18,
    grade: "Grade 7A",
    progress: 85,
    thumbnail: "/thumbnails/shona.png",
  },
  {
    id: "course-heritage-7",
    subject: "Heritage Studies",
    title: "Grade 7 Heritage Studies",
    description: "Learning about the rich history and culture of Zimbabwe, from Great Zimbabwe to the modern flag.",
    total_lessons: 15,
    grade: "Grade 7A",
    progress: 30,
    thumbnail: "/thumbnails/heritage.png",
  },
  {
    id: "course-sci-7",
    subject: "Science",
    title: "Grade 7 General Science",
    description: "Exploring biology, chemistry, and physics foundations including experiments and environmental science.",
    total_lessons: 22,
    grade: "Grade 7A",
    progress: 45,
  },
  {
    id: "course-ict-7",
    subject: "ICT",
    title: "Grade 7 Computer Studies",
    description: "Introduction to computing, basic programming, internet safety, and digital literacy skills.",
    total_lessons: 16,
    grade: "Grade 7A",
    progress: 92,
  },
  {
    id: "course-ss-7",
    subject: "Social Studies",
    title: "Grade 7 Social Studies",
    description: "Geography, history of Zimbabwe and Africa, civic education, and map reading skills.",
    total_lessons: 18,
    grade: "Grade 7A",
    progress: 63,
  },
  {
    id: "course-math-5",
    subject: "Mathematics",
    title: "Grade 5 Mathematics",
    description: "Foundations of multiplication, division, and basic fractions.",
    total_lessons: 15,
    grade: "Grade 5A",
    progress: 40,
    thumbnail: "/thumbnails/math.png",
  },
  {
    id: "course-eng-5",
    subject: "English",
    title: "Grade 5 English",
    description: "Developing reading fluency and basic creative writing skills.",
    total_lessons: 12,
    grade: "Grade 5A",
    progress: 65,
  },
  {
    id: "course-heritage-5",
    subject: "Heritage Studies",
    title: "Grade 5 Heritage Studies",
    description: "Introduction to Zimbabwean heritage and cultural values.",
    total_lessons: 10,
    grade: "Grade 5A",
    progress: 50,
    thumbnail: "/thumbnails/heritage.png",
  },
];

// ─── Mock Documents (simulated files for each course) ────────────────────────
export interface MockDocument {
  name: string;
  fullPath: string;
  size: number;
  contentType: string;
  timeCreated: string;
  courseId: string;
}

export const MOCK_DOCUMENTS: MockDocument[] = [
  // Mathematics
  { name: "Term_1_Algebra_Notes.pdf", fullPath: "courses/course-math-7/Term_1_Algebra_Notes.pdf", size: 524288, contentType: "application/pdf", timeCreated: "2026-01-15T08:00:00Z", courseId: "course-math-7" },
  { name: "Geometry_Worksheet.pdf", fullPath: "courses/course-math-7/Geometry_Worksheet.pdf", size: 312000, contentType: "application/pdf", timeCreated: "2026-01-20T08:00:00Z", courseId: "course-math-7" },
  { name: "Fractions_Practice_Test.pdf", fullPath: "courses/course-math-7/Fractions_Practice_Test.pdf", size: 198000, contentType: "application/pdf", timeCreated: "2026-02-05T08:00:00Z", courseId: "course-math-7" },

  // English
  { name: "Creative_Writing_Guide.pdf", fullPath: "courses/course-eng-7/Creative_Writing_Guide.pdf", size: 450000, contentType: "application/pdf", timeCreated: "2026-01-12T08:00:00Z", courseId: "course-eng-7" },
  { name: "Grammar_Rules_Handbook.pdf", fullPath: "courses/course-eng-7/Grammar_Rules_Handbook.pdf", size: 680000, contentType: "application/pdf", timeCreated: "2026-01-18T08:00:00Z", courseId: "course-eng-7" },
  { name: "Reading_Comprehension_Exercises.pdf", fullPath: "courses/course-eng-7/Reading_Comprehension_Exercises.pdf", size: 275000, contentType: "application/pdf", timeCreated: "2026-02-01T08:00:00Z", courseId: "course-eng-7" },

  // Shona
  { name: "Shona_Poetry_Analysis.pdf", fullPath: "courses/course-shona-7/Shona_Poetry_Analysis.pdf", size: 390000, contentType: "application/pdf", timeCreated: "2026-01-14T08:00:00Z", courseId: "course-shona-7" },
  { name: "Ndyinorerwa_Study_Guide.pdf", fullPath: "courses/course-shona-7/Ndyinorerwa_Study_Guide.pdf", size: 520000, contentType: "application/pdf", timeCreated: "2026-01-22T08:00:00Z", courseId: "course-shona-7" },
  { name: "Mazwi_Vocabulary_List.pdf", fullPath: "courses/course-shona-7/Mazwi_Vocabulary_List.pdf", size: 145000, contentType: "application/pdf", timeCreated: "2026-02-03T08:00:00Z", courseId: "course-shona-7" },

  // Science
  { name: "Biology_Cell_Structure.pdf", fullPath: "courses/course-sci-7/Biology_Cell_Structure.pdf", size: 610000, contentType: "application/pdf", timeCreated: "2026-01-16T08:00:00Z", courseId: "course-sci-7" },
  { name: "Chemistry_Elements_Table.pdf", fullPath: "courses/course-sci-7/Chemistry_Elements_Table.pdf", size: 430000, contentType: "application/pdf", timeCreated: "2026-01-25T08:00:00Z", courseId: "course-sci-7" },
  { name: "Physics_Forces_Worksheet.pdf", fullPath: "courses/course-sci-7/Physics_Forces_Worksheet.pdf", size: 280000, contentType: "application/pdf", timeCreated: "2026-02-08T08:00:00Z", courseId: "course-sci-7" },

  // ICT
  { name: "Introduction_to_Coding.pdf", fullPath: "courses/course-ict-7/Introduction_to_Coding.pdf", size: 750000, contentType: "application/pdf", timeCreated: "2026-01-13T08:00:00Z", courseId: "course-ict-7" },
  { name: "Internet_Safety_Guide.pdf", fullPath: "courses/course-ict-7/Internet_Safety_Guide.pdf", size: 320000, contentType: "application/pdf", timeCreated: "2026-01-20T08:00:00Z", courseId: "course-ict-7" },
  { name: "MS_Word_Basics_Tutorial.pdf", fullPath: "courses/course-ict-7/MS_Word_Basics_Tutorial.pdf", size: 410000, contentType: "application/pdf", timeCreated: "2026-02-10T08:00:00Z", courseId: "course-ict-7" },

  // Social Studies
  { name: "Zimbabwe_History_Chapter1.pdf", fullPath: "courses/course-ss-7/Zimbabwe_History_Chapter1.pdf", size: 580000, contentType: "application/pdf", timeCreated: "2026-01-17T08:00:00Z", courseId: "course-ss-7" },
  { name: "Map_Reading_Skills.pdf", fullPath: "courses/course-ss-7/Map_Reading_Skills.pdf", size: 490000, contentType: "application/pdf", timeCreated: "2026-01-24T08:00:00Z", courseId: "course-ss-7" },
  { name: "Civic_Education_Notes.pdf", fullPath: "courses/course-ss-7/Civic_Education_Notes.pdf", size: 260000, contentType: "application/pdf", timeCreated: "2026-02-06T08:00:00Z", courseId: "course-ss-7" },
  
  // Heritage Studies
  { name: "Zimbabwe_National_Anthem_Lyrics.pdf", fullPath: "courses/course-heritage-7/National_Anthem.pdf", size: 124000, contentType: "application/pdf", timeCreated: "2026-01-10T08:00:00Z", courseId: "course-heritage-7" },
  { name: "Great_Zimbabwe_History.pdf", fullPath: "courses/course-heritage-7/Great_Zimbabwe.pdf", size: 854000, contentType: "application/pdf", timeCreated: "2026-01-15T08:00:00Z", courseId: "course-heritage-7" },
  { name: "Heritage_Values_Intro.pdf", fullPath: "courses/course-heritage-5/Values_Intro.pdf", size: 312000, contentType: "application/pdf", timeCreated: "2026-02-01T08:00:00Z", courseId: "course-heritage-5" },
];

// ─── Helper: get documents by course ID ──────────────────────────────────────
export function getMockDocumentsByCourse(courseId: string): MockDocument[] {
  return MOCK_DOCUMENTS.filter((d) => d.courseId === courseId);
}

// ─── Exam Timetable ─────────────────────────────────────────────────────────
export interface MockExam {
  exam_date: string;
  start_time: string;
  end_time: string;
  subject: string;
  venue: string | null;
}

export const MOCK_EXAMS: MockExam[] = [
  { exam_date: "2026-06-15", start_time: "08:30", end_time: "10:30", subject: "Mathematics P1", venue: "School Hall" },
  { exam_date: "2026-06-16", start_time: "08:30", end_time: "10:00", subject: "English Language", venue: "School Hall" },
  { exam_date: "2026-06-17", start_time: "08:30", end_time: "10:30", subject: "General Science", venue: "School Hall" },
  { exam_date: "2026-06-18", start_time: "08:30", end_time: "10:00", subject: "Shona Culture", venue: "School Hall" },
  { exam_date: "2026-06-19", start_time: "08:30", end_time: "10:30", subject: "Social Studies", venue: "School Hall" },
  { exam_date: "2026-06-22", start_time: "09:00", end_time: "11:00", subject: "ICT Practical", venue: "Computer Lab" },
  { exam_date: "2026-06-23", start_time: "08:30", end_time: "10:30", subject: "Agriculture", venue: "School Hall" },
];

// ─── Class Timetable Entries ──────────────────────────────────────────────────
export interface MockTimetableEntry {
  day_of_week: string;
  period_number: number;
  start_time: string;
  end_time: string;
  subject: string;
  grade: string;
}

export const MOCK_TIMETABLE: MockTimetableEntry[] = [
  // Monday
  { day_of_week: "Monday", period_number: 1, start_time: "08:00", end_time: "08:40", subject: "Mathematics", grade: "Grade 5A" },
  { day_of_week: "Monday", period_number: 2, start_time: "08:40", end_time: "09:20", subject: "English", grade: "Grade 5A" },
  { day_of_week: "Monday", period_number: 3, start_time: "09:20", end_time: "10:00", subject: "Science", grade: "Grade 5A" },
  { day_of_week: "Monday", period_number: 4, start_time: "10:00", end_time: "10:30", subject: "BREAK", grade: "Grade 5A" },
  { day_of_week: "Monday", period_number: 5, start_time: "10:30", end_time: "11:10", subject: "Shona", grade: "Grade 5A" },
  { day_of_week: "Monday", period_number: 6, start_time: "11:10", end_time: "11:50", subject: "ICT", grade: "Grade 5A" },
  
  // Tuesday
  { day_of_week: "Tuesday", period_number: 1, start_time: "08:00", end_time: "08:40", subject: "English", grade: "Grade 5A" },
  { day_of_week: "Tuesday", period_number: 2, start_time: "08:40", end_time: "09:20", subject: "Mathematics", grade: "Grade 5A" },
  { day_of_week: "Tuesday", period_number: 3, start_time: "09:20", end_time: "10:00", subject: "Social Studies", grade: "Grade 5A" },
  { day_of_week: "Tuesday", period_number: 4, start_time: "10:00", end_time: "10:30", subject: "BREAK", grade: "Grade 5A" },
  { day_of_week: "Tuesday", period_number: 5, start_time: "10:30", end_time: "11:10", subject: "Agriculture", grade: "Grade 5A" },
  { day_of_week: "Tuesday", period_number: 6, start_time: "11:10", end_time: "11:50", subject: "P.E.", grade: "Grade 5A" },

  // Wednesday
  { day_of_week: "Wednesday", period_number: 1, start_time: "08:00", end_time: "08:40", subject: "Science", grade: "Grade 5A" },
  { day_of_week: "Wednesday", period_number: 2, start_time: "08:40", end_time: "09:20", subject: "Shona", grade: "Grade 5A" },
  { day_of_week: "Wednesday", period_number: 3, start_time: "09:20", end_time: "10:00", subject: "Mathematics", grade: "Grade 5A" },
  { day_of_week: "Wednesday", period_number: 4, start_time: "10:00", end_time: "10:30", subject: "BREAK", grade: "Grade 5A" },
  { day_of_week: "Wednesday", period_number: 5, start_time: "10:30", end_time: "11:10", subject: "English", grade: "Grade 5A" },
  { day_of_week: "Wednesday", period_number: 6, start_time: "11:10", end_time: "11:50", subject: "Library", grade: "Grade 5A" },

  // Thursday
  { day_of_week: "Thursday", period_number: 1, start_time: "08:00", end_time: "08:40", subject: "Social Studies", grade: "Grade 5A" },
  { day_of_week: "Thursday", period_number: 2, start_time: "08:40", end_time: "09:20", subject: "English", grade: "Grade 5A" },
  { day_of_week: "Thursday", period_number: 3, start_time: "09:20", end_time: "10:00", subject: "Mathematics", grade: "Grade 5A" },
  { day_of_week: "Thursday", period_number: 4, start_time: "10:00", end_time: "10:30", subject: "BREAK", grade: "Grade 5A" },
  { day_of_week: "Thursday", period_number: 5, start_time: "10:30", end_time: "11:10", subject: "Art", grade: "Grade 5A" },
  { day_of_week: "Thursday", period_number: 6, start_time: "11:10", end_time: "11:50", subject: "Music", grade: "Grade 5A" },

  // Friday
  { day_of_week: "Friday", period_number: 1, start_time: "08:00", end_time: "08:40", subject: "Mathematics", grade: "Grade 5A" },
  { day_of_week: "Friday", period_number: 2, start_time: "08:40", end_time: "09:20", subject: "General Knowledge", grade: "Grade 5A" },
  { day_of_week: "Friday", period_number: 3, start_time: "09:20", end_time: "10:00", subject: "Spelling Bee", grade: "Grade 5A" },
  { day_of_week: "Friday", period_number: 4, start_time: "10:00", end_time: "10:30", subject: "BREAK", grade: "Grade 5A" },
  { day_of_week: "Friday", period_number: 5, start_time: "10:30", end_time: "11:10", subject: "Guidance", grade: "Grade 5A" },
  { day_of_week: "Friday", period_number: 6, start_time: "11:10", end_time: "11:50", subject: "Assembly", grade: "Grade 5A" },
];

export function getMockTimetableByGrade(grade: string): MockTimetableEntry[] {
  return MOCK_TIMETABLE.filter((e) => e.grade === grade);
}


