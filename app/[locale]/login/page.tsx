import GoogleSignIn from '@/components/Buttons/GoogleSignIn'
import { Metadata } from 'next'
import { Locale } from 'next-intl'
import { getTranslations } from 'next-intl/server'

type Props = {
  params: {
    locale: Locale
    slug: string
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const metadata = {
    metaTitle : 'Login | Money Manager | Ian Febi Sastrataruna',
    metaDescription :
      'Login to access your personal finance dashboard with Money Manager by Ian Febi Sastrataruna.',
    keywords :
      'login, money manager, finance, personal budgeting, Ian Febi Sastrataruna',
    metaRobots : 'index, follow',
  }

  const socialMeta = {
    twitter : {
      description :
        'Securely log in to manage your finances with Money Manager by Ian Febi Sastrataruna.',
    },
  }

  return {
    title       : metadata.metaTitle,
    description : metadata.metaDescription,
    keywords    : metadata.keywords,
    robots      : metadata.metaRobots,
    openGraph   : {
      title       : metadata.metaTitle,
      description : metadata.metaDescription,
      siteName    : 'Ian Febi Sastrataruna',
      type        : 'website',
    },
    twitter : {
      card        : 'summary',
      site        : '@ianfebi01',
      title       : metadata.metaTitle,
      description : socialMeta.twitter?.description || '',
    },
  }
}

export default async function PageMoneyManagerLogin( { params }: Props ) {
  const { locale } = await params

  const t = await getTranslations( { locale } )

  return (
    <main className="mt-20 sm:mt-20 grow flex items-center">
      <section id="money-manager"
        className="bg-dark h-full w-full"
      >
        <div className="max-w-sm mx-auto px-6 lg:px-8 py-6 lg:py-8  flex flex-col gap-4 items-center rounded-lg bg-dark-secondary">
          <h1 className="m-0">{t( 'login' )}</h1>
          <GoogleSignIn/>
        </div>
      </section>
    </main>
  )
}
