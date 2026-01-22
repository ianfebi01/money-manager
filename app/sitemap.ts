// app/sitemap.ts
import type { MetadataRoute } from 'next'
import { locales } from '@/i18n/config' // ['en','id']

const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL ||
  'https://moneymanager.id'

export default function sitemap(): MetadataRoute.Sitemap {
  // Add your main routes here (without locale prefix)
  const routes = ['', '/privacy-policy', '/login'] // extend as needed

  const entries: MetadataRoute.Sitemap = []

  for ( const route of routes ) {
    // Build localized URLs for each route
    const localizedUrls = locales.map( ( locale ) => {
      const url = `${baseUrl}/${locale}${route}`
      
      return {
        url,
        lastModified    : new Date(),
        changeFrequency : 'monthly' as const,
        priority        : route === '' ? 1 : 0.7,
        alternates      : {
          languages : Object.fromEntries(
            locales.map( ( l ) => [l, `${baseUrl}/${l}${route}`] )
          ),
        },
      }
    } )

    entries.push( ...localizedUrls )
  }

  return entries
}
