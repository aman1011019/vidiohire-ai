import { createFileRoute } from "@tanstack/react-router";
import RecruiterPage from "@/components/RecruiterPage";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CANDIDATES } from "@/lib/mock-data";
import { Sparkles, ThumbsUp, ThumbsDown } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/recruiter/recommendations")({
  head: () => ({ meta: [{ title: "Hiring Recommendations · VidioHire AI" }] }),
  component: Recs,
});

function Recs() {
  const recs = [...CANDIDATES].sort((a, b) => b.matchScore - a.matchScore).slice(0, 6);
  return (
    <RecruiterPage
      badge="AI"
      title="Hiring Recommendations"
      subtitle="VidioHire AI synthesizes signals across interviews, resumes and tasks into a single recommendation."
    >
      <div className="grid lg:grid-cols-2 gap-4">
        {recs.map((c, i) => (
          <Card key={c.id} className="glass p-5">
            <div className="flex items-start gap-3 mb-3">
              <div className="size-10 rounded-lg grid place-items-center text-sm font-bold text-primary-foreground" style={{ background: c.videoThumb }}>{c.avatar}</div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold truncate">{c.name}</div>
                <div className="text-xs text-muted-foreground truncate">{c.headline}</div>
              </div>
              <Badge className={i < 2 ? "bg-success/20 text-success border-success/30" : "bg-primary/20 text-primary border-primary/30"}>
                {i < 2 ? "Strong hire" : i < 4 ? "Hire" : "Lean hire"}
              </Badge>
            </div>
            <div className="text-sm flex items-start gap-2 mb-3">
              <Sparkles className="size-4 text-primary shrink-0 mt-0.5" />
              <p className="text-muted-foreground">{c.bio}</p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" className="flex-1 gradient-primary text-primary-foreground" onClick={() => toast.success("Endorsed")}><ThumbsUp className="size-3.5 mr-1" /> Endorse</Button>
              <Button size="sm" variant="outline" onClick={() => toast.message("Dismissed")}><ThumbsDown className="size-3.5" /></Button>
            </div>
          </Card>
        ))}
      </div>
    </RecruiterPage>
  );
}
