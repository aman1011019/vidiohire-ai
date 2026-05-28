import { createFileRoute } from "@tanstack/react-router";
import RecruiterPage from "@/components/RecruiterPage";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/recruiter/performance")({
  head: () => ({ meta: [{ title: "Recruitment Performance · VidioHire AI" }] }),
  component: Perf,
});

function Perf() {
  const team = [
    { n: "Jordan Lee", role: "Recruiter Lead", hires: 6, interviews: 38, offer: "84%" },
    { n: "Mei Tanaka", role: "Sourcer", hires: 3, interviews: 22, offer: "78%" },
    { n: "Diego Alvarez", role: "Recruiter", hires: 4, interviews: 27, offer: "80%" },
    { n: "Priya Shah", role: "Coordinator", hires: 1, interviews: 14, offer: "—" },
  ];
  return (
    <RecruiterPage
      badge="Team"
      title="Recruitment Performance"
      subtitle="Per-recruiter throughput, conversion and quality metrics."
      stats={[
        { label: "Team hires (Q)", value: 14 },
        { label: "Interviews", value: 101 },
        { label: "Offer rate", value: "81%" },
        { label: "Avg response", value: "4h" },
      ]}
    >
      <Card className="glass overflow-hidden">
        <div className="grid grid-cols-12 px-4 py-2 text-[11px] uppercase tracking-wider text-muted-foreground border-b border-border">
          <div className="col-span-4">Recruiter</div>
          <div className="col-span-3">Role</div>
          <div className="col-span-2 text-right">Hires</div>
          <div className="col-span-2 text-right">Interviews</div>
          <div className="col-span-1 text-right">Offer</div>
        </div>
        {team.map((t) => (
          <div key={t.n} className="grid grid-cols-12 px-4 py-3 items-center border-b border-border last:border-0">
            <div className="col-span-4 text-sm font-medium">{t.n}</div>
            <div className="col-span-3"><Badge variant="outline" className="text-[10px]">{t.role}</Badge></div>
            <div className="col-span-2 text-right text-sm">{t.hires}</div>
            <div className="col-span-2 text-right text-sm">{t.interviews}</div>
            <div className="col-span-1 text-right text-sm">{t.offer}</div>
          </div>
        ))}
      </Card>
    </RecruiterPage>
  );
}
