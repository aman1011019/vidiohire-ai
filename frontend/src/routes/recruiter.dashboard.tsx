import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import RecruiterPage from "@/components/RecruiterPage";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CANDIDATES, JOBS } from "@/lib/mock-data";
import {
  Briefcase, Users, Bot, BarChart3, Sparkles, ArrowRight, TrendingUp, Clock, CheckCircle2,
} from "lucide-react";
import { useWebSocketInitialization, useRealtimeStore } from "@/hooks/useRealtime";

export const Route = createFileRoute("/recruiter/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard · Recruiter · VidioHire AI" }] }),
  component: Dashboard,
});

function Dashboard() {
  useWebSocketInitialization();
  const { pipelineData, isConnected } = useRealtimeStore();
  
  const nav = useNavigate();
  const topCandidates = [...CANDIDATES].sort((a, b) => b.matchScore - a.matchScore).slice(0, 5);
  const recentJobs = JOBS.slice(0, 4);

  return (
    <RecruiterPage
      badge="Recruiter Workspace"
      title={
        <div className="flex items-center gap-3">
          Welcome back, Talent Lead
          {isConnected && (
            <Badge variant="outline" className="bg-success/10 text-success border-success/20 animate-pulse">
              Live Connection
            </Badge>
          )}
        </div>
      }
      subtitle="Your AI hiring operating system — pipeline, candidates, interviews and insights at a glance."
      stats={[
        { label: "Open roles", value: 12, hint: "+2 this week" },
        { label: "Applications", value: 312, hint: "+48 today" },
        { label: "AI interviews", value: 87, hint: "23 pending review" },
        { label: "Hires this quarter", value: 14, hint: "Goal 20" },
      ]}
      actions={
        <>
          <Button variant="outline" onClick={() => nav({ to: "/recruiter/pipeline" })}>
            <BarChart3 className="size-4 mr-2" /> View pipeline
          </Button>
          <Button className="gradient-primary text-primary-foreground glow" onClick={() => nav({ to: "/recruiter/jobs/create" })}>
            <Briefcase className="size-4 mr-2" /> Create job
          </Button>
        </>
      }
    >
      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="glass p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-sm font-semibold">Top AI-matched candidates</div>
              <div className="text-xs text-muted-foreground">Ranked by skill, communication & experience signals</div>
            </div>
            <Link to="/recruiter/candidates" className="text-xs text-primary inline-flex items-center gap-1 hover:underline">
              See all <ArrowRight className="size-3" />
            </Link>
          </div>
          <div className="divide-y divide-border">
            {topCandidates.map((c) => (
              <div key={c.id} className="flex items-center gap-3 py-3">
                <div className="size-10 rounded-lg grid place-items-center text-sm font-bold text-primary-foreground shrink-0" style={{ background: c.videoThumb }}>{c.avatar}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{c.name}</div>
                  <div className="text-xs text-muted-foreground truncate">{c.headline} · {c.location}</div>
                </div>
                <Badge className="bg-success/20 text-success border-success/30">{c.matchScore}%</Badge>
                <Button size="sm" variant="outline" onClick={() => nav({ to: "/recruiter/candidates" })}>Review</Button>
              </div>
            ))}
          </div>
        </Card>

        <div className="space-y-4">
          <Card className="glass p-5">
            <div className="text-sm font-semibold mb-3 flex items-center gap-2"><Sparkles className="size-4 text-primary" /> AI recommendations</div>
            <ul className="space-y-3 text-sm">
              <li className="flex gap-2"><CheckCircle2 className="size-4 text-success shrink-0 mt-0.5" /> Shortlist <b>Maya Chen</b> — strong systems design signal.</li>
              <li className="flex gap-2"><Clock className="size-4 text-primary shrink-0 mt-0.5" /> 3 senior frontend candidates waiting on interview invites.</li>
              <li className="flex gap-2"><TrendingUp className="size-4 text-accent shrink-0 mt-0.5" /> Time-to-hire dropped 18% vs last quarter.</li>
            </ul>
            <Button size="sm" variant="outline" className="mt-4 w-full" onClick={() => nav({ to: "/recruiter/ai-analysis" })}>
              Open AI insights
            </Button>
          </Card>

          <Card className="glass p-5">
            <div className="text-sm font-semibold mb-3 flex items-center gap-2"><Briefcase className="size-4 text-primary" /> Recent jobs</div>
            <div className="space-y-2">
              {recentJobs.map((j) => (
                <div key={j.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-accent/40">
                  <div className="min-w-0">
                    <div className="text-sm font-medium truncate">{j.title}</div>
                    <div className="text-[11px] text-muted-foreground truncate">{j.company} · {j.location}</div>
                  </div>
                  <Badge variant="outline" className="text-[10px]">Open</Badge>
                </div>
              ))}
            </div>
            <Button size="sm" variant="ghost" className="mt-2 w-full justify-center" onClick={() => nav({ to: "/recruiter/jobs" })}>
              Manage jobs <ArrowRight className="size-3 ml-1" />
            </Button>
          </Card>
        </div>
      </div>

      <Card className="glass p-6">
        <div className="text-sm font-semibold mb-4 flex items-center gap-2"><Users className="size-4 text-primary" /> Hiring funnel</div>
        <div className="space-y-2">
          {[{ l: "Applied", v: 312 }, { l: "Reviewed", v: 184 }, { l: "Shortlisted", v: 74 }, { l: "Interview", v: 38 }, { l: "Offer", v: 18 }, { l: "Hired", v: 12 }].map((s, i) => (
            <div key={s.l} className="flex items-center gap-3">
              <div className="w-24 text-xs">{s.l}</div>
              <div className="flex-1 h-3 rounded-full bg-muted overflow-hidden">
                <div className="h-full gradient-primary" style={{ width: `${100 - i * 15}%` }} />
              </div>
              <div className="w-12 text-right text-sm font-medium">{s.v}</div>
            </div>
          ))}
        </div>
        <Button className="mt-6 gradient-primary text-primary-foreground" onClick={() => nav({ to: "/recruiter/interviews" })}>
          <Bot className="size-4 mr-2" /> Send AI interview invites
        </Button>
      </Card>
    </RecruiterPage>
  );
}
