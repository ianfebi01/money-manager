'use client'

import TextQuote from '@/components/Texts/TextQuote'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import { FunctionComponent, useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin( ScrollTrigger )

interface Props {
  quote: string
}

const Quote: FunctionComponent<Props> = ( { quote } ) => {
  const bgRef = useRef<HTMLDivElement>( null )
  const containerRef = useRef<HTMLDivElement>( null )

  useEffect( () => {
    const ctx = gsap.context( () => {
      if ( bgRef.current && containerRef.current ) {
        gsap.fromTo(
          bgRef.current,
          { y : -100 },
          {
            y             : 100,
            ease          : 'power2.out',
            scrollTrigger : {
              trigger : containerRef.current,
              start   : 'top bottom',
              end     : 'bottom top',
              scrub   : 1,
            },
          }
        )
      }
    }, containerRef )

    return () => ctx.revert()
  }, [] )

  return (
    <div
      ref={containerRef}
      className={cn(
        'bg-dark h-full border border-none rounded-3xl flex justify-center items-center p-4 md:p-10 relative overflow-hidden'
      )}
    >
      <div
        ref={bgRef}
        className="bg-plus absolute top-0 left-0 w-full h-full bg-contain bg-center z-0"
      />
      <div className="h-fit p-8 md:p-14 relative z-10">
        <Image
          src="/quote.svg"
          alt="Quote icon"
          className="absolute top-0 left-0 w-8 h-8 md:w-[52px] md:h-[52px]"
          width={0}
          height={0}
          priority
        />
        <div className="max-w-2xl">
          <TextQuote quote={quote} />
        </div>
        <Image
          src="/quote.svg"
          className="absolute bottom-0 right-0 w-8 h-8 md:w-[52px] md:h-[52px]"
          width={0}
          height={0}
          alt="Quote icon"
          priority
        />
      </div>
    </div>
  )
}

export default Quote
