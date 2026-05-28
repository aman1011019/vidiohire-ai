import { createFileRoute } from "@tanstack/react-router";
import RecruiterPage from "@/components/RecruiterPage";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CANDIDATES } from "@/lib/mock-data";
import { Mail, Send } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/recruiter/interview-invites")({
  head: () => ({ meta: [{ title: "Interview Invites · VidioHire AI" }] }),
  component: Invites,
});

function Invites() {
  const list = CANDIDATES.slice(0, 8);
  return (
    <RecruiterPage badge="Outbox" title="Interview Invites" subtitle="Send and track AI interview invitations.">
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {list.map((c, i) => (
          <Card key={c.id} className="glass p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="size-10 rounded-lg grid place-items-center text-sm font-bold text-primary-foreground" style={{ background: c.videoThumb }}>{c.avatar}</div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold truncate">{c.name}</div>
                <div className="text-xs text-muted-foreground truncate">{c.headline}</div>
              </div>
            </div>
            <div className="text-xs text-muted-foreground mb-2">{["Pending", "Accepted", "Pending", "Declined"][i % 4]}</div>
            <Badge variant="outline" className="text-[10px] mb-3">AI Screening · 30 min</Badge>
            <div className="flex gap-2">
              <Button size="sm" className="flex-1 gradient-primary text-primary-foreground" onClick={() => toast.success("Invite sent")}><Send className="size-3.5 mr-1" /> Send</Button>
              <Button size="sm" variant="outline" onClick={() => toast.success("Reminder queued")}><Mail className="size-4" /></Button>
            </div>
          </Card>
        ))}
      </div>
    </RecruiterPage>
  );
}
