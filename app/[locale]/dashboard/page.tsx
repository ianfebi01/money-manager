
import Header from '@/components/Layouts/Header'
import Dashboard from '@/components/Pages/Dashboard'
import { Locale } from 'next-intl'
import { getTranslations } from 'next-intl/server'

type Props = {
  params: {
    locale: Locale
    slug: string
  }
}

export default async function PageMoneyManager( { params }: Props ) {
  const { locale } = await params

  const t = await getTranslations( { locale } )

  return (
    <div className='mt-8'>
      <Header text={t( 'transaction_summary' )} />
      <Dashboard/>
    </div>
  )
}
