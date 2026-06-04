'use client'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Header from '@/components/layout/Header'

const AGENTS = [
  {
    name: 'Quality Inspection Agent',
    role: 'Primary Inspector',
    desc: 'Analyzes production line images and sensor data to detect defects in real-time using computer vision heuristics.',
    color: 'from-green-500/20 to-green-500/5',
    border: 'border-blue-500/20',
    icon: '🔍',
  },
  {
    name: 'Defect Analysis Agent',
    role: 'Pattern Analyst',
    desc: 'Classifies defects by category, severity, and frequency. Identifies trends and anomalies in defect patterns.',
    color: 'from-yellow-500/20 to-yellow-500/5',
    border: 'border-yellow-500/30',
    icon: '📊',
  },
  {
    name: 'Root Cause Agent',
    role: 'Cause Investigator',
    desc: 'Traces defects back to their root causes using causal chain analysis, process parameters, and historical data.',
    color: 'from-orange-500/20 to-orange-500/5',
    border: 'border-orange-500/30',
    icon: '🌳',
  },
  {
    name: 'Maintenance Agent',
    role: 'Predictive Engineer',
    desc: 'Monitors equipment health metrics and predicts failure probabilities to schedule proactive maintenance.',
    color: 'from-blue-500/20 to-blue-500/5',
    border: 'border-blue-500/30',
    icon: '⚙️',
  },
  {
    name: 'Reporting Agent',
    role: 'Intelligence Writer',
    desc: 'Synthesizes findings from all agents to produce executive-grade reports with actionable recommendations.',
    color: 'from-purple-500/20 to-purple-500/5',
    border: 'border-purple-500/30',
    icon: '📄',
  },
]

