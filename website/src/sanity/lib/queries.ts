import { defineQuery } from 'next-sanity'
import { sanityFetch, sanityFetchFresh } from './client'

export interface SiteEvent {
  _id: string
  title: string
  start: string
  end?: string
  county: string
  locationName?: string
  address?: string
  description?: string
  registrationUrl?: string
  organizer?: string
  cost?: string
}

export interface ScheduleEntry {
  _key: string
  day: string
  startTime: string
  endTime: string
  weeks?: string[]
}

export interface RecurringProgram {
  _id: string
  name: string
  programType: string
  label?: string
  organization?: string
  description?: string
  schedule?: ScheduleEntry[]
  locationName?: string
  address?: string
  county?: string
  phone?: string
  website?: string
  publicNotes?: string
}

const EVENT_FIELDS = `_id, title, start, end, county, locationName, address, description, registrationUrl, organizer, cost`
const PROGRAM_FIELDS = `_id, name, programType, label, organization, description, schedule, locationName, address, county, phone, website, publicNotes`

export const UPCOMING_EVENTS_QUERY = defineQuery(`*[
  _type == "event" && hidden != true
  && dateTime(coalesce(end, start)) >= dateTime($now)
  && (!defined($county) || county == $county)
] | order(start asc) { ${EVENT_FIELDS} }`)

export const RECURRING_PROGRAMS_QUERY = defineQuery(`*[
  _type == "recurringProgram" && hidden != true
  && (!defined($programType) || programType == $programType)
  && (!defined($county) || county == $county)
] | order(_createdAt asc) { ${PROGRAM_FIELDS} }`)

// Every search word must match (as a word prefix) somewhere in the listed fields
export const SITE_CONTENT_SEARCH_QUERY = defineQuery(`{
  "events": *[
    _type == "event" && hidden != true
    && dateTime(coalesce(end, start)) >= dateTime($now)
    && [title, description, locationName, address, organizer, county] match $terms
  ] | order(start asc)[0...10] { ${EVENT_FIELDS} },
  "programs": *[
    _type == "recurringProgram" && hidden != true
    && [name, programType, label, organization, description, locationName, address, county, publicNotes] match $terms
  ] | order(_createdAt asc)[0...10] { ${PROGRAM_FIELDS} }
}`)

// Rounded to the minute so the Sanity CDN can cache the query
function currentMinute() {
  return new Date(Math.floor(Date.now() / 60_000) * 60_000).toISOString()
}

// Upcoming = not yet ended (or not yet started, when there is no end time).
export async function getUpcomingEvents(county?: string) {
  try {
    return await sanityFetchFresh<SiteEvent[]>(UPCOMING_EVENTS_QUERY, { now: currentMinute(), county: county ?? null })
  } catch (error) {
    console.error('Failed to load events from Sanity', error)
    return null
  }
}

export async function getRecurringPrograms({ programType, county }: { programType?: string; county?: string } = {}) {
  try {
    return await sanityFetchFresh<RecurringProgram[]>(RECURRING_PROGRAMS_QUERY, {
      programType: programType ?? null,
      county: county ?? null,
    })
  } catch (error) {
    console.error('Failed to load recurring programs from Sanity', error)
    return null
  }
}

export async function searchSiteContent(query: string) {
  const terms = query
    .toLowerCase()
    .split(/\s+/)
    .map((word) => word.replace(/[^\p{L}\p{N}'-]/gu, ''))
    .filter(Boolean)
    .slice(0, 8)
    .map((word) => `${word}*`)
  if (terms.length === 0) return { events: [], programs: [] }
  return sanityFetch<{ events: SiteEvent[]; programs: RecurringProgram[] }>(SITE_CONTENT_SEARCH_QUERY, {
    now: currentMinute(),
    terms,
  })
}
