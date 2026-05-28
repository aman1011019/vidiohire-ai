import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import type { ReactNode } from "react";
import {
  LayoutDashboard, Video, Briefcase, Bookmark, Bot, BarChart3, MessageSquare,
  Bell, Settings, LogOut, Search, Users, FileCode2, Sparkles, HelpCircle, User,
  PanelLeftClose, PanelLeftOpen, Menu, Sun, Moon, FileText, X,
  GitBranch, Mail, Building2, Brain, ShieldCheck, ListChecks, Plus,
  ClipboardList, Trophy, Lightbulb, BookOpen, UsersRound,
} from "lucide-react";
import { useApp, type Role } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import AIAssistant from "@/components/AIAssistant";

type NavItem = { to: string; label: string; icon: any; badge?: number };
type NavGroup = { label: string; items: NavItem[] };

const CANDIDATE_GROUPS: NavGroup[] = [
  {
    label: "Workspace",
    items: [
      { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { to: "/video-resume", label: "Video Resume", icon: Video },
      { to: "/resume", label: "Resume Analysis", icon: FileText },
      { to: "/applications", label: "Applications", icon: Bookmark },
      { to: "/profile", label: "Profile", icon: User },
    ],
  },
  {
    label: "AI Studio",
    items: [
      { to: "/interview", label: "AI Interview", icon: Bot },
      { to: "/coding", label: "Coding Lab", icon: FileCode2 },
      { to: "/feedback", label: "Feedback Reports", icon: Sparkles },
    ],
  },
  {
    label: "Discover",
    items: [
      { to: "/jobs", label: "Jobs", icon: Briefcase },
      { to: "/analytics", label: "Analytics", icon: BarChart3 },
    ],
  },
  {
    label: "Account",
    items: [
      { to: "/messages", label: "Messages", icon: MessageSquare },
      { to: "/notifications", label: "Notifications", icon: Bell },
      { to: "/settings", label: "Settings", icon: Settings },
      { to: "/help", label: "Help", icon: HelpCircle },
    ],
  },
];

const recruiterGroups = (counts: { apps: number; msgs: number; ivs: number; alerts: number }): NavGroup[] => [
  {
    label: "Workspace",
    items: [
      { to: "/recruiter/dashboard", label: "Recruiter Dashboard", icon: LayoutDashboard },
      { to: "/recruiter/pipeline", label: "Hiring Pipeline", icon: GitBranch },
      { to: "/recruiter/candidates", label: "Candidates", icon: Users },
      { to: "/recruiter/interviews", label: "Interviews", icon: Video, badge: counts.ivs },
    ],
  },
  {
    label: "Job Management",
    items: [
      { to: "/recruiter/jobs", label: "All Jobs", icon: Briefcase },
      { to: "/recruiter/jobs/create", label: "Create Job", icon: Plus },
      { to: "/recruiter/applications", label: "Applications", icon: ClipboardList, badge: counts.apps },
      { to: "/recruiter/shortlisted", label: "Shortlisted", icon: Bookmark },
    ],
  },
  {
    label: "AI Recruitment",
    items: [
      { to: "/recruiter/ai-analysis", label: "AI Candidate Analysis", icon: Brain },
      { to: "/recruiter/resume-intelligence", label: "Resume Intelligence", icon: FileText },
      { to: "/recruiter/reports", label: "AI Interview Reports", icon: ListChecks },
      { to: "/recruiter/recommendations", label: "Hiring Recommendations", icon: Sparkles },
    ],
  },
  {
    label: "Communication",
    items: [
      { to: "/recruiter/messages", label: "Messages", icon: MessageSquare, badge: counts.msgs },
      { to: "/recruiter/notifications", label: "Notifications", icon: Bell, badge: counts.alerts },
      { to: "/recruiter/interview-invites", label: "Interview Invites", icon: Mail },
    ],
  },
  {
    label: "Analytics",
    items: [
      { to: "/recruiter/analytics", label: "Hiring Analytics", icon: BarChart3 },
      { to: "/recruiter/performance", label: "Recruitment Performance", icon: Trophy },
      { to: "/recruiter/insights", label: "AI Insights", icon: Lightbulb },
    ],
  },
  {
    label: "Company",
    items: [
      { to: "/recruiter/company", label: "Company Profile", icon: Building2 },
      { to: "/recruiter/team", label: "Team Management", icon: UsersRound },
      { to: "/recruiter/settings", label: "Recruiter Settings", icon: Settings },
    ],
  },
  {
    label: "Support",
    items: [
      { to: "/help", label: "Help Center", icon: HelpCircle },
      { to: "/help", label: "Documentation", icon: BookOpen },
    ],
  },
];

export default function AppShell({ children }: { children: ReactNode }) {
  const { user, notifications, logout, theme, setTheme } = useApp();
  const nav = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const role: Role = user?.role ?? "candidate";
  const unread = notifications.filter((n) => !n.read).length;

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  const isRecruiter = role === "recruiter";
  const groups: NavGroup[] = isRecruiter
    ? recruiterGroups({ apps: 18, msgs: 4, ivs: 3, alerts: Math.max(unread, 5) })
    : CANDIDATE_GROUPS;

  const SidebarBody = ({ mobile = false }: { mobile?: boolean }) => (
    <>
      <div className="flex items-center gap-2 px-4 h-16 border-b border-border shrink-0">
        <div className="size-9 rounded-xl gradient-primary grid place-items-center glow shrink-0">
          <Bot className="size-4 text-primary-foreground" />
        </div>
        {(!collapsed || mobile) && (
          <div className="flex flex-col leading-none">
            <span className="font-bold tracking-tight gradient-text text-lg">VidioHire</span>
            <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              {isRecruiter ? "AI Hiring OS" : "AI Hiring OS"}
            </span>
          </div>
        )}
        {mobile && (
          <button onClick={() => setMobileOpen(false)} className="ml-auto text-muted-foreground hover:text-foreground">
            <X className="size-4" />
          </button>
        )}
      </div>
      <nav className="flex-1 overflow-y-auto scrollbar-thin py-3 px-2 space-y-4">
        {groups.map((g) => (
          <div key={g.label}>
            {(!collapsed || mobile) && (
              <div className="px-3 mb-1 text-[10px] uppercase tracking-[0.18em] text-muted-foreground/70">{g.label}</div>
            )}
            {g.items.map((item) => {
              const active = pathname === item.to || (item.to !== "/" && pathname.startsWith(item.to + "/"));
              const Icon = item.icon;
              return (
                <Link
                  key={`${g.label}-${item.to}-${item.label}`}
                  to={item.to}
                  title={collapsed && !mobile ? item.label : undefined}
                  className={`group relative flex items-center gap-3 px-3 py-2 my-0.5 rounded-lg text-sm transition-all ${
                    active
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
                  }`}
                >
                  {active && <span className="absolute left-0 top-1.5 bottom-1.5 w-0.5 rounded-r gradient-primary" />}
                  <Icon className={`size-4 shrink-0 ${active ? "text-primary" : ""}`} />
                  {(!collapsed || mobile) && <span className="truncate flex-1">{item.label}</span>}
                  {(!collapsed || mobile) && item.badge ? (
                    <Badge className="ml-auto h-5 px-1.5 bg-primary text-primary-foreground text-[10px]">{item.badge}</Badge>
                  ) : null}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>
      <div className="border-t border-border p-3 shrink-0 space-y-2">
        {(!collapsed || mobile) && (
          <button
            onClick={() => nav({ to: isRecruiter ? "/recruiter/settings" : "/profile" })}
            className="flex items-center gap-2 w-full p-2 rounded-lg hover:bg-accent/40 text-left"
          >
            <Avatar className="size-8 ring-1 ring-primary/40">
              <AvatarFallback className="gradient-primary text-primary-foreground text-xs font-semibold">
                {user?.name?.split(" ").map((n) => n[0]).slice(0, 2).join("") ?? "JL"}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-medium truncate">{user?.name ?? "Guest"}</div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider">{role}</div>
            </div>
          </button>
        )}
        <button
          onClick={() => { logout(); toast.success("Signed out"); nav({ to: "/" }); }}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground w-full px-2 py-1.5 rounded-lg hover:bg-accent/40"
        >
          <LogOut className="size-4" />
          {(!collapsed || mobile) && "Sign out"}
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex w-full bg-background">
      <aside
        className={`${collapsed ? "w-[68px]" : "w-64"} hidden md:flex flex-col glass-strong border-r border-border transition-[width] duration-300 sticky top-0 h-screen z-30`}
      >
        <SidebarBody />
      </aside>

      {mobileOpen && (
        <>
          <div className="fixed inset-0 bg-background/70 backdrop-blur-md z-40 md:hidden animate-in fade-in" onClick={() => setMobileOpen(false)} />
          <aside className="fixed inset-y-0 left-0 w-72 z-50 md:hidden flex flex-col glass-strong border-r border-border animate-in slide-in-from-left">
            <SidebarBody mobile />
          </aside>
        </>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-20 glass border-b border-border h-16 flex items-center gap-3 px-3 sm:px-4">
          <button className="md:hidden p-2 -ml-1 rounded-md hover:bg-accent/40" onClick={() => setMobileOpen(true)} aria-label="Open menu">
            <Menu className="size-5" />
          </button>
          <button className="hidden md:inline-flex p-2 -ml-1 rounded-md hover:bg-accent/40 text-muted-foreground hover:text-foreground" onClick={() => setCollapsed(!collapsed)} aria-label="Toggle sidebar">
            {collapsed ? <PanelLeftOpen className="size-4" /> : <PanelLeftClose className="size-4" />}
          </button>
          <div className="hidden sm:flex items-center gap-2 flex-1 max-w-md rounded-lg px-2 bg-muted/40 border border-border focus-within:ring-1 focus-within:ring-primary/40">
            <Search className="size-4 text-muted-foreground" />
            <Input placeholder={isRecruiter ? "Search candidates, jobs, skills…" : "Search jobs, companies…"} className="bg-transparent border-0 focus-visible:ring-0 h-9 px-1" />
            <kbd className="hidden lg:inline text-[10px] text-muted-foreground border border-border rounded px-1.5 py-0.5">⌘K</kbd>
          </div>
          <div className="ml-auto flex items-center gap-1 sm:gap-2">
            {isRecruiter && (
              <Button variant="outline" size="sm" className="hidden sm:inline-flex" onClick={() => nav({ to: "/recruiter/jobs/create" })}>
                <Plus className="size-4 mr-1" /> New Job
              </Button>
            )}
            <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} title="Toggle theme">
              {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </Button>
            <Button variant="ghost" size="icon" onClick={() => nav({ to: isRecruiter ? "/recruiter/notifications" : "/notifications" })} className="relative">
              <Bell className="size-4" />
              {unread > 0 && <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-primary animate-pulse" />}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-accent/40">
                  <Avatar className="size-8 ring-1 ring-primary/40">
                    <AvatarFallback className="gradient-primary text-primary-foreground text-xs font-semibold">
                      {user?.name?.split(" ").map((n) => n[0]).slice(0, 2).join("") ?? "JL"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden sm:block text-left">
                    <div className="text-sm font-medium leading-tight">{user?.name ?? "Guest"}</div>
                    <div className="text-[10px] text-muted-foreground uppercase tracking-wider">{role}</div>
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>{user?.email ?? "guest@vidiohire.ai"}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {isRecruiter ? (
                  <>
                    <DropdownMenuItem onClick={() => nav({ to: "/recruiter/dashboard" })}>Dashboard</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => nav({ to: "/recruiter/company" })}>Company</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => nav({ to: "/recruiter/settings" })}>Settings</DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem onClick={() => nav({ to: "/profile" })}>Profile</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => nav({ to: "/settings" })}>Settings</DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => { logout(); toast.success("Signed out"); nav({ to: "/" }); }}>
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-x-hidden">{children}</main>
      </div>
      {!isRecruiter && <AIAssistant />}
    </div>
  );
}
