import type { Metadata } from 'next'
import { config } from '@fortawesome/fontawesome-svg-core'
import ReactQueryProvider from '@/components/Context/ReactQueryProvider'
import { Toaster } from 'react-hot-toast'
import GoogleAnalytics from '@/components/GoogleAnalytics'
import NextTopLoader from 'nextjs-toploader'
import SectionProvider from '@/components/Context/SectionProvider'
import Footer from '@/components/Layouts/Footer'
import { ErrorBoundary } from 'next/dist/client/components/error-boundary'
import Error from '../error'
import { hasLocale, NextIntlClientProvider } from 'next-intl'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import MoneyManagerNavbar from '@/components/Layouts/MoneyManagerNavbar'
import SessionProviderWrapper from '@/components/Context/SessionPrviderWrapper'

config.autoAddCss = false

export const metadata: Metadata = {
  title : 'Money Manager | by ianfebi01',
  description :
    'Manage Your Money Without Hassle',
}

export function generateStaticParams() {
  return routing.locales.map( ( locale ) => ( { locale } ) )
}

export default async function LocaleLayout( {
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
} ) {
  // Ensure that the incoming `locale` is valid
  const { locale } = await params
  if ( !hasLocale( routing.locales, locale ) ) {
    notFound()
  }

  return (
    <html lang={locale}>
      <GoogleAnalytics />
      <ErrorBoundary errorComponent={Error}>
        <ReactQueryProvider>
          <body suppressHydrationWarning={true}
            id="myportal"
          >
            <SessionProviderWrapper>
              <NextIntlClientProvider>
                <NextTopLoader
                  color="#F26B50"
                  initialPosition={0.08}
                  crawlSpeed={200}
                  height={3}
                  crawl={true}
                  showSpinner={false}
                  easing="ease"
                  speed={200}
                  shadow="0 0 10px #F26B50,0 0 5px #F26B50"
                />
                <Toaster
                  toastOptions={{
                    // icon : (
                    // 	<div className="text-20" data-cy="modal-information-icon">
                    // 		<ModalInformationIcon />
                    // 	</div>
                    // ),
                    position  : 'top-right',
                    className : 'bg-white text-dark text-md',
                    style     : {
                      boxShadow : '0px 4px 10px rgba(0, 0, 0, 0.1)',
                      height    : '44px',
                    },
                  }}
                />
                <div className="min-h-screen flex flex-col">
                  <div className="max-w-7xl px-6 lg:px-8 mx-auto w-full">
                    <MoneyManagerNavbar />
                  </div>
                  {children}
                  <SectionProvider>
                    <Footer />
                  </SectionProvider>
                </div>
              </NextIntlClientProvider>
            </SessionProviderWrapper>
          </body>
        </ReactQueryProvider>
      </ErrorBoundary>
    </html>
  )
}
