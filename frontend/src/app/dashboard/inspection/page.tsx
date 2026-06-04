'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { inspectionApi } from '@/lib/api'
import Header from '@/components/layout/Header'
import toast from 'react-hot-toast'

export default function InspectionPage() {
  const [inspections, setInspections] = useState<any[]>([])
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [analyzing, setAnalyzing] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [form, setForm] = useState({ machine_id: 'CNC-001', inspection_type: 'standard', notes: '' })

  useEffect(() => {
    Promise.all([inspectionApi.list(), inspectionApi.stats()])
      .then(([listRes, statsRes]) => {
        setInspections(listRes.data)
        setStats(statsRes.data)
      })
      .catch(() => toast.error('Failed to load inspection data'))
      .finally(() => setLoading(false))
  }, [])

  const runAnalysis = async () => {
    setAnalyzing(true)
    setResult(null)
    try {
      const res = await inspectionApi.analyze(form)
      setResult(res.data)
      toast.success('AI inspection analysis complete!')
    } catch {
      toast.error('Analysis failed')
    } finally {
      setAnalyzing(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const map: Record<string, string> = {
      Pass: 'badge-pass', Fail: 'badge-fail', Warning: 'badge-warning'
    }
    return map[status] || 'badge-minor'
  }

  const getSeverityBadge = (severity: string) => {
    const map: Record<string, string> = {
      Critical: 'badge-critical', Major: 'badge-warning', Minor: 'badge-minor'
    }
    return map[severity] || 'badge-minor'
  }

  return (
    <div className="p-6 space-y-6">
      <Header title="Quality Inspection" subtitle="AI-POWERED VISUAL QUALITY CONTROL" />

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Inspected Today', value: stats.total_inspected_today?.toLocaleString(), color: 'text-white' },
            { label: 'First Pass Yield', value: `${stats.first_pass_yield}%`, color: 'text-blue-400' },
            { label: 'Defect Rate', value: `${stats.defect_rate}%`, color: 'text-red-400' },
            { label: 'Avg Cycle Time', value: `${stats.avg_cycle_time}s`, color: 'text-blue-400' },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="mfg-card p-4">
              <div className={`stat-number text-2xl font-bold mb-1 ${s.color}`}>{s.value}</div>
              <div className="text-xs font-mono text-slate-600 uppercase tracking-wider">{s.label}</div>
            </motion.div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AI Analysis Panel */}
        <div className="mfg-card p-6">
          <h3 className="font-semibold text-white mb-1">Run AI Inspection</h3>
          <p className="text-xs text-slate-500 font-mono mb-4">CrewAI Quality Inspection Agent</p>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-slate-500 mb-2 uppercase tracking-wider">Machine ID</label>
              <select
                value={form.machine_id}
                onChange={e => setForm({ ...form, machine_id: e.target.value })}
                className="mfg-input"
              >
                {['CNC-001', 'WELD-002', 'PAINT-003', 'ASSEMBLY-004', 'PRESS-005'].map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-mono text-slate-500 mb-2 uppercase tracking-wider">Inspection Type</label>
              <select
                value={form.inspection_type}
                onChange={e => setForm({ ...form, inspection_type: e.target.value })}
                className="mfg-input"
              >
                <option value="standard">Standard</option>
                <option value="deep">Deep Analysis</option>
                <option value="quick">Quick Scan</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-mono text-slate-500 mb-2 uppercase tracking-wider">Notes</label>
              <textarea
                value={form.notes}
                onChange={e => setForm({ ...form, notes: e.target.value })}
                className="mfg-input resize-none"
                rows={3}
                placeholder="Additional inspection notes..."
              />
            </div>

            <button
              onClick={runAnalysis}
              disabled={analyzing}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {analyzing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  AI Analyzing...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                  </svg>
                  Run AI Inspection
                </>
              )}
            </button>
          </div>

          {/* Result */}
          {result && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 space-y-3">
              <div className="border-t border-slate-700/50 pt-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono text-slate-500">RESULT</span>
                  <span className={`badge text-xs ${result.quality_status === 'PASS' ? 'badge-pass' : result.quality_status === 'FAIL' ? 'badge-fail' : 'badge-warning'}`}>
                    {result.quality_status}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="bg-blue-500/5 rounded-lg p-2 text-center">
                    <div className="stat-number text-lg text-white">{result.severity_score}</div>
                    <div className="text-xs text-slate-600">Severity</div>
                  </div>
                  <div className="bg-blue-500/5 rounded-lg p-2 text-center">
                    <div className="stat-number text-lg text-white">{result.confidence}%</div>
                    <div className="text-xs text-slate-600">Confidence</div>
                  </div>
                </div>
                <div className="bg-black/30 rounded-lg p-3 text-xs text-blue-500 font-mono leading-relaxed max-h-40 overflow-y-auto">
                  {result.ai_analysis?.slice(0, 500)}...
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Inspection List */}
        <div className="lg:col-span-2 mfg-card">
          <div className="p-5 border-b border-slate-700/40">
            <h3 className="font-semibold text-white text-sm">Recent Inspections</h3>
            <p className="text-xs font-mono text-slate-600">LATEST QUALITY CHECKS</p>
          </div>
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-8 text-center text-slate-500 font-mono text-sm">LOADING...</div>
            ) : (
              <table className="mfg-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Product</th>
                    <th>Machine</th>
                    <th>Status</th>
                    <th>Defect Type</th>
                    <th>Severity</th>
                    <th>Confidence</th>
                  </tr>
                </thead>
                <tbody>
                  {inspections.map((item) => (
                    <tr key={item.id}>
                      <td className="font-mono text-blue-500 text-xs">{item.id}</td>
                      <td className="text-xs text-blue-400">{item.product_id}</td>
                      <td className="text-xs font-mono text-slate-500">{item.machine}</td>
                      <td><span className={`badge text-xs ${getStatusBadge(item.status)}`}>{item.status}</span></td>
                      <td className="text-xs text-blue-500">{item.defect_type}</td>
                      <td><span className={`badge text-xs ${getSeverityBadge(item.severity)}`}>{item.severity}</span></td>
                      <td className="text-xs font-mono text-blue-400">{item.confidence}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
