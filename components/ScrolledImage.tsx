'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin( ScrollTrigger )

const ScrolledImage = () => {
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
        ease       : 'power2.out',
        height     : '100%',
        translateY : 0,
        duration   : 1,
      } )

        .to(
          hRef.current,
          {
            ease       : 'power2.out',
            translateY : 80,
            scale      : 0.5,
            duration   : 1,
            opacity    : 0
          },
          '<'
        )

        .to(
          panel2Ref.current,
          {
            ease       : 'power2.out',
            translateY : 0,
            duration   : 1,
          },
          '<'
        )

        .to(
          panel3Ref.current,
          {
            ease       : 'power2.out',
            translateY : 0,
            duration   : 1,
          },
          '<'
        )

      tl.to(
        panel1ImageRef.current,
        {
          ease     : 'power2.out',
          width    : '1280px',
          height   : '720px',
          duration : 1,
        },
        '<'
      )

        .to( panel1Ref.current, {
          clipPath : 'inset(0% 0% 100% 0%)',
          ease     : 'power2.out',
          duration : 1,
        } )

        .to( panel2Ref.current, {
          clipPath : 'inset(0% 0% 100% 0%)',
          ease     : 'power2.out',
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
        <h2 ref={hRef}
          className="m-0 text-center text-5xl max-w-lg mx-auto mt-12"
        >
          Buat jadi milik anda dan bawa ke mana saja
        </h2>
        {/* Panel 3 - final content */}
        <div
          ref={panel3Ref}
          className="absolute inset-0 z-0 flex items-center justify-center translate-y-20"
        >
          <div className="w-[1024px] h-[576px] overflow-hidden relative flex items-center justify-center bg-yellow-500 text-white text-5xl">
            <h2>Follow me</h2>
          </div>
        </div>

        {/* Panel 2 - smaller frame, same image */}
        <div
          ref={panel2Ref}
          className="absolute inset-0 z-10 flex items-center justify-center h-[576px] my-auto translate-y-20"
          style={{ clipPath : 'inset(0% 0% 0% 0%)' }}
        >
          <div className="w-[1024px] h-[576px] overflow-hidden relative flex items-center justify-center">
            <img
              src="https://www.google.com/chrome/static/images/v2/yours-take-over/theme-arches.webp"
              className="w-[1280px] h-[720px] object-cover object-center"
              alt="Panel 2 Image"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <h2>Follow me</h2>
            </div>
          </div>
        </div>

        {/* Panel 1 - full image */}
        <div
          ref={panel1Ref}
          className="absolute inset-0 z-20 flex items-center justify-center h-[720px] my-auto translate-y-20"
          style={{ clipPath : 'inset(0% 0% 0% 0%)' }}
        >
          <div
            ref={panel1ImageRef}
            className="w-[1024px] h-[576px] overflow-hidden relative flex items-center justify-center"
          >
            <img
              src="https://www.google.com/chrome/static/images/v2/yours-take-over/theme-arches.webp"
              className="w-full h-full object-cover object-center"
              alt="Panel 1 Image"
            />
          </div>
        </div>
      </section>
    </div>
  )
}

export default ScrolledImage
