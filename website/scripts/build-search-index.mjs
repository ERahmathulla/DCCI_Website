// Builds the site search index after `next build` (runs as part of `npm run build`).
//
// Reads every prerendered page in .next/server/app, indexes the content inside
// <main data-pagefind-body>, and writes a static Pagefind bundle to public/pagefind,
// which the browser searches without any server or third-party service.
//
// Pages rendered on every request (the ones that read Sanity) have no prerendered
// HTML, so the built app is started on a local port for a moment and their HTML is
// fetched from it. Their Sanity-driven sections are marked data-pagefind-ignore.

import { spawn } from 'node:child_process'
import { readdir, readFile, rm } from 'node:fs/promises'
import { createServer } from 'node:net'
import { join, relative, sep } from 'node:path'
import * as pagefind from 'pagefind'
import ts from 'typescript'

const APP_DIR = '.next/server/app'
const OUTPUT_DIR = 'public/pagefind'
const SITE_NAME_SUFFIX = ' | Big Bend Brain Health'
const COUNTIES_FILE = 'src/lib/data/counties.ts'

// The Studio, API routes, Next internals (_not-found etc.), and the search page itself
const EXCLUDED = [/^\/studio(\/|$)/, /^\/api(\/|$)/, /^\/_/, /^\/directory$/, /\[/]

// Routes with `dynamic = 'force-dynamic'`; county pages are added from the counties data
const DYNAMIC_ROUTES = ['/events', '/care-services/respite', '/caregiver-support/support-groups']

async function* htmlFiles(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) yield* htmlFiles(path)
    else if (entry.name.endsWith('.html')) yield path
  }
}

function toUrl(file) {
  const route = relative(APP_DIR, file).split(sep).join('/').replace(/\.html$/, '')
  return route === 'index' ? '/' : `/${route}`
}

// The counties data is TypeScript with no imports: strip the types and load it
async function countyRoutes() {
  const { outputText } = ts.transpileModule(await readFile(COUNTIES_FILE, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
  })
  const { OUTREACH_COUNTIES } = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`)
  if (!OUTREACH_COUNTIES?.length) throw new Error(`No counties found in ${COUNTIES_FILE}`)
  return OUTREACH_COUNTIES.map((county) => `/counties/${county.slug}`)
}

function freePort() {
  return new Promise((resolve, reject) => {
    const server = createServer()
    server.once('error', reject)
    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address()
      server.close(() => resolve(port))
    })
  })
}

// Starts the built app (`next start`) and resolves once it answers requests
async function startBuiltApp() {
  const port = await freePort()
  const server = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '-p', String(port)], {
    stdio: ['ignore', 'ignore', 'inherit'],
  })
  const origin = `http://127.0.0.1:${port}`
  for (let attempt = 0; attempt < 120; attempt++) {
    if (server.exitCode !== null) throw new Error(`next start exited with code ${server.exitCode}`)
    try {
      await fetch(origin, { signal: AbortSignal.timeout(5000) })
      return { origin, stop: () => server.kill() }
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 250))
    }
  }
  server.kill()
  throw new Error('next start did not respond within 30 seconds')
}

const { index, errors: createErrors } = await pagefind.createIndex({ forceLanguage: 'en' })
if (!index) throw new Error(`Pagefind failed to start: ${createErrors.join(', ')}`)

let count = 0
async function addPage(url, html) {
  // Next streams each page's content (behind the root loading.tsx) into
  // <div hidden id="S:n"> blocks after <main>, which only holds the loading
  // skeleton. Index those blocks as the page body instead of <main>.
  if (/<div hidden id="S:\d+">/.test(html)) {
    html = html
      .replace(/(<main[^>]*?) data-pagefind-body(="")?/, '$1')
      .replace(/<div hidden id="(S:\d+)">/g, '<div id="$1" data-pagefind-body>')
  }

  // Use the page's <title> (without the site name) as the result title
  const title = html.match(/<title>([^<]*)<\/title>/)?.[1]?.replace(SITE_NAME_SUFFIX, '')
  if (title) {
    html = html.replace(/(<[^>]*data-pagefind-body[^>]*>)/, `$1<span data-pagefind-meta="title" data-pagefind-ignore>${title}</span>`)
  }

  const { errors, file: indexed } = await index.addHTMLFile({ url, content: html })
  if (errors.length) throw new Error(`Pagefind could not index ${url}: ${errors.join(', ')}`)
  if (indexed.uniqueWords < 10) console.warn(`Search index: ${url} has almost no searchable text (${indexed.uniqueWords} words)`)
  count++
}

for await (const file of htmlFiles(APP_DIR)) {
  const url = toUrl(file)
  if (EXCLUDED.some((pattern) => pattern.test(url))) continue

  const html = await readFile(file, 'utf8')
  // Skip redirect-only pages (e.g. /counties) and anything outside the site layout
  if (html.includes('id="__next-page-redirect"') || !html.includes('data-pagefind-body')) continue

  await addPage(url, html)
}

const app = await startBuiltApp()
try {
  for (const url of [...DYNAMIC_ROUTES, ...(await countyRoutes())]) {
    const response = await fetch(app.origin + url, { signal: AbortSignal.timeout(30_000) })
    const html = await response.text()
    // Fail the build rather than quietly drop a page from search
    if (!response.ok || !html.includes('data-pagefind-body')) {
      throw new Error(`Search index: could not render ${url} (status ${response.status})`)
    }
    await addPage(url, html)
  }
} finally {
  app.stop()
}

if (count === 0) throw new Error(`No pages found to index in ${APP_DIR}`)

await rm(OUTPUT_DIR, { recursive: true, force: true })
const { errors: writeErrors } = await index.writeFiles({ outputPath: OUTPUT_DIR })
if (writeErrors.length) throw new Error(`Pagefind could not write the index: ${writeErrors.join(', ')}`)
await pagefind.close()

console.log(`Search index: ${count} pages indexed into ${OUTPUT_DIR}`)
