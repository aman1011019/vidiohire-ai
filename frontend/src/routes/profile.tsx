import { createFileRoute } from "@tanstack/react-router";
import AppShell from "@/components/AppShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useApp } from "@/lib/store";
import { useState, useEffect } from "react";
import { 
  Plus, X, Share2, Github, Globe, Linkedin, Pencil, MapPin, Mail, Phone, 
  Briefcase, GraduationCap, Code, Award, FileText, Upload, Sparkles, CheckCircle2,
  Trash2, File
} from "lucide-react";
import { toast } from "sonner";
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter 
} from "@/components/ui/dialog";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "Professional Profile · VidioHire AI" }] }),
  component: Profile,
});

// Dummy initial data mimicking our new enterprise schema
const initialProfile = {
  name: "Jordan Lee",
  headline: "Senior Frontend Engineer & UI Architect",
  avatar_url: "",
  bio: "Passionate about building scalable, high-performance web applications with a focus on exceptional user experiences.",
  objective: "Seeking a senior engineering role where I can lead frontend architecture and mentor junior developers.",
  ai_intro: "Jordan is a highly skilled frontend engineer with 5+ years of experience specializing in React and TypeScript. They demonstrate strong architectural capabilities and a proven track record of delivering enterprise SaaS products.",
  ats_score: 92.5,
  profile_strength: 95.0,
  phone: "+1 (555) 123-4567",
  email: "jordan.lee@example.com",
  country: "United States",
  city: "San Francisco, CA",
  timezone: "PST",
  website: "jordan.dev",
  github: "github.com/jordanlee",
  linkedin: "linkedin.com/in/jordanlee",
  experiences: [
    { id: "1", company: "Acme Corp", role: "Senior Frontend Engineer", start_date: "2022", end_date: "Present", description: "Led the migration to Next.js, improving load times by 40%.", technologies: "React, TypeScript, Next.js" }
  ],
  educations: [
    { id: "1", school: "Stanford University", degree: "B.S. Computer Science", cgpa: "3.8", start_year: "2015", end_year: "2019" }
  ],
  projects: [
    { id: "1", title: "VidioHire Open Source", description: "An open-source ATS built with FastAPI and React.", tech_stack: "React, FastAPI, PostgreSQL", github_url: "github.com/vidiohire", live_url: "vidiohire.ai" }
  ],
  certifications: [
    { id: "1", name: "AWS Certified Solutions Architect", issuer: "Amazon Web Services", year: "2023", credential_url: "" }
  ],
  skills: ["React", "TypeScript", "Node.js", "PostgreSQL", "System Design"],
  resume_url: "jordan_lee_resume.pdf"
};

