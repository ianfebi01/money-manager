import GoogleSignIn from '@/components/Buttons/GoogleSignIn'
import { locales } from '@/i18n/config'
import { Metadata } from 'next'
import { Locale } from 'next-intl'
import { getTranslations } from 'next-intl/server'

type Props = {
  params: {
    locale: Locale
    slug: string
  }
}

export async function generateMetadata( {
  params
}: {
  params: {locale: string};
} ): Promise<Metadata> {
  const { locale } = params;
  const t = await getTranslations( { locale, namespace : 'pages.login' } );

  const path = `/${locale}/login`;
  
  return {
    title       : t( 'title' ),
    description : t( 'desc' ),
    robots      : { index : false, follow : false }, // common for auth pages
    alternates  : {
      canonical : path,
      languages : Object.fromEntries( locales.map( ( l ) => [l, `/${l}/login`] ) )
    },
    openGraph : { url : path, title : t( 'title' ), description : t( 'desc' ) },
    twitter   : { title : t( 'title' ), description : t( 'desc' ) }
  };
}

export default async function PageMoneyManagerLogin( { params }: Props ) {
  const { locale } = await params

  const t = await getTranslations( { locale } )

  return (
    <main className="grow flex items-center">
      <section id="money-manager"
        className="bg-dark h-full w-full"
      >
        <div className="max-w-xs sm:max-w-sm mx-auto px-6 lg:px-8 py-6 lg:py-8  flex flex-col gap-4 items-center rounded-lg bg-dark-secondary">
          <h1 className="m-0">{t( 'login' )}</h1>
          <div className='mb-2 w-full'>
            <GoogleSignIn/>
          </div>
        </div>
      </section>
    </main>
  )
}
