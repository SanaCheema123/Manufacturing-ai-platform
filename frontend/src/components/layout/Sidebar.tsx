'use client'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/store'
import { motion, AnimatePresence } from 'framer-motion'

const NAV = [
  { href: '/dashboard',             label: 'Overview',    icon: '▣' },
  { href: '/dashboard/inspection',  label: 'Inspection',  icon: '◎' },
  { href: '/dashboard/defects',     label: 'Defects',     icon: '◈' },
  { href: '/dashboard/rootcause',   label: 'Root Cause',  icon: '◉' },
  { href: '/dashboard/maintenance', label: 'Maintenance', icon: '⚙' },
  { href: '/dashboard/sensors',     label: 'IoT Sensors', icon: '◐' },
  { href: '/dashboard/reports',     label: 'Reports',     icon: '▤' },
  { href: '/dashboard/about',       label: 'About',       icon: '◫' },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuthStore()
  const [collapsed, setCollapsed] = useState(false)

  const handleLogout = () => { logout(); router.push('/login') }

  return (
    <motion.aside
      animate={{ width: collapsed ? 64 : 220 }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
      className="flex-shrink-0 flex flex-col h-screen sticky top-0 overflow-hidden"
      style={{ background: '#0D1424', borderRight: '1px solid #1E2D47' }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5" style={{ borderBottom: '1px solid #1E2D47', minHeight: 68 }}>
        <div className="w-9 h-9 flex-shrink-0 rounded-xl overflow-hidden flex items-center justify-center"
          style={{ background: '#111827', border: '1px solid #243554' }}>
          <Image src="/aivonex_logo.png" alt="AIVONEX" width={32} height={32} className="object-contain" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
              <div className="font-bold text-white text-sm leading-tight" style={{ fontFamily: 'Syne, sans-serif' }}>AIVONEX</div>
              <div className="text-xs font-mono" style={{ color: '#334155', letterSpacing: '0.06em' }}>MFG PLATFORM</div>
            </motion.div>
          )}
        </AnimatePresence>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-md transition-colors"
          style={{ color: '#475569' }}
          onMouseEnter={e => (e.currentTarget.style.color = '#94A3B8')}
          onMouseLeave={e => (e.currentTarget.style.color = '#475569')}
        >
          {collapsed ? '›' : '‹'}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-2 space-y-0.5 overflow-y-auto">
        {!collapsed && (
          <div className="px-2 mb-3">
            <span className="text-xs font-mono" style={{ color: '#334155', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Navigation</span>
          </div>
        )}
        {NAV.map(item => {
          const active = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group"
              style={{
                background: active ? 'rgba(59,130,246,0.12)' : 'transparent',
                border: active ? '1px solid rgba(59,130,246,0.2)' : '1px solid transparent',
              }}
              onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.04)' }}
              onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent' }}
            >
              <span className="text-base flex-shrink-0 w-5 text-center"
                style={{ color: active ? '#60A5FA' : '#475569', transition: 'color 0.2s' }}>
                {item.icon}
              </span>
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="text-sm font-medium whitespace-nowrap"
                    style={{ color: active ? '#F0F6FF' : '#94A3B8' }}
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
              {active && !collapsed && (
                <motion.div layoutId="active-pill" className="ml-auto w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ background: '#3B82F6' }} />
              )}
            </Link>
          )
        })}
      </nav>

      {/* User */}
      <div className="px-2 pb-4" style={{ borderTop: '1px solid #1E2D47', paddingTop: '12px' }}>
        <div className="flex items-center gap-3 px-2 py-2 rounded-lg mb-2"
          style={{ background: 'rgba(59,130,246,0.05)' }}>
          <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold"
            style={{ background: '#1D4ED8', color: '#fff', fontFamily: 'Space Grotesk, sans-serif' }}>
            {user?.username?.[0]?.toUpperCase() || 'U'}
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 min-w-0">
                <div className="text-xs font-semibold text-white truncate capitalize">{user?.username}</div>
                <div className="text-xs font-mono" style={{ color: '#475569' }}>{user?.role}</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <button onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm"
          style={{ color: '#475569' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; e.currentTarget.style.color = '#F87171' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#475569' }}
        >
          <span className="flex-shrink-0">⏻</span>
          <AnimatePresence>
            {!collapsed && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-sm">
                Sign out
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.aside>
  )
}
