import { createFileRoute } from "@tanstack/react-router";
import RecruiterPage from "@/components/RecruiterPage";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CANDIDATES, JOBS } from "@/lib/mock-data";
import { toast } from "sonner";

export const Route = createFileRoute("/recruiter/applications")({
  head: () => ({ meta: [{ title: "Applications · VidioHire AI" }] }),
  component: Applications,
});

function Applications() {
  const apps = CANDIDATES.map((c, i) => ({ c, job: JOBS[i % JOBS.length], date: `${(i % 9) + 1}d ago` }));
  return (
    <RecruiterPage
      badge="Inbox"
      title="Applications"
      subtitle="All inbound applications across jobs, scored and triaged by AI."
      stats={[
        { label: "New (24h)", value: 18 },
        { label: "This week", value: 84 },
        { label: "Total", value: apps.length },
        { label: "AI shortlisted", value: 22 },
      ]}
    >
      <Card className="glass overflow-hidden">
        {apps.slice(0, 14).map(({ c, job, date }) => (
          <div key={c.id} className="grid grid-cols-12 px-4 py-3 items-center hover:bg-accent/30 border-b border-border last:border-0">
            <div className="col-span-4 flex items-center gap-3 min-w-0">
              <div className="size-9 rounded-md grid place-items-center text-xs font-bold text-primary-foreground" style={{ background: c.videoThumb }}>{c.avatar}</div>
              <div className="min-w-0">
                <div className="text-sm font-medium truncate">{c.name}</div>
                <div className="text-[11px] text-muted-foreground truncate">{c.headline}</div>
              </div>
            </div>
            <div className="col-span-3 text-sm truncate">{job.title}</div>
            <div className="col-span-2 text-xs text-muted-foreground">{date}</div>
            <div className="col-span-1"><Badge className="bg-success/20 text-success border-success/30">{c.matchScore}%</Badge></div>
            <div className="col-span-2 flex justify-end gap-1">
              <Button size="sm" variant="outline" onClick={() => toast.message("Rejected")}>Reject</Button>
              <Button size="sm" className="gradient-primary text-primary-foreground" onClick={() => toast.success("Shortlisted")}>Shortlist</Button>
            </div>
          </div>
        ))}
      </Card>
    </RecruiterPage>
  );
}
