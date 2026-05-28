import { createFileRoute } from "@tanstack/react-router";
import RecruiterPage from "@/components/RecruiterPage";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { CANDIDATES } from "@/lib/mock-data";
import { Send } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/recruiter/messages")({
  head: () => ({ meta: [{ title: "Messages · VidioHire AI" }] }),
  component: Messages,
});

function Messages() {
  const threads = CANDIDATES.slice(0, 8);
  const [active, setActive] = useState(threads[0].id);
  const [draft, setDraft] = useState("");
  const c = threads.find((t) => t.id === active)!;

  return (
    <RecruiterPage badge="Inbox" title="Messages" subtitle="Direct conversations with candidates and your hiring team.">
      <div className="grid lg:grid-cols-[300px_1fr] gap-4 h-[65vh]">
        <Card className="glass p-2 overflow-y-auto scrollbar-thin">
          {threads.map((t) => (
            <button key={t.id} onClick={() => setActive(t.id)} className={`w-full text-left p-2 rounded-lg flex items-center gap-2 ${active === t.id ? "bg-accent/50" : "hover:bg-accent/30"}`}>
              <div className="size-8 rounded-md grid place-items-center text-xs font-bold text-primary-foreground" style={{ background: t.videoThumb }}>{t.avatar}</div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{t.name}</div>
                <div className="text-[11px] text-muted-foreground truncate">Re: {t.headline}</div>
              </div>
              {t.id === threads[0].id && <Badge className="bg-primary/30 text-primary text-[10px]">2</Badge>}
            </button>
          ))}
        </Card>

        <Card className="glass flex flex-col overflow-hidden">
          <div className="px-4 py-3 border-b border-border flex items-center gap-3">
            <div className="size-9 rounded-md grid place-items-center text-xs font-bold text-primary-foreground" style={{ background: c.videoThumb }}>{c.avatar}</div>
            <div><div className="text-sm font-semibold">{c.name}</div><div className="text-[11px] text-muted-foreground">{c.headline}</div></div>
          </div>
          <div className="flex-1 p-4 space-y-3 overflow-y-auto scrollbar-thin">
            <div className="max-w-[70%] rounded-lg bg-muted/50 p-3 text-sm">Hi! Excited to hear back about the role.</div>
            <div className="max-w-[70%] rounded-lg gradient-primary text-primary-foreground p-3 text-sm ml-auto">Thanks for applying — could you do a 30-min screen Wed?</div>
            <div className="max-w-[70%] rounded-lg bg-muted/50 p-3 text-sm">Absolutely, Wed 11am works.</div>
          </div>
          <div className="p-3 border-t border-border flex gap-2">
            <Input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Write a message…" />
            <Button className="gradient-primary text-primary-foreground" onClick={() => setDraft("")}><Send className="size-4" /></Button>
          </div>
        </Card>
      </div>
    </RecruiterPage>
  );
}
