import { createFileRoute } from "@tanstack/react-router";
import RecruiterPage from "@/components/RecruiterPage";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/recruiter/settings")({
  head: () => ({ meta: [{ title: "Recruiter Settings · VidioHire AI" }] }),
  component: Settings,
});

function Settings() {
  return (
    <RecruiterPage badge="Settings" title="Recruiter Settings" subtitle="Notifications, integrations and AI preferences.">
      <div className="grid lg:grid-cols-2 gap-4">
        <Card className="glass p-6 space-y-4">
          <div className="text-sm font-semibold">Notifications</div>
          {[
            ["Email me about new applications", true],
            ["Notify on AI shortlist", true],
            ["Daily hiring digest", false],
            ["Integrity alerts (anti-cheat)", true],
          ].map(([l, v]) => (
            <div key={l as string} className="flex items-center justify-between">
              <Label className="text-sm">{l as string}</Label>
              <Switch defaultChecked={v as boolean} />
            </div>
          ))}
        </Card>
        <Card className="glass p-6 space-y-4">
          <div className="text-sm font-semibold">AI preferences</div>
          {[
            ["Auto-shortlist high-match candidates", true],
            ["AI-generated job descriptions", true],
            ["Bias / compliance check before posting", true],
            ["Auto-translate candidate messages", false],
          ].map(([l, v]) => (
            <div key={l as string} className="flex items-center justify-between">
              <Label className="text-sm">{l as string}</Label>
              <Switch defaultChecked={v as boolean} />
            </div>
          ))}
        </Card>
      </div>
      <div className="flex justify-end"><Button className="gradient-primary text-primary-foreground" onClick={() => toast.success("Saved")}>Save changes</Button></div>
    </RecruiterPage>
  );
}
