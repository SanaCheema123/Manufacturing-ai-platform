import type { Metadata } from 'next'
import { Inter, Space_Grotesk, JetBrains_Mono, Syne } from 'next/font/google'
import '../styles/globals.css'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const grotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-grotesk' })
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' })
const syne = Syne({ subsets: ['latin'], variable: '--font-syne' })

export const metadata: Metadata = {
  title: 'Manufacturing AI Platform | AIVONEX',
  description: 'AI-Powered Quality Inspection & Root Cause Analysis — AIVONEX SMC-PVT LTD',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${grotesk.variable} ${mono.variable} ${syne.variable}`}>
      <body>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#0F1A2E',
              color: '#F0F6FF',
              border: '1px solid #243554',
              borderRadius: '10px',
              fontSize: '13px',
            },
            success: { iconTheme: { primary: '#10B981', secondary: '#0F1A2E' } },
            error:   { iconTheme: { primary: '#EF4444', secondary: '#0F1A2E' } },
          }}
        />
      </body>
    </html>
  )
}
