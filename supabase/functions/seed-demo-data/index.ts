import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const supabaseAdmin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const results: string[] = [];

  // Create admin user
  const { data: adminUser, error: adminError } = await supabaseAdmin.auth.admin.createUser({
    email: "admin@cabsprimary.ac.zw",
    password: "admin123",
    email_confirm: true,
    user_metadata: { full_name: "Admin User" },
  });

  if (adminError && !adminError.message.includes("already been registered")) {
    results.push(`Admin error: ${adminError.message}`);
  } else if (adminUser?.user) {
    await supabaseAdmin.from("user_roles").upsert({ user_id: adminUser.user.id, role: "admin" }, { onConflict: "user_id,role" });
    await supabaseAdmin.from("profiles").update({ full_name: "Admin User" }).eq("user_id", adminUser.user.id);
    results.push("Admin created");
  }

  // Create student user
  const { data: studentUser, error: studentError } = await supabaseAdmin.auth.admin.createUser({
    email: "student@cabsprimary.ac.zw",
    password: "student123",
    email_confirm: true,
    user_metadata: { full_name: "Tendai Moyo" },
  });

  if (studentError && !studentError.message.includes("already been registered")) {
    results.push(`Student error: ${studentError.message}`);
  } else if (studentUser?.user) {
    await supabaseAdmin.from("user_roles").upsert({ user_id: studentUser.user.id, role: "student" }, { onConflict: "user_id,role" });
    await supabaseAdmin.from("profiles").update({ full_name: "Tendai Moyo", grade: "Grade 5A" }).eq("user_id", studentUser.user.id);

    // Create student record
    const { data: studentRec } = await supabaseAdmin.from("students").upsert({
      user_id: studentUser.user.id,
      student_id: "CABS2026001",
      full_name: "Tendai Moyo",
      grade: "Grade 5A",
      parent_name: "Mr. J. Moyo",
      parent_phone: "+263 712 345 678",
      status: "Active",
    }, { onConflict: "student_id" }).select().single();

    if (studentRec) {
      // Seed results
      const resultRows = [
        { student_id: studentRec.id, subject: "Mathematics", term: 1, year: 2026, mark: 85, grade: "A", comment: "Excellent work" },
        { student_id: studentRec.id, subject: "English", term: 1, year: 2026, mark: 78, grade: "B+", comment: "Good effort" },
        { student_id: studentRec.id, subject: "Shona", term: 1, year: 2026, mark: 72, grade: "B", comment: "Improving" },
        { student_id: studentRec.id, subject: "Science", term: 1, year: 2026, mark: 90, grade: "A+", comment: "Outstanding" },
        { student_id: studentRec.id, subject: "Social Studies", term: 1, year: 2026, mark: 68, grade: "B-", comment: "Needs more effort" },
        { student_id: studentRec.id, subject: "ICT", term: 1, year: 2026, mark: 82, grade: "A-", comment: "Very good" },
        { student_id: studentRec.id, subject: "Agriculture", term: 1, year: 2026, mark: 75, grade: "B+", comment: "Consistent" },
        { student_id: studentRec.id, subject: "P.E.", term: 1, year: 2026, mark: 88, grade: "A", comment: "Excellent" },
      ];
      await supabaseAdmin.from("results").insert(resultRows);

      // Seed fee transactions
      const feeRows = [
        { student_id: studentRec.id, description: "Term 1 Tuition", amount: -450, balance: -450, term: 1, year: 2026, transaction_date: "2026-01-15" },
        { student_id: studentRec.id, description: "Payment Received", amount: 300, balance: -150, payment_method: "EcoCash", term: 1, year: 2026, transaction_date: "2026-01-20" },
        { student_id: studentRec.id, description: "Sports Levy", amount: -30, balance: -180, term: 1, year: 2026, transaction_date: "2026-02-10" },
        { student_id: studentRec.id, description: "Payment Received", amount: 60, balance: -120, payment_method: "Bank Transfer", term: 1, year: 2026, transaction_date: "2026-03-01" },
      ];
      await supabaseAdmin.from("fee_transactions").insert(feeRows);
      results.push("Student + results + fees created");
    }
  }

  // Add more students
  const moreStudents = [
    { student_id: "CABS2026002", full_name: "Rumbidzai Chipo", grade: "Grade 5A", parent_name: "Mrs. T. Chipo" },
    { student_id: "CABS2026003", full_name: "Tapiwa Ndlovu", grade: "Grade 4A", parent_name: "Mr. P. Ndlovu" },
    { student_id: "CABS2026004", full_name: "Nyasha Dube", grade: "Grade 3A", parent_name: "Mrs. S. Dube" },
    { student_id: "CABS2026005", full_name: "Farai Mutasa", grade: "Grade 6A", parent_name: "Mr. F. Mutasa" },
  ];
  for (const s of moreStudents) {
    await supabaseAdmin.from("students").upsert({ ...s, status: "Active" }, { onConflict: "student_id" });
  }
  results.push("Extra students added");

  // Seed exam timetable
  const exams = [
    { term: 2, year: 2026, exam_date: "2026-05-12", start_time: "08:00", end_time: "10:00", subject: "Mathematics", venue: "Hall A", grade: "Grade 5A" },
    { term: 2, year: 2026, exam_date: "2026-05-13", start_time: "08:00", end_time: "10:00", subject: "English", venue: "Hall A", grade: "Grade 5A" },
    { term: 2, year: 2026, exam_date: "2026-05-14", start_time: "08:00", end_time: "10:00", subject: "Shona", venue: "Hall B", grade: "Grade 5A" },
    { term: 2, year: 2026, exam_date: "2026-05-15", start_time: "08:00", end_time: "10:00", subject: "Science", venue: "Lab 1", grade: "Grade 5A" },
    { term: 2, year: 2026, exam_date: "2026-05-16", start_time: "08:00", end_time: "09:30", subject: "Social Studies", venue: "Hall A", grade: "Grade 5A" },
    { term: 2, year: 2026, exam_date: "2026-05-19", start_time: "08:00", end_time: "09:30", subject: "ICT", venue: "Computer Lab", grade: "Grade 5A" },
  ];
  await supabaseAdmin.from("exam_timetable").insert(exams);
  results.push("Exam timetable seeded");

  // Seed class timetable
  const ttEntries: { grade: string; day_of_week: string; period_number: number; start_time: string; end_time: string; subject: string }[] = [];
  const daySubjects: Record<string, string[]> = {
    Monday: ["Mathematics", "English", "Shona", "BREAK", "Social Studies", "Agriculture", "P.E."],
    Tuesday: ["English", "Mathematics", "Science", "BREAK", "ICT", "Social Studies", "Art"],
    Wednesday: ["Shona", "Science", "Mathematics", "BREAK", "Agriculture", "ICT", "P.E."],
    Thursday: ["Science", "Shona", "English", "BREAK", "Social Studies", "P.E.", "Music"],
    Friday: ["Mathematics", "English", "ICT", "BREAK", "Agriculture", "Social Studies", "Art"],
  };
  const times = [
    ["07:30", "08:10"], ["08:10", "08:50"], ["08:50", "09:30"], ["09:30", "10:00"],
    ["10:00", "10:40"], ["10:40", "11:20"], ["11:20", "12:00"],
  ];
  for (const [day, subjects] of Object.entries(daySubjects)) {
    subjects.forEach((subj, i) => {
      ttEntries.push({ grade: "Grade 5A", day_of_week: day, period_number: i + 1, start_time: times[i][0], end_time: times[i][1], subject: subj });
    });
  }
  await supabaseAdmin.from("class_timetable").insert(ttEntries);
  results.push("Class timetable seeded");

  // Seed e-learning courses
  const courses = [
    { subject: "Mathematics", grade: "Grade 5A", title: "Grade 5 Math", description: "Number operations, fractions, geometry", total_lessons: 12 },
    { subject: "English", grade: "Grade 5A", title: "Grade 5 English", description: "Reading, grammar, creative writing", total_lessons: 10 },
    { subject: "Shona", grade: "Grade 5A", title: "Grade 5 Shona", description: "Ndimi, nyaya, tsika nemagariro", total_lessons: 8 },
    { subject: "Science", grade: "Grade 5A", title: "Grade 5 Science", description: "Living things, matter, energy", total_lessons: 11 },
    { subject: "Social Studies", grade: "Grade 5A", title: "Grade 5 Social Studies", description: "Zimbabwe history, maps, government", total_lessons: 9 },
    { subject: "ICT", grade: "Grade 5A", title: "Grade 5 ICT", description: "Computer basics, typing, internet safety", total_lessons: 7 },
  ];
  await supabaseAdmin.from("elearning_courses").insert(courses);
  results.push("E-learning courses seeded");

  return new Response(JSON.stringify({ success: true, results }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
