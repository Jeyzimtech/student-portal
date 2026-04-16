
-- User roles table FIRST
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'teacher', 'hod', 'student')),
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Secure role check function
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role TEXT)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

-- Profiles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  phone TEXT,
  grade TEXT,
  subject TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Students
CREATE TABLE public.students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  student_id TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  grade TEXT NOT NULL,
  date_of_birth DATE,
  parent_name TEXT,
  parent_phone TEXT,
  parent_email TEXT,
  address TEXT,
  status TEXT NOT NULL DEFAULT 'Active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;

-- Results
CREATE TABLE public.results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
  subject TEXT NOT NULL,
  term INTEGER NOT NULL CHECK (term BETWEEN 1 AND 3),
  year INTEGER NOT NULL,
  mark NUMERIC(5,2) NOT NULL CHECK (mark BETWEEN 0 AND 100),
  grade TEXT,
  comment TEXT,
  uploaded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.results ENABLE ROW LEVEL SECURITY;

-- Fee transactions
CREATE TABLE public.fee_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
  description TEXT NOT NULL,
  amount NUMERIC(10,2) NOT NULL,
  balance NUMERIC(10,2),
  payment_method TEXT,
  term INTEGER,
  year INTEGER,
  transaction_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.fee_transactions ENABLE ROW LEVEL SECURITY;

-- Exam timetable
CREATE TABLE public.exam_timetable (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  term INTEGER NOT NULL,
  year INTEGER NOT NULL,
  exam_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  subject TEXT NOT NULL,
  venue TEXT,
  grade TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.exam_timetable ENABLE ROW LEVEL SECURITY;

-- Class timetable
CREATE TABLE public.class_timetable (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  grade TEXT NOT NULL,
  day_of_week TEXT NOT NULL,
  period_number INTEGER NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  subject TEXT NOT NULL,
  teacher_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.class_timetable ENABLE ROW LEVEL SECURITY;

-- E-learning courses
CREATE TABLE public.elearning_courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject TEXT NOT NULL,
  grade TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  total_lessons INTEGER NOT NULL DEFAULT 1,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.elearning_courses ENABLE ROW LEVEL SECURITY;

-- E-learning progress
CREATE TABLE public.elearning_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
  course_id UUID REFERENCES public.elearning_courses(id) ON DELETE CASCADE NOT NULL,
  completed_lessons INTEGER NOT NULL DEFAULT 0,
  progress_percent NUMERIC(5,2) NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(student_id, course_id)
);
ALTER TABLE public.elearning_progress ENABLE ROW LEVEL SECURITY;

-- Timestamp trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON public.students FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_elearning_progress_updated_at BEFORE UPDATE ON public.elearning_progress FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- RLS Policies
CREATE POLICY "Users view own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins manage roles" ON public.user_roles FOR ALL USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users view own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins view all profiles" ON public.profiles FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Students view own record" ON public.students FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Staff view all students" ON public.students FOR SELECT USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'teacher') OR public.has_role(auth.uid(), 'hod'));
CREATE POLICY "Admins insert students" ON public.students FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update students" ON public.students FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete students" ON public.students FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Students view own results" ON public.results FOR SELECT USING (EXISTS (SELECT 1 FROM public.students s WHERE s.id = results.student_id AND s.user_id = auth.uid()));
CREATE POLICY "Staff view all results" ON public.results FOR SELECT USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'teacher') OR public.has_role(auth.uid(), 'hod'));
CREATE POLICY "Teachers upload results" ON public.results FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'teacher') OR public.has_role(auth.uid(), 'hod') OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Teachers update results" ON public.results FOR UPDATE USING (public.has_role(auth.uid(), 'teacher') OR public.has_role(auth.uid(), 'hod') OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Students view own fees" ON public.fee_transactions FOR SELECT USING (EXISTS (SELECT 1 FROM public.students s WHERE s.id = fee_transactions.student_id AND s.user_id = auth.uid()));
CREATE POLICY "Admins manage fees" ON public.fee_transactions FOR ALL USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Auth view exam timetable" ON public.exam_timetable FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins insert exam tt" ON public.exam_timetable FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update exam tt" ON public.exam_timetable FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete exam tt" ON public.exam_timetable FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Auth view class timetable" ON public.class_timetable FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins insert class tt" ON public.class_timetable FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update class tt" ON public.class_timetable FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete class tt" ON public.class_timetable FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Auth view courses" ON public.elearning_courses FOR SELECT TO authenticated USING (true);
CREATE POLICY "Staff insert courses" ON public.elearning_courses FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'teacher') OR public.has_role(auth.uid(), 'hod'));
CREATE POLICY "Staff update courses" ON public.elearning_courses FOR UPDATE USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'teacher') OR public.has_role(auth.uid(), 'hod'));

CREATE POLICY "Students view own progress" ON public.elearning_progress FOR SELECT USING (EXISTS (SELECT 1 FROM public.students s WHERE s.id = elearning_progress.student_id AND s.user_id = auth.uid()));
CREATE POLICY "Students update own progress" ON public.elearning_progress FOR UPDATE USING (EXISTS (SELECT 1 FROM public.students s WHERE s.id = elearning_progress.student_id AND s.user_id = auth.uid()));
CREATE POLICY "Staff view all progress" ON public.elearning_progress FOR SELECT USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'teacher'));
CREATE POLICY "Admins insert progress" ON public.elearning_progress FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete progress" ON public.elearning_progress FOR DELETE USING (public.has_role(auth.uid(), 'admin'));
