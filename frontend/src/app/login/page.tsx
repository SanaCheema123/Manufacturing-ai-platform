'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { authApi } from '@/lib/api'
import { useAuthStore } from '@/lib/store'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'

const DEMO_USERS = [
  { label: 'Admin', username: 'admin', password: 'admin123', color: '#3B82F6' },
  { label: 'Engineer', username: 'engineer', password: 'engineer123', color: '#10B981' },
  { label: 'Viewer', username: 'viewer', password: 'viewer123', color: '#F59E0B' },
]

export default function LoginPage() {
  const router = useRouter()
  const { setAuth } = useAuthStore()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (u?: string, p?: string) => {
    const user = u || username
    const pass = p || password
    if (!user || !pass) { toast.error('Enter credentials'); return }
    setLoading(true)
    try {
      const res = await authApi.login(user, pass)
      setAuth(res.data.user, res.data.access_token)
      toast.success('Access granted')
      router.push('/dashboard')
    } catch {
      toast.error('Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex" style={{ background: '#070B14' }}>
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0D1424 0%, #0F1A2E 50%, #091422 100%)' }}>

        {/* Grid background */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'linear-gradient(#3B82F6 1px, transparent 1px), linear-gradient(90deg, #3B82F6 1px, transparent 1px)', backgroundSize: '48px 48px' }} />

        {/* Glow orb */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #3B82F6 0%, transparent 70%)' }} />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <Image src="/aivonex_logo.png" alt="AIVONEX" width={44} height={44} className="rounded-xl" />
            <div>
              <div className="text-white font-bold text-lg" style={{ fontFamily: 'Syne, sans-serif' }}>AIVONEX</div>
              <div className="text-xs font-mono" style={{ color: '#475569', letterSpacing: '0.1em' }}>SMC-PVT LTD</div>
            </div>
          </div>
        </div>

        <div className="relative z-10 space-y-6">
          <div>
            <h1 className="text-4xl font-bold leading-tight mb-4"
              style={{ fontFamily: 'Syne, sans-serif', color: '#F0F6FF' }}>
              Manufacturing<br />
              <span style={{ color: '#3B82F6' }}>Intelligence</span><br />
              Platform
            </h1>
            <p style={{ color: '#94A3B8', fontSize: '15px', lineHeight: '1.7' }}>
              Five AI agents working in concert — inspecting quality, analyzing defects,
              tracing root causes, predicting failures, and generating actionable intelligence.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'AI Agents', value: '5' },
              { label: 'API Routes', value: '25+' },
              { label: 'Live Metrics', value: '30+' },
              { label: 'LLM Model', value: 'LLaMA3' },
            ].map(s => (
              <div key={s.label} className="rounded-xl p-4"
                style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.12)' }}>
                <div className="text-2xl font-bold mb-1" style={{ fontFamily: 'Space Grotesk, sans-serif', color: '#60A5FA' }}>{s.value}</div>
                <div className="text-xs font-mono" style={{ color: '#475569', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-xs font-mono" style={{ color: '#334155' }}>
            Powered by CrewAI · Groq LLaMA3-70B · FastAPI · Next.js 14
          </p>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <Image src="/aivonex_logo.png" alt="AIVONEX" width={40} height={40} className="rounded-xl" />
            <div>
              <div className="font-bold text-white" style={{ fontFamily: 'Syne, sans-serif' }}>AIVONEX</div>
              <div className="text-xs font-mono" style={{ color: '#475569' }}>Manufacturing AI Platform</div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: 'Syne, sans-serif' }}>Sign in</h2>
            <p style={{ color: '#64748B', fontSize: '14px' }}>Access your manufacturing intelligence dashboard</p>
          </div>

          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-xs font-mono mb-2" style={{ color: '#64748B', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Username</label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
                placeholder="Enter username"
                className="mfg-input"
              />
            </div>
            <div>
              <label className="block text-xs font-mono mb-2" style={{ color: '#64748B', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
                placeholder="Enter password"
                className="mfg-input"
              />
            </div>
            <button onClick={() => handleLogin()} disabled={loading} className="btn-primary w-full py-3">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Authenticating...
                </span>
              ) : 'Sign In'}
            </button>
          </div>

          {/* Demo credentials */}
          <div className="rounded-xl p-4" style={{ background: '#0D1424', border: '1px solid #1E2D47' }}>
            <p className="text-xs font-mono mb-3" style={{ color: '#475569', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Demo Credentials</p>
            <div className="space-y-2">
              {DEMO_USERS.map(u => (
                <button
                  key={u.username}
                  onClick={() => { setUsername(u.username); setPassword(u.password); handleLogin(u.username, u.password) }}
                  className="w-full flex items-center justify-between rounded-lg px-3 py-2.5 transition-colors"
                  style={{ background: '#111827', border: '1px solid #1E2D47' }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = '#243554')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = '#1E2D47')}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-2 h-2 rounded-full" style={{ background: u.color }} />
                    <span className="text-sm font-medium text-white">{u.label}</span>
                  </div>
                  <span className="text-xs font-mono" style={{ color: '#475569' }}>{u.username} / {u.password}</span>
                </button>
              ))}
            </div>
          </div>

          <p className="text-center text-xs mt-6 font-mono" style={{ color: '#334155' }}>
            Built by <span style={{ color: '#3B82F6' }}>Sana Cheema</span> · AIVONEX SMC-PVT LTD
          </p>
        </motion.div>
      </div>
    </div>
  )
}
