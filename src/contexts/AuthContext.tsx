import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
} from "firebase/auth";
import { auth } from "@/integrations/firebase/client";
import { fetchCollection } from "@/integrations/firebase/firestore";

interface AuthContextType {
  user: User | null;
  role: string | null;
  profile: { full_name: string; grade?: string; subject?: string } | null;
  studentRecord: { id: string; student_id: string; grade: string } | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

// ─── Demo credentials ────────────────────────────────────────────────────────
const DEMO_ACCOUNTS: Record<string, { role: string; profile: { full_name: string; grade?: string; subject?: string }; studentRecord?: { id: string; student_id: string; grade: string } }> = {
  "admin@cabsprimary.ac.zw": {
    role: "admin",
    profile: { full_name: "Admin User", subject: "Administration" },
  },
  "teacher@cabsprimary.ac.zw": {
    role: "teacher",
    profile: { full_name: "Mrs. Moyo", subject: "Mathematics", grade: "Grade 7A" },
  },
  "student@cabsprimary.ac.zw": {
    role: "student",
    profile: { full_name: "Tatenda Chigwedere", grade: "Grade 7A" },
    studentRecord: { id: "demo-student-1", student_id: "CABS-0001", grade: "Grade 7A" },
  },
};

const DEMO_PASSWORDS: Record<string, string> = {
  "admin@cabsprimary.ac.zw": "admin123",
  "teacher@cabsprimary.ac.zw": "teacher123",
  "student@cabsprimary.ac.zw": "student123",
};
// ─────────────────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [profile, setProfile] = useState<AuthContextType["profile"]>(null);
  const [studentRecord, setStudentRecord] = useState<AuthContextType["studentRecord"]>(null);
  const [loading, setLoading] = useState(true);
  const [isDemoUser, setIsDemoUser] = useState(false);

  const fetchUserData = async (uid: string) => {
    // Fetch role from Firestore
    const roles = await fetchCollection<{ user_id: string; role: string }>("user_roles", {
      filters: [{ field: "user_id", op: "==", value: uid }],
    });
    if (roles.length > 0) setRole(roles[0].role);

    // Fetch profile
    const profiles = await fetchCollection<{ user_id: string; full_name: string; grade?: string; subject?: string }>("profiles", {
      filters: [{ field: "user_id", op: "==", value: uid }],
    });
    if (profiles.length > 0) setProfile(profiles[0]);

    // Fetch student record
    const students = await fetchCollection<{ id: string; user_id: string; student_id: string; grade: string }>("students", {
      filters: [{ field: "user_id", op: "==", value: uid }],
    });
    if (students.length > 0) {
      setStudentRecord({ id: students[0].id, student_id: students[0].student_id, grade: students[0].grade });
    }
  };

  // Restore demo session from localStorage OR listen for Firebase auth
  useEffect(() => {
    const savedDemo = localStorage.getItem("demo_user_email");
    if (savedDemo && DEMO_ACCOUNTS[savedDemo]) {
      const account = DEMO_ACCOUNTS[savedDemo];
      setRole(account.role);
      setProfile(account.profile);
      setStudentRecord(account.studentRecord || null);
      setUser({ uid: "demo-user", email: savedDemo } as User);
      setIsDemoUser(true);
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        await fetchUserData(firebaseUser.uid);
      } else {
        setRole(null);
        setProfile(null);
        setStudentRecord(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const emailLower = email.toLowerCase().trim();

    // ── Demo login ────────────────────────────────────────────────────────
    if (DEMO_ACCOUNTS[emailLower] && DEMO_PASSWORDS[emailLower] === password) {
      const account = DEMO_ACCOUNTS[emailLower];
      setRole(account.role);
      setProfile(account.profile);
      setStudentRecord(account.studentRecord || null);
      setUser({ uid: "demo-user", email: emailLower } as User);
      setIsDemoUser(true);
      localStorage.setItem("demo_user_email", emailLower);
      return { error: null };
    }

    // ── Firebase Auth ─────────────────────────────────────────────────────
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { error: null };
    } catch (err: unknown) {
      const firebaseError = err as { code?: string; message?: string };
      // If the demo email was used but wrong password
      if (DEMO_ACCOUNTS[emailLower]) {
        return { error: "Invalid password. Demo password is shown below the form." };
      }
      return { error: firebaseError.message || "Login failed" };
    }
  };

  const signOut = async () => {
    if (isDemoUser) {
      localStorage.removeItem("demo_user_email");
      setIsDemoUser(false);
    } else {
      await firebaseSignOut(auth);
    }
    setUser(null);
    setRole(null);
    setProfile(null);
    setStudentRecord(null);
  };

  return (
    <AuthContext.Provider value={{ user, role, profile, studentRecord, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
