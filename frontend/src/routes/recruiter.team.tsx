import { createFileRoute } from "@tanstack/react-router";
import RecruiterPage from "@/components/RecruiterPage";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserPlus } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/recruiter/team")({
  head: () => ({ meta: [{ title: "Team Management · VidioHire AI" }] }),
  component: Team,
});

function Team() {
  const team = [
    { n: "Jordan Lee", e: "jordan@vidiohire.ai", r: "Admin" },
    { n: "Mei Tanaka", e: "mei@vidiohire.ai", r: "Recruiter" },
    { n: "Diego Alvarez", e: "diego@vidiohire.ai", r: "Recruiter" },
    { n: "Priya Shah", e: "priya@vidiohire.ai", r: "Coordinator" },
  ];
  return (
    <RecruiterPage
      badge="Team"
      title="Team Management"
      subtitle="Invite recruiters, hiring managers and interviewers."
      actions={<Button className="gradient-primary text-primary-foreground" onClick={() => toast.success("Invite sent")}><UserPlus className="size-4 mr-2" /> Invite member</Button>}
    >
      <Card className="glass overflow-hidden">
        {team.map((t) => (
          <div key={t.e} className="grid grid-cols-12 px-4 py-3 items-center border-b border-border last:border-0">
            <div className="col-span-5 text-sm font-medium">{t.n}</div>
            <div className="col-span-4 text-xs text-muted-foreground">{t.e}</div>
            <div className="col-span-2"><Badge variant="outline" className="text-[10px]">{t.r}</Badge></div>
            <div className="col-span-1 text-right"><Button size="sm" variant="ghost">Edit</Button></div>
          </div>
        ))}
      </Card>
    </RecruiterPage>
  );
}
