import type { Metadata } from 'next'
import Link from 'next/link'
import { MapPin, Clock, Phone, Calendar, Users } from 'lucide-react'
import Breadcrumbs from '@/components/ui/Breadcrumbs'
import { getRecurringPrograms, type RecurringProgram, type ScheduleEntry } from '@/sanity/lib/queries'
import { DAYS_OF_WEEK } from '@/sanity/options'
import { formatTimeRange } from '@/lib/utils/schedule'

export const metadata: Metadata = {
  title: 'Respite & Adult Day Programs',
  description: 'Social Clubs, in-home respite, and emergency respite programs for dementia caregivers in the Big Bend region.',
}

// Rendered on every request so visitors always see current Sanity data
export const dynamic = 'force-dynamic'

const timeRange = (entry: ScheduleEntry) => formatTimeRange(entry.startTime, entry.endTime)

function placeLabel(program: RecurringProgram) {
  const place = program.locationName ?? program.name
  return program.address ? `${place} (${program.address})` : place
}

export default async function RespitePage() {
  // Respite schedules are managed in Sanity (Studio → Recurring programs → Respite)
  const programs = await getRecurringPrograms({ programType: 'Respite' })
  const entries = (programs ?? []).flatMap((program) => (program.schedule ?? []).map((entry) => ({ program, entry })))
  const socialClubs = DAYS_OF_WEEK
    .map((day) => ({
      day,
      items: entries.filter((e) => e.entry.day === day).sort((a, b) => a.entry.startTime.localeCompare(b.entry.startTime)),
    }))
    .filter((d) => d.items.length > 0)
  // When every club keeps the same hours (and notes), show them once in the intro, as before
  const ranges = new Set(entries.map((e) => timeRange(e.entry)))
  const sharedRange = ranges.size === 1 ? [...ranges][0] : null
  const notes = new Set((programs ?? []).map((p) => p.publicNotes?.trim() ?? ''))
  const sharedNote = notes.size === 1 ? [...notes][0] : null

  return (
    <article>
      <Breadcrumbs crumbs={[
        { label: 'Find Care & Services', href: '/care-services' },
        { label: 'Respite & Adult Day Programs' },
      ]} />

      <h1 className="text-3xl font-bold text-warmgray-900 mb-4">Respite & Adult Day Programs</h1>
      <p className="text-lg text-warmgray-500 mb-8 leading-relaxed max-w-2xl">
        Respite care gives caregivers a planned break while the person with dementia receives supervised, meaningful engagement. These programs are essential — caregiver burnout is one of the leading reasons people with dementia move to facilities.
      </p>

      {/* Social Clubs */}
      <section className="mb-10" aria-labelledby="social-clubs-heading">
        <h2 id="social-clubs-heading" className="text-xl font-bold text-warmgray-900 mb-2">
          Alzheimer's Project Social Clubs (Day Respite)
        </h2>
        <p className="text-sm text-warmgray-500 mb-5">
          Structured day programs with CNA/HHA supervision and therapeutic activities — music, art, pet therapy, guided exercise, games, and intergenerational socialization.
          {/* Sanity-driven text is left out of the site search index; live search covers it */}
          {sharedRange && <span data-pagefind-ignore> Open <strong>{sharedRange}</strong>{sharedNote && ` (${sharedNote})`}.</span>}
        </p>

        <div data-pagefind-ignore>
        {programs === null ? (
          <p className="text-sm text-warmgray-600 mb-6" role="alert">
            The Social Club schedule couldn't load right now. Call <a href="tel:+18503862778" className="font-semibold underline">(850) 386-2778</a> for current days and times.
          </p>
        ) : socialClubs.length === 0 ? (
          <p className="text-sm text-warmgray-600 mb-6">
            No Social Club days are listed right now. Call <a href="tel:+18503862778" className="font-semibold underline">(850) 386-2778</a> for the current schedule.
          </p>
        ) : (
          <div className="space-y-3 mb-6">
            {socialClubs.map((club) => (
              <div key={club.day} className="flex gap-4 p-4 rounded-xl bg-white border border-warmgray-100 shadow-card">
                <div className="w-20 text-sm font-bold text-warmgray-900 shrink-0">{club.day}</div>
                <div className="space-y-1">
                  {club.items.map(({ program, entry }) => (
                    <div key={`${program._id}-${entry._key}`}>
                      <div className="flex items-center gap-2 text-sm text-warmgray-700">
                        <MapPin className="w-3.5 h-3.5 text-warmgray-400 shrink-0" aria-hidden />
                        <span>
                          {placeLabel(program)}
                          {(entry.weeks?.length || !sharedRange) && (
                            <span className="text-warmgray-500">
                              {' · '}{entry.weeks?.length ? `${entry.weeks.join(' & ')} ${club.day}, ` : ''}{timeRange(entry)}
                            </span>
                          )}
                        </span>
                      </div>
                      {program.publicNotes && sharedNote === null && (
                        <p className="text-xs text-warmgray-500 pl-[22px]">{program.publicNotes}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
        </div>

        <div className="p-5 rounded-2xl bg-warmgray-50 border border-warmgray-200">
          <h3 className="text-sm font-bold text-warmgray-900 mb-2">How to get started</h3>
          <ol className="space-y-2 text-sm text-warmgray-900 list-decimal list-inside">
            <li>Call <a href="tel:+18503862778" className="font-semibold underline">(850) 386-2778</a> to express interest.</li>
            <li>A Florida Elder Affairs assessment with a case manager (~45 min) is required.</li>
            <li>A Respite Care Assessment covering stage, mobility, behavior, and medical needs is completed.</li>
            <li>A three-week trial period allows both the participant and program to ensure fit.</li>
          </ol>
        </div>
      </section>

      {/* In-home respite */}
      <section className="mb-10" aria-labelledby="inhome-respite-heading">
        <h2 id="inhome-respite-heading" className="text-xl font-bold text-warmgray-900 mb-4">In-Home Respite Options</h2>
        <div className="space-y-4">
          <div className="card-base p-5">
            <h3 className="text-base font-bold text-warmgray-900 mb-1">AmeriCorps / Legacy Corps for Veterans & Military Families</h3>
            <p className="text-sm text-warmgray-500 mb-3">Trained volunteers matched to veteran families for in-home companionship-based respite. No cost. Volunteers understand military culture. <strong>Note:</strong> companion care only — not personal care or medication assistance.</p>
            <a href="tel:+18503862778" className="flex items-center gap-1.5 text-sm font-medium text-warmgray-800 hover:text-warmgray-900 transition-colors">
              <Phone className="w-3.5 h-3.5" aria-hidden /> (850) 386-2778 — Alzheimer's Project
            </a>
          </div>

          <div className="card-base p-5">
            <h3 className="text-base font-bold text-warmgray-900 mb-1">ADI In-Home Respite (Florida DOEA)</h3>
            <p className="text-sm text-warmgray-500 mb-3">For individuals 18+ with a probable ADRD diagnosis: in-home, facility-based, emergency, and extended care up to 30 days. Delivered through Advantage Aging Solutions.</p>
            <a href="tel:+18664674624" className="flex items-center gap-1.5 text-sm font-medium text-warmgray-800 hover:text-warmgray-900 transition-colors">
              <Phone className="w-3.5 h-3.5" aria-hidden /> 866-467-4624 — Elder Helpline
            </a>
          </div>

          <div className="card-base p-5">
            <h3 className="text-base font-bold text-warmgray-900 mb-1">Emergency Respite</h3>
            <p className="text-sm text-warmgray-500 mb-3">Short-notice respite in crisis situations — when a caregiver is hospitalized, has a family emergency, or is otherwise unable to provide care. Contact the Elder Helpline immediately.</p>
            <a href="tel:+18009635337" className="flex items-center gap-1.5 text-sm font-medium text-warmgray-800 hover:text-warmgray-900 transition-colors">
              <Phone className="w-3.5 h-3.5" aria-hidden /> 1-800-963-5337 — Elder Helpline (24/7)
            </a>
          </div>
        </div>
      </section>
    </article>
  )
}
