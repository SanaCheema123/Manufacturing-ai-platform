# 🏭 Manufacturing AI Platform
<img width="958" height="447" alt="p1" src="https://github.com/user-attachments/assets/1b5970a2-c393-4373-9ca4-ae8267acabd7" />
<img width="958" height="446" alt="p2" src="https://github.com/user-attachments/assets/1fa18750-fb22-4780-b27f-93154bedbc4e" />
<img width="960" height="442" alt="p3" src="https://github.com/user-attachments/assets/448d51ce-6a1c-4dc0-b03a-98dc471e92c7" />
<img width="958" height="449" alt="p4" src="https://github.com/user-attachments/assets/869911d4-9a25-4413-841a-cd1341da1d80" />
<img width="960" height="446" alt="p5" src="https://github.com/user-attachments/assets/0319af3c-8c35-4a2b-a87b-fa01988d9aa9" />
<img width="960" height="446" alt="p6" src="https://github.com/user-attachments/assets/cef32be0-67ff-4e85-944b-c35284915fc9" />
<img width="960" height="449" alt="p7" src="https://github.com/user-attachments/assets/d7d660d6-a0fe-4a26-87d9-fc306a518c40" />
<img width="960" height="446" alt="p8" src="https://github.com/user-attachments/assets/2c2bc08b-071b-40b2-9702-6586bf89de5c" />
<img width="960" height="442" alt="p9" src="https://github.com/user-attachments/assets/a990b785-f3cb-4c86-a345-535003a5c0f5" />

> **AI-Powered Quality Inspection & Root Cause Analysis System**  
> Built by **Sana Cheema** | AIVONEX SMC-PVT LTD

