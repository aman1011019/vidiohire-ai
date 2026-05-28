import { createFileRoute } from "@tanstack/react-router";
import AppShell from "@/components/AppShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Sparkles, Check, X, Lightbulb } from "lucide-react";
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from "recharts";
import { toast } from "sonner";

export const Route = createFileRoute("/feedback")({
  head: () => ({ meta: [{ title: "Interview Feedback · VidioHire AI" }] }),
  component: Feedback,
});

const skills = [
  { s: "Communication", v: 88 }, { s: "Confidence", v: 92 }, { s: "Clarity", v: 81 },
  { s: "Technical", v: 76 }, { s: "EQ", v: 84 }, { s: "Pacing", v: 79 },
];

function Feedback() {
  return (
    <AppShell>
      <div className="space-y-6 max-w-5xl mx-auto">
        <div className="flex flex-wrap justify-between items-end gap-3">
          <div>
            <Badge className="bg-accent/40 mb-1"><Sparkles className="size-3 mr-1"/>AI scorecard</Badge>
            <h1 className="text-3xl font-bold">Interview Feedback Report</h1>
            <p className="text-muted-foreground">Senior Frontend Engineer · Tech Expert · Today</p>
          </div>
          <Button onClick={()=>toast.success("PDF downloaded")} className="gradient-primary text-primary-foreground glow"><Download className="size-4 mr-2"/>Download PDF</Button>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <Card className="glass-strong p-6 md:col-span-1 text-center">
            <div className="text-sm text-muted-foreground">Overall score</div>
            <div className="text-6xl font-bold gradient-text mt-2">84</div>
            <div className="text-sm text-success mt-1">Strong hire signal</div>
            <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
              {[
                {l:"Technical",v:76},{l:"Communication",v:88},{l:"Confidence",v:92},{l:"EQ",v:84},
              ].map(m=>(
                <div key={m.l} className="p-2 rounded-lg bg-muted/40"><div className="text-muted-foreground">{m.l}</div><div className="font-semibold">{m.v}</div></div>
              ))}
            </div>
          </Card>

          <Card className="glass p-5 md:col-span-2">
            <div className="font-semibold mb-2">Skill profile</div>
            <div className="h-72">
              <ResponsiveContainer>
                <RadarChart data={skills}>
                  <PolarGrid stroke="oklch(0.30 0.04 270 / 0.5)" />
                  <PolarAngleAxis dataKey="s" stroke="oklch(0.7 0.03 260)" fontSize={11} />
                  <Radar dataKey="v" stroke="oklch(0.78 0.20 220)" fill="oklch(0.72 0.20 265)" fillOpacity={0.5} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <Card className="glass p-5">
            <div className="font-semibold flex items-center gap-2 mb-3 text-success"><Check className="size-4"/>Strengths</div>
            <ul className="text-sm space-y-2">
              {["Clear, structured answers using STAR pattern","High vocal confidence and consistent pacing","Strong examples backing up React reconciliation","Asked thoughtful clarifying questions"].map(s=><li key={s}>• {s}</li>)}
            </ul>
          </Card>
          <Card className="glass p-5">
            <div className="font-semibold flex items-center gap-2 mb-3 text-warning"><X className="size-4"/>Areas to improve</div>
            <ul className="text-sm space-y-2">
              {["Deeper system design coverage (caching, partitioning)","Reduce 'um' filler frequency (7 detected)","Tighten architecture explanation to 90s max","Mention tradeoffs explicitly when comparing tools"].map(s=><li key={s}>• {s}</li>)}
            </ul>
          </Card>
        </div>

        <Card className="glass-strong p-5">
          <div className="font-semibold flex items-center gap-2 mb-3"><Lightbulb className="size-4 text-neon"/>Recommended learning path</div>
          <div className="grid sm:grid-cols-3 gap-3">
            {["System Design Primer · 2h","Advanced TypeScript Patterns · 4h","Mock interview: Distributed systems · 1h"].map(c=>(
              <div key={c} className="p-3 rounded-lg border border-border bg-muted/30 text-sm">{c}</div>
            ))}
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
