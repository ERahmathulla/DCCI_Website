import { createClient, type QueryParams } from 'next-sanity'
import { apiVersion, dataset, projectId } from '../env'

// Public dataset: reads need no token.
export const client = createClient({ projectId, dataset, apiVersion, useCdn: true })

// Live search results are cached for up to a minute.
export function sanityFetch<T>(query: string, params: QueryParams = {}) {
  return client.fetch<T>(query, params, { next: { revalidate: 60 } })
}

// For pages rendered on every request: always asks Sanity, never Next's data cache.
export function sanityFetchFresh<T>(query: string, params: QueryParams = {}) {
  return client.fetch<T>(query, params, { cache: 'no-store' })
}
