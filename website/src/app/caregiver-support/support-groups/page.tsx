import type { Metadata } from 'next'
import { MapPin, Clock, Phone, Users } from 'lucide-react'
import Breadcrumbs from '@/components/ui/Breadcrumbs'
import { ProgramsLoadError } from '@/components/programs/ProgramCard'
import { getRecurringPrograms } from '@/sanity/lib/queries'
import { formatScheduleEntry } from '@/lib/utils/schedule'

export const metadata: Metadata = {
  title: 'Local Support Groups',
  description: 'Free dementia caregiver support groups in the Big Bend area. No RSVP required.',
}

// Rendered on every request so visitors always see current Sanity data
export const dynamic = 'force-dynamic'

export default async function SupportGroupsPage() {
  // Support groups are managed in Sanity (Studio → Recurring programs → Support group)
  const groups = await getRecurringPrograms({ programType: 'Support group' })

  return (
    <article>
      <Breadcrumbs crumbs={[
        { label: 'For Caregivers', href: '/caregiver-support' },
        { label: 'Support Groups' },
      ]} />

      <h1 className="text-3xl font-bold text-warmgray-900 mb-4">Local Support Groups</h1>
      <p className="text-lg text-warmgray-500 mb-3 leading-relaxed max-w-2xl">
        All groups listed here are <strong>free</strong> and require <strong>no RSVP</strong>. Facilitated by trained professionals through the Alzheimer's Project.
      </p>
      <p className="text-sm text-warmgray-400 mb-8">
        Dates and times subject to change. Call <a href="tel:+18503862778" className="text-warmgray-800 font-medium hover:text-warmgray-900 transition-colors">(850) 386-2778</a> to confirm.
      </p>

      {/* Kept out of the static search index; live search covers Sanity content */}
      <div className="space-y-4 mb-10" data-pagefind-ignore>
        {groups === null ? (
          <ProgramsLoadError />
        ) : groups.length === 0 ? (
          <p className="text-sm text-warmgray-600">
            No support groups are listed right now. Call <a href="tel:+18503862778" className="font-semibold underline">(850) 386-2778</a> for the current schedule.
          </p>
        ) : (
          groups.map((group) => (
            <div key={group._id} id={group._id} className="p-5 rounded-2xl bg-white border border-warmgray-100 shadow-card scroll-mt-header">
              <div className="flex items-start justify-between gap-3 mb-3 flex-wrap">
                <h2 className="text-base font-bold text-warmgray-900">{group.name}</h2>
                {group.label && (
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 bg-warmgray-100 text-warmgray-800">
                    {group.label}
                  </span>
                )}
              </div>

              <div className="space-y-1.5">
                {(group.locationName || group.address) && (
                  <div className="flex items-center gap-2 text-sm text-warmgray-600">
                    <MapPin className="w-4 h-4 text-warmgray-400 shrink-0" aria-hidden />
                    <span>
                      <strong>{group.locationName}</strong>
                      {group.locationName && group.address && ' — '}
                      {group.address}
                    </span>
                  </div>
                )}
                {group.schedule?.map((entry) => (
                  <div key={entry._key} className="flex items-center gap-2 text-sm text-warmgray-600">
                    <Clock className="w-4 h-4 text-warmgray-400 shrink-0" aria-hidden />
                    <span>{formatScheduleEntry(entry)}</span>
                  </div>
                ))}
                {group.publicNotes && (
                  <p className="text-sm text-warmgray-500 pl-6">{group.publicNotes}</p>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Online options */}
      <div className="p-5 rounded-2xl bg-warmgray-50 border border-warmgray-200 mb-8">
        <div className="flex items-start gap-3">
          <Users className="w-5 h-5 text-warmgray-500 shrink-0 mt-0.5" aria-hidden />
          <div>
            <h2 className="text-base font-semibold text-warmgray-900 mb-1">Online Support Communities</h2>
            <p className="text-sm text-warmgray-600 mb-3">Can't attend in person? These free online communities offer peer support any time.</p>
            <ul className="space-y-1 text-sm">
              <li><a href="https://alzconnected.org" target="_blank" rel="noopener noreferrer" className="text-warmgray-800 hover:text-warmgray-900 font-medium transition-colors">ALZConnected</a> — Online community for people facing memory-disorder diseases</li>
              <li><a href="https://caregiver.org" target="_blank" rel="noopener noreferrer" className="text-warmgray-800 hover:text-warmgray-900 font-medium transition-colors">Family Caregiver Alliance</a> — National support and resources</li>
              <li><a href="https://caregiving.com" target="_blank" rel="noopener noreferrer" className="text-warmgray-800 hover:text-warmgray-900 font-medium transition-colors">Caregiving.com</a> — Multi-faceted online caregiver community</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="p-5 rounded-2xl bg-warmgray-50 border border-warmgray-200">
        <div className="flex items-start gap-3">
          <Phone className="w-5 h-5 text-warmgray-800 shrink-0 mt-0.5" aria-hidden />
          <div>
            <p className="text-sm font-semibold text-warmgray-900 mb-1">Questions about support groups?</p>
            <p className="text-sm text-warmgray-900">
              Call the Alzheimer's Project at <a href="tel:+18503862778" className="font-semibold underline hover:text-warmgray-900">(850) 386-2778</a>, Mon–Fri 9am–5pm.
            </p>
          </div>
        </div>
      </div>
    </article>
  )
}
