# VidioHire AI – Enterprise AI Hiring Platform

## 🚀 Overview

VidioHire AI is a next-generation AI-powered hiring platform designed to modernize recruitment workflows using real-time analytics, AI-driven interviews, resume intelligence, and enterprise-grade recruiter tools.

The platform helps recruiters:

* create and manage jobs
* analyze resumes with AI
* conduct AI-powered interviews
* monitor candidate performance in real time
* track hiring pipelines
* communicate with candidates instantly

Candidates can:

* build professional profiles
* upload resumes and video resumes
* participate in live AI interviews
* receive AI feedback reports
* track applications in real time

---

# ✨ Core Features

## 👨‍💼 Recruiter Features

### Recruitment Dashboard

* Real-time hiring analytics
* Active interview monitoring
* Candidate pipeline management
* AI hiring insights

### Job Management

* Create/Edit/Delete jobs
* Publish or close job listings
* Application tracking
* Hiring workflow automation

### Candidate Pipeline

* Applied
* Under Review
* AI Interview
* Shortlisted
* Rejected
* Hired

### AI Resume Analysis

* ATS score generation
* Skill extraction
* Job compatibility analysis
* AI hiring recommendations

### AI Live Interview

* Real-time transcript generation
* AI-generated technical questions
* Communication analysis
* Confidence analysis
* Technical scoring
* Anti-cheat monitoring

### Messaging & Notifications

* Recruiter ↔ Candidate realtime messaging
* Typing indicators
* Live notifications
* Interview scheduling alerts

### Reports

* Resume reports
* AI interview reports
* Hiring insights
* PDF/DOCX exports

---

# 👨‍🎓 Candidate Features

### Professional Profile System

* Editable profile sections
* Resume upload
* Skills management
* Projects showcase
* Certifications
* Experience management
* Portfolio links

### AI Interview System

* Camera monitoring
* AI-generated questions
* Live transcript
* Real-time analysis
* AI feedback reports

### Application Tracking

* Live application updates
* Interview progress tracking
* Recruiter communication

### AI Resume Intelligence

* ATS optimization
* Skill analysis
* Resume suggestions
* Recruiter visibility scoring

---

# 🧠 AI Capabilities

* Resume intelligence
* AI-generated interview questions
* Real-time speech analysis
* Candidate scoring
* Recruiter insights
* Hiring recommendations
* Behavioral analysis
* Anti-cheat detection

---

# 🏗️ Tech Stack

## Frontend

* React
* TypeScript
* Vite
* Tailwind CSS
* Zustand
* Framer Motion
* React Router

## Backend

* FastAPI
* PostgreSQL
* SQLAlchemy
* Alembic
* WebSockets
* JWT Authentication

## AI & Realtime

* Gemini/OpenAI APIs
* Speech-to-Text APIs
* Realtime WebSocket Engine

## Deployment

* Vercel / Cloudflare Pages
* Render / Railway / VPS Backend

---

# 📂 Project Structure

```bash
vidiohire-ai/
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── index.html
│   ├── vite.config.ts
│   └── package.json
│
├── backend/
│   ├── app/
│   ├── alembic/
│   ├── requirements.txt
│   └── main.py
│
└── README.md
```

---

# ⚙️ Frontend Setup

## 1️⃣ Navigate to frontend

```bash
cd frontend
```

## 2️⃣ Install dependencies

```bash
npm install
```

## 3️⃣ Create `.env`

```env
VITE_API_URL=http://localhost:8000
```

## 4️⃣ Run frontend

```bash
npm run dev
```

Frontend runs on:

```bash
http://localhost:5173
```

---

# ⚙️ Backend Setup

## 1️⃣ Navigate to backend

```bash
cd backend
```

## 2️⃣ Create virtual environment

### Windows

```bash
python -m venv venv
venv\Scripts\activate
```

### Linux/macOS

```bash
python3 -m venv venv
source venv/bin/activate
```

---

## 3️⃣ Install dependencies

```bash
pip install -r requirements.txt
```

---

## 4️⃣ Create `.env`

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/vidiohire
SECRET_KEY=your_secret_key
ACCESS_TOKEN_EXPIRE_MINUTES=60
FRONTEND_URL=http://localhost:5173
```

---

## 5️⃣ Run migrations

```bash
alembic upgrade head
```

---

## 6️⃣ Start backend

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

Backend runs on:

```bash
http://localhost:8000
```

Swagger docs:

```bash
http://localhost:8000/docs
```

---

# 🔐 Authentication

* JWT Authentication
* Role-based access
* Recruiter/Candidate roles
* Secure password hashing
* Protected routes

---

# 🌐 Deployment

## Frontend Deployment

* Vercel
* Cloudflare Pages

### Build Command

```bash
npm run build
```

### Output Directory

```bash
dist
```

---

# ☁️ Cloudflare Routing

Create:

```bash
public/_redirects
```

Add:

```txt
/* /index.html 200
```

---

# 📡 Realtime Systems

Powered by:

* FastAPI WebSockets
* Realtime transcript streaming
* Live AI analytics
* Instant notifications

---

# 🛡️ Anti-Cheat System

The AI interview system silently monitors:

* tab switching
* fullscreen exits
* interview abandonment
* suspicious activity

If cheating is detected:

* interview can pause/end
* recruiter receives alerts
* events are stored securely

---

# 📊 AI Reports

Reports include:

* Resume analysis
* Communication score
* Technical score
* Confidence score
* Hiring recommendation
* Behavioral insights

Export formats:

* PDF
* DOCX

---

# 📱 Responsive Design

Fully optimized for:

* Desktop
* Laptop
* Tablet
* Mobile

---

# 🚧 Future Enhancements

* AI avatar interviewer
* Multilingual interviews
* Video emotion analysis
* Enterprise organization support
* Team collaboration
* Calendar integrations
* Advanced analytics dashboard

---

# 👨‍💻 Developed By

Aman Sharma

---

# 📜 License

This project is built for educational, innovation, and enterprise recruitment purposes.

All rights reserved © VidioHire AI.