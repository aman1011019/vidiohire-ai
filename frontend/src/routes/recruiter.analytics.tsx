import { createFileRoute } from "@tanstack/react-router";
import RecruiterPage from "@/components/RecruiterPage";
import { Card } from "@/components/ui/card";

export const Route = createFileRoute("/recruiter/analytics")({
  head: () => ({ meta: [{ title: "Hiring Analytics · VidioHire AI" }] }),
  component: Analytics,
});

function Analytics() {
  const funnel = [
    { l: "Sourced", v: 1240 }, { l: "Applied", v: 312 }, { l: "Screened", v: 184 },
    { l: "Interviewed", v: 76 }, { l: "Offer", v: 22 }, { l: "Hired", v: 14 },
  ];
  return (
    <RecruiterPage
      badge="Analytics"
      title="Hiring Analytics"
      subtitle="Funnel, source quality, time-to-hire and diversity insights."
      stats={[
        { label: "Time to hire", value: "21d", hint: "↓ 18% QoQ" },
        { label: "Offer accept", value: "82%", hint: "↑ 4 pts" },
        { label: "Cost per hire", value: "$2.1k" },
        { label: "Quality of hire", value: "4.6/5" },
      ]}
    >
      <div className="grid lg:grid-cols-2 gap-4">
        <Card className="glass p-6">
          <div className="text-sm font-semibold mb-4">Funnel</div>
          {funnel.map((s, i) => (
            <div key={s.l} className="flex items-center gap-3 mb-2">
              <div className="w-24 text-xs">{s.l}</div>
              <div className="flex-1 h-3 rounded-full bg-muted overflow-hidden">
                <div className="h-full gradient-primary" style={{ width: `${100 - i * 14}%` }} />
              </div>
              <div className="w-14 text-right text-sm">{s.v}</div>
            </div>
          ))}
        </Card>
        <Card className="glass p-6">
          <div className="text-sm font-semibold mb-4">Sources</div>
          {[{ l: "Inbound", v: 38 }, { l: "Referrals", v: 24 }, { l: "LinkedIn", v: 20 }, { l: "Events", v: 10 }, { l: "Other", v: 8 }].map((s) => (
            <div key={s.l} className="flex items-center gap-3 mb-2">
              <div className="w-24 text-xs">{s.l}</div>
              <div className="flex-1 h-3 rounded-full bg-muted overflow-hidden"><div className="h-full bg-accent" style={{ width: `${s.v * 2}%` }} /></div>
              <div className="w-12 text-right text-sm">{s.v}%</div>
            </div>
          ))}
        </Card>
      </div>
    </RecruiterPage>
  );
}
