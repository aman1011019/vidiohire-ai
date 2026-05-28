import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import axios from "axios";

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
const TOKEN_KEY = "vidiohire:token";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// Configure axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests if available
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const seedNotifications: Notification[] = [
  {
    id: "n1",
    title: "Recruiter viewed your profile",
    body: "Alex from Stripe just viewed your video resume.",
    time: "2m ago",
    read: false,
  },
  {
    id: "n2",
    title: "AI Interview ready",
    body: "Your tailored interview for Senior FE Engineer is ready.",
    time: "1h ago",
    read: false,
  },
  {
    id: "n3",
    title: "New match",
    body: "94% match — Frontend Engineer at Linear.",
    time: "3h ago",
    read: true,
  },
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
    try {
      localStorage.setItem(KEY, JSON.stringify(local));
    } catch {}
  }, [local]);

  useEffect(() => {
    const root = document.documentElement;
    if (local.theme === "light") root.classList.add("light");
    else root.classList.remove("light");
  }, [local.theme]);

  // Load user from token on mount
  const loadUserFromToken = async (token: string) => {
    try {
      const response = await apiClient.get("/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = response.data;
      setUser({
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role as Role,
        headline: data.headline ?? undefined,
        avatar: data.avatar_url ?? undefined,
      });
    } catch (error) {
      console.error("Failed to load user:", error);
      localStorage.removeItem(TOKEN_KEY);
      setUser(null);
    } finally {
      setAuthLoading(false);
    }
  };

  useEffect(() => {
    // Check for existing token on mount
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      loadUserFromToken(token);
    } else {
      setAuthLoading(false);
    }
  }, []);

  const ctx: Ctx = {
    ...local,
    user,
    authLoading,
    login: async (email, password) => {
      try {
        const response = await apiClient.post("/auth/login", { email, password });
        const { token, user: userData } = response.data;

        // Store token
        localStorage.setItem(TOKEN_KEY, token);

        const u: User = {
          id: userData.id,
          name: userData.name,
          email: userData.email,
          role: userData.role as Role,
          headline: userData.headline ?? undefined,
          avatar: userData.avatar_url ?? undefined,
        };
        setUser(u);
        return u;
      } catch (error: any) {
        throw new Error(error.response?.data?.detail || "Login failed");
      }
    },
    signup: async (name, email, password, role) => {
      try {
        const response = await apiClient.post("/auth/signup", {
          name,
          email,
          password,
          role,
        });
        const { token, user: userData } = response.data;

        // Store token
        localStorage.setItem(TOKEN_KEY, token);

        const u: User = {
          id: userData.id,
          name: userData.name,
          email: userData.email,
          role: userData.role as Role,
          headline: userData.headline ?? undefined,
          avatar: userData.avatar_url ?? undefined,
        };
        setUser(u);
        return u;
      } catch (error: any) {
        throw new Error(error.response?.data?.detail || "Signup failed");
      }
    },
    logout: async () => {
      try {
        await apiClient.post("/auth/logout");
      } catch (error) {
        console.error("Logout error:", error);
      } finally {
        localStorage.removeItem(TOKEN_KEY);
        setUser(null);
      }
    },
    toggleSavedJob: (id) =>
      setLocal((s) => ({
        ...s,
        savedJobs: s.savedJobs.includes(id)
          ? s.savedJobs.filter((x) => x !== id)
          : [...s.savedJobs, id],
      })),
    apply: (jobId) =>
      setLocal((s) =>
        s.applications.some((a) => a.jobId === jobId)
          ? s
          : {
              ...s,
              applications: [
                ...s.applications,
                {
                  id: "a_" + Date.now(),
                  jobId,
                  status: "Applied",
                  appliedAt: new Date().toISOString(),
                },
              ],
            },
      ),
    withdraw: (jobId) =>
      setLocal((s) => ({ ...s, applications: s.applications.filter((a) => a.jobId !== jobId) })),
    setVideoResume: (v) => setLocal((s) => ({ ...s, videoResume: v })),
    markAllRead: () =>
      setLocal((s) => ({
        ...s,
        notifications: s.notifications.map((n) => ({ ...n, read: true })),
      })),
    addNotification: (n) =>
      setLocal((s) => ({
        ...s,
        notifications: [
          { id: "n_" + Date.now(), read: false, time: "just now", ...n },
          ...s.notifications,
        ],
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
