'use client'
import { useEffect, useState } from 'react'

interface HeaderProps {
  title: string
  subtitle?: string
}

export default function Header({ title, subtitle }: HeaderProps) {
  const [time, setTime] = useState('')

  useEffect(() => {
    const update = () => setTime(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }))
    update()
    const interval = setInterval(update, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex items-start justify-between mb-2">
      <div>
        <h1 className="text-xl font-bold text-white leading-tight" style={{ fontFamily: 'Syne, sans-serif' }}>{title}</h1>
        {subtitle && (
          <p className="text-xs font-mono mt-0.5" style={{ color: '#475569', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{subtitle}</p>
        )}
      </div>
      <div className="text-right">
        <div className="text-sm font-mono font-semibold" style={{ color: '#3B82F6' }}>{time}</div>
        <div className="text-xs font-mono" style={{ color: '#334155' }}>{new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</div>
      </div>
    </div>
  )
}
