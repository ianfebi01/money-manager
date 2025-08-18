import CallToAction from '@/components/Heroes/CallToAction'
import FeaturedFeature from '@/components/Sections/FeaturedFeature'
import ScrolledImages from '@/components/Sections/ScrolledImages'
import FeaturedMultiLang from '@/components/Sections/FeaturedMultiLang'
import TextLeftImageRight from '@/components/TextLeftImageRight'
import Quote from '@/components/Sections/Quote'
import { Props } from '@/types'
import { getTranslations } from 'next-intl/server'

export default async function HomePage( props: Omit<Props, 'children'> ) {
  const { locale } = await props.params

  const t = await getTranslations( { locale } )
  
  return (
    <div className="grow ">
      <section className="max-w-7xl px-6 lg:px-8 mx-auto w-full min-h-[70vh] flex items-center justify-center">
        <CallToAction />
      </section>
      <section>
        <ScrolledImages />
      </section>
      <div className="bg-dark-secondary">
        <section className="max-w-7xl px-6 lg:px-8 mx-auto w-full py-16">
          <Quote
            quote={t( 'home_quote' )}
          />
        </section>
      </div>
      <section className="hidden md:block grow max-w-7xl px-6 lg:px-8 mx-auto w-full py-16">
        <FeaturedMultiLang />
      </section>
      <section className="max-w-7xl px-6 lg:px-8 mx-auto w-full max-lg:pt-16">
        <FeaturedFeature />
      </section>
      <section className="max-w-7xl px-6 lg:px-8 mx-auto w-full py-16">
        <TextLeftImageRight
          image="/images/data-storage.svg"
          fullWidthBgImage={false}
          reverse
          scaling="contain"
          bodyCopy={t( 'text_left_image_right.body_copy' )}
        />
      </section>
    </div>
  )
}
