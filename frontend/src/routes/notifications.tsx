import { createFileRoute } from "@tanstack/react-router";
import AppShell from "@/components/AppShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useApp } from "@/lib/store";
import { Bell, CheckCheck } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/notifications")({
  head: () => ({ meta: [{ title: "Notifications · VidioHire AI" }] }),
  component: Notifs,
});

function Notifs() {
  const { notifications, markAllRead, addNotification } = useApp();
  return (
    <AppShell>
      <div className="max-w-3xl mx-auto space-y-4">
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-bold">Notifications</h1>
            <p className="text-muted-foreground">{notifications.filter(n=>!n.read).length} unread</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={()=>{addNotification({title:"New recruiter view",body:"Anthropic just viewed your profile"});toast.success("Test notification added");}}>Simulate</Button>
            <Button onClick={()=>{markAllRead(); toast.success("All marked read");}} className="gradient-primary text-primary-foreground"><CheckCheck className="size-4 mr-2"/>Mark all read</Button>
          </div>
        </div>
        <Card className="glass-strong p-2">
          {notifications.map((n)=>(
            <div key={n.id} className={`flex gap-3 p-4 rounded-xl ${n.read?"":"bg-accent/20"}`}>
              <div className="size-10 rounded-full gradient-primary grid place-items-center shrink-0"><Bell className="size-4 text-primary-foreground"/></div>
              <div className="flex-1">
                <div className="font-medium">{n.title}</div>
                <div className="text-sm text-muted-foreground">{n.body}</div>
                <div className="text-xs text-muted-foreground mt-1">{n.time}</div>
              </div>
              {!n.read && <Badge className="gradient-primary text-primary-foreground">New</Badge>}
            </div>
          ))}
        </Card>
      </div>
    </AppShell>
  );
}
