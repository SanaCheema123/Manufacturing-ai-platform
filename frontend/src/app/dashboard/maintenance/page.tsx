'use client'
import { useEffect, useState } from 'react'
import { maintenanceApi } from '@/lib/api'
import Header from '@/components/layout/Header'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'

export default function MaintenancePage() {
  const [machines, setMachines] = useState<any[]>([])
  const [schedule, setSchedule] = useState<any[]>([])
  const [workOrders, setWorkOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [predicting, setPredicting] = useState(false)
  const [prediction, setPrediction] = useState<any>(null)
  const [selectedMachine, setSelectedMachine] = useState('CNC-001')

  useEffect(() => {
    Promise.all([maintenanceApi.equipmentHealth(), maintenanceApi.schedule(), maintenanceApi.workOrders()])
      .then(([m, s, w]) => { setMachines(m.data); setSchedule(s.data); setWorkOrders(w.data) })
      .catch(() => toast.error('Failed to load maintenance data'))
      .finally(() => setLoading(false))
  }, [])

  const runPrediction = async () => {
    setPredicting(true)
    try {
      const res = await maintenanceApi.predict({ machine_id: selectedMachine })
      setPrediction(res.data)
      toast.success('Maintenance prediction complete!')
    } catch { toast.error('Prediction failed') }
    finally { setPredicting(false) }
  }

  const getHealthColor = (score: number) => score >= 80 ? 'text-blue-400' : score >= 65 ? 'text-yellow-400' : 'text-red-400'
  const getHealthBarColor = (score: number) => score >= 80 ? '#22c55e' : score >= 65 ? '#f59e0b' : '#ef4444'

  return (
    <div className="p-6 space-y-6">
      <Header title="Predictive Maintenance" subtitle="AI EQUIPMENT HEALTH MONITORING" />

      {/* Summary stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Equipment', value: machines.length, color: 'text-white' },
          { label: 'Healthy', value: machines.filter(m => m.health_score >= 80).length, color: 'text-blue-400' },
          { label: 'Warning', value: machines.filter(m => m.health_score >= 65 && m.health_score < 80).length, color: 'text-yellow-400' },
          { label: 'Critical', value: machines.filter(m => m.health_score < 65).length, color: 'text-red-400' },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="mfg-card p-4">
            <div className={`stat-number text-3xl font-bold mb-1 ${s.color}`}>{s.value}</div>
            <div className="text-xs font-mono text-slate-600 uppercase tracking-wider">{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* AI Prediction Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="mfg-card p-6">
          <h3 className="font-semibold text-white mb-1">AI Failure Prediction</h3>
          <p className="text-xs text-slate-500 font-mono mb-4">Predictive Maintenance Agent</p>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-mono text-slate-500 mb-2 uppercase">Machine</label>
              <select value={selectedMachine} onChange={e => setSelectedMachine(e.target.value)} className="mfg-input">
                {['CNC-001', 'WELD-002', 'PAINT-003', 'ASSEMBLY-004', 'PRESS-005', 'INSPECT-006'].map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
            <button onClick={runPrediction} disabled={predicting} className="btn-primary w-full flex items-center justify-center gap-2">
              {predicting ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Predicting...</> : <>Generate Prediction</>}
            </button>
          </div>
          {prediction && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 pt-4 border-t border-slate-700/50 space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-blue-500/5 rounded-lg p-3 text-center">
                  <div className={`stat-number text-xl ${getHealthColor(prediction.health_score)}`}>{prediction.health_score}</div>
                  <div className="text-xs text-slate-600">Health</div>
                </div>
                <div className="bg-red-500/5 rounded-lg p-3 text-center">
                  <div className="stat-number text-xl text-red-400">{prediction.failure_probability_7d}%</div>
                  <div className="text-xs text-slate-600">Fail 7D</div>
                </div>
              </div>
              <div>
                <p className="text-xs font-mono text-slate-600 mb-2">RECOMMENDED ACTIONS</p>
                {prediction.recommended_actions?.slice(0, 3).map((a: string, i: number) => (
                  <div key={i} className="text-xs text-blue-500 flex items-start gap-2 mb-1">
                    <span className="text-blue-400 mt-0.5">▸</span>{a}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Equipment Health */}
        <div className="lg:col-span-2 mfg-card p-5">
          <h3 className="font-semibold text-white text-sm mb-4">Equipment Health Overview</h3>
          <div className="space-y-3">
            {machines.map((m, i) => (
              <motion.div key={m.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }} className="flex items-center gap-4">
                <div className="w-24 text-xs font-mono text-slate-500 flex-shrink-0">{m.id}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-blue-400">{m.name}</span>
                    <span className={`text-xs font-bold font-mono ${getHealthColor(m.health_score)}`}>{m.health_score}%</span>
                  </div>
                  <div className="health-bar">
                    <motion.div
                      className="health-fill"
                      initial={{ width: 0 }}
                      animate={{ width: `${m.health_score}%` }}
                      transition={{ duration: 1, delay: i * 0.06 + 0.3 }}
                      style={{ background: getHealthBarColor(m.health_score) }}
                    />
                  </div>
                </div>
                <div className="text-xs text-right flex-shrink-0 w-20">
                  <div className="text-white font-semibold">{m.uptime_percent}%</div>
                  <div className="text-slate-600">uptime</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Schedule + Work Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="mfg-card">
          <div className="p-4 border-b border-slate-700/40">
            <h3 className="font-semibold text-white text-sm">Maintenance Schedule</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="mfg-table">
              <thead><tr><th>Machine</th><th>Date</th><th>Type</th><th>Priority</th><th>Hours</th></tr></thead>
              <tbody>
                {schedule.map((s: any) => (
                  <tr key={s.machine_id}>
                    <td className="text-xs font-mono text-blue-500">{s.machine_id}</td>
                    <td className="text-xs text-white">{s.scheduled_date}</td>
                    <td className="text-xs text-blue-400">{s.maintenance_type}</td>
                    <td><span className={`badge text-xs ${s.priority === 'High' ? 'badge-critical' : s.priority === 'Medium' ? 'badge-warning' : 'badge-minor'}`}>{s.priority}</span></td>
                    <td className="text-xs font-mono text-slate-500">{s.estimated_duration_hours}h</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mfg-card">
          <div className="p-4 border-b border-slate-700/40">
            <h3 className="font-semibold text-white text-sm">Work Orders</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="mfg-table">
              <thead><tr><th>ID</th><th>Machine</th><th>Type</th><th>Status</th><th>Due</th></tr></thead>
              <tbody>
                {workOrders.map((w: any) => (
                  <tr key={w.id}>
                    <td className="text-xs font-mono text-blue-500">{w.id}</td>
                    <td className="text-xs font-mono text-slate-500">{w.machine}</td>
                    <td className="text-xs text-blue-400">{w.type}</td>
                    <td><span className={`badge text-xs ${w.status === 'Completed' ? 'badge-pass' : w.status === 'In Progress' ? 'badge-warning' : w.status === 'On Hold' ? 'badge-minor' : 'badge-critical'}`}>{w.status}</span></td>
                    <td className="text-xs text-white">{w.due_date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