[![FastAPI](https://img.shields.io/badge/FastAPI-0.104-009688?style=flat&logo=fastapi)](https://fastapi.tiangolo.com/)
[![Next.js](https://img.shields.io/badge/Next.js-14-000000?style=flat&logo=nextdotjs)](https://nextjs.org/)
[![CrewAI](https://img.shields.io/badge/CrewAI-Multi--Agent-FF6B6B?style=flat)](https://crewai.com/)
[![Groq](https://img.shields.io/badge/Groq-LLaMA3--70B-F55036?style=flat)](https://groq.com/)

---

## 📋 Overview

An enterprise-grade AI manufacturing intelligence platform that deploys **5 specialized CrewAI agents** to monitor production lines, detect defects, analyze root causes, predict equipment failures, and generate executive-level reports.

### Key Features

- 🔍 **AI Quality Inspection** — Real-time defect detection with CrewAI Quality Inspector Agent
- 📊 **Defect Analysis** — Pattern recognition and trend analysis with AI Defect Analyst
- 🌳 **Root Cause Analysis** — Multi-factor causal chain investigation
- ⚙️ **Predictive Maintenance** — Equipment failure probability forecasting
- 📄 **AI Report Generation** — Multi-agent collaborative executive reports
- 📡 **IoT Sensor Monitoring** — Live telemetry with 5-second polling (temp, vibration, pressure, RPM, current, humidity)
- 🔐 **JWT Authentication** — Role-based access (admin/engineer/viewer)

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Next.js 14 Frontend                       │
│  Dashboard │ Inspection │ Defects │ RCA │ Maintenance │ IoT  │
└──────────────────────────┬──────────────────────────────────┘
                           │ REST API + JWT
┌──────────────────────────▼──────────────────────────────────┐
│                    FastAPI Backend                           │
│  /api/auth │ /api/dashboard │ /api/inspection │ /api/defects │
│  /api/rootcause │ /api/maintenance │ /api/reports │ /sensors  │
└──────────────────────────┬──────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────┐
│                  CrewAI Agent Crew                           │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Quality     │  │   Defect     │  │  Root Cause  │      │
│  │  Inspector   │→ │   Analyst    │→ │   Analyst    │      │
│  └──────────────┘  └──────────────┘  └──────┬───────┘      │
│                                             │               │
│                    ┌──────────────┐  ┌──────▼───────┐      │
│                    │   Report     │← │  Maintenance │      │
│                    │   Writer     │  │   Engineer   │      │
│                    └──────────────┘  └──────────────┘      │
└──────────────────────────┬──────────────────────────────────┘
                           │ LangChain
┌──────────────────────────▼──────────────────────────────────┐
│           Groq API — LLaMA3-70B-8192                        │
└─────────────────────────────────────────────────────────────┘
```

### AI Agents

| Agent | Role | Responsibility |
|-------|------|---------------|
| Quality Inspection Agent | Primary Inspector | Defect detection & quality scoring |
| Defect Analysis Agent | Pattern Analyst | Defect classification & trend analysis |
| Root Cause Agent | Cause Investigator | Causal chain & corrective actions |
| Maintenance Agent | Predictive Engineer | Equipment health & failure prediction |
| Reporting Agent | Intelligence Writer | Executive report synthesis |

---

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- Python 3.11+
- Docker & Docker Compose (for containerized deployment)
- Groq API Key (free at [console.groq.com](https://console.groq.com))

### Option 1: Docker Compose (Recommended)

```bash
# Clone the repository
git clone https://github.com/SanaCheema123/manufacturing-ai-platform.git
cd manufacturing-ai-platform

# Configure environment
cp backend/.env.example backend/.env
# Edit backend/.env and add your GROQ_API_KEY

# Launch full stack
docker-compose up -d

# Access the platform
open http://localhost:3000
```

### Option 2: Local Development

**Backend:**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

cp .env.example .env
# Edit .env and set GROQ_API_KEY

uvicorn main:app --reload --port 8000
```

**Frontend:**
```bash
cd frontend
npm install

cp .env.example .env.local
# Edit .env.local: NEXT_PUBLIC_API_URL=http://localhost:8000

npm run dev
```

**Visit:** http://localhost:3000

---

## 🔐 Demo Credentials

| Role | Username | Password | Access |
|------|----------|----------|--------|
| Admin | `admin` | `admin123` | Full access |
| Engineer | `engineer` | `engineer123` | Read + Analysis |
| Viewer | `viewer` | `viewer123` | Read only |

---

## 📁 Project Structure

```
manufacturing-ai-platform/
├── backend/
│   ├── main.py                 # FastAPI app entry point
│   ├── requirements.txt
│   ├── Dockerfile
│   ├── .env.example
│   ├── config/
│   │   └── settings.py         # Pydantic settings
│   ├── agents/
│   │   └── manufacturing_crew.py  # CrewAI 5-agent system
│   ├── services/
│   │   └── data_service.py     # Synthetic data generators
│   └── api/routes/
│       ├── auth.py             # JWT authentication
│       ├── dashboard.py        # Overview & KPIs
│       ├── inspection.py       # Quality inspection
│       ├── defects.py          # Defect management
│       ├── rootcause.py        # RCA endpoints
│       ├── maintenance.py      # Predictive maintenance
│       ├── reports.py          # AI report generation
│       └── sensors.py          # IoT sensor data
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── login/          # Auth page
│   │   │   └── dashboard/
│   │   │       ├── page.tsx    # Overview
│   │   │       ├── inspection/ # Quality inspection
│   │   │       ├── defects/    # Defect analysis
│   │   │       ├── rootcause/  # Root cause analysis
│   │   │       ├── maintenance/# Predictive maintenance
│   │   │       ├── sensors/    # IoT monitoring
│   │   │       ├── reports/    # AI reports
│   │   │       └── about/      # Platform info
│   │   ├── components/
│   │   │   ├── layout/         # Sidebar, Header, Footer
│   │   │   └── dashboard/      # KPI cards, charts
│   │   ├── lib/
│   │   │   ├── api.ts          # Axios API client
│   │   │   └── store.ts        # Zustand auth store
│   │   └── styles/
│   │       └── globals.css     # Industrial dark theme
│   ├── Dockerfile
│   └── .env.example
└── docker-compose.yml
```

---

## 🔧 Configuration

### Backend `.env`

```env
GROQ_API_KEY=gsk_your_key_here
SECRET_KEY=your_jwt_secret_key_change_this
DATABASE_URL=postgresql://user:pass@localhost:5432/manufacturing_db
MONGODB_URL=mongodb://localhost:27017/manufacturing_logs
REDIS_URL=redis://localhost:6379
```

### Frontend `.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## 📡 API Reference

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/login` | POST | JWT login |
| `/api/dashboard/overview` | GET | KPI metrics |
| `/api/inspection/analyze` | POST | AI quality inspection |
| `/api/defects/analyze` | POST | AI defect analysis |
| `/api/rootcause/analyze` | POST | AI root cause analysis |
| `/api/maintenance/predict` | POST | Failure prediction |
| `/api/reports/generate` | POST | Multi-agent report |
| `/api/sensors/live` | GET | Live IoT data |
| `/health` | GET | Health check |

Full interactive docs available at: `http://localhost:8000/docs`

---

## 🎨 Design System

- **Theme:** Dark industrial green
- **Fonts:** Orbitron (headings), Rajdhani (body), JetBrains Mono (data)
- **Colors:** `#0a0f0a` background · `#22c55e` accent · `#1e321e` borders
- **Components:** `mfg-card`, `mfg-table`, `mfg-input`, `btn-primary`, `badge-*`, `status-dot`

---

## 🛠️ Tech Stack

### Frontend
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion
- Recharts
- Zustand
- Axios

### Backend
- FastAPI
- CrewAI
- LangChain + Groq
- Python-Jose (JWT)
- Passlib + BCrypt
- Pydantic v2

### Infrastructure
- Docker + Docker Compose
- PostgreSQL 16
- MongoDB 7
- Redis 7

---

## 👩‍💻 Developer

**Sana Cheema**  
Founder & CEO · AIVONEX SMC-PVT LTD  
Bahawalpur, Pakistan

- 🐙 GitHub: [@SanaCheema123](https://github.com/SanaCheema123)
- 💼 LinkedIn: [sanacheema-ml-ai](https://www.linkedin.com/in/sanacheema-ml-ai/)

---

## 📄 License

© 2025 AIVONEX SMC-PVT LTD. All rights reserved.