function Profile() {
  const { user } = useApp();
  const [profile, setProfile] = useState(initialProfile);
  
  // Modals state
  const [editHeader, setEditHeader] = useState(false);
  const [editAbout, setEditAbout] = useState(false);
  const [editExperience, setEditExperience] = useState<any>(null); // null or item
  const [editProject, setEditProject] = useState<any>(null);
  const [editEducation, setEditEducation] = useState<any>(null);

  // Form states
  const [headerForm, setHeaderForm] = useState({ ...profile });
  const [aboutForm, setAboutForm] = useState({ bio: profile.bio, objective: profile.objective });
  const [expForm, setExpForm] = useState({ company: "", role: "", start_date: "", end_date: "", description: "", technologies: "" });
  const [projForm, setProjForm] = useState({ title: "", description: "", tech_stack: "", github_url: "", live_url: "" });
  const [eduForm, setEduForm] = useState({ school: "", degree: "", cgpa: "", start_year: "", end_year: "" });
  const [newSkill, setNewSkill] = useState("");

  const handleSaveHeader = () => {
    setProfile({ ...profile, ...headerForm });
    setEditHeader(false);
    toast.success("Profile header updated");
  };

  const handleSaveAbout = () => {
    setProfile({ ...profile, ...aboutForm });
    setEditAbout(false);
    toast.success("About section updated");
  };

  const handleSaveExp = () => {
    if (!expForm.company || !expForm.role) return toast.error("Company and Role required");
    if (editExperience?.id) {
      setProfile(p => ({ ...p, experiences: p.experiences.map(e => e.id === editExperience.id ? { ...e, ...expForm } : e) }));
    } else {
      setProfile(p => ({ ...p, experiences: [{ ...expForm, id: Date.now().toString() }, ...p.experiences] }));
    }
    setEditExperience(null);
    toast.success("Experience saved");
  };

  const handleDeleteExp = (id: string) => {
    setProfile(p => ({ ...p, experiences: p.experiences.filter(e => e.id !== id) }));
    toast.success("Experience deleted");
  };

  const handleSaveProj = () => {
    if (!projForm.title) return toast.error("Title required");
    if (editProject?.id) {
      setProfile(p => ({ ...p, projects: p.projects.map(e => e.id === editProject.id ? { ...e, ...projForm } : e) }));
    } else {
      setProfile(p => ({ ...p, projects: [{ ...projForm, id: Date.now().toString() }, ...p.projects] }));
    }
    setEditProject(null);
    toast.success("Project saved");
  };

  const handleSaveEdu = () => {
    if (!eduForm.school) return toast.error("School required");
    if (editEducation?.id) {
      setProfile(p => ({ ...p, educations: p.educations.map(e => e.id === editEducation.id ? { ...e, ...eduForm } : e) }));
    } else {
      setProfile(p => ({ ...p, educations: [{ ...eduForm, id: Date.now().toString() }, ...p.educations] }));
    }
    setEditEducation(null);
    toast.success("Education saved");
  };

  const addSkill = () => {
    if (newSkill && !profile.skills.includes(newSkill)) {
      setProfile(p => ({ ...p, skills: [...p.skills, newSkill] }));
      setNewSkill("");
      toast.success("Skill added");
    }
  };

  const removeSkill = (sk: string) => {
    setProfile(p => ({ ...p, skills: p.skills.filter(s => s !== sk) }));
  };

  const handleResumeUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".pdf,.docx";
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (file) {
        toast.promise(
          new Promise((resolve) => setTimeout(() => {
            setProfile(p => ({ ...p, resume_url: file.name, ats_score: 96.5, profile_strength: 98.0 }));
            resolve(true);
          }, 2000)),
          {
            loading: 'AI is analyzing your resume...',
            success: 'Resume processed! ATS score updated.',
            error: 'Failed to process resume'
          }
        );
      }
    };
    input.click();
  };

  return (
    <AppShell>
      <div className="max-w-6xl mx-auto space-y-6 pb-10">
        
        {/* TOP METRICS (AI INSIGHTS) */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="glass p-5 flex items-center gap-4">
            <div className="size-12 rounded-full gradient-primary flex items-center justify-center text-primary-foreground">
              <CheckCircle2 className="size-6" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Profile Strength</div>
              <div className="text-2xl font-bold">{profile.profile_strength}%</div>
              <div className="text-xs text-primary mt-1">Excellent</div>
            </div>
          </Card>
          <Card className="glass p-5 flex items-center gap-4 border-primary/20">
            <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <Sparkles className="size-6" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">AI ATS Score</div>
              <div className="text-2xl font-bold text-primary">{profile.ats_score}%</div>
              <div className="text-xs text-muted-foreground mt-1">Top 5% of candidates</div>
            </div>
          </Card>
          <Card className="glass p-5 flex items-center gap-4">
            <div className="size-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
              <FileText className="size-6" />
            </div>
            <div className="flex-1">
              <div className="text-sm text-muted-foreground">Active Resume</div>
              <div className="text-sm font-semibold truncate">{profile.resume_url || "No resume uploaded"}</div>
              <button onClick={handleResumeUpload} className="text-xs text-primary mt-1 hover:underline flex items-center"><Upload className="size-3 mr-1"/> Upload New</button>
            </div>
          </Card>
        </div>

        {/* HEADER SECTION */}
        <Card className="glass-strong p-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-32 gradient-primary opacity-20" />
          <Button variant="outline" size="sm" className="absolute top-4 right-4 bg-background/50 backdrop-blur" onClick={() => { setHeaderForm(profile); setEditHeader(true); }}>
            <Pencil className="size-4 mr-2" /> Edit Intro
          </Button>
          
          <div className="relative pt-12 flex flex-col md:flex-row gap-6 items-start">
            <Avatar className="size-32 ring-4 ring-background shadow-xl">
              <AvatarFallback className="gradient-primary text-4xl text-primary-foreground">
                {profile.name.split(" ").map(n=>n[0]).slice(0,2).join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 pt-2">
              <h1 className="text-3xl font-bold">{profile.name}</h1>
              <div className="text-lg text-muted-foreground mt-1">{profile.headline}</div>
              
              <div className="flex flex-wrap gap-4 mt-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><MapPin className="size-4"/> {profile.city}, {profile.country}</span>
                <span className="flex items-center gap-1"><Mail className="size-4"/> {profile.email}</span>
                <span className="flex items-center gap-1"><Phone className="size-4"/> {profile.phone}</span>
              </div>
              
              <div className="flex flex-wrap gap-3 mt-4">
                <a href={`https://${profile.website}`} target="_blank" className="flex items-center gap-1 text-sm text-primary hover:underline"><Globe className="size-4"/> {profile.website}</a>
                <a href={`https://${profile.github}`} target="_blank" className="flex items-center gap-1 text-sm text-primary hover:underline"><Github className="size-4"/> GitHub</a>
                <a href={`https://${profile.linkedin}`} target="_blank" className="flex items-center gap-1 text-sm text-primary hover:underline"><Linkedin className="size-4"/> LinkedIn</a>
              </div>
            </div>
          </div>
        </Card>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            
            {/* ABOUT SECTION */}
            <Card className="glass p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold">About</h2>
                <Button variant="ghost" size="icon" onClick={() => { setAboutForm({ bio: profile.bio, objective: profile.objective }); setEditAbout(true); }}><Pencil className="size-4"/></Button>
              </div>
              
              {profile.ai_intro && (
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-4 flex gap-3 items-start">
                  <Sparkles className="size-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm font-semibold text-primary mb-1">AI Generated Summary (What Recruiters See)</div>
                    <div className="text-sm leading-relaxed">{profile.ai_intro}</div>
                  </div>
                </div>
              )}
              
              <div className="space-y-4">
                <div>
                  <div className="text-sm font-semibold mb-1">Professional Bio</div>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">{profile.bio || "No bio added."}</p>
                </div>
                <div>
                  <div className="text-sm font-semibold mb-1">Career Objective</div>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">{profile.objective || "No objective added."}</p>
                </div>
              </div>
            </Card>

            {/* EXPERIENCE SECTION */}
            <Card className="glass p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold flex items-center gap-2"><Briefcase className="size-5"/> Experience</h2>
                <Button variant="outline" size="sm" onClick={() => { setExpForm({ company: "", role: "", start_date: "", end_date: "", description: "", technologies: "" }); setEditExperience({ id: null }); }}><Plus className="size-4 mr-1"/> Add</Button>
              </div>
              <div className="space-y-6">
                {profile.experiences.map((exp) => (
                  <div key={exp.id} className="relative group">
                    <Button variant="ghost" size="icon" className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => { setExpForm(exp); setEditExperience(exp); }}><Pencil className="size-4"/></Button>
                    <div className="font-semibold text-base">{exp.role}</div>
                    <div className="text-sm text-primary mb-1">{exp.company}</div>
                    <div className="text-xs text-muted-foreground mb-3">{exp.start_date} – {exp.end_date}</div>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{exp.description}</p>
                    {exp.technologies && (
                      <div className="flex gap-2 mt-3">
                        {exp.technologies.split(",").map(t => <Badge key={t} variant="secondary" className="text-xs">{t.trim()}</Badge>)}
                      </div>
                    )}
                  </div>
                ))}
                {profile.experiences.length === 0 && <div className="text-sm text-muted-foreground">No experience added.</div>}
              </div>
            </Card>

            {/* PROJECTS SECTION */}
            <Card className="glass p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold flex items-center gap-2"><Code className="size-5"/> Projects</h2>
                <Button variant="outline" size="sm" onClick={() => { setProjForm({ title: "", description: "", tech_stack: "", github_url: "", live_url: "" }); setEditProject({ id: null }); }}><Plus className="size-4 mr-1"/> Add</Button>
              </div>
              <div className="space-y-6">
                {profile.projects.map((proj) => (
                  <div key={proj.id} className="relative group">
                    <Button variant="ghost" size="icon" className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => { setProjForm(proj); setEditProject(proj); }}><Pencil className="size-4"/></Button>
                    <div className="font-semibold text-base">{proj.title}</div>
                    <p className="text-sm text-muted-foreground my-2">{proj.description}</p>
                    {proj.tech_stack && (
                      <div className="flex gap-2 mb-3">
                        {proj.tech_stack.split(",").map(t => <Badge key={t} variant="outline" className="text-[10px]">{t.trim()}</Badge>)}
                      </div>
                    )}
                    <div className="flex gap-4 text-xs">
                      {proj.github_url && <a href={`https://${proj.github_url}`} className="text-primary hover:underline flex items-center"><Github className="size-3 mr-1"/> Repo</a>}
                      {proj.live_url && <a href={`https://${proj.live_url}`} className="text-primary hover:underline flex items-center"><Globe className="size-3 mr-1"/> Live</a>}
                    </div>
                  </div>
                ))}
                {profile.projects.length === 0 && <div className="text-sm text-muted-foreground">No projects added.</div>}
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            {/* SKILLS SECTION */}
            <Card className="glass p-6">
              <h2 className="text-lg font-bold mb-4">Skills</h2>
              <div className="flex flex-wrap gap-2 mb-4">
                {profile.skills.map((s) => (
                  <Badge key={s} variant="secondary" className="gap-1 pl-2 pr-1">
                    {s}
                    <button onClick={() => removeSkill(s)} className="hover:text-destructive rounded-full p-0.5"><X className="size-3"/></button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input value={newSkill} onChange={e => setNewSkill(e.target.value)} placeholder="Add a skill..." onKeyDown={e => { if(e.key==='Enter') addSkill(); }} className="h-9"/>
                <Button size="sm" onClick={addSkill}>Add</Button>
              </div>
            </Card>

            {/* EDUCATION SECTION */}
            <Card className="glass p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold flex items-center gap-2"><GraduationCap className="size-5"/> Education</h2>
                <Button variant="ghost" size="icon" onClick={() => { setEduForm({ school: "", degree: "", cgpa: "", start_year: "", end_year: "" }); setEditEducation({ id: null }); }}><Plus className="size-4"/></Button>
              </div>
              <div className="space-y-4">
                {profile.educations.map((edu) => (
                  <div key={edu.id} className="relative group p-3 rounded-lg hover:bg-muted/30 transition-colors">
                    <Button variant="ghost" size="icon" className="absolute right-2 top-2 opacity-0 group-hover:opacity-100" onClick={() => { setEduForm(edu); setEditEducation(edu); }}><Pencil className="size-4"/></Button>
                    <div className="font-semibold text-sm">{edu.school}</div>
                    <div className="text-xs text-muted-foreground">{edu.degree}</div>
                    <div className="text-xs text-muted-foreground mt-1">{edu.start_year} – {edu.end_year} • CGPA: {edu.cgpa}</div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* EDIT MODALS */}
      
      {/* Header Modal */}
      <Dialog open={editHeader} onOpenChange={setEditHeader}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader><DialogTitle>Edit Profile Intro</DialogTitle></DialogHeader>
          <div className="grid sm:grid-cols-2 gap-4 py-4">
            <div className="space-y-2"><div className="text-xs font-semibold">Full Name</div><Input value={headerForm.name} onChange={e => setHeaderForm({...headerForm, name: e.target.value})} /></div>
            <div className="space-y-2"><div className="text-xs font-semibold">Headline</div><Input value={headerForm.headline} onChange={e => setHeaderForm({...headerForm, headline: e.target.value})} /></div>
            <div className="space-y-2"><div className="text-xs font-semibold">Email</div><Input value={headerForm.email} onChange={e => setHeaderForm({...headerForm, email: e.target.value})} /></div>
            <div className="space-y-2"><div className="text-xs font-semibold">Phone</div><Input value={headerForm.phone} onChange={e => setHeaderForm({...headerForm, phone: e.target.value})} /></div>
            <div className="space-y-2"><div className="text-xs font-semibold">City</div><Input value={headerForm.city} onChange={e => setHeaderForm({...headerForm, city: e.target.value})} /></div>
            <div className="space-y-2"><div className="text-xs font-semibold">Country</div><Input value={headerForm.country} onChange={e => setHeaderForm({...headerForm, country: e.target.value})} /></div>
            <div className="space-y-2"><div className="text-xs font-semibold">LinkedIn URL</div><Input value={headerForm.linkedin} onChange={e => setHeaderForm({...headerForm, linkedin: e.target.value})} /></div>
            <div className="space-y-2"><div className="text-xs font-semibold">GitHub URL</div><Input value={headerForm.github} onChange={e => setHeaderForm({...headerForm, github: e.target.value})} /></div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setEditHeader(false)}>Cancel</Button><Button onClick={handleSaveHeader}>Save</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* About Modal */}
      <Dialog open={editAbout} onOpenChange={setEditAbout}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader><DialogTitle>Edit About</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2"><div className="text-xs font-semibold">Professional Bio</div><Textarea rows={5} value={aboutForm.bio} onChange={e => setAboutForm({...aboutForm, bio: e.target.value})} /></div>
            <div className="space-y-2"><div className="text-xs font-semibold">Career Objective</div><Textarea rows={3} value={aboutForm.objective} onChange={e => setAboutForm({...aboutForm, objective: e.target.value})} /></div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setEditAbout(false)}>Cancel</Button><Button onClick={handleSaveAbout}>Save</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Experience Modal */}
      <Dialog open={!!editExperience} onOpenChange={(o) => !o && setEditExperience(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader><DialogTitle>{editExperience?.id ? 'Edit Experience' : 'Add Experience'}</DialogTitle></DialogHeader>
          <div className="grid sm:grid-cols-2 gap-4 py-4">
            <div className="space-y-2"><div className="text-xs font-semibold">Role/Title</div><Input value={expForm.role} onChange={e => setExpForm({...expForm, role: e.target.value})} /></div>
            <div className="space-y-2"><div className="text-xs font-semibold">Company</div><Input value={expForm.company} onChange={e => setExpForm({...expForm, company: e.target.value})} /></div>
            <div className="space-y-2"><div className="text-xs font-semibold">Start Date</div><Input placeholder="MM/YYYY" value={expForm.start_date} onChange={e => setExpForm({...expForm, start_date: e.target.value})} /></div>
            <div className="space-y-2"><div className="text-xs font-semibold">End Date</div><Input placeholder="MM/YYYY or Present" value={expForm.end_date} onChange={e => setExpForm({...expForm, end_date: e.target.value})} /></div>
            <div className="space-y-2 sm:col-span-2"><div className="text-xs font-semibold">Description</div><Textarea rows={4} value={expForm.description} onChange={e => setExpForm({...expForm, description: e.target.value})} /></div>
            <div className="space-y-2 sm:col-span-2"><div className="text-xs font-semibold">Technologies (comma separated)</div><Input value={expForm.technologies} onChange={e => setExpForm({...expForm, technologies: e.target.value})} /></div>
          </div>
          <DialogFooter className="flex justify-between w-full">
            {editExperience?.id ? <Button variant="destructive" onClick={() => { handleDeleteExp(editExperience.id); setEditExperience(null); }}><Trash2 className="size-4 mr-2"/> Delete</Button> : <div/>}
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setEditExperience(null)}>Cancel</Button>
              <Button onClick={handleSaveExp}>Save</Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Project Modal */}
      <Dialog open={!!editProject} onOpenChange={(o) => !o && setEditProject(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader><DialogTitle>{editProject?.id ? 'Edit Project' : 'Add Project'}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2"><div className="text-xs font-semibold">Project Title</div><Input value={projForm.title} onChange={e => setProjForm({...projForm, title: e.target.value})} /></div>
            <div className="space-y-2"><div className="text-xs font-semibold">Description</div><Textarea rows={3} value={projForm.description} onChange={e => setProjForm({...projForm, description: e.target.value})} /></div>
            <div className="space-y-2"><div className="text-xs font-semibold">Tech Stack</div><Input value={projForm.tech_stack} onChange={e => setProjForm({...projForm, tech_stack: e.target.value})} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><div className="text-xs font-semibold">GitHub URL</div><Input value={projForm.github_url} onChange={e => setProjForm({...projForm, github_url: e.target.value})} /></div>
              <div className="space-y-2"><div className="text-xs font-semibold">Live URL</div><Input value={projForm.live_url} onChange={e => setProjForm({...projForm, live_url: e.target.value})} /></div>
            </div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setEditProject(null)}>Cancel</Button><Button onClick={handleSaveProj}>Save</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Education Modal */}
      <Dialog open={!!editEducation} onOpenChange={(o) => !o && setEditEducation(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader><DialogTitle>{editEducation?.id ? 'Edit Education' : 'Add Education'}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2"><div className="text-xs font-semibold">School/University</div><Input value={eduForm.school} onChange={e => setEduForm({...eduForm, school: e.target.value})} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><div className="text-xs font-semibold">Degree</div><Input value={eduForm.degree} onChange={e => setEduForm({...eduForm, degree: e.target.value})} /></div>
              <div className="space-y-2"><div className="text-xs font-semibold">CGPA/Grade</div><Input value={eduForm.cgpa} onChange={e => setEduForm({...eduForm, cgpa: e.target.value})} /></div>
              <div className="space-y-2"><div className="text-xs font-semibold">Start Year</div><Input value={eduForm.start_year} onChange={e => setEduForm({...eduForm, start_year: e.target.value})} /></div>
              <div className="space-y-2"><div className="text-xs font-semibold">End Year</div><Input value={eduForm.end_year} onChange={e => setEduForm({...eduForm, end_year: e.target.value})} /></div>
            </div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setEditEducation(null)}>Cancel</Button><Button onClick={handleSaveEdu}>Save</Button></DialogFooter>
        </DialogContent>
      </Dialog>

    </AppShell>
  );
}
