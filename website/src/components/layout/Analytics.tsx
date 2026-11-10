'use client'

import Script from 'next/script'
import { usePathname } from 'next/navigation'

// Public Measurement ID from Google, not a secret
const TAG_ID = 'G-QKB0RKXRK3'

export default function Analytics() {
  const pathname = usePathname()
  // Don't count visits to the Sanity Studio
  if (pathname.startsWith('/studio')) return null

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${TAG_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', '${TAG_ID}');
        `}
      </Script>
    </>
  )
}
