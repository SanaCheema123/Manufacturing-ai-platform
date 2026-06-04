'use client'
import { motion } from 'framer-motion'

interface MachineHealthCardProps {
  id: string
  name: string
  health_score: number
  uptime_percent: number
  status: string
  index?: number
}

export default function MachineHealthCard({ id, name, health_score, uptime_percent, status, index = 0 }: MachineHealthCardProps) {
  const color = health_score >= 80 ? '#10B981' : health_score >= 65 ? '#F59E0B' : '#EF4444'
  const statusColor = { Online: '#10B981', Warning: '#F59E0B', Critical: '#EF4444', Offline: '#475569' }[status] || '#475569'

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.06 }}
      className="mfg-card p-4"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="text-xs font-mono font-semibold" style={{ color: '#60A5FA' }}>{id}</div>
          <div className="text-sm font-medium text-white mt-0.5">{name}</div>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full" style={{ background: statusColor, boxShadow: `0 0 6px ${statusColor}` }} />
          <span className="text-xs font-mono" style={{ color: statusColor }}>{status}</span>
        </div>
      </div>
      <div className="space-y-2.5">
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-xs font-mono" style={{ color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Health</span>
            <span className="text-xs font-mono font-semibold" style={{ color }}>{health_score}%</span>
          </div>
          <div className="health-bar">
            <motion.div
              className="health-fill"
              initial={{ width: 0 }}
              animate={{ width: `${health_score}%` }}
              transition={{ duration: 1, delay: index * 0.06 + 0.3 }}
              style={{ background: color }}
            />
          </div>
        </div>
        <div className="flex justify-between items-center pt-1" style={{ borderTop: '1px solid #1E2D47' }}>
          <span className="text-xs font-mono" style={{ color: '#475569' }}>Uptime</span>
          <span className="text-xs font-mono font-semibold text-white">{uptime_percent}%</span>
        </div>
      </div>
    </motion.div>
  )
}
