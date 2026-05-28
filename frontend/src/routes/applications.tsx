import { createFileRoute, Link } from "@tanstack/react-router";
import AppShell from "@/components/AppShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useApp } from "@/lib/store";
import { JOBS } from "@/lib/mock-data";
import { toast } from "sonner";

export const Route = createFileRoute("/applications")({
  head: () => ({ meta: [{ title: "Applications · VidioHire AI" }] }),
  component: Apps,
});

const STAGES = ["Applied","Under Review","Shortlisted","Interview","Selected","Rejected"];

function Apps() {
  const { applications, withdraw, savedJobs } = useApp();
  const map = Object.fromEntries(JOBS.map((j) => [j.id, j]));

  return (
    <AppShell>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Applications & saved jobs</h1>

        <Card className="glass p-5">
          <div className="font-semibold mb-3">Active applications</div>
          {applications.length === 0 ? (
            <div className="text-sm text-muted-foreground py-6 text-center">No applications yet. <Link to="/jobs" className="text-primary">Browse jobs →</Link></div>
          ) : (
            <div className="space-y-3">
              {applications.map((a, i) => {
                const j = map[a.jobId]; if (!j) return null;
                const stageIdx = i % STAGES.length;
                return (
                  <div key={a.id} className="p-4 rounded-xl border border-border bg-muted/30 flex flex-wrap items-center gap-4">
                    <div className="size-12 rounded-lg gradient-primary grid place-items-center text-primary-foreground font-bold">{j.logo}</div>
                    <div className="flex-1 min-w-[200px]">
                      <Link to="/jobs/$jobId" params={{ jobId: j.id }} className="font-semibold hover:gradient-text">{j.title}</Link>
                      <div className="text-xs text-muted-foreground">{j.company} · {j.location}</div>
                    </div>
                    <div className="flex-1 min-w-[260px]">
                      <div className="flex items-center gap-1">
                        {STAGES.map((s, idx) => (
                          <div key={s} className="flex-1">
                            <div className={`h-1.5 rounded-full ${idx<=stageIdx?"gradient-primary":"bg-muted"}`}/>
                            <div className={`text-[10px] mt-1 ${idx<=stageIdx?"text-foreground":"text-muted-foreground"}`}>{s}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={()=>{withdraw(j.id); toast.success("Application withdrawn");}}>Withdraw</Button>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        <Card className="glass p-5">
          <div className="font-semibold mb-3">Saved jobs ({savedJobs.length})</div>
          {savedJobs.length === 0 ? (
            <div className="text-sm text-muted-foreground py-6 text-center">Save jobs from the Jobs page to revisit later.</div>
          ) : (
            <div className="grid md:grid-cols-2 gap-3">
              {savedJobs.map((id) => {
                const j = map[id]; if (!j) return null;
                return (
                  <Link key={id} to="/jobs/$jobId" params={{ jobId: id }} className="p-3 rounded-lg border border-border flex items-center gap-3 hover:bg-accent/30">
                    <div className="size-10 rounded-lg gradient-primary grid place-items-center text-primary-foreground font-bold">{j.logo}</div>
                    <div className="flex-1 min-w-0"><div className="font-medium truncate">{j.title}</div><div className="text-xs text-muted-foreground">{j.company}</div></div>
                    <Badge className="bg-success/20 text-success border-success/30">{j.matchScore}%</Badge>
                  </Link>
                );
              })}
            </div>
          )}
        </Card>
      </div>
    </AppShell>
  );
}
