import { createFileRoute } from "@tanstack/react-router";
import RecruiterPage from "@/components/RecruiterPage";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CANDIDATES } from "@/lib/mock-data";
import { Mail, Video } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/recruiter/shortlisted")({
  head: () => ({ meta: [{ title: "Shortlisted · VidioHire AI" }] }),
  component: Shortlisted,
});

function Shortlisted() {
  const list = [...CANDIDATES].sort((a, b) => b.matchScore - a.matchScore).slice(0, 9);
  return (
    <RecruiterPage
      badge="Shortlist"
      title="Shortlisted Candidates"
      subtitle="Your high-signal candidates ready for interview, offer or hire."
      stats={[
        { label: "Total", value: list.length },
        { label: "Ready to interview", value: 6 },
        { label: "Offers out", value: 2 },
        { label: "Avg match", value: `${Math.round(list.reduce((a, c) => a + c.matchScore, 0) / list.length)}%` },
      ]}
    >
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {list.map((c) => (
          <Card key={c.id} className="glass p-5">
            <div className="flex items-start gap-3">
              <div className="size-12 rounded-lg grid place-items-center text-sm font-bold text-primary-foreground" style={{ background: c.videoThumb }}>{c.avatar}</div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold truncate">{c.name}</div>
                <div className="text-xs text-muted-foreground truncate">{c.headline}</div>
              </div>
              <Badge className="bg-success/20 text-success border-success/30">{c.matchScore}%</Badge>
            </div>
            <div className="mt-3 text-xs text-muted-foreground line-clamp-2">{c.bio}</div>
            <div className="grid grid-cols-3 gap-2 mt-3 text-center text-[10px]">
              <div className="rounded-md bg-muted/40 p-1.5"><div className="text-muted-foreground">Comm</div><div className="font-semibold">{c.communication}</div></div>
              <div className="rounded-md bg-muted/40 p-1.5"><div className="text-muted-foreground">Conf</div><div className="font-semibold">{c.confidence}</div></div>
              <div className="rounded-md bg-muted/40 p-1.5"><div className="text-muted-foreground">EQ</div><div className="font-semibold">{c.emotional}</div></div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button size="sm" className="flex-1 gradient-primary text-primary-foreground" onClick={() => toast.success(`Interview invite sent to ${c.name}`)}><Video className="size-3.5 mr-1" /> Invite</Button>
              <Button size="sm" variant="outline" onClick={() => toast.success("Message drafted")}><Mail className="size-4" /></Button>
            </div>
          </Card>
        ))}
      </div>
    </RecruiterPage>
  );
}
