import { locales } from '@/i18n/config'
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ||
    'https://moneymanager.id'

  // Disallow dashboard for all locales
  const disallows = ['/dashboard', ...locales.map( ( loc ) => `/${loc}/dashboard` )]

  return {
    rules : [
      {
        userAgent : '*',
        allow     : ['/'],
        disallow  : disallows,
      },
    ],
    sitemap : `${baseUrl}/sitemap.xml`,
    host    : baseUrl,
  }
}
