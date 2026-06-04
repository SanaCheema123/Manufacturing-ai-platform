'use client'
import { useEffect, useState } from 'react'
import { dashboardApi } from '@/lib/api'
import KpiCard from '@/components/dashboard/KpiCard'
import MachineHealthCard from '@/components/dashboard/MachineHealthCard'
import Header from '@/components/layout/Header'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'

const CHART_COLORS = ['#3B82F6','#10B981','#F59E0B','#EF4444','#8B5CF6','#06B6D4']

export default function DashboardPage() {
  const [overview, setOverview] = useState<any>(null)
  const [qualityTrends, setQualityTrends] = useState<any[]>([])
  const [alerts, setAlerts] = useState<any[]>([])
  const [machineHealth, setMachineHealth] = useState<any[]>([])
  const [defectData, setDefectData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchAll = async () => {
    try {
      const [o, q, a, m, d] = await Promise.all([
        dashboardApi.overview(),
        dashboardApi.qualityTrends(),
        dashboardApi.alerts(),
        dashboardApi.machineHealth(),
        dashboardApi.productionMetrics(),
      ])
      setOverview(o.data)
      setQualityTrends(q.data.slice(-14))
      setAlerts(a.data.slice(0, 5))
      setMachineHealth(m.data)
      setDefectData(d.data?.defect_distribution || [])
    } catch { toast.error('Failed to load dashboard data') }
    finally { setLoading(false) }
  }

  useEffect(() => {
    fetchAll()
    const i = setInterval(fetchAll, 30000)
    return () => clearInterval(i)
  }, [])

  const tooltipStyle = {
    contentStyle: { background: '#0F1A2E', border: '1px solid #243554', borderRadius: 8, fontSize: 12 },
    labelStyle: { color: '#94A3B8' }
  }

  return (
    <div className="space-y-6">
      <Header title="Operations Overview" subtitle="LIVE MANUFACTURING INTELLIGENCE" />

      {/* KPI grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard title="Production Rate" value={overview?.production_rate || 0} unit="/hr" color="blue" index={0} trend={2} />
        <KpiCard title="Quality Score" value={overview?.quality_score || 0} unit="%" color="green" index={1} trend={1} />
        <KpiCard title="Defect Rate" value={overview?.defect_rate || 0} unit="%" color="red" index={2} trend={-0.5} />
        <KpiCard title="OEE" value={overview?.oee || 0} unit="%" color="purple" index={3} trend={3} />
        <KpiCard title="Units Today" value={overview?.units_produced_today || 0} color="blue" index={4} />
        <KpiCard title="Active Alerts" value={overview?.active_alerts || 0} color="yellow" index={5} />
        <KpiCard title="Machine Uptime" value={overview?.machine_uptime || 0} unit="%" color="green" index={6} />
        <KpiCard title="Throughput" value={overview?.throughput_efficiency || 0} unit="%" color="purple" index={7} />
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Quality trend */}
        <div className="lg:col-span-2 mfg-card p-5">
          <div className="mb-4">
            <div className="text-sm font-semibold text-white">Quality Score Trend</div>
            <div className="label-mono mt-0.5">14-DAY ROLLING</div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={qualityTrends} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="qualGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E2D47" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#475569' }} tickFormatter={d => d?.slice(5)} />
              <YAxis tick={{ fontSize: 10, fill: '#475569' }} domain={[85, 100]} />
              <Tooltip {...tooltipStyle} />
              <Area type="monotone" dataKey="quality_score" stroke="#3B82F6" strokeWidth={2} fill="url(#qualGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Defect distribution */}
        <div className="mfg-card p-5">
          <div className="mb-4">
            <div className="text-sm font-semibold text-white">Defect Distribution</div>
            <div className="label-mono mt-0.5">BY CATEGORY</div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={defectData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value" paddingAngle={3}>
                {defectData.map((_: any, i: number) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
              </Pie>
              <Tooltip {...tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {defectData.slice(0, 4).map((d: any, i: number) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: CHART_COLORS[i] }} />
                  <span style={{ color: '#94A3B8' }}>{d.name}</span>
                </div>
                <span className="font-mono" style={{ color: '#60A5FA' }}>{d.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="mfg-card p-5">
          <div className="mb-4">
            <div className="text-sm font-semibold text-white">Production vs Defects</div>
            <div className="label-mono mt-0.5">WEEKLY COMPARISON</div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={qualityTrends.slice(-7)} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E2D47" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#475569' }} tickFormatter={d => d?.slice(5)} />
              <YAxis tick={{ fontSize: 10, fill: '#475569' }} />
              <Tooltip {...tooltipStyle} />
              <Bar dataKey="units_produced" name="Units" fill="#3B82F6" radius={[3,3,0,0]} />
              <Bar dataKey="defects" name="Defects" fill="#EF4444" radius={[3,3,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="mfg-card p-5">
          <div className="mb-4">
            <div className="text-sm font-semibold text-white">OEE Performance</div>
            <div className="label-mono mt-0.5">7-DAY TREND</div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={qualityTrends.slice(-7)} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E2D47" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#475569' }} tickFormatter={d => d?.slice(5)} />
              <YAxis tick={{ fontSize: 10, fill: '#475569' }} />
              <Tooltip {...tooltipStyle} />
              <Line type="monotone" dataKey="oee" stroke="#10B981" strokeWidth={2} dot={false} name="OEE %" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Machine health + alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-semibold text-white">Machine Health</div>
            <div className="label-mono">LIVE STATUS</div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {machineHealth.map((m: any, i: number) => (
              <MachineHealthCard key={m.id} {...m} index={i} />
            ))}
          </div>
        </div>

        <div className="mfg-card">
          <div className="p-4" style={{ borderBottom: '1px solid #1E2D47' }}>
            <div className="text-sm font-semibold text-white">Recent Alerts</div>
            <div className="label-mono mt-0.5">LAST 5 EVENTS</div>
          </div>
          <div className="divide-y" style={{ borderColor: '#1E2D47' }}>
            {alerts.map((a: any, i: number) => (
              <motion.div key={i} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}
                className="p-4">
                <div className="flex items-start gap-2.5">
                  <div className={`status-dot mt-1.5 flex-shrink-0 ${
                    a.severity === 'Critical' ? 'status-critical' :
                    a.severity === 'Warning' ? 'status-warning' : 'status-info'
                  }`} />
                  <div>
                    <div className="text-xs font-medium text-white">{a.message}</div>
                    <div className="text-xs font-mono mt-1" style={{ color: '#475569' }}>{a.machine_id} · {a.time}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
