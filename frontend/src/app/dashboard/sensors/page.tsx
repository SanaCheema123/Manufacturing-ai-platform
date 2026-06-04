'use client'
import { useEffect, useState } from 'react'
import { sensorsApi } from '@/lib/api'
import Header from '@/components/layout/Header'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function SensorsPage() {
  const [liveSensors, setLiveSensors] = useState<any[]>([])
  const [thresholds, setThresholds] = useState<any>(null)
  const [readings, setReadings] = useState<any[]>([])
  const [selectedMachine, setSelectedMachine] = useState('CNC-001')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([sensorsApi.live(), sensorsApi.thresholds()])
      .then(([lRes, tRes]) => { setLiveSensors(lRes.data); setThresholds(tRes.data) })
      .catch(() => toast.error('Failed to load sensor data'))
      .finally(() => setLoading(false))
    
    // Auto-refresh live data
    const interval = setInterval(() => {
      sensorsApi.live().then(r => setLiveSensors(r.data)).catch(() => {})
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    sensorsApi.readings(selectedMachine, 6).then(r => setReadings(r.data.slice(-60))).catch(() => {})
  }, [selectedMachine])

  const getStatusColor = (status: string) => ({
    Normal: 'text-blue-400', Warning: 'text-yellow-400', Alert: 'text-red-400'
  }[status] || 'text-gray-400')

  const getSensorStatus = (key: string, val: number) => {
    if (!thresholds || !thresholds[key]) return 'Normal'
    const t = thresholds[key]
    if (val > t.critical) return 'Alert'
    if (val > t.max || val < t.min) return 'Warning'
    return 'Normal'
  }

  return (
    <div className="p-6 space-y-6">
      <Header title="IoT Sensor Monitoring" subtitle="REAL-TIME EQUIPMENT TELEMETRY" />

      {/* Live sensor grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {liveSensors.map((sensor, i) => (
          <motion.div key={sensor.machine_id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className="mfg-card p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="font-mono text-sm text-white font-semibold">{sensor.machine_id}</div>
                <div className="flex items-center gap-2">
                  <span className={`status-dot ${sensor.status === 'Normal' ? 'status-healthy' : sensor.status === 'Warning' ? 'status-warning' : 'status-critical'}`} />
                  <span className={`text-xs font-mono ${getStatusColor(sensor.status)}`}>{sensor.status}</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'TEMP', value: `${sensor.temperature}°C`, key: 'temperature', raw: sensor.temperature },
                { label: 'VIB', value: `${sensor.vibration}`, key: 'vibration', raw: sensor.vibration },
                { label: 'PSI', value: `${sensor.pressure}bar`, key: 'pressure', raw: sensor.pressure },
                { label: 'RPM', value: `${sensor.rpm}`, key: 'rpm', raw: sensor.rpm },
                { label: 'AMP', value: `${sensor.current_amps}A`, key: 'current', raw: sensor.current_amps },
                { label: 'HUM', value: `${sensor.humidity}%`, key: 'humidity', raw: sensor.humidity },
              ].map(m => {
                const status = getSensorStatus(m.key, m.raw)
                return (
                  <div key={m.label} className={`rounded-lg p-2 text-center ${status === 'Alert' ? 'bg-red-500/10' : status === 'Warning' ? 'bg-yellow-500/10' : 'bg-blue-500/5'}`}>
                    <div className={`text-xs font-bold font-mono ${status === 'Alert' ? 'text-red-400' : status === 'Warning' ? 'text-yellow-400' : 'text-white'}`}>{m.value}</div>
                    <div className="text-xs text-slate-600">{m.label}</div>
                  </div>
                )
              })}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Readings chart */}
      <div className="mfg-card p-5">
        <div className="flex items-center gap-4 mb-4 flex-wrap">
          <div className="flex-1">
            <h3 className="font-semibold text-white text-sm">Sensor History</h3>
            <p className="text-xs font-mono text-slate-600">LAST 6 HOURS</p>
          </div>
          <select value={selectedMachine} onChange={e => setSelectedMachine(e.target.value)} className="mfg-input w-36 text-xs py-2">
            {['CNC-001', 'WELD-002', 'PAINT-003', 'ASSEMBLY-004', 'PRESS-005'].map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div style={{ height: 180 }}>
            <p className="text-xs font-mono text-slate-600 mb-2">TEMPERATURE (°C)</p>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={readings} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E2D47" />
                <XAxis dataKey="timestamp" tick={{ fontSize: 9, fill: '#475569' }} tickFormatter={d => d.slice(11, 16)} />
                <YAxis tick={{ fontSize: 9, fill: '#475569' }} />
                <Tooltip contentStyle={{ background: '#0F1A2E', border: '1px solid #1E2D47', borderRadius: 8, fontSize: 11 }} labelFormatter={d => d.slice(11, 16)} />
                <Line type="monotone" dataKey="temperature" stroke="#ef4444" strokeWidth={1.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div style={{ height: 180 }}>
            <p className="text-xs font-mono text-slate-600 mb-2">VIBRATION (mm/s)</p>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={readings} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E2D47" />
                <XAxis dataKey="timestamp" tick={{ fontSize: 9, fill: '#475569' }} tickFormatter={d => d.slice(11, 16)} />
                <YAxis tick={{ fontSize: 9, fill: '#475569' }} />
                <Tooltip contentStyle={{ background: '#0F1A2E', border: '1px solid #1E2D47', borderRadius: 8, fontSize: 11 }} labelFormatter={d => d.slice(11, 16)} />
                <Line type="monotone" dataKey="vibration" stroke="#f59e0b" strokeWidth={1.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Thresholds reference */}
      {thresholds && (
        <div className="mfg-card p-5">
          <h3 className="font-semibold text-white text-sm mb-4">Sensor Thresholds</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {Object.entries(thresholds).map(([key, val]: any) => (
              <div key={key} className="bg-blue-500/5 rounded-xl p-3 text-center">
                <div className="text-xs font-mono text-blue-500 uppercase mb-2">{key}</div>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between"><span className="text-slate-600">Normal:</span><span className="text-white">{val.min}–{val.max}</span></div>
                  <div className="flex justify-between"><span className="text-red-800">Critical:</span><span className="text-red-400">&gt;{val.critical}</span></div>
                  <div className="text-slate-700 mt-1">{val.unit}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
