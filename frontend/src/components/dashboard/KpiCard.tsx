'use client'
import { motion } from 'framer-motion'
import CountUp from 'react-countup'

interface KpiCardProps {
  title: string
  value: number | string
  unit?: string
  trend?: number
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple'
  index?: number
}

const COLORS = {
  blue:   { text: '#60A5FA', bg: 'rgba(59,130,246,0.08)',  border: 'rgba(59,130,246,0.15)' },
  green:  { text: '#34D399', bg: 'rgba(16,185,129,0.08)',  border: 'rgba(16,185,129,0.15)' },
  yellow: { text: '#FCD34D', bg: 'rgba(245,158,11,0.08)',  border: 'rgba(245,158,11,0.15)' },
  red:    { text: '#F87171', bg: 'rgba(239,68,68,0.08)',   border: 'rgba(239,68,68,0.15)'  },
  purple: { text: '#A5B4FC', bg: 'rgba(99,102,241,0.08)',  border: 'rgba(99,102,241,0.15)' },
}

export default function KpiCard({ title, value, unit, trend, color = 'blue', index = 0 }: KpiCardProps) {
  const c = COLORS[color]
  const numeric = typeof value === 'number'

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className="mfg-card p-5"
    >
      <div className="text-xs font-mono mb-3 uppercase tracking-wider" style={{ color: '#475569', letterSpacing: '0.08em' }}>
        {title}
      </div>
      <div className="flex items-end justify-between">
        <div className="stat-number text-3xl" style={{ color: c.text }}>
          {numeric ? <CountUp end={value as number} duration={1.5} decimals={value % 1 !== 0 ? 1 : 0} /> : value}
          {unit && <span className="text-lg ml-1" style={{ color: '#475569' }}>{unit}</span>}
        </div>
        {trend !== undefined && (
          <div className="text-xs font-mono px-2 py-1 rounded-md"
            style={{
              background: trend >= 0 ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
              color: trend >= 0 ? '#34D399' : '#F87171',
              border: `1px solid ${trend >= 0 ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}`,
            }}>
            {trend >= 0 ? '▲' : '▼'} {Math.abs(trend)}%
          </div>
        )}
      </div>
      <div className="mt-3 h-1 rounded-full" style={{ background: c.border }}>
        <div className="h-full rounded-full" style={{ background: c.text, width: '100%', opacity: 0.5 }} />
      </div>
    </motion.div>
  )
}
