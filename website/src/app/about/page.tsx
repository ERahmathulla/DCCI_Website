import type { Metadata } from 'next'
import Link from 'next/link'
import { ExternalLink, Mail, Phone } from 'lucide-react'
import BrainIcon from '@/components/ui/BrainIcon'

export const metadata: Metadata = {
  title: 'About',
  description: 'About the Big Bend Brain Health hub — who built it, why, and which organizations it features.',
}

const featuredOrgs = [
  { name: "Alzheimer's Project", abbr: 'AP', url: 'https://alzheimersproject.org', phone: '(850) 386-2778', desc: "Day respite, support groups, caregiver education, and the region's memory care backbone." },
  { name: 'TMH Memory Disorder Clinic', abbr: 'TMH MDC', url: 'https://tmh.org', phone: '(850) 431-5001', desc: 'State-designated Memory Disorder Clinic: neurological evaluation, neuropsychological testing, social-work support.' },
  { name: 'FSU REACH', abbr: 'REACH', url: 'https://reach.med.fsu.edu', phone: null, email: 'connect.reach@med.fsu.edu', desc: 'Research, education, and community engagement on aging and dementia. Resource portal and symposia.' },
  { name: 'Advantage Aging Solutions', abbr: 'AAA', url: 'https://advantageaging.org', phone: '(850) 488-0055', desc: 'Area Agency on Aging: Elder Helpline, SHINE, CCE/HCE/ADI intake, TCARE caregiver support.' },
  { name: 'Big Bend Healthcare Coalition', abbr: 'BBHCC', url: 'https://bigbendhcc.org', phone: '(850) 488-6211', desc: 'Regional healthcare disaster preparedness coalition serving 8 Big Bend counties.' },
  { name: 'Big Bend AHEC', abbr: 'AHEC', url: 'https://bigbendahec.org', phone: '(850) 224-1177', desc: 'Chronic disease programs, Powerful Tools for Caregivers, AHEC Scholars, and community health education.' },
  { name: 'Florida Dept. of Elder Affairs', abbr: 'DOEA', url: 'https://elderaffairs.org', phone: '(850) 414-2000', desc: 'Alzheimer\'s Disease Initiative, Memory Disorder Clinics, DCCI, FACE Care Navigators, and state policy.' },
]

export default function AboutPage() {
  return (
    <div className="pt-header">
      <div className="bg-gradient-to-b from-warmgray-50 to-white border-b border-warmgray-100 py-12">
        <div className="container-narrow">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-warmgray-400 to-warmgray-900 flex items-center justify-center">
              <BrainIcon className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-warmgray-900">About This Site</h1>
              <p className="text-warmgray-500">Big Bend Brain Health</p>
            </div>
          </div>
          <p className="text-lg text-warmgray-600 leading-relaxed max-w-2xl">
            This site was built to solve a real problem: dementia caregiving resources exist across many organizations' websites, and families who need help often don't know which organization to contact or where to start.
          </p>
        </div>
      </div>

      <div className="container-narrow py-12 space-y-12">
        {/* Mission */}
        <section aria-labelledby="mission-heading">
          <h2 id="mission-heading" className="text-2xl font-bold text-warmgray-900 mb-4">Our mission</h2>
          <div className="prose prose-warmgray max-w-none">
            <p>
              The <strong>Big Bend Brain Health Hub</strong> consolidates resources from seven organizations into one easy-to-navigate destination — so the "unreached middle" (families who've noticed changes but aren't yet connected to any service) can find help quickly.
            </p>
            <p>
              Everything is organized around <strong>what the visitor needs right now</strong>, not which organization provides it. Whether someone is looking for a diagnosis, a support group, in-home care, or just the right phone number, this site gives them a clear path forward.
            </p>
          </div>
        </section>

        {/* Featured organizations */}
        <section id="organizations" aria-labelledby="organizations-heading">
          <h2 id="organizations-heading" className="text-2xl font-bold text-warmgray-900 mb-6">Featured Organizations</h2>
          <div className="space-y-4">
            {featuredOrgs.map((org) => (
              <div key={org.name} className="card-base p-5 flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-warmgray-100 flex items-center justify-center shrink-0 text-xs font-bold text-warmgray-900">
                  {org.abbr.slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 flex-wrap mb-1">
                    <h3 className="text-base font-bold text-warmgray-900">{org.name}</h3>
                    <a href={org.url} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs text-warmgray-800 hover:text-warmgray-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warmgray-700 rounded">
                      Website <ExternalLink className="w-3 h-3" aria-hidden />
                    </a>
                  </div>
                  <p className="text-sm text-warmgray-500 mb-2">{org.desc}</p>
                  <div className="flex flex-wrap gap-3 text-xs">
                    {org.phone && (
                      <a href={`tel:${org.phone.replace(/\D/g,'')}`} className="flex items-center gap-1 text-warmgray-500 hover:text-warmgray-800 transition-colors">
                        <Phone className="w-3 h-3" aria-hidden />{org.phone}
                      </a>
                    )}
                    {org.email && (
                      <a href={`mailto:${org.email}`} className="flex items-center gap-1 text-warmgray-500 hover:text-warmgray-800 transition-colors">
                        <Mail className="w-3 h-3" aria-hidden />{org.email}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-warmgray-500 mt-4">
            Organizations are listed for information only. Being listed does not mean partnership with or endorsement by this site.
          </p>
        </section>

        {/* Contact */}
        <section id="contact" aria-labelledby="contact-heading">
          <h2 id="contact-heading" className="text-2xl font-bold text-warmgray-900 mb-4">Contact & Corrections</h2>
          <div className="p-6 rounded-2xl bg-warmgray-50 border border-warmgray-200">
            <p className="text-sm text-warmgray-900 mb-4">
              Found an outdated phone number or want to add a resource? We want to keep this directory accurate.
            </p>
            <a href="mailto:erar20062009@gmail.com" className="btn-primary text-sm">
              <Mail className="w-4 h-4" aria-hidden />
              Contact us
            </a>
          </div>
        </section>

        {/* Accessibility */}
        <section id="accessibility" aria-labelledby="a11y-heading">
          <h2 id="a11y-heading" className="text-2xl font-bold text-warmgray-900 mb-4">Accessibility</h2>
          <div className="prose prose-warmgray max-w-none">
            <p>
              This site is designed to meet <strong>WCAG 2.1 AA</strong> accessibility standards, with larger base text (18px), high-color contrast, full keyboard navigation, and screen reader support. All animations respect the <code>prefers-reduced-motion</code> setting.
            </p>
            <p>If you encounter an accessibility barrier, please <a href="mailto:erar20062009@gmail.com">contact us</a>.</p>
          </div>
        </section>

        {/* Privacy */}
        <section id="privacy" aria-labelledby="privacy-heading">
          <h2 id="privacy-heading" className="text-2xl font-bold text-warmgray-900 mb-4">Privacy</h2>
          <div className="prose prose-warmgray max-w-none">
            <p>
              This site uses Google Analytics to count visits and see which pages are most helpful. It doesn't collect your name or email address, and we don't use it for advertising.
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}
