import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Calendar, MapPin, ChevronRight } from 'lucide-react'
import { OUTREACH_COUNTIES } from '@/lib/data/counties'
import EventCard, { EventsLoadError, NoUpcomingEvents } from '@/components/events/EventCard'
import { ProgramsLoadError, WeeklyPrograms } from '@/components/programs/ProgramCard'
import { getRecurringPrograms, getUpcomingEvents } from '@/sanity/lib/queries'

interface Props {
  params: Promise<{ county: string }>
}

// Rendered on every request so visitors always see current Sanity data
export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { county: slug } = await params
  const county = OUTREACH_COUNTIES.find(c => c.slug === slug)
  if (!county) return {}
  return {
    title: `${county.name} County Dementia Outreach Events`,
    description: `Upcoming dementia awareness events, resource tables, volunteer opportunities, and community education activities in ${county.name} County, Florida.`,
  }
}

export default async function CountyPage({ params }: Props) {
  const { county: slug } = await params
  const county = OUTREACH_COUNTIES.find(c => c.slug === slug)

  if (!county) notFound()

  const [events, programs] = await Promise.all([
    getUpcomingEvents(county.name),
    getRecurringPrograms({ county: county.name }),
  ])

  return (
    <>
      {/* Page hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-warmgray-50 via-[#eef4f7] to-white pt-16 pb-20 md:pt-24 md:pb-28">
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#6b9eb5]/10 blur-3xl" />
          <div className="absolute bottom-0 left-1/4 w-64 h-64 rounded-full bg-warmgray-100/40 blur-3xl" />
        </div>

        <div className="container-main relative">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex items-center gap-2 text-sm text-warmgray-500" role="list">
              <li>
                <Link href="/" className="hover:text-warmgray-800 transition-colors">
                  Home
                </Link>
              </li>
              <ChevronRight className="w-4 h-4 shrink-0" aria-hidden />
              <li>
                <Link href="/#map-section" className="hover:text-warmgray-800 transition-colors">
                  Outreach
                </Link>
              </li>
              <ChevronRight className="w-4 h-4 shrink-0" aria-hidden />
              <li className="text-warmgray-900 font-medium" aria-current="page">
                {county.name} County
              </li>
            </ol>
          </nav>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#6b9eb5]/10 text-[#3a7088] rounded-full text-xs font-semibold mb-5">
            <MapPin className="w-3.5 h-3.5" aria-hidden />
            Big Bend Region, Florida
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-warmgray-900 mb-5 leading-tight">
            {county.name} County<br />
            <span className="text-[#4a8098]">Dementia Outreach Events</span>
          </h1>

          <p className="text-lg md:text-xl text-warmgray-500 max-w-2xl leading-relaxed mb-8">
            {county.blurb}
          </p>

          <Link href="/#map-section" className="btn-secondary text-sm inline-flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" aria-hidden />
            Back to county map
          </Link>
        </div>
      </section>

      {/* Placeholder content */}
      <section className="container-main section-padding">
        <div className="max-w-3xl">
          {/* Upcoming events from Sanity */}
          <section className="mb-12" aria-labelledby="county-events-heading">
            <h2 id="county-events-heading" className="text-2xl font-bold text-warmgray-900 mb-5">
              Upcoming events in {county.name} County
            </h2>
            <div data-pagefind-ignore>
              {events && events.length > 0 ? (
                <div className="space-y-4">
                  {events.map((event) => (
                    <EventCard key={event._id} event={event} />
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-[#6b9eb5]/25 bg-[#6b9eb5]/5 p-8">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[#6b9eb5]/15 flex items-center justify-center shrink-0">
                      <Calendar className="w-5 h-5 text-[#4a8098]" aria-hidden />
                    </div>
                    {events === null ? <EventsLoadError /> : <NoUpcomingEvents />}
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Weekly programs from Sanity (shown only when the county has some) */}
          {(programs === null || programs.length > 0) && (
            <section className="mb-12" aria-labelledby="county-programs-heading">
              <h2 id="county-programs-heading" className="text-2xl font-bold text-warmgray-900 mb-5">
                Weekly programs in {county.name} County
              </h2>
              <div data-pagefind-ignore>
                {programs === null ? (
                  <ProgramsLoadError />
                ) : (
                  <WeeklyPrograms programs={programs} gridClassName="grid grid-cols-1 sm:grid-cols-2 gap-4" />
                )}
              </div>
            </section>
          )}

          {/* What to expect */}
          <h2 className="text-2xl font-bold text-warmgray-900 mb-5">
            What outreach looks like in {county.name} County
          </h2>
          <p className="text-warmgray-500 leading-relaxed mb-6">
            Dementia outreach in the Big Bend reaches families where they already gather — at
            churches, libraries, senior centers, health fairs, and volunteer-led events.
          </p>

          <ul className="space-y-4 mb-12" role="list">
            {[
              'Dementia awareness and education sessions',
              'Resource tables with printed guides and referral cards',
              'Caregiver support circles and listening sessions',
              'Volunteer opportunities for students and community members',
              'Connections to local organizations and services',
            ].map(item => (
              <li key={item} className="flex items-start gap-3 text-warmgray-600">
                <span className="w-1.5 h-1.5 rounded-full bg-[#6b9eb5] mt-2.5 shrink-0" aria-hidden />
                {item}
              </li>
            ))}
          </ul>

          {/* CTA strip */}
          <div className="grid gap-4 sm:grid-cols-2">
            <Link
              href="/directory"
              className="flex items-center gap-3 p-5 rounded-2xl bg-white border border-warmgray-100 shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warmgray-700 focus-visible:ring-offset-2"
            >
              <div className="w-10 h-10 rounded-xl bg-warmgray-100 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5 text-warmgray-700" aria-hidden />
              </div>
              <div>
                <p className="text-xs font-semibold text-warmgray-500 uppercase tracking-wide mb-0.5">
                  Browse now
                </p>
                <p className="text-sm font-bold text-warmgray-900">Search Resources</p>
              </div>
            </Link>
          </div>

          {/* Closing */}
          <p className="text-warmgray-500 leading-relaxed mt-12">
            We're planning more dementia education and caregiver events in {county.name} County.
            As they're scheduled, you'll find dates, locations, and details right here, so check back soon.
          </p>
        </div>
      </section>

      {/* Other counties */}
      <section className="bg-warmgray-50 border-t border-warmgray-100 py-14">
        <div className="container-main">
          <p className="text-sm font-semibold text-warmgray-500 uppercase tracking-wider mb-6">
            Other counties
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {OUTREACH_COUNTIES.filter(c => c.slug !== county.slug).map(other => (
              <Link
                key={other.slug}
                href={other.path}
                className="group flex items-center gap-2.5 p-3 rounded-xl bg-white border border-warmgray-100 hover:border-[#6b9eb5]/40 hover:shadow-sm transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4a8098] focus-visible:ring-offset-1"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#6b9eb5] shrink-0" aria-hidden />
                <span className="text-sm font-medium text-warmgray-700 group-hover:text-warmgray-900">
                  {other.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