const TECH_STACK = [
  { category: 'Frontend', items: ['Next.js 14', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Recharts', 'Zustand'] },
  { category: 'Backend', items: ['FastAPI', 'Python 3.11', 'CrewAI', 'LangChain', 'Pydantic', 'JWT Auth'] },
  { category: 'AI/LLM', items: ['Groq API', 'LLaMA3-70B', 'CrewAI Agents', 'Multi-Agent Orchestration'] },
  { category: 'Infrastructure', items: ['Docker', 'Docker Compose', 'PostgreSQL', 'MongoDB', 'Redis'] },
]

export default function AboutPage() {
  return (
    <div className="p-6 space-y-6">
      <Header title="About This Platform" subtitle="AIVONEX MANUFACTURING INTELLIGENCE" />

      {/* Hero Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mfg-card p-8 relative overflow-hidden"
      >
        <div className="absolute inset-0 opacity-5 bg-[repeating-linear-gradient(0deg,#22c55e,#22c55e_1px,transparent_1px,transparent_40px),repeating-linear-gradient(90deg,#22c55e,#22c55e_1px,transparent_1px,transparent_40px)]" />
        <div className="relative flex flex-col md:flex-row items-center gap-8">
          <div className="flex-shrink-0">
            <Image src="/aivonex_logo.png" alt="AIVONEX" width={100} height={100} className="rounded-2xl" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <div className="font-mono text-xs text-blue-500 tracking-widest mb-2">AIVONEX SMC-PVT LTD</div>
            <h1 className="text-2xl font-bold text-white mb-3" style={{ fontFamily: 'Orbitron, sans-serif' }}>
              Manufacturing AI Platform
            </h1>
            <p className="text-blue-400 text-sm leading-relaxed max-w-2xl">
              An enterprise-grade AI-powered quality inspection and root cause analysis system. 
              Five specialized CrewAI agents collaborate to monitor production lines, detect defects, 
              analyze failures, predict maintenance needs, and generate actionable intelligence reports.
            </p>
            <div className="flex flex-wrap gap-2 mt-4 justify-center md:justify-start">
              {['CrewAI', 'LLaMA3-70B', 'FastAPI', 'Next.js 14', 'Real-time IoT'].map(tag => (
                <span key={tag} className="badge badge-pass text-xs px-3 py-1">{tag}</span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Agent Architecture */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-1 h-6 bg-green-500 rounded-full" />
          <h2 className="text-white font-semibold">AI Agent Architecture</h2>
          <span className="text-xs font-mono text-slate-600">5 SPECIALIZED AGENTS</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {AGENTS.map((agent, i) => (
            <motion.div
              key={agent.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className={`mfg-card p-5 border ${agent.border} bg-gradient-to-b ${agent.color}`}
            >
              <div className="text-3xl mb-3">{agent.icon}</div>
              <div className="text-xs font-mono text-slate-500 mb-1 uppercase tracking-wider">{agent.role}</div>
              <div className="text-sm font-semibold text-white mb-2">{agent.name}</div>
              <p className="text-xs text-slate-500 leading-relaxed">{agent.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Agent flow diagram */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mfg-card p-5 mt-4"
        >
          <p className="text-xs font-mono text-slate-500 mb-4">AGENT COLLABORATION FLOW</p>
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-mono">
            {['Sensor Input', '→', 'Quality Inspector', '→', 'Defect Analyst', '→', 'Root Cause', '→', 'Maintenance', '→', 'Report Writer', '→', 'Executive Report'].map((item, i) => (
              <span
                key={i}
                className={item === '→' ? 'text-slate-600' : 'bg-blue-500/10 text-blue-400 px-3 py-1.5 rounded-lg border border-slate-700/50'}
              >
                {item}
              </span>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Tech Stack */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-1 h-6 bg-green-500 rounded-full" />
          <h2 className="text-white font-semibold">Technology Stack</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {TECH_STACK.map((stack, i) => (
            <motion.div
              key={stack.category}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="mfg-card p-5"
            >
              <div className="text-xs font-mono text-blue-500 uppercase tracking-wider mb-3">{stack.category}</div>
              <div className="space-y-2">
                {stack.items.map(item => (
                  <div key={item} className="flex items-center gap-2 text-sm text-blue-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500/60 flex-shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Developer Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mfg-card p-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-1 h-6 bg-green-500 rounded-full" />
          <h2 className="text-white font-semibold">Developer</h2>
        </div>
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="w-20 h-20 rounded-2xl bg-blue-500/10 border border-green-500/20 flex items-center justify-center flex-shrink-0">
            <span className="text-3xl font-bold text-blue-400" style={{ fontFamily: 'Orbitron, sans-serif' }}>SC</span>
          </div>
          <div className="flex-1 text-center md:text-left">
            <div className="text-lg font-bold text-white mb-1">Sana Cheema</div>
            <div className="text-xs font-mono text-blue-500 mb-3">Founder & CEO · AIVONEX SMC-PVT LTD · Bahawalpur, Pakistan</div>
            <p className="text-sm text-blue-400 leading-relaxed mb-4 max-w-2xl">
              AI/ML engineer and researcher specializing in computer vision, deep learning, and production-grade AI systems. 
              Founder of AIVONEX, delivering enterprise AI solutions across manufacturing, finance, and healthcare domains.
            </p>
            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              <a
                href="https://github.com/SanaCheema123"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs font-mono text-blue-400 hover:text-blue-300 transition-colors bg-blue-500/10 px-4 py-2 rounded-xl border border-slate-700/50"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
                GitHub
              </a>
              <a
                href="https://www.linkedin.com/in/sanacheema-ml-ai/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs font-mono text-blue-400 hover:text-blue-300 transition-colors bg-blue-500/10 px-4 py-2 rounded-xl border border-slate-700/50"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                LinkedIn
              </a>
            </div>
          </div>
          <div className="flex-shrink-0">
            <Image src="/aivonex_logo.png" alt="AIVONEX" width={72} height={72} className="rounded-xl opacity-80" />
          </div>
        </div>
      </motion.div>

      {/* Platform Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'AI Agents', value: '5', sub: 'Specialized CrewAI' },
          { label: 'API Endpoints', value: '25+', sub: 'FastAPI Routes' },
          { label: 'Dashboard Pages', value: '8', sub: 'Next.js Views' },
          { label: 'Real-time Metrics', value: '30+', sub: 'IoT Data Points' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.08 }}
            className="mfg-card p-5 text-center"
          >
            <div className="stat-number text-3xl font-bold text-blue-400 mb-1">{stat.value}</div>
            <div className="text-sm text-white font-semibold mb-1">{stat.label}</div>
            <div className="text-xs text-slate-600 font-mono">{stat.sub}</div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
