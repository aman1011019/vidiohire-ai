import { createFileRoute } from "@tanstack/react-router";
import RecruiterPage from "@/components/RecruiterPage";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CANDIDATES } from "@/lib/mock-data";
import { FileText, Upload } from "lucide-react";

export const Route = createFileRoute("/recruiter/resume-intelligence")({
  head: () => ({ meta: [{ title: "Resume Intelligence · VidioHire AI" }] }),
  component: ResumeIntel,
});

function ResumeIntel() {
  return (
    <RecruiterPage
      badge="AI"
      title="Resume Intelligence"
      subtitle="Parsed resumes, extracted skills, seniority and gap analysis — all powered by AI."
      stats={[
        { label: "Resumes parsed", value: 412 },
        { label: "Avg seniority", value: "Senior" },
        { label: "Top skill", value: "React" },
        { label: "Skill gaps", value: 9 },
      ]}
      actions={<Button className="gradient-primary text-primary-foreground"><Upload className="size-4 mr-2" /> Bulk upload</Button>}
    >
      <div className="grid lg:grid-cols-2 gap-4">
        {CANDIDATES.slice(0, 6).map((c) => (
          <Card key={c.id} className="glass p-5">
            <div className="flex items-start gap-3 mb-3">
              <div className="size-10 rounded-lg grid place-items-center text-primary bg-primary/15 shrink-0"><FileText className="size-5" /></div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold truncate">{c.name} · {c.headline}</div>
                <div className="text-xs text-muted-foreground">{c.experience} yrs experience · {c.location}</div>
              </div>
              <Badge className="bg-success/20 text-success border-success/30">Parsed</Badge>
            </div>
            <div className="text-xs text-muted-foreground mb-2">Extracted skills</div>
            <div className="flex flex-wrap gap-1 mb-3">
              {c.skills.map((s) => <Badge key={s} variant="outline" className="text-[10px]">{s}</Badge>)}
            </div>
            <div className="text-xs text-muted-foreground mb-1">AI summary</div>
            <p className="text-sm">{c.bio}</p>
          </Card>
        ))}
      </div>
    </RecruiterPage>
  );
}
