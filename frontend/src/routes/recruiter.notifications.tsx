import { createFileRoute } from "@tanstack/react-router";
import RecruiterPage from "@/components/RecruiterPage";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useApp } from "@/lib/store";
import { Bell, Sparkles, Users, ShieldAlert } from "lucide-react";

export const Route = createFileRoute("/recruiter/notifications")({
  head: () => ({ meta: [{ title: "Notifications · VidioHire AI" }] }),
  component: Notes,
});

function Notes() {
  const { notifications, markAllRead } = useApp();
  const extras = [
    { icon: Users, text: "12 new applications on Senior Frontend Engineer", time: "5m" },
    { icon: Sparkles, text: "AI flagged 3 strong-hire candidates", time: "1h" },
    { icon: ShieldAlert, text: "Integrity warning on John D.'s interview (tab switch)", time: "3h" },
    { icon: Bell, text: "Interview invite accepted by Maya Chen", time: "Yesterday" },
  ];
  return (
    <RecruiterPage badge="Alerts" title="Notifications" subtitle="Realtime updates across your pipeline." actions={
      <button onClick={markAllRead} className="text-sm text-primary hover:underline">Mark all read</button>
    }>
      <Card className="glass divide-y divide-border">
        {extras.map((n, i) => (
          <div key={i} className="flex items-start gap-3 p-4">
            <div className="size-9 rounded-lg bg-primary/15 text-primary grid place-items-center"><n.icon className="size-4" /></div>
            <div className="flex-1"><div className="text-sm">{n.text}</div><div className="text-[11px] text-muted-foreground">{n.time} ago</div></div>
            <Badge variant="outline" className="text-[10px]">New</Badge>
          </div>
        ))}
        {notifications.map((n) => (
          <div key={n.id} className="flex items-start gap-3 p-4">
            <div className="size-9 rounded-lg bg-muted/40 grid place-items-center"><Bell className="size-4" /></div>
            <div className="flex-1"><div className="text-sm">{n.title}</div><div className="text-[11px] text-muted-foreground">{n.body}</div></div>
          </div>
        ))}
      </Card>
    </RecruiterPage>
  );
}
