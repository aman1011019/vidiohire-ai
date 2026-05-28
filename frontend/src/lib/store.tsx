import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

export type Role = "candidate" | "recruiter";
export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  headline?: string;
};

type Notification = { id: string; title: string; body: string; time: string; read: boolean };

type LocalState = {
  notifications: Notification[];
  savedJobs: string[];
  applications: { id: string; jobId: string; status: string; appliedAt: string }[];
  videoResume: { url: string; duration: number; uploadedAt: string } | null;
  theme: "dark" | "light";
};

type Ctx = LocalState & {
  user: User | null;
  authLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  signup: (name: string, email: string, password: string, role: Role) => Promise<User>;
  logout: () => Promise<void>;
  toggleSavedJob: (id: string) => void;
  apply: (jobId: string) => void;
  withdraw: (jobId: string) => void;
  setVideoResume: (v: LocalState["videoResume"]) => void;
  markAllRead: () => void;
  addNotification: (n: Omit<Notification, "id" | "read" | "time">) => void;
  setTheme: (t: "dark" | "light") => void;
};

const AppContext = createContext<Ctx | null>(null);
const KEY = "vidiohire:local";

const seedNotifications: Notification[] = [
  { id: "n1", title: "Recruiter viewed your profile", body: "Alex from Stripe just viewed your video resume.", time: "2m ago", read: false },
  { id: "n2", title: "AI Interview ready", body: "Your tailored interview for Senior FE Engineer is ready.", time: "1h ago", read: false },
  { id: "n3", title: "New match", body: "94% match — Frontend Engineer at Linear.", time: "3h ago", read: true },
];

const defaultLocal: LocalState = {
  notifications: seedNotifications,
  savedJobs: [],
  applications: [],
  videoResume: null,
  theme: "dark",
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [local, setLocal] = useState<LocalState>(() => {
    if (typeof window === "undefined") return defaultLocal;
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) return { ...defaultLocal, ...JSON.parse(raw) };
    } catch {}
    return defaultLocal;
  });
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(local)); } catch {}
  }, [local]);

  useEffect(() => {
    const root = document.documentElement;
    if (local.theme === "light") root.classList.add("light"); else root.classList.remove("light");
  }, [local.theme]);

  // Hydrate profile for the current session
  const loadProfile = async (userId: string, fallbackEmail: string) => {
    const { data } = await supabase
      .from("profiles")
      .select("id,name,email,role,headline,avatar_url")
      .eq("id", userId)
      .maybeSingle();
    if (data) {
      setUser({
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role as Role,
        headline: data.headline ?? undefined,
        avatar: data.avatar_url ?? undefined,
      });
    } else {
      setUser({ id: userId, name: fallbackEmail.split("@")[0], email: fallbackEmail, role: "candidate" });
    }
  };

  useEffect(() => {
    // Set up listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_evt, session) => {
      if (session?.user) {
        setTimeout(() => { loadProfile(session.user.id, session.user.email ?? ""); }, 0);
      } else {
        setUser(null);
      }
    });
    // THEN get existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) loadProfile(session.user.id, session.user.email ?? "").finally(() => setAuthLoading(false));
      else setAuthLoading(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  const ctx: Ctx = {
    ...local,
    user,
    authLoading,
    login: async (email, password) => {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      const { data: profile } = await supabase
        .from("profiles").select("id,name,email,role,headline,avatar_url")
        .eq("id", data.user!.id).maybeSingle();
      const u: User = profile
        ? { id: profile.id, name: profile.name, email: profile.email, role: profile.role as Role, headline: profile.headline ?? undefined, avatar: profile.avatar_url ?? undefined }
        : { id: data.user!.id, name: email.split("@")[0], email, role: "candidate" };
      setUser(u);
      return u;
    },
    signup: async (name, email, password, role) => {
      const redirectUrl = `${window.location.origin}/dashboard`;
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: redirectUrl, data: { name, role } },
      });
      if (error) throw error;
      const u: User = { id: data.user?.id ?? "", name, email, role };
      if (data.session) setUser(u);
      return u;
    },
    logout: async () => {
      await supabase.auth.signOut();
      setUser(null);
    },
    toggleSavedJob: (id) =>
      setLocal((s) => ({ ...s, savedJobs: s.savedJobs.includes(id) ? s.savedJobs.filter((x) => x !== id) : [...s.savedJobs, id] })),
    apply: (jobId) =>
      setLocal((s) =>
        s.applications.some((a) => a.jobId === jobId)
          ? s
          : { ...s, applications: [...s.applications, { id: "a_" + Date.now(), jobId, status: "Applied", appliedAt: new Date().toISOString() }] }
      ),
    withdraw: (jobId) => setLocal((s) => ({ ...s, applications: s.applications.filter((a) => a.jobId !== jobId) })),
    setVideoResume: (v) => setLocal((s) => ({ ...s, videoResume: v })),
    markAllRead: () => setLocal((s) => ({ ...s, notifications: s.notifications.map((n) => ({ ...n, read: true })) })),
    addNotification: (n) =>
      setLocal((s) => ({
        ...s,
        notifications: [{ id: "n_" + Date.now(), read: false, time: "just now", ...n }, ...s.notifications],
      })),
    setTheme: (t) => setLocal((s) => ({ ...s, theme: t })),
  };

  return <AppContext.Provider value={ctx}>{children}</AppContext.Provider>;
}

export function useApp() {
  const c = useContext(AppContext);
  if (!c) throw new Error("useApp must be inside AppProvider");
  return c;
}
