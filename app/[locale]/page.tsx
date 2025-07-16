import CallToAction from '@/components/Heroes/CallToAction'
import FeaturedFeature from '@/components/Sections/FeaturedFeature'
import ScrolledImages from '@/components/Sections/ScrolledImages'
import FeaturedMultiLang from '@/components/Sections/FeaturedMultiLang'
import TextLeftImageRight from '@/components/TextLeftImageRight'
import Quote from '@/components/Sections/Quote'

export default function HomePage() {
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
            quote={`Bukan seberapa banyak yang kamu punya, tapi seberapa baik kamu mengelolanya.`}
          />
        </section>
      </div>
      <section className="hidden md:block grow max-w-7xl px-6 lg:px-8 mx-auto w-full py-16">
        <FeaturedMultiLang />
      </section>
      <section className="max-w-7xl px-6 lg:px-8 mx-auto w-full">
        <FeaturedFeature />
      </section>
      <section className="max-w-7xl px-6 lg:px-8 mx-auto w-full py-16">
        <TextLeftImageRight
          image="/images/data-storage.svg"
          fullWidthBgImage={false}
          reverse
          scaling="contain"
          bodyCopy={`## Full Online  
Akses dan kelola keuanganmu dari berbagai perangkat—laptop, tablet, atau ponsel—dengan data yang selalu tersinkron secara real-time.  
Tidak perlu khawatir kehilangan data.
            `}
        />
      </section>
    </div>
  )
}
