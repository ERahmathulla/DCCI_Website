import type { Metadata } from 'next'
import { Nunito } from 'next/font/google'
import '../styles/globals.css'
import HelpBar from '@/components/layout/HelpBar'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import MobileNav from '@/components/layout/MobileNav'
import PageTransition from '@/components/layout/PageTransition'
import Analytics from '@/components/layout/Analytics'
import SearchOverlay from '@/components/search/SearchOverlay'
import ProgressBar from '@/components/ui/ProgressBar'
import { SITE_NAME, SITE_DESCRIPTION } from '@/lib/utils/constants'

const nunito = Nunito({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: ['dementia', 'memory care', 'Alzheimer\'s', 'caregiver', 'Big Bend', 'Tallahassee', 'Florida', 'resources'],
  openGraph: {
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    type: 'website',
    locale: 'en_US',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={nunito.variable}>
      <body>
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>

        <ProgressBar />
        <SearchOverlay />

        <div className="flex flex-col min-h-dvh">
          <HelpBar />
          <Header />
          <MobileNav />

          <main id="main-content" className="flex-1" tabIndex={-1} data-pagefind-body>
            <PageTransition>
              {children}
            </PageTransition>
          </main>

          <Footer />
        </div>

        {/* Production deployment only, so local and preview visits aren't counted */}
        {process.env.VERCEL_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
