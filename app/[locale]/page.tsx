import BouncingText from '@/components/BounchingText'
import CallToAction from '@/components/Heroes/CallToAction'
import ScrolledImage from '@/components/ScrolledImage'
import ScrolledImages from '@/components/Sections/ScrolledImages'

export default function HomePage() {
  return (
    <div>
      <section className="grow max-w-7xl px-6 lg:px-8 mx-auto w-full">
        <CallToAction />
      </section>
      <ScrolledImages />
      <section className="grow max-w-7xl px-6 lg:px-8 mx-auto w-full">
        <ScrolledImage />
        <BouncingText text="huhah" />
      </section>
    </div>
  )
}
