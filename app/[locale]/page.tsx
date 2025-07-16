import CallToAction from '@/components/Heroes/CallToAction'
import ScrolledImage from '@/components/ScrolledImage'
import FeaturedFeature from '@/components/Sections/FeaturedFeature'
import ScrolledImages from '@/components/Sections/ScrolledImages'

export default function HomePage() {
  return (
    <div>
      <section className="grow max-w-7xl px-6 lg:px-8 mx-auto w-full">
        <CallToAction />
      </section>
      <section>
        <ScrolledImages />
      </section>
      <section className="hidden md:block grow max-w-7xl px-6 lg:px-8 mx-auto w-full">
        <ScrolledImage />
        <FeaturedFeature/>
      </section>
    </div>
  )
}
