import type { Metadata } from 'next'
import Link from 'next/link'
import {
  ArrowRight, BookOpen, Phone, MapPin, Calendar,
  FileDown, ChevronRight, Users
} from 'lucide-react'
import TriageCards from '@/components/home/TriageCards'
import MapStorySection from '@/components/home/MapStorySection'
import EmergencyCallout from '@/components/content/EmergencyCallout'
import { FadeIn } from '@/components/ui/FadeIn'
import { SITE_NAME, SITE_DESCRIPTION, ALZ_ASSOCIATION_HELPLINE } from '@/lib/utils/constants'

export const metadata: Metadata = {
  title: `${SITE_NAME} — Dementia & Memory Care Resources`,
  description: SITE_DESCRIPTION,
}

const featuredOrgs = [
  "Alzheimer's Project",
  'TMH Memory Disorder Clinic',
  'FSU REACH',
  'Advantage Aging Solutions',
  'Big Bend AHEC',
  'FL Dept. of Elder Affairs',
  'Big Bend Healthcare Coalition',
]

const featuredLinks = [
  {
    icon: FileDown,
    label: 'Free Doctor-Visit Toolkit',
    description: 'Checklists and questions to bring to your next appointment',
    href: '/signs-diagnosis/toolkit',
    accent: 'bg-warmgray-100 text-warmgray-800',
    border: 'hover:border-warmgray-200',
  },
  {
    icon: MapPin,
    label: 'Find Local Support Groups',
    description: 'Free groups across Leon, Jefferson, and surrounding counties',
    href: '/caregiver-support/support-groups',
    accent: 'bg-warmgray-100 text-warmgray-800',
    border: 'hover:border-warmgray-200',
  },
  {
    icon: Calendar,
    label: 'Upcoming Events',
    description: 'Classes, conferences, and community programs near you',
    href: '/events',
    accent: 'bg-warmgray-100 text-warmgray-800',
    border: 'hover:border-warmgray-200',
  },
  {
    icon: BookOpen,
    label: 'Understanding Dementia',
    description: '10 warning signs, types, stages, and what to expect',
    href: '/signs-diagnosis/warning-signs',
    accent: 'bg-warmgray-100 text-warmgray-800',
    border: 'hover:border-warmgray-200',
  },
]

