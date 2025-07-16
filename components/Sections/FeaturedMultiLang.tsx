'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGlobe } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image'
import BouncingText from '../BounchingText'

gsap.registerPlugin( ScrollTrigger )

const FeaturedMultiLang = () => {
  const sectionRef = useRef<HTMLDivElement>( null )
  const panel1Ref = useRef<HTMLDivElement>( null )
  const panel1ImageRef = useRef<HTMLDivElement>( null )
  const panel2Ref = useRef<HTMLDivElement>( null )
  const panel3Ref = useRef<HTMLDivElement>( null )
  const hRef = useRef<HTMLDivElement>( null )

  useEffect( () => {
    const ctx = gsap.context( () => {
      const tl = gsap.timeline( {
        scrollTrigger : {
          trigger       : sectionRef.current,
          start         : 'top top',
          end           : 'bottom top',
          scrub         : 1,
          pin           : true,
          anticipatePin : 1,
        },
      } )

      // Curtain up panel 1
      tl.to( panel1Ref.current, {
        ease       : 'none',
        height     : '100%',
        translateY : 0,
        duration   : 1,
      } )

        .to(
          hRef.current,
          {
            ease       : 'none',
            translateY : 80,
            scale      : 0.5,
            duration   : 1,
            opacity    : 0,
          },
          '<'
        )

        .to(
          panel2Ref.current,
          {
            ease       : 'none',
            translateY : 0,
            duration   : 1,
          },
          '<'
        )

        .to(
          panel3Ref.current,
          {
            ease       : 'none',
            translateY : 0,
            duration   : 1,
          },
          '<'
        )

      tl.to(
        panel1ImageRef.current,
        {
          ease     : 'none',
          width    : '1280px',
          height   : '720px',
          duration : 1,
        },
        '<'
      )

        .to( panel1Ref.current, {
          clipPath : 'inset(0% 0% 100% 0%)',
          ease     : 'none',
          duration : 1,
        } )

        .to( panel2Ref.current, {
          clipPath : 'inset(0% 0% 100% 0%)',
          ease     : 'none',
          duration : 1,
        } )
    }, sectionRef )

    return () => ctx.revert()
  }, [] )

  return (
    <div className="overflow-hidden">
      <section
        ref={sectionRef}
        className="relative h-screen w-full overflow-hidden "
      >
        <h2
          ref={hRef}
          className="m-0 text-center leading-[38px] md:text-4xl md:leading-[55px] max-w-xs md:max-w-sm mx-auto flex flex-col"
        >
          <span>Gunakan aplikasi</span>
          <span>
            dalam
            {' '}
            <span className="text-blue-400 py-2 px-4 bg-blue-400/10 rounded-full w-fit overflow-hidden">
              <FontAwesomeIcon icon={faGlobe}
                className="mr-4"
              />
              <BouncingText text="bahasa" />
            </span>
            yang anda inginkan
          </span>
        </h2>
        {/* Panel 3 - final content */}
        <div
          ref={panel3Ref}
          className="absolute inset-0 z-0 flex items-center justify-center translate-y-32"
        >
          <div className="w-[1024px] h-[576px] overflow-hidden relative flex items-center justify-center rounded-lg border border-dark-secondary">
            <Image
              src="/images/add-transaction-mba.png"
              alt="Panel 2 Image"
              fill
              className="object-cover object-center"
              priority // optional
            />
          </div>
        </div>

        {/* Panel 2 - smaller frame, same image */}
        <div
          ref={panel2Ref}
          className="absolute inset-0 z-10 flex items-center justify-center h-[576px] my-auto translate-y-32"
          style={{ clipPath : 'inset(0% 0% 0% 0%)' }}
        >
          <div className="w-[1024px] h-[576px] overflow-hidden relative flex items-center justify-center rounded-lg border border-dark-secondary">
            <div className="relative w-[1280px] h-[720px]">
              <Image
                src="/images/scrolled-section/transaction-summary-en.png"
                alt="Panel 2 Image"
                fill
                className="object-cover object-center"
                priority // optional: loads image ASAP
              />
            </div>
          </div>
        </div>

        {/* Panel 1 - full image */}
        <div
          ref={panel1Ref}
          className="absolute inset-0 z-20 flex items-center justify-center h-[720px] my-auto translate-y-32"
          style={{ clipPath : 'inset(0% 0% 0% 0%)' }}
        >
          <div
            ref={panel1ImageRef}
            className="w-[1024px] h-[576px] overflow-hidden relative flex items-center justify-center rounded-lg border border-dark-secondary"
          >
            <Image
              src="/images/scrolled-section/transaction-summary-id.png"
              alt="Panel 1 Image"
              fill
              className="object-cover object-center w-full h-full"
            />
          </div>
        </div>
      </section>
    </div>
  )
}

export default FeaturedMultiLang
