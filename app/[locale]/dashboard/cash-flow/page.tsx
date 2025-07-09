import Header from '@/components/Layouts/Header'
import CashFlow from '@/components/Pages/CashFlow'
import { Locale } from 'next-intl'
import { getTranslations } from 'next-intl/server'

type Props = {
  params: {
    locale: Locale
    slug: string
  }
}

export default async function PageMoneyManagerCashFlow( { params }: Props ) {
  const { locale } = await params

  const t = await getTranslations( { locale } )

  return (
    <div>
      <Header text={t( 'transaction' )} />
      <CashFlow/>
    </div>
  )
}
