import { createFileRoute, Link } from "@tanstack/react-router";
import AppShell from "@/components/AppShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Eye, Video, Briefcase, Bookmark, Bot, TrendingUp, Sparkles, ArrowRight, Calendar,
} from "lucide-react";
import { useApp } from "@/lib/store";
import { ACTIVITY, JOBS } from "@/lib/mock-data";
import {
  AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, RadarChart,
  PolarGrid, PolarAngleAxis, Radar,
} from "recharts";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard · VidioHire AI" }] }),
  component: Dashboard,
});

const viewData = Array.from({ length: 12 }).map((_, i) => ({ d: `D${i+1}`, v: 8 + Math.round(Math.random()*40) }));
const skills = [
  { s: "Communication", v: 88 }, { s: "Confidence", v: 92 }, { s: "Clarity", v: 81 },
  { s: "Technical", v: 76 }, { s: "EQ", v: 84 }, { s: "Pacing", v: 79 },
];

function Dashboard() {
  const { user, applications, savedJobs, videoResume } = useApp();
  const profileCompletion = videoResume ? 95 : 65;

  const stats = [
    { i: Eye, l: "Recruiter views", v: 128, c: "+24%" },
    { i: Video, l: "Video plays", v: 412, c: "+12%" },
    { i: Briefcase, l: "Applications", v: applications.length, c: "+3" },
    { i: Bookmark, l: "Saved jobs", v: savedJobs.length, c: "+1" },
  ];

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold">Welcome back, {user?.name.split(" ")[0] ?? "there"} 👋</h1>
            <p className="text-muted-foreground">Here's what's happening with your profile.</p>
          </div>
          <Link to="/interview"><Button className="gradient-primary text-primary-foreground glow"><Bot className="size-4 mr-2"/> Start AI Interview</Button></Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s) => (
            <Card key={s.l} className="glass p-5 hover:glow transition-all">
              <div className="flex items-start justify-between">
                <s.i className="size-5 text-neon" />
                <Badge className="bg-success/20 text-success border-success/30 text-[10px]">{s.c}</Badge>
              </div>
              <div className="mt-3 text-3xl font-bold">{s.v.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground mt-1">{s.l}</div>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-5">
          <Card className="glass p-5 lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <div><div className="text-sm text-muted-foreground">Profile views</div><div className="text-xl font-semibold">Last 12 days</div></div>
              <Badge className="bg-accent/40"><TrendingUp className="size-3 mr-1"/> +18%</Badge>
            </div>
            <div className="h-56">
              <ResponsiveContainer>
                <AreaChart data={viewData}>
                  <defs>
                    <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="oklch(0.72 0.20 265)" stopOpacity={0.6} />
                      <stop offset="95%" stopColor="oklch(0.72 0.20 265)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="d" stroke="oklch(0.7 0.03 260)" fontSize={11} />
                  <YAxis stroke="oklch(0.7 0.03 260)" fontSize={11} />
                  <Tooltip contentStyle={{ background: "oklch(0.18 0.035 270)", border: "1px solid oklch(0.30 0.04 270 / 0.5)", borderRadius: 8 }} />
                  <Area type="monotone" dataKey="v" stroke="oklch(0.72 0.20 265)" fill="url(#g1)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
          <Card className="glass p-5">
            <div className="text-sm text-muted-foreground">AI Skill Radar</div>
            <div className="h-56">
              <ResponsiveContainer>
                <RadarChart data={skills}>
                  <PolarGrid stroke="oklch(0.30 0.04 270 / 0.5)" />
                  <PolarAngleAxis dataKey="s" stroke="oklch(0.7 0.03 260)" fontSize={10} />
                  <Radar dataKey="v" stroke="oklch(0.78 0.20 220)" fill="oklch(0.72 0.20 265)" fillOpacity={0.45} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-5">
          <Card className="glass p-5">
            <div className="flex items-center justify-between mb-3"><div className="font-semibold">Profile completion</div><span className="text-sm text-muted-foreground">{profileCompletion}%</span></div>
            <Progress value={profileCompletion} className="h-2" />
            <ul className="mt-4 space-y-2 text-sm">
              <li className="flex items-center gap-2"><div className="size-2 rounded-full bg-success"/> Basic info</li>
              <li className="flex items-center gap-2"><div className="size-2 rounded-full bg-success"/> Skills & experience</li>
              <li className="flex items-center gap-2"><div className={`size-2 rounded-full ${videoResume?"bg-success":"bg-warning"}`}/> Video resume {!videoResume && <Link to="/video-resume" className="text-primary text-xs ml-1">Add →</Link>}</li>
              <li className="flex items-center gap-2"><div className="size-2 rounded-full bg-warning"/> Portfolio links</li>
            </ul>
          </Card>
          <Card className="glass p-5">
            <div className="flex items-center justify-between mb-3"><div className="font-semibold">Activity feed</div><Sparkles className="size-4 text-neon"/></div>
            <ul className="space-y-3 text-sm">
              {ACTIVITY.map((a, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="size-8 rounded-lg gradient-primary grid place-items-center text-primary-foreground text-xs font-semibold">{a.who[0]}</div>
                  <div><div><strong>{a.who}</strong> {a.what}</div><div className="text-xs text-muted-foreground">{a.time}</div></div>
                </li>
              ))}
            </ul>
          </Card>
          <Card className="glass p-5">
            <div className="flex items-center justify-between mb-3"><div className="font-semibold">Recommended jobs</div><Link to="/jobs" className="text-xs text-primary inline-flex items-center">See all <ArrowRight className="size-3 ml-0.5"/></Link></div>
            <ul className="space-y-3">
              {JOBS.slice(0,3).map((j) => (
                <li key={j.id} className="flex items-center gap-3 p-2 -mx-2 rounded-lg hover:bg-accent/30">
                  <div className="size-9 rounded-lg gradient-primary grid place-items-center text-primary-foreground font-bold">{j.logo}</div>
                  <div className="flex-1 min-w-0"><div className="text-sm font-medium truncate">{j.title}</div><div className="text-xs text-muted-foreground">{j.company} · {j.location}</div></div>
                  <Badge className="bg-success/20 text-success border-success/30">{j.matchScore}%</Badge>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        <Card className="glass p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="font-semibold flex items-center gap-2"><Calendar className="size-4"/> Upcoming</div>
          </div>
          <div className="grid sm:grid-cols-3 gap-3">
            {["Mock interview · Tue 3pm","Linear screening · Wed 11am","Stripe onsite · Fri 1pm"].map((e) => (
              <div key={e} className="p-3 rounded-lg border border-border bg-muted/30 text-sm">{e}</div>
            ))}
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
