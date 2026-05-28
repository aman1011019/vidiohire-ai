export type Job = {
  id: string;
  title: string;
  company: string;
  logo: string;
  location: string;
  remote: boolean;
  type: string;
  salary: string;
  experience: string;
  skills: string[];
  description: string;
  posted: string;
  matchScore: number;
};

export type Candidate = {
  id: string;
  name: string;
  headline: string;
  avatar: string;
  videoThumb: string;
  location: string;
  skills: string[];
  experience: number;
  matchScore: number;
  communication: number;
  confidence: number;
  emotional: number;
  bio: string;
};

const COMPANIES = ["Linear", "Stripe", "Figma", "Vercel", "Notion", "Anthropic", "Cloudflare", "Supabase", "OpenAI", "Discord"];
const TITLES = [
  "Senior Frontend Engineer", "AI/ML Engineer", "Product Designer", "Full Stack Engineer",
  "Staff Backend Engineer", "DevOps Engineer", "Mobile Engineer (React Native)", "Engineering Manager",
  "Data Scientist", "Developer Advocate",
];
const SKILLS = ["React", "TypeScript", "Node.js", "Python", "GraphQL", "Postgres", "Kubernetes", "AWS", "Next.js", "Tailwind", "PyTorch", "LangChain", "Rust", "Go", "WebRTC"];
const LOCATIONS = ["Remote", "San Francisco, CA", "New York, NY", "London, UK", "Berlin, DE", "Bengaluru, IN", "Singapore"];

function pick<T>(arr: T[], n: number): T[] {
  const a = [...arr].sort(() => Math.random() - 0.5);
  return a.slice(0, n);
}

export const JOBS: Job[] = Array.from({ length: 18 }).map((_, i) => {
  const company = COMPANIES[i % COMPANIES.length];
  const title = TITLES[i % TITLES.length];
  return {
    id: "job_" + (i + 1),
    title,
    company,
    logo: company[0],
    location: LOCATIONS[i % LOCATIONS.length],
    remote: i % 2 === 0,
    type: i % 3 === 0 ? "Contract" : "Full-time",
    salary: `$${120 + i * 6}k – $${180 + i * 8}k`,
    experience: ["1–3 yrs", "3–5 yrs", "5+ yrs"][i % 3],
    skills: pick(SKILLS, 5),
    description: `Join ${company} to build the future of ${title.toLowerCase()}. You'll ship product-defining features alongside a world-class team. We value craft, autonomy, and fast iteration.`,
    posted: `${(i % 7) + 1}d ago`,
    matchScore: 70 + ((i * 13) % 30),
  };
});

const FIRST = ["Aarav", "Priya", "Liam", "Sofia", "Hiro", "Maya", "Noah", "Zara", "Ethan", "Amara", "Kai", "Luna"];
const LAST = ["Patel", "Chen", "Johnson", "Garcia", "Tanaka", "Okafor", "Singh", "Müller", "Silva", "Kim"];

export const CANDIDATES: Candidate[] = Array.from({ length: 24 }).map((_, i) => {
  const name = `${FIRST[i % FIRST.length]} ${LAST[(i * 3) % LAST.length]}`;
  return {
    id: "cand_" + (i + 1),
    name,
    headline: TITLES[i % TITLES.length],
    avatar: name.split(" ").map((s) => s[0]).join(""),
    videoThumb: `linear-gradient(135deg, hsl(${(i * 37) % 360} 70% 50%), hsl(${(i * 71) % 360} 60% 40%))`,
    location: LOCATIONS[i % LOCATIONS.length],
    skills: pick(SKILLS, 4),
    experience: (i % 8) + 1,
    matchScore: 72 + ((i * 11) % 28),
    communication: 70 + ((i * 7) % 30),
    confidence: 65 + ((i * 9) % 35),
    emotional: 70 + ((i * 5) % 30),
    bio: "Passionate engineer focused on shipping delightful product experiences with deep technical rigor.",
  };
});

