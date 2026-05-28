import { createFileRoute } from "@tanstack/react-router";
import AppShell from "@/components/AppShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useApp } from "@/lib/store";
import { useState } from "react";
import { toast } from "sonner";
import { Sun, Moon, AlertTriangle } from "lucide-react";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings · VidioHire AI" }] }),
  component: Settings,
});

function Settings() {
  const { user, theme, setTheme, logout } = useApp();
  const [email, setEmail] = useState(true);
  const [push, setPush] = useState(true);
  const [publicProfile, setPublicProfile] = useState(true);

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto space-y-5">
        <h1 className="text-3xl font-bold">Settings</h1>

        <Card className="glass p-5 space-y-4">
          <div className="font-semibold">Appearance</div>
          <div className="flex items-center gap-3">
            <Button variant={theme==="dark"?"default":"outline"} onClick={()=>setTheme("dark")}><Moon className="size-4 mr-2"/>Dark</Button>
            <Button variant={theme==="light"?"default":"outline"} onClick={()=>setTheme("light")}><Sun className="size-4 mr-2"/>Light</Button>
          </div>
        </Card>

        <Card className="glass p-5 space-y-4">
          <div className="font-semibold">Notifications</div>
          <div className="flex items-center justify-between"><Label>Email notifications</Label><Switch checked={email} onCheckedChange={setEmail}/></div>
          <div className="flex items-center justify-between"><Label>Push notifications</Label><Switch checked={push} onCheckedChange={setPush}/></div>
        </Card>

        <Card className="glass p-5 space-y-4">
          <div className="font-semibold">Privacy</div>
          <div className="flex items-center justify-between"><Label>Public profile</Label><Switch checked={publicProfile} onCheckedChange={setPublicProfile}/></div>
          <div className="text-xs text-muted-foreground">When off, recruiters can't discover you in the feed.</div>
        </Card>

        <Card className="glass p-5 space-y-4">
          <div className="font-semibold">Account</div>
          <div className="grid sm:grid-cols-2 gap-3">
            <div><Label>Name</Label><Input defaultValue={user?.name ?? ""}/></div>
            <div><Label>Email</Label><Input defaultValue={user?.email ?? ""}/></div>
          </div>
          <div><Label>Change password</Label><Input type="password" placeholder="New password"/></div>
          <Button className="gradient-primary text-primary-foreground" onClick={()=>toast.success("Saved")}>Save changes</Button>
        </Card>

        <Card className="glass p-5 border-destructive/40">
          <div className="font-semibold text-destructive flex items-center gap-2 mb-2"><AlertTriangle className="size-4"/>Danger zone</div>
          <p className="text-sm text-muted-foreground mb-3">Permanently delete your account and all data.</p>
          <AlertDialog>
            <AlertDialogTrigger asChild><Button variant="destructive">Delete account</Button></AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>This action is permanent and cannot be undone.</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={()=>{logout(); toast.success("Account deleted (demo)");}}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </Card>
      </div>
    </AppShell>
  );
}
