import { createFileRoute } from "@tanstack/react-router";
import RecruiterPage from "@/components/RecruiterPage";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CANDIDATES } from "@/lib/mock-data";
import { Sparkles, Brain, ShieldCheck, AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/recruiter/ai-analysis")({
  head: () => ({ meta: [{ title: "AI Candidate Analysis · VidioHire AI" }] }),
  component: AIAnalysis,
});

function AIAnalysis() {
  const top = [...CANDIDATES].sort((a, b) => b.matchScore - a.matchScore).slice(0, 6);
  return (
    <RecruiterPage
      badge="AI"
      title="AI Candidate Analysis"
      subtitle="Skill, communication, confidence and integrity signals across your candidate pool."
      stats={[
        { label: "Candidates analyzed", value: CANDIDATES.length },
        { label: "Avg match score", value: `${Math.round(CANDIDATES.reduce((a, c) => a + c.matchScore, 0) / CANDIDATES.length)}%` },
        { label: "Integrity flags", value: 3 },
        { label: "Strong hires", value: 11 },
      ]}
    >
      <div className="grid lg:grid-cols-2 gap-4">
        {top.map((c) => (
          <Card key={c.id} className="glass p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="size-10 rounded-lg grid place-items-center text-sm font-bold text-primary-foreground" style={{ background: c.videoThumb }}>{c.avatar}</div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold truncate">{c.name}</div>
                <div className="text-xs text-muted-foreground truncate">{c.headline}</div>
              </div>
              <Badge className="bg-success/20 text-success border-success/30">{c.matchScore}%</Badge>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-[11px] mb-3">
              <div className="rounded-md bg-muted/40 p-2"><div className="text-muted-foreground">Skill fit</div><div className="font-semibold">{c.matchScore}%</div></div>
              <div className="rounded-md bg-muted/40 p-2"><div className="text-muted-foreground">Communication</div><div className="font-semibold">{c.communication}</div></div>
              <div className="rounded-md bg-muted/40 p-2"><div className="text-muted-foreground">Integrity</div><div className="font-semibold text-success">High</div></div>
            </div>
            <ul className="text-xs space-y-1.5 text-muted-foreground">
              <li className="flex gap-2"><Sparkles className="size-3.5 text-primary mt-0.5" /> Strong systems thinking & ownership signal.</li>
              <li className="flex gap-2"><Brain className="size-3.5 text-accent mt-0.5" /> Deep experience with {c.skills.slice(0, 2).join(", ")}.</li>
              <li className="flex gap-2"><ShieldCheck className="size-3.5 text-success mt-0.5" /> Clean interview integrity — no anomalies.</li>
              {c.matchScore < 80 && <li className="flex gap-2"><AlertTriangle className="size-3.5 text-warning mt-0.5" /> Stretch on senior-level system design.</li>}
            </ul>
          </Card>
        ))}
      </div>
    </RecruiterPage>
  );
}
