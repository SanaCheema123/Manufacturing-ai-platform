export default function Footer() {
  return (
    <footer className="px-6 py-3 flex items-center justify-between"
      style={{ borderTop: '1px solid #1E2D47', background: '#0D1424' }}>
      <div className="text-xs font-mono" style={{ color: '#334155' }}>
        © 2025 <span style={{ color: '#3B82F6' }}>AIVONEX</span> SMC-PVT LTD · Bahawalpur, Pakistan
      </div>
      <div className="flex items-center gap-4">
        <a href="https://github.com/SanaCheema123" target="_blank" rel="noopener noreferrer"
          className="text-xs font-mono transition-colors" style={{ color: '#334155' }}
          onMouseEnter={e => (e.currentTarget.style.color = '#60A5FA')}
          onMouseLeave={e => (e.currentTarget.style.color = '#334155')}>
          GitHub
        </a>
        <a href="https://www.linkedin.com/in/sanacheema-ml-ai/" target="_blank" rel="noopener noreferrer"
          className="text-xs font-mono transition-colors" style={{ color: '#334155' }}
          onMouseEnter={e => (e.currentTarget.style.color = '#60A5FA')}
          onMouseLeave={e => (e.currentTarget.style.color = '#334155')}>
          LinkedIn
        </a>
        <span className="text-xs font-mono" style={{ color: '#334155' }}>
          Sana Cheema
        </span>
      </div>
    </footer>
  )
}
