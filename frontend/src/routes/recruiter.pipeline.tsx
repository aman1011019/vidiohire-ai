import { createFileRoute } from "@tanstack/react-router";
import RecruiterPage from "@/components/RecruiterPage";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CANDIDATES, type Candidate } from "@/lib/mock-data";
import { ChevronUp, ChevronDown, Filter } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/recruiter/pipeline")({
  head: () => ({ meta: [{ title: "Hiring Pipeline · VidioHire AI" }] }),
  component: Pipeline,
});

const STAGES = ["Applied", "Screening", "Shortlisted", "Interview", "Offer", "Hired"];

function Pipeline() {
  const [pipeline, setPipeline] = useState<Record<string, Candidate[]>>(() => {
    const out: Record<string, Candidate[]> = Object.fromEntries(STAGES.map((s) => [s, []]));
    CANDIDATES.forEach((c, i) => out[STAGES[i % STAGES.length]].push(c));
    return out;
  });

  const move = (stage: string, id: string, dir: -1 | 1) => {
    const i = STAGES.indexOf(stage);
    const ni = Math.min(STAGES.length - 1, Math.max(0, i + dir));
    if (ni === i) return;
    setPipeline((p) => {
      const cand = p[stage].find((c) => c.id === id)!;
      return { ...p, [stage]: p[stage].filter((c) => c.id !== id), [STAGES[ni]]: [...p[STAGES[ni]], cand] };
    });
    toast.success(`Moved to ${STAGES[ni]}`);
  };

  return (
    <RecruiterPage
      badge="Pipeline"
      title="Hiring Pipeline"
      subtitle="Drag candidates through stages. AI auto-tags risk, fit and velocity signals."
      stats={STAGES.map((s) => ({ label: s, value: pipeline[s].length }))}
      actions={<Button variant="outline"><Filter className="size-4 mr-2" /> Filter</Button>}
    >
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {STAGES.map((s) => (
          <Card key={s} className="glass p-3 min-w-[180px]">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-semibold">{s}</div>
              <Badge variant="outline">{pipeline[s].length}</Badge>
            </div>
            <div className="space-y-2 max-h-[60vh] overflow-y-auto scrollbar-thin">
              {pipeline[s].map((c) => (
                <div key={c.id} className="p-2 rounded-lg bg-muted/40 border border-border">
                  <div className="text-xs font-medium truncate">{c.name}</div>
                  <div className="text-[10px] text-muted-foreground truncate">{c.headline}</div>
                  <div className="flex items-center justify-between mt-1.5">
                    <Badge className="bg-success/20 text-success border-success/30 text-[10px]">{c.matchScore}%</Badge>
                    <div className="flex gap-1">
                      <button onClick={() => move(s, c.id, -1)} className="size-5 rounded grid place-items-center hover:bg-accent/40"><ChevronUp className="size-3" /></button>
                      <button onClick={() => move(s, c.id, 1)} className="size-5 rounded grid place-items-center hover:bg-accent/40"><ChevronDown className="size-3" /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </RecruiterPage>
  );
}