export const MESSAGES = [
  { id: "m1", from: "Alex (Stripe)", avatar: "AS", last: "Loved your video — got 10 min this week?", time: "2m", unread: 2, online: true },
  { id: "m2", from: "Priya (Linear)", avatar: "PL", last: "Sending over the take-home now.", time: "1h", unread: 0, online: true },
  { id: "m3", from: "Marco (Notion)", avatar: "MN", last: "Our team really enjoyed the chat.", time: "3h", unread: 1, online: false },
  { id: "m4", from: "Sara (Vercel)", avatar: "SV", last: "Quick question about your project…", time: "1d", unread: 0, online: false },
];

export const ACTIVITY = [
  { who: "Stripe", what: "viewed your video resume", time: "2m ago" },
  { who: "Linear", what: "shortlisted you for Senior FE", time: "12m ago" },
  { who: "Notion", what: "sent an interview invite", time: "1h ago" },
  { who: "Vercel", what: "saved your profile", time: "3h ago" },
];

export const INTERVIEW_PERSONAS = [
  { id: "friendly", name: "Friendly HR", emoji: "🤝", desc: "Warm, conversational, focuses on culture fit." },
  { id: "faang", name: "Strict FAANG", emoji: "🎯", desc: "Rigorous technical depth & systems thinking." },
  { id: "founder", name: "Startup Founder", emoji: "🚀", desc: "Pragmatic, scrappy, looks for ownership." },
  { id: "behavioral", name: "Behavioral", emoji: "🧠", desc: "STAR-method, past experience deep dives." },
  { id: "technical", name: "Tech Expert", emoji: "💻", desc: "Deep, language-specific technical interview." },
];

export const QUESTION_BANK: Record<string, string[]> = {
  React: [
    "Walk me through how React reconciliation works under the hood.",
    "When would you reach for useMemo vs useCallback, and what are the tradeoffs?",
    "Tell me about a tricky bug you debugged in a React app and how you isolated it.",
  ],
  TypeScript: [
    "How do you model discriminated unions, and when are they better than enums?",
    "What's the difference between unknown and any, and when do you use each?",
  ],
  "Node.js": [
    "How does the Node event loop schedule microtasks vs macrotasks?",
    "Walk me through how you'd design a rate limiter as Express middleware.",
  ],
  Python: [
    "Explain the GIL and how it affects multithreaded Python.",
    "How would you profile and optimize a slow Python service?",
  ],
  GraphQL: ["How do you avoid N+1 queries in a GraphQL resolver?"],
  AWS: ["When would you use SQS vs Kinesis vs EventBridge?"],
  Kubernetes: ["Explain the difference between a Deployment, StatefulSet, and DaemonSet."],
  PyTorch: ["Walk me through how autograd builds the computation graph."],
  LangChain: ["How would you design a RAG pipeline that stays grounded?"],
};

export const GENERAL_QUESTIONS = [
  "Tell me about yourself and what drew you to this role.",
  "Walk me through a project you're most proud of — what made it hard?",
  "Describe a time you disagreed with a teammate. How did you resolve it?",
  "Where do you want to grow in the next 12 months?",
  "Why are you exploring new opportunities right now?",
];

export function generateQuestions(skills: string[], persona: string): string[] {
  const techQs = skills.flatMap((s) => QUESTION_BANK[s] ?? []).slice(0, 4);
  const general = GENERAL_QUESTIONS.slice(0, 2);
  const personaTwist =
    persona === "faang"
      ? ["Design a video-streaming backend that scales to 10M concurrent viewers."]
      : persona === "founder"
        ? ["You have 2 weeks and one engineer. What do you ship and what do you cut?"]
        : persona === "behavioral"
          ? ["Tell me about a time you owned a difficult outcome end-to-end."]
          : ["What does great teamwork look like to you?"];
  return [...general, ...techQs, ...personaTwist];
}
