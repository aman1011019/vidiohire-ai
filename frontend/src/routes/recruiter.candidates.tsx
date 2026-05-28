import { createFileRoute } from "@tanstack/react-router";
import RecruiterPage from "@/components/RecruiterPage";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { CANDIDATES } from "@/lib/mock-data";
import { Search, Bookmark, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/recruiter/candidates")({
  head: () => ({ meta: [{ title: "Candidates · VidioHire AI" }] }),
  component: Candidates,
});

function Candidates() {
  const [q, setQ] = useState("");
  const [min, setMin] = useState([70]);
  const filtered = useMemo(
    () =>
      CANDIDATES.filter(
        (c) =>
          c.matchScore >= min[0] &&
          (q === "" || c.name.toLowerCase().includes(q.toLowerCase()) || c.skills.join(" ").toLowerCase().includes(q.toLowerCase()))
      ).sort((a, b) => b.matchScore - a.matchScore),
    [q, min]
  );

  return (
    <RecruiterPage
      badge="Talent pool"
      title="Candidates"
      subtitle="Browse, filter and shortlist the entire talent pool with AI-ranked match scores."
      stats={[
        { label: "Total", value: CANDIDATES.length },
        { label: "Matching filter", value: filtered.length },
        { label: "Avg match", value: `${Math.round(filtered.reduce((a, c) => a + c.matchScore, 0) / Math.max(1, filtered.length))}%` },
        { label: "Shortlisted", value: 24 },
      ]}
    >
      <Card className="glass p-4 flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-2 flex-1 min-w-[220px]">
          <Search className="size-4 text-muted-foreground" />
          <Input placeholder="Search name or skill…" value={q} onChange={(e) => setQ(e.target.value)} className="bg-transparent border-0 focus-visible:ring-0" />
        </div>
        <div className="flex items-center gap-3 min-w-[220px]">
          <span className="text-xs text-muted-foreground whitespace-nowrap">Min match {min[0]}%</span>
          <Slider value={min} onValueChange={setMin} max={100} step={1} className="w-40" />
        </div>
      </Card>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((c) => (
          <Card key={c.id} className="glass p-4 hover:glow transition-all">
            <div className="flex items-start gap-3">
              <div className="size-12 rounded-lg grid place-items-center text-sm font-bold text-primary-foreground" style={{ background: c.videoThumb }}>{c.avatar}</div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold truncate">{c.name}</div>
                <div className="text-xs text-muted-foreground truncate">{c.headline}</div>
              </div>
              <Badge className="bg-success/20 text-success border-success/30">{c.matchScore}%</Badge>
            </div>
            <div className="flex flex-wrap gap-1 mt-3">
              {c.skills.slice(0, 3).map((s) => <Badge key={s} variant="outline" className="text-[10px]">{s}</Badge>)}
            </div>
            <div className="flex gap-2 mt-3">
              <Button size="sm" className="flex-1 gradient-primary text-primary-foreground" onClick={() => toast.success(`Shortlisted ${c.name}`)}><Sparkles className="size-3 mr-1" /> Shortlist</Button>
              <Button size="sm" variant="outline" onClick={() => toast.success("Saved")}><Bookmark className="size-4" /></Button>
            </div>
          </Card>
        ))}
      </div>
    </RecruiterPage>
  );
}
