import { createFileRoute } from "@tanstack/react-router";
import RecruiterPage from "@/components/RecruiterPage";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CANDIDATES } from "@/lib/mock-data";
import { Bot, ShieldAlert, Download } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/recruiter/reports")({
  head: () => ({ meta: [{ title: "AI Interview Reports · VidioHire AI" }] }),
  component: Reports,
});

function Reports() {
  return (
    <RecruiterPage
      badge="Reports"
      title="AI Interview Reports"
      subtitle="Full transcripts, scoring, integrity logs and AI recommendations for every interview."
      stats={[
        { label: "Reports (30d)", value: 67 },
        { label: "Recommended hire", value: 21 },
        { label: "Integrity issues", value: 4 },
        { label: "Avg score", value: "82" },
      ]}
    >
      <Card className="glass overflow-hidden">
        {CANDIDATES.slice(0, 10).map((c, i) => (
          <div key={c.id} className="grid grid-cols-12 px-4 py-3 items-center hover:bg-accent/30 border-b border-border last:border-0">
            <div className="col-span-4 flex items-center gap-3 min-w-0">
              <div className="size-9 rounded-md grid place-items-center text-xs font-bold text-primary-foreground" style={{ background: c.videoThumb }}>{c.avatar}</div>
              <div className="min-w-0">
                <div className="text-sm font-medium truncate">{c.name}</div>
                <div className="text-[11px] text-muted-foreground truncate">{c.headline}</div>
              </div>
            </div>
            <div className="col-span-2 text-sm">Score {c.matchScore}</div>
            <div className="col-span-3 flex gap-1.5 flex-wrap">
              <Badge className="bg-primary/20 text-primary border-primary/30 text-[10px]"><Bot className="size-3 mr-1" /> AI scored</Badge>
              {i % 4 === 0 && <Badge className="bg-warning/20 text-warning border-warning/30 text-[10px]"><ShieldAlert className="size-3 mr-1" /> Tab switch</Badge>}
            </div>
            <div className="col-span-2 text-xs text-muted-foreground">{i + 1}d ago</div>
            <div className="col-span-1 text-right">
              <Button size="sm" variant="outline" onClick={() => toast.success("Report downloaded")}><Download className="size-3.5" /></Button>
            </div>
          </div>
        ))}
      </Card>
    </RecruiterPage>
  );
}