const stats = [
  { value: '17', label: 'Memory Disorder Clinics in Florida' },
  { value: '8', label: 'Big Bend counties served' },
  { value: '7', label: 'Featured organizations' },
  { value: '24/7', label: "Alzheimer's Association helpline" },
]

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-warmgray-50 via-cream-50 to-white pt-16 pb-24 md:pt-24 md:pb-36">
        {/* Decorative blurs */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full bg-warmgray-100/50 blur-3xl" />
          <div className="absolute top-1/2 -left-24 w-72 h-72 rounded-full bg-warmgray-100/40 blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-48 h-48 rounded-full bg-warmgray-200/30 blur-2xl" />
        </div>

        <div className="container-main relative">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-warmgray-100 text-warmgray-900 rounded-full text-xs font-semibold mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-warmgray-700" aria-hidden />
              Big Bend Region, Florida
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-warmgray-900 mb-6 leading-[1.05] tracking-tight">
              Dementia care<br />
              <span className="text-gradient">all in one place.</span>
            </h1>

            <p className="text-xl md:text-2xl text-warmgray-600 mb-10 max-w-2xl leading-relaxed font-light">
              Noticing memory changes? Not sure where to start? Connect Big Bend families with local helplines, diagnosis, support groups, and care — in one clear, organized site.
            </p>

            <div className="flex flex-wrap items-center gap-4 mb-10">
              <Link href="/signs-diagnosis" className="btn-primary text-base px-8 py-4">
                Start here
                <ArrowRight className="w-5 h-5" aria-hidden />
              </Link>
              <a href="tel:+18002723900" className="btn-secondary text-base px-8 py-4">
                <Phone className="w-5 h-5" aria-hidden />
                24/7 Alzheimer's Association Helpline
              </a>
            </div>

            <p className="text-sm text-warmgray-400">
              24/7 Alzheimer's Association Helpline:{' '}
              <a href="tel:+18002723900" className="text-warmgray-800 font-semibold hover:text-warmgray-900 transition-colors">
                {ALZ_ASSOCIATION_HELPLINE}
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* Triage cards — overlapping hero slightly */}
      <section className="container-main -mt-8 relative z-10" aria-labelledby="triage-heading">
        <h2 id="triage-heading" className="sr-only">What do you need help with?</h2>
        <TriageCards />
      </section>

      {/* Scroll-driven real map — statewide Florida → Big Bend → county markers */}
      <MapStorySection />

      {/* Featured resources */}
      <section className="container-main section-padding" aria-labelledby="featured-heading">
        <div className="flex items-center justify-between mb-10 gap-4">
          <FadeIn>
            <div>
              <p className="text-sm font-semibold text-warmgray-800 uppercase tracking-wider mb-1">Quick access</p>
              <h2 id="featured-heading" className="text-3xl font-bold text-warmgray-900">Most helpful resources</h2>
            </div>
          </FadeIn>
          <Link href="/directory" className="text-sm font-medium text-warmgray-800 hover:text-warmgray-900 transition-colors flex items-center gap-1 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warmgray-700 rounded">
            View all <ChevronRight className="w-4 h-4" aria-hidden />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {featuredLinks.map((item, i) => {
            const Icon = item.icon
            return (
              <FadeIn key={item.href} delay={i * 0.08}>
                <Link
                  href={item.href}
                  className={`group flex flex-col gap-3 p-5 rounded-2xl bg-white border-2 border-warmgray-100 shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warmgray-700 focus-visible:ring-offset-2 ${item.border} h-full`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.accent}`}>
                    <Icon className="w-5 h-5" aria-hidden />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-warmgray-900 mb-1 group-hover:text-warmgray-900 transition-colors">
                      {item.label}
                    </h3>
                    <p className="text-xs text-warmgray-500 leading-relaxed">{item.description}</p>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-medium text-warmgray-800 group-hover:gap-2 transition-all duration-150">
                    Learn more <ArrowRight className="w-3 h-3" aria-hidden />
                  </div>
                </Link>
              </FadeIn>
            )
          })}
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-warmgray-900 py-14" aria-labelledby="stats-heading">
        <h2 id="stats-heading" className="sr-only">Resource network statistics</h2>
        <div className="container-main">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-white text-center">
            {stats.map((stat, i) => (
              <FadeIn key={stat.label} delay={i * 0.08}>
                <div className="flex flex-col gap-1">
                  <span className="text-4xl md:text-5xl font-bold text-white">{stat.value}</span>
                  <span className="text-sm text-warmgray-200 font-medium">{stat.label}</span>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* About + Emergency */}
      <section className="container-main section-padding">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <FadeIn>
            <div>
              <p className="text-sm font-semibold text-warmgray-800 uppercase tracking-wider mb-2">Why one site?</p>
              <h2 className="text-3xl font-bold text-warmgray-900 mb-5">One place, seven organizations</h2>
              <p className="text-warmgray-500 mb-6 leading-relaxed text-lg">
                This site brings together resources from seven Big Bend organizations into one easy-to-navigate hub — so you never have to wonder which organization to call.
              </p>
              <ul className="space-y-3 mb-8" role="list">
                {featuredOrgs.map((org) => (
                  <li key={org} className="flex items-center gap-3 text-sm text-warmgray-600">
                    <div className="w-2 h-2 rounded-full bg-warmgray-400 shrink-0" aria-hidden />
                    {org}
                  </li>
                ))}
              </ul>
              <Link href="/about" className="btn-secondary text-sm">
                Learn about the project
                <ArrowRight className="w-4 h-4" aria-hidden />
              </Link>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div>
              <p className="text-sm font-semibold text-emergency-600 uppercase tracking-wider mb-2">Always accessible</p>
              <h2 className="text-3xl font-bold text-warmgray-900 mb-5">Emergency numbers</h2>
              <EmergencyCallout compact />
              <div className="mt-5">
                <Link href="/emergency" className="text-sm font-medium text-emergency-600 hover:text-emergency-700 transition-colors flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emergency-500 rounded">
                  Full emergency resources page
                  <ArrowRight className="w-4 h-4" aria-hidden />
                </Link>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Stay up to date */}
      <section
        className="relative py-20 overflow-hidden bg-warmgray-950"
        aria-labelledby="signup-heading"
      >
        {/* Dot pattern overlay */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
          aria-hidden
        />

        <div className="container-narrow text-center text-white relative">
          <div className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center mx-auto mb-6">
            <Users className="w-7 h-7 text-white" aria-hidden />
          </div>
          <h2 id="signup-heading" className="text-3xl md:text-4xl font-bold mb-4">
            Stay connected to local resources
          </h2>
          <p className="text-lg max-w-lg mx-auto font-light">
            <Link href="/events" className="text-warmgray-200 underline underline-offset-4 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded">
              Stay up to date: see upcoming events and programs.
            </Link>
          </p>
        </div>
      </section>
    </>
  )
}
