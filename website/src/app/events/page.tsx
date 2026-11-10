import type { Metadata } from 'next'
import Breadcrumbs from '@/components/ui/Breadcrumbs'
import EventCard, { EventsLoadError, NoUpcomingEvents } from '@/components/events/EventCard'
import ProgramCard, { ProgramsLoadError, WeeklyPrograms } from '@/components/programs/ProgramCard'
import { getRecurringPrograms, getUpcomingEvents } from '@/sanity/lib/queries'

export const metadata: Metadata = {
  title: 'Events & Classes',
  description: 'Upcoming dementia education events, support group schedules, and conferences in the Big Bend region.',
}

// Rendered on every request so visitors always see current Sanity data
export const dynamic = 'force-dynamic'

export default async function EventsPage() {
  const [events, programs] = await Promise.all([getUpcomingEvents(), getRecurringPrograms()])
  // Support groups have their own section; the rest are listed under Weekly Programs
  const supportGroups = programs?.filter((p) => p.programType === 'Support group') ?? []
  const otherPrograms = programs?.filter((p) => p.programType !== 'Support group') ?? []

  return (
    <div className="pt-header">
      <div className="bg-gradient-to-b from-warmgray-50 to-white border-b border-warmgray-100 py-10">
        <div className="container-main">
          <Breadcrumbs crumbs={[{ label: 'Events & Stay Connected' }]} />
          <h1 className="text-3xl font-bold text-warmgray-900 mb-2">Events & Classes</h1>
          <p className="text-warmgray-500 max-w-xl">
            Support groups, education classes, and community events from local organizations.
          </p>
        </div>
      </div>

      <div className="container-main py-10">
        {/* Recurring support groups (Sanity; kept out of the static search index, live search covers it) */}
        <section className="mb-12" aria-labelledby="recurring-heading">
          <h2 id="recurring-heading" className="text-2xl font-bold text-warmgray-900 mb-2">
            Recurring Support Groups
          </h2>
          <p className="text-sm text-warmgray-500 mb-6">
            All groups are free, facilitated by Alzheimer's Project, and require no RSVP.
            Call <a href="tel:+18503862778" className="text-warmgray-800 font-medium hover:text-warmgray-900">(850) 386-2778</a> to confirm times.
          </p>
          <div data-pagefind-ignore>
            {programs === null ? (
              <ProgramsLoadError />
            ) : supportGroups.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {supportGroups.map((program) => (
                  <ProgramCard key={program._id} program={program} />
                ))}
              </div>
            ) : (
              <p className="text-sm text-warmgray-600">No support groups are listed right now.</p>
            )}
          </div>
        </section>

        {/* Upcoming events from Sanity */}
        <section className="mb-12" aria-labelledby="upcoming-heading">
          <h2 id="upcoming-heading" className="text-2xl font-bold text-warmgray-900 mb-6">
            Upcoming Events
          </h2>
          <div data-pagefind-ignore>
            {events === null ? (
              <EventsLoadError />
            ) : events.length > 0 ? (
              <div className="space-y-4">
                {events.map((event) => (
                  <EventCard key={event._id} event={event} />
                ))}
              </div>
            ) : (
              <NoUpcomingEvents />
            )}
          </div>
        </section>

        {/* Other weekly programs from Sanity, grouped by type */}
        <section id="weekly-programs" className="scroll-mt-header" aria-labelledby="weekly-programs-heading">
          <h2 id="weekly-programs-heading" className="text-2xl font-bold text-warmgray-900 mb-2">
            Weekly Programs
          </h2>
          <p className="text-sm text-warmgray-500 mb-6">
            Programs that meet on the same days every week or month. Support groups are listed above.
          </p>
          <div data-pagefind-ignore>
            {programs === null ? (
              <ProgramsLoadError />
            ) : otherPrograms.length > 0 ? (
              <WeeklyPrograms programs={otherPrograms} />
            ) : (
              <p className="text-sm text-warmgray-600">No other weekly programs are listed right now.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
