import { createFileRoute, useNavigate, Outlet, useRouterState } from "@tanstack/react-router";
import RecruiterPage from "@/components/RecruiterPage";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { JOBS } from "@/lib/mock-data";
import { Plus, MapPin, Users } from "lucide-react";

export const Route = createFileRoute("/recruiter/jobs")({
  head: () => ({ meta: [{ title: "Jobs · VidioHire AI" }] }),
  component: Jobs,
});

function Jobs() {
  const nav = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  if (pathname !== "/recruiter/jobs") return <Outlet />;

  return (
    <RecruiterPage
      badge="Job management"
      title="All Jobs"
      subtitle="Active, draft and archived job postings across your organization."
      stats={[
        { label: "Active", value: 12 },
        { label: "Draft", value: 3 },
        { label: "Total applicants", value: 312 },
        { label: "Avg time to fill", value: "21d" },
      ]}
      actions={
        <Button className="gradient-primary text-primary-foreground" onClick={() => nav({ to: "/recruiter/jobs/create" })}>
          <Plus className="size-4 mr-2" /> Create job
        </Button>
      }
    >
      <div className="grid gap-3">
        {JOBS.map((j) => (
          <Card key={j.id} className="glass p-4 flex flex-wrap items-center gap-4 hover:glow transition-all">
            <div className="size-12 rounded-xl grid place-items-center bg-primary/20 text-primary font-bold text-lg shrink-0">{j.logo}</div>
            <div className="flex-1 min-w-[200px]">
              <div className="font-semibold">{j.title}</div>
              <div className="text-xs text-muted-foreground flex items-center gap-2">{j.company} · <MapPin className="size-3" /> {j.location}</div>
              <div className="flex flex-wrap gap-1 mt-2">
                {j.skills.slice(0, 4).map((s) => <Badge key={s} variant="outline" className="text-[10px]">{s}</Badge>)}
              </div>
            </div>
            <div className="text-right space-y-1">
              <Badge className="bg-success/20 text-success border-success/30">Open</Badge>
              <div className="text-xs text-muted-foreground flex items-center gap-1 justify-end"><Users className="size-3" /> {20 + (parseInt(j.id.split("_")[1]) * 3)} applicants</div>
            </div>
            <Button size="sm" variant="outline">Manage</Button>
          </Card>
        ))}
      </div>
    </RecruiterPage>
  );
}
