'use client'
import { useEffect, useState } from 'react'
import { reportsApi } from '@/lib/api'
import Header from '@/components/layout/Header'
import toast from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'

const REPORT_TYPES = [
  { value: 'quality_summary', label: 'Quality Summary', desc: 'Defect trends, pass/fail rates, quality KPIs' },
  { value: 'maintenance_report', label: 'Maintenance Report', desc: 'Equipment health, work orders, predictions' },
  { value: 'production_overview', label: 'Production Overview', desc: 'Throughput, OEE, shift performance' },
  { value: 'root_cause_analysis', label: 'Root Cause Analysis', desc: 'Failure patterns, corrective actions' },
  { value: 'executive_summary', label: 'Executive Summary', desc: 'Full multi-agent comprehensive report' },
]

const TIME_RANGES = ['Last 24 Hours', 'Last 7 Days', 'Last 30 Days', 'Last Quarter']

export default function ReportsPage() {
  const [reports, setReports] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [reportType, setReportType] = useState('executive_summary')
  const [timeRange, setTimeRange] = useState('Last 7 Days')
  const [selectedReport, setSelectedReport] = useState<any>(null)

  useEffect(() => {
    reportsApi.list()
      .then(r => setReports(r.data))
      .catch(() => toast.error('Failed to load reports'))
      .finally(() => setLoading(false))
  }, [])

  const generateReport = async () => {
    setGenerating(true)
    setResult(null)
    try {
      const res = await reportsApi.generate({ report_type: reportType, time_range: timeRange })
      setResult(res.data)
      setReports(prev => [res.data, ...prev])
      toast.success('Report generated successfully!')
    } catch {
      toast.error('Report generation failed')
    } finally {
      setGenerating(false)
    }
  }

  const selectedType = REPORT_TYPES.find(t => t.value === reportType)

  return (
    <div className="p-6 space-y-6">
      <Header title="AI Report Generation" subtitle="MULTI-AGENT INTELLIGENCE REPORTS" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Generator Panel */}
        <div className="space-y-4">
          <div className="mfg-card p-6">
            <h3 className="font-semibold text-white mb-1">Generate New Report</h3>
            <p className="text-xs text-slate-500 font-mono mb-5">CREWAI MULTI-AGENT SYSTEM</p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-500 mb-2 uppercase">Report Type</label>
                <div className="space-y-2">
                  {REPORT_TYPES.map(t => (
                    <button
                      key={t.value}
                      onClick={() => setReportType(t.value)}
                      className={`w-full text-left p-3 rounded-xl border transition-all ${
                        reportType === t.value
                          ? 'border-blue-500/40 bg-blue-500/10'
                          : 'border-slate-700/50 bg-transparent hover:bg-blue-500/5'
                      }`}
                    >
                      <div className={`text-xs font-semibold mb-0.5 ${reportType === t.value ? 'text-blue-400' : 'text-white'}`}>
                        {t.label}
                      </div>
                      <div className="text-xs text-slate-600">{t.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-500 mb-2 uppercase">Time Range</label>
                <select
                  value={timeRange}
                  onChange={e => setTimeRange(e.target.value)}
                  className="mfg-input"
                >
                  {TIME_RANGES.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>

              <button
                onClick={generateReport}
                disabled={generating}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                {generating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>Generate Report</>
                )}
              </button>
            </div>
          </div>

          {/* Agent Status during generation */}
          {generating && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mfg-card p-4">
              <p className="text-xs font-mono text-slate-500 mb-3">AGENTS ACTIVE</p>
              {['Quality Inspector', 'Defect Analyst', 'Root Cause Analyst', 'Maintenance Eng.', 'Report Writer'].map((agent, i) => (
                <motion.div
                  key={agent}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.3 }}
                  className="flex items-center gap-2 mb-2"
                >
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-xs text-blue-500 font-mono">{agent}</span>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>

        {/* Report Content */}
        <div className="lg:col-span-2 space-y-4">
          {result ? (
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="mfg-card p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-white text-sm">{result.title || selectedType?.label}</h3>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs font-mono text-slate-500">{result.time_range || timeRange}</span>
                    <span className="text-xs text-slate-700">•</span>
                    <span className="text-xs font-mono text-slate-500">{new Date().toLocaleDateString()}</span>
                  </div>
                </div>
                <span className="badge badge-pass text-xs">Completed</span>
              </div>

              {/* Key Metrics */}
              {result.key_metrics && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
                  {Object.entries(result.key_metrics).slice(0, 4).map(([k, v]: any) => (
                    <div key={k} className="bg-blue-500/5 rounded-xl p-3 text-center">
                      <div className="stat-number text-xl text-white font-bold">{v}</div>
                      <div className="text-xs text-slate-600 mt-1 capitalize">{k.replace(/_/g, ' ')}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Main analysis */}
              {result.analysis && (
                <div className="mb-4">
                  <p className="text-xs font-mono text-slate-500 mb-2">AI ANALYSIS</p>
                  <div className="bg-blue-500/5 rounded-xl p-4 text-sm text-blue-300 leading-relaxed whitespace-pre-wrap border border-slate-700/40">
                    {result.analysis}
                  </div>
                </div>
              )}

              {/* Recommendations */}
              {result.recommendations && result.recommendations.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs font-mono text-slate-500 mb-2">RECOMMENDATIONS</p>
                  <div className="space-y-2">
                    {result.recommendations.map((rec: string, i: number) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-blue-400">
                        <span className="text-blue-400 mt-0.5 font-bold">▸</span>
                        {rec}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions section */}
              <div className="flex items-center gap-3 pt-4 border-t border-slate-700/40">
                <button
                  onClick={() => {
                    const content = JSON.stringify(result, null, 2)
                    const blob = new Blob([content], { type: 'application/json' })
                    const url = URL.createObjectURL(blob)
                    const a = document.createElement('a')
                    a.href = url
                    a.download = `aivonex_report_${reportType}_${Date.now()}.json`
                    a.click()
                    toast.success('Report exported!')
                  }}
                  className="btn-secondary text-xs px-4 py-2"
                >
                  Export JSON
                </button>
                <button
                  onClick={() => {
                    window.print()
                  }}
                  className="btn-secondary text-xs px-4 py-2"
                >
                  Print / PDF
                </button>
                <span className="text-xs text-slate-700 ml-auto font-mono">
                  Generated by {result.agents_used?.length || 5} AI Agents
                </span>
              </div>
            </motion.div>
          ) : (
            <div className="mfg-card p-8 flex flex-col items-center justify-center text-center" style={{ minHeight: 300 }}>
              <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-4">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="1.5">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                  <polyline points="10 9 9 9 8 9"/>
                </svg>
              </div>
              <p className="text-white font-semibold mb-2">No Report Generated Yet</p>
              <p className="text-xs text-slate-600">Select a report type and time range, then click Generate Report to run the multi-agent AI crew.</p>
            </div>
          )}

          {/* Report History */}
          {reports.length > 0 && (
            <div className="mfg-card">
              <div className="p-4 border-b border-slate-700/40 flex items-center justify-between">
                <h3 className="font-semibold text-white text-sm">Report History</h3>
                <span className="text-xs font-mono text-slate-600">{reports.length} reports</span>
              </div>
              <div className="divide-y divide-green-900/10">
                {reports.slice(0, 8).map((r: any, i: number) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.04 }}
                    className="p-4 flex items-center justify-between hover:bg-blue-500/5 transition-colors cursor-pointer"
                    onClick={() => setResult(r)}
                  >
                    <div>
                      <div className="text-sm text-white font-medium">{r.title || r.report_type}</div>
                      <div className="text-xs text-slate-600 font-mono mt-0.5">{r.time_range || 'N/A'} • {r.generated_at ? new Date(r.generated_at).toLocaleDateString() : 'Recent'}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="badge badge-pass text-xs">Done</span>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2">
                        <polyline points="9 18 15 12 9 6"/>
                      </svg>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
