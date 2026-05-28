import { createFileRoute } from "@tanstack/react-router";
import RecruiterPage from "@/components/RecruiterPage";
import { Card } from "@/components/ui/card";
import { Sparkles, TrendingUp, AlertTriangle, Lightbulb } from "lucide-react";

export const Route = createFileRoute("/recruiter/insights")({
  head: () => ({ meta: [{ title: "AI Insights · VidioHire AI" }] }),
  component: Insights,
});

function Insights() {
  const items = [
    { icon: TrendingUp, color: "text-success", title: "Hiring velocity up 22%", body: "Time-to-offer dropped from 27d to 21d this quarter." },
    { icon: Sparkles, color: "text-primary", title: "Top source: referrals", body: "Referred candidates close 2.3× faster than inbound." },
    { icon: AlertTriangle, color: "text-warning", title: "Bottleneck at interview stage", body: "3 jobs have >5 candidates waiting on interview scheduling." },
    { icon: Lightbulb, color: "text-accent", title: "Try async video screens", body: "Teams using async video screens shortened time-to-shortlist by 38%." },
  ];
  return (
    <RecruiterPage badge="AI" title="AI Insights" subtitle="Actionable, AI-generated recommendations to improve your hiring funnel.">
      <div className="grid lg:grid-cols-2 gap-4">
        {items.map((it) => (
          <Card key={it.title} className="glass p-5 flex gap-3">
            <div className={`size-10 rounded-lg grid place-items-center bg-muted/40 ${it.color}`}><it.icon className="size-5" /></div>
            <div>
              <div className="font-semibold">{it.title}</div>
              <div className="text-sm text-muted-foreground">{it.body}</div>
            </div>
          </Card>
        ))}
      </div>
    </RecruiterPage>
  );
}
