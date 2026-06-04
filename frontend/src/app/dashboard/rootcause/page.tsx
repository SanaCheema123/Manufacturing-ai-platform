'use client'
import { useEffect, useState } from 'react'
import { rcaApi } from '@/lib/api'
import Header from '@/components/layout/Header'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'

export default function RootCausePage() {
  const [rcaList, setRcaList] = useState<any[]>([])
  const [analyzing, setAnalyzing] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [form, setForm] = useState({ machine_id: 'CNC-001', time_window: '24h' })

  useEffect(() => {
    rcaApi.list().then(r => setRcaList(r.data)).catch(() => toast.error('Failed to load RCA data'))
  }, [])

  const runRCA = async () => {
    setAnalyzing(true)
    setResult(null)
    try {
      const res = await rcaApi.analyze(form)
      setResult(res.data)
      toast.success('Root cause analysis complete!')
    } catch { toast.error('RCA analysis failed') }
    finally { setAnalyzing(false) }
  }

  return (
    <div className="p-6 space-y-6">
      <Header title="Root Cause Analysis" subtitle="AI-POWERED FAULT INVESTIGATION" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* RCA Form */}
        <div className="mfg-card p-6">
          <h3 className="font-semibold text-white mb-1">Run RCA Investigation</h3>
          <p className="text-xs text-slate-500 font-mono mb-4">CrewAI Root Cause Expert</p>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-slate-500 mb-2 uppercase tracking-wider">Target Machine</label>
              <select value={form.machine_id} onChange={e => setForm({ ...form, machine_id: e.target.value })} className="mfg-input">
                {['CNC-001', 'WELD-002', 'PAINT-003', 'ASSEMBLY-004', 'PRESS-005'].map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-mono text-slate-500 mb-2 uppercase tracking-wider">Time Window</label>
              <select value={form.time_window} onChange={e => setForm({ ...form, time_window: e.target.value })} className="mfg-input">
                <option value="6h">Last 6 Hours</option>
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
              </select>
            </div>
            <button onClick={runRCA} disabled={analyzing} className="btn-primary w-full flex items-center justify-center gap-2">
              {analyzing ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Investigating...</> : <>Investigate Root Cause</>}
            </button>
          </div>

          {result && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 pt-4 border-t border-slate-700/50 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-500">CONFIDENCE</span>
                <span className="stat-number text-lg text-blue-400">{result.confidence}%</span>
              </div>
              <div>
                <span className="text-xs font-mono text-slate-600">PRIMARY CAUSE</span>
                <p className="text-sm text-white mt-1">{result.primary_cause}</p>
              </div>
              <div>
                <span className="text-xs font-mono text-slate-600 block mb-2">CAUSAL CHAIN</span>
                {result.causal_chain?.map((step: string, i: number) => (
                  <div key={i} className="flex items-start gap-2 mb-1.5">
                    <span className="w-5 h-5 rounded-full bg-green-500/15 text-blue-400 text-xs flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
                    <span className="text-xs text-blue-500">{step}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* RCA list */}
        <div className="lg:col-span-2 space-y-4">
          {rcaList.map((rca, i) => (
            <motion.div key={rca.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="mfg-card p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs text-blue-500">{rca.id}</span>
                    <span className={`badge text-xs ${rca.priority === 'Critical' ? 'badge-critical' : rca.priority === 'High' ? 'badge-warning' : 'badge-minor'}`}>{rca.priority}</span>
                    <span className={`badge text-xs ${rca.status === 'Resolved' ? 'badge-pass' : rca.status === 'Open' ? 'badge-critical' : 'badge-warning'}`}>{rca.status}</span>
                  </div>
                  <h4 className="font-semibold text-white">{rca.defect_type}</h4>
                  <p className="text-sm text-blue-500 mt-1">{rca.primary_cause}</p>
                </div>
                <div className="text-right">
                  <div className="stat-number text-xl text-blue-400">{rca.confidence}%</div>
                  <div className="text-xs font-mono text-slate-600">CONFIDENCE</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-mono text-slate-600 uppercase tracking-wider mb-2">Contributing Factors</p>
                  <ul className="space-y-1">
                    {rca.contributing_factors.map((f: string, j: number) => (
                      <li key={j} className="text-xs text-blue-500 flex items-center gap-2">
                        <span className="text-yellow-500">▸</span>{f}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-mono text-slate-600 uppercase tracking-wider mb-2">Corrective Action</p>
                  <p className="text-xs text-blue-400">{rca.corrective_action}</p>
                  <div className="mt-2 flex items-center gap-3">
                    <span className="text-xs font-mono text-slate-600">Affected Units:</span>
                    <span className="text-xs text-white font-semibold">{rca.affected_units}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* AI Analysis result full */}
      {result && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mfg-card p-5">
          <h3 className="font-semibold text-white text-sm mb-1">AI Investigation Report</h3>
          <p className="text-xs font-mono text-slate-600 mb-4">Root Cause Analysis Expert · {result.machine_id}</p>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 bg-black/30 rounded-xl p-4 font-mono text-xs text-blue-400 leading-relaxed max-h-60 overflow-y-auto">
              {result.ai_analysis}
            </div>
            <div>
              <p className="text-xs font-mono text-slate-500 uppercase mb-3">Corrective Actions</p>
              <ul className="space-y-2">
                {result.corrective_actions?.map((a: string, i: number) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-green-500/15 text-blue-400 text-xs flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
                    <span className="text-xs text-blue-400">{a}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
