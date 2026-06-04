'use client'
import { useEffect, useState } from 'react'
import { defectsApi } from '@/lib/api'
import Header from '@/components/layout/Header'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'

export default function DefectsPage() {
  const [defects, setDefects] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [trends, setTrends] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [analyzing, setAnalyzing] = useState(false)
  const [aiResult, setAiResult] = useState<any>(null)
  const [filter, setFilter] = useState({ severity: '', machine: '' })

  useEffect(() => {
    Promise.all([defectsApi.list(), defectsApi.categories(), defectsApi.trends()])
      .then(([d, c, t]) => { setDefects(d.data); setCategories(c.data); setTrends(t.data) })
      .catch(() => toast.error('Failed to load defect data'))
      .finally(() => setLoading(false))
  }, [])

  const applyFilters = async () => {
    setLoading(true)
    try {
      const res = await defectsApi.list(filter.severity || undefined, filter.machine || undefined)
      setDefects(res.data)
    } catch { toast.error('Filter failed') }
    finally { setLoading(false) }
  }

  const runAIAnalysis = async () => {
    setAnalyzing(true)
    try {
      const res = await defectsApi.analyze({ time_range: '24h' })
      setAiResult(res.data)
      toast.success('AI defect analysis complete!')
    } catch { toast.error('AI analysis failed') }
    finally { setAnalyzing(false) }
  }

  const getSeverityBadge = (s: string) => ({ Critical: 'badge-critical', Major: 'badge-warning', Minor: 'badge-minor' }[s] || 'badge-minor')

  return (
    <div className="p-6 space-y-6">
      <Header title="Defect Analysis" subtitle="PATTERN RECOGNITION & ANOMALY DETECTION" />

      {/* Categories bar chart + trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="mfg-card p-5">
          <h3 className="font-semibold text-white text-sm mb-1">Defect by Category</h3>
          <p className="text-xs font-mono text-slate-600 mb-4">CLASSIFICATION BREAKDOWN</p>
          <div style={{ height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categories} layout="vertical" margin={{ left: 20, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E2D47" />
                <XAxis type="number" tick={{ fontSize: 10, fill: '#475569' }} />
                <YAxis dataKey="category" type="category" tick={{ fontSize: 10, fill: '#86a886' }} width={80} />
                <Tooltip contentStyle={{ background: '#0F1A2E', border: '1px solid #1E2D47', borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="count" fill="#22c55e" fillOpacity={0.8} radius={[0,4,4,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="mfg-card p-5">
          <h3 className="font-semibold text-white text-sm mb-1">Defect Rate Trend</h3>
          <p className="text-xs font-mono text-slate-600 mb-4">30-DAY HISTORY</p>
          <div style={{ height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trends.slice(-14)} margin={{ top: 5, right: 10, bottom: 0, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E2D47" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#475569' }} tickFormatter={d => d.slice(5)} />
                <YAxis tick={{ fontSize: 10, fill: '#475569' }} />
                <Tooltip contentStyle={{ background: '#0F1A2E', border: '1px solid #1E2D47', borderRadius: 8, fontSize: 12 }} />
                <Line type="monotone" dataKey="defect_rate" stroke="#ef4444" strokeWidth={2} dot={false} name="Defect %" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* AI Analysis */}
      <div className="mfg-card p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-white text-sm">AI Defect Pattern Analysis</h3>
            <p className="text-xs font-mono text-slate-600">CrewAI Defect Analysis Engineer</p>
          </div>
          <button onClick={runAIAnalysis} disabled={analyzing} className="btn-primary flex items-center gap-2 text-sm py-2">
            {analyzing ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Analyzing...</> : <>Run AI Analysis</>}
          </button>
        </div>
        {aiResult && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 bg-black/30 rounded-xl p-4 font-mono text-xs text-blue-400 leading-relaxed max-h-48 overflow-y-auto">
              {aiResult.ai_analysis?.slice(0, 800)}
            </div>
            <div className="space-y-2">
              <h4 className="text-xs font-mono text-slate-500 uppercase tracking-wider">Top Defects</h4>
              {(aiResult.top_defect_types || []).map((d: any) => (
                <div key={d.type} className="flex items-center justify-between py-1.5 px-3 rounded-lg bg-blue-500/5">
                  <span className="text-xs text-white">{d.type}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-blue-500">{d.count}</span>
                    <span className={`text-xs font-mono ${d.trend === 'increasing' ? 'text-red-400' : d.trend === 'decreasing' ? 'text-blue-400' : 'text-yellow-400'}`}>
                      {d.trend === 'increasing' ? '↑' : d.trend === 'decreasing' ? '↓' : '→'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Defects table with filters */}
      <div className="mfg-card">
        <div className="p-5 border-b border-slate-700/40 flex items-center gap-3 flex-wrap">
          <h3 className="font-semibold text-white text-sm flex-1">Defect Records</h3>
          <select value={filter.severity} onChange={e => setFilter({ ...filter, severity: e.target.value })} className="mfg-input w-36 text-xs py-2">
            <option value="">All Severity</option>
            <option value="Critical">Critical</option>
            <option value="Major">Major</option>
            <option value="Minor">Minor</option>
          </select>
          <select value={filter.machine} onChange={e => setFilter({ ...filter, machine: e.target.value })} className="mfg-input w-36 text-xs py-2">
            <option value="">All Machines</option>
            {['CNC-001', 'WELD-002', 'PAINT-003', 'ASSEMBLY-004', 'PRESS-005'].map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
          <button onClick={applyFilters} className="btn-secondary text-xs py-2 px-4">Filter</button>
        </div>
        <div className="overflow-x-auto">
          <table className="mfg-table">
            <thead><tr>
              <th>ID</th><th>Type</th><th>Machine</th><th>Severity</th>
              <th>Confidence</th><th>Location</th><th>Status</th><th>Cost Impact</th>
            </tr></thead>
            <tbody>
              {defects.map((d: any) => (
                <tr key={d.id}>
                  <td className="font-mono text-xs text-blue-500">{d.id}</td>
                  <td className="text-xs text-white">{d.type}</td>
                  <td className="text-xs font-mono text-slate-500">{d.machine}</td>
                  <td><span className={`badge text-xs ${getSeverityBadge(d.severity)}`}>{d.severity}</span></td>
                  <td className="text-xs font-mono text-blue-400">{d.confidence}%</td>
                  <td className="text-xs text-slate-500">{d.location}</td>
                  <td><span className={`badge text-xs ${d.status === 'Open' ? 'badge-critical' : d.status === 'Resolved' ? 'badge-pass' : 'badge-warning'}`}>{d.status}</span></td>
                  <td className="text-xs font-mono text-yellow-500">${d.cost_impact}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
