import CallToAction from '@/components/Heroes/CallToAction'
import FeaturedFeature from '@/components/Sections/FeaturedFeature'
import ScrolledImages from '@/components/Sections/ScrolledImages'
import FeaturedMultiLang from '@/components/Sections/FeaturedMultiLang'
import TextLeftImageRight from '@/components/TextLeftImageRight'

export default function HomePage() {
  return (
    <div>
      <section className="grow max-w-7xl px-6 lg:px-8 mx-auto w-full min-h-[70vh] flex items-center justify-center">
        <CallToAction />
      </section>
      <section>
        <ScrolledImages />
      </section>
      <section className="hidden md:block grow max-w-7xl px-6 lg:px-8 mx-auto w-full">
        <FeaturedMultiLang />
        <FeaturedFeature />
        <div className="py-16">
          <TextLeftImageRight
            image="/images/data-storage.svg"
            fullWidthBgImage={false}
            reverse
            scaling='contain'
            bodyCopy={`## Full Online  
Akses dan kelola keuanganmu dari berbagai perangkat—laptop, tablet, atau ponsel—dengan data yang selalu tersinkron secara real-time.  
Tidak perlu khawatir kehilangan data.
            `}
          />
        </div>
      </section>
    </div>
  )
}
