import { NextResponse, type NextRequest } from 'next/server'
import { OUTREACH_COUNTIES } from '@/lib/data/counties'

// County pages are rendered on every request and streamed, so a notFound() inside
// the page arrives after the 200 status has been sent. Unknown counties are sent
// to the not-found page here instead, with a real 404 status.
export function middleware(request: NextRequest) {
  const slug = request.nextUrl.pathname.split('/')[2]
  if (OUTREACH_COUNTIES.some((county) => county.slug === slug)) return NextResponse.next()
  return NextResponse.rewrite(new URL('/_not-found', request.url), { status: 404 })
}

export const config = {
  matcher: '/counties/:county+',
}
