import { createFileRoute } from "@tanstack/react-router";
import RecruiterPage from "@/components/RecruiterPage";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

import { Pencil } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/recruiter/company")({
  head: () => ({ meta: [{ title: "Company Profile · VidioHire AI" }] }),
  component: Company,
});

function Company() {
  const [isEditing, setIsEditing] = useState(false);
  const [companyData, setCompanyData] = useState({
    name: "VidioHire AI",
    website: "https://vidiohire.ai",
    industry: "HR Tech / AI",
    hq: "San Francisco, CA",
    about: "VidioHire AI is the AI hiring operating system used by modern teams to find, evaluate and hire world-class talent."
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
    toast.success("Profile saved");
  };

  return (
    <RecruiterPage 
      badge="Company" 
      title="Company Profile" 
      subtitle="How candidates see your brand on every job post and invite."
      actions={
        !isEditing ? (
          <Button variant="outline" onClick={() => setIsEditing(true)}>
            <Pencil className="size-4 mr-2" />
            Edit Profile
          </Button>
        ) : null
      }
    >
      <form className="grid lg:grid-cols-3 gap-4" onSubmit={handleSave}>
        <Card className="glass p-6 lg:col-span-2 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Company name</Label>
              {isEditing ? <Input value={companyData.name} onChange={(e) => setCompanyData({...companyData, name: e.target.value})} /> : <div className="text-sm p-2 border border-transparent">{companyData.name}</div>}
            </div>
            <div className="space-y-2">
              <Label>Website</Label>
              {isEditing ? <Input value={companyData.website} onChange={(e) => setCompanyData({...companyData, website: e.target.value})} /> : <div className="text-sm p-2 border border-transparent text-primary">{companyData.website}</div>}
            </div>
            <div className="space-y-2">
              <Label>Industry</Label>
              {isEditing ? <Input value={companyData.industry} onChange={(e) => setCompanyData({...companyData, industry: e.target.value})} /> : <div className="text-sm p-2 border border-transparent">{companyData.industry}</div>}
            </div>
            <div className="space-y-2">
              <Label>Headquarters</Label>
              {isEditing ? <Input value={companyData.hq} onChange={(e) => setCompanyData({...companyData, hq: e.target.value})} /> : <div className="text-sm p-2 border border-transparent">{companyData.hq}</div>}
            </div>
          </div>
          <div className="space-y-2">
            <Label>About</Label>
            {isEditing ? <Textarea rows={6} value={companyData.about} onChange={(e) => setCompanyData({...companyData, about: e.target.value})} /> : <div className="text-sm p-2 border border-transparent whitespace-pre-wrap">{companyData.about}</div>}
          </div>
          {isEditing && (
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
              <Button type="submit" className="gradient-primary text-primary-foreground">Save</Button>
            </div>
          )}
        </Card>
        <Card className="glass p-6 space-y-3 h-fit">
          <div className="text-sm font-semibold">Brand kit</div>
          <p className="text-xs text-muted-foreground">Logo, colors and tone are applied to job posts and candidate emails.</p>
          <div className="aspect-video rounded-lg gradient-primary glow" />
        </Card>
      </form>
    </RecruiterPage>
  );
}
