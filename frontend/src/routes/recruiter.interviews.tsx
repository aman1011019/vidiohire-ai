import { createFileRoute } from "@tanstack/react-router";
import RecruiterPage from "@/components/RecruiterPage";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CANDIDATES } from "@/lib/mock-data";
import { Video, Bot, Calendar, Clock } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/recruiter/interviews")({
  head: () => ({ meta: [{ title: "Interviews · VidioHire AI" }] }),
  component: Interviews,
});

function Interviews() {
  const sessions = CANDIDATES.slice(0, 8).map((c, i) => ({
    c,
    when: ["Today 14:00", "Today 16:30", "Tomorrow 10:00", "Wed 11:30", "Wed 15:00", "Thu 09:00", "Thu 13:00", "Fri 11:00"][i],
    status: ["Live now", "Scheduled", "Scheduled", "AI review", "Completed", "Scheduled", "AI review", "Scheduled"][i],
    type: i % 2 === 0 ? "AI screening" : "Technical",
  }));

  return (
    <RecruiterPage
      badge="Interviews"
      title="Interview Control Center"
      subtitle="Live and scheduled AI interviews with realtime integrity monitoring."
      stats={[
        { label: "Live now", value: 1 },
        { label: "Scheduled", value: 12 },
        { label: "Pending review", value: 7 },
        { label: "Completed (7d)", value: 34 },
      ]}
    >
      <Card className="glass overflow-hidden">
        <div className="grid grid-cols-12 px-4 py-2 text-[11px] uppercase tracking-wider text-muted-foreground border-b border-border">
          <div className="col-span-4">Candidate</div>
          <div className="col-span-3">When</div>
          <div className="col-span-2">Type</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-1 text-right">Action</div>
        </div>
        {sessions.map(({ c, when, status, type }) => (
          <div key={c.id} className="grid grid-cols-12 px-4 py-3 items-center hover:bg-accent/30 border-b border-border last:border-0">
            <div className="col-span-4 flex items-center gap-3 min-w-0">
              <div className="size-9 rounded-md grid place-items-center text-xs font-bold text-primary-foreground" style={{ background: c.videoThumb }}>{c.avatar}</div>
              <div className="min-w-0">
                <div className="text-sm font-medium truncate">{c.name}</div>
                <div className="text-[11px] text-muted-foreground truncate">{c.headline}</div>
              </div>
            </div>
            <div className="col-span-3 text-sm flex items-center gap-1.5"><Calendar className="size-3.5 text-muted-foreground" /> {when}</div>
            <div className="col-span-2"><Badge variant="outline" className="text-[10px]">{type}</Badge></div>
            <div className="col-span-2">
              <Badge className={
                status === "Live now" ? "bg-destructive/20 text-destructive border-destructive/30 animate-pulse" :
                status === "Completed" ? "bg-success/20 text-success border-success/30" :
                status === "AI review" ? "bg-accent/20 text-accent border-accent/30" :
                "bg-primary/20 text-primary border-primary/30"
              }>
                {status === "Live now" ? <Clock className="size-3 mr-1" /> : null}{status}
              </Badge>
            </div>
            <div className="col-span-1 text-right">
              <Button size="sm" variant="outline" onClick={() => toast.success(`Opened ${c.name}`)}>
                {status === "Live now" ? <Video className="size-3.5" /> : <Bot className="size-3.5" />}
              </Button>
            </div>
          </div>
        ))}
      </Card>
    </RecruiterPage>
  );
}
