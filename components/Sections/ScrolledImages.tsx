'use client'

import imageLoader from '@/lib/constans/image-loader'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin( ScrollTrigger )

const ScrolledImages = () => {
  const images = [
    '/images/cashflow.png',
    '/images/transaction-summary-mobile.png',
    '/images/transaction-summary.png',
    '/images/add-transaction-mobile.png',
    '/images/add-transaction.png',
  ]

  const scrollContainerRef = useRef<HTMLDivElement>( null )
  const scrollContentRef = useRef<HTMLDivElement>( null )
  const imagesRef = useRef<HTMLDivElement[] | null[]>( [] )

  useEffect( () => {
    if ( !scrollContainerRef.current || !scrollContentRef.current ) return

    const container = scrollContainerRef.current
    const content = scrollContentRef.current
    const image0 = imagesRef.current?.[0]
    const image1 = imagesRef.current?.[1]
    const image3 = imagesRef.current?.[3]

    const mm = gsap.matchMedia()

    mm.add( '(min-width: 768px)', () => {
      const ctx = gsap.context( () => {
        const tl = gsap.timeline( {
          scrollTrigger : {
            trigger : container,
            start   : 'top 50%',
            end     : 'bottom top',
            scrub   : 1,
            pin     : false,
          },
        } )

        tl.to(
          content,
          {
            x    : -500,
            ease : 'power2.out',
          },
          0
        )

        tl.to(
          image3,
          {
            height   : '400px',
            ease     : 'power2.out',
            duration : 0.3,
          },
          0
        )

        tl.to(
          imagesRef.current,
          {
            height      : '400px',
            marginRight : '32',
            ease        : 'power2.out',
            duration    : 0.3,
          },
          0
        )

        tl.to(
          image1,
          {
            opacity    : '1',
            translateY : 0,
            ease       : 'power2.out',
            duration   : 0.3,
          },
          0
        )

        tl.to(
          image0,
          {
            height   : '400px',
            ease     : 'power2.out',
            duration : 0.3,
          },
          0
        )

        tl.to(
          image0,
          {
            translateX : 0,
            ease       : 'power2.out',
            duration   : 0.3,
          },
          0
        )
      }, scrollContainerRef )

      return () => ctx.revert()
    } )
    mm.add( '(max-width: 767px)', () => {
      const ctx = gsap.context( () => {
        const tl = gsap.timeline( {
          scrollTrigger : {
            trigger : container,
            start   : 'bottom bottom',
            end     : 'bottom top',
            scrub   : 1,
            pin     : false,
          },
        } )

        tl.to(
          content,
          {
            x    : -100,
            ease : 'power2.out',
          },
          0
        )
      }, scrollContainerRef )

      return () => ctx.revert()
    } )

    return () => mm.revert()
  }, [] )

  return (
    <div
      ref={scrollContainerRef}
      className="relative w-full h-[550px] overflow-hidden -translate-y-[112px]"
    >
      <div
        ref={scrollContentRef}
        className="flex flex-row justify-center items-end h-full"
      >
        {images.map( ( item, index ) => (
          <div
            ref={( el ) => ( imagesRef.current[index] = el )}
            key={index}
            className={cn(
              'relative overflow-hidden rounded-xl border bg-dark border-dark-secondary shrink-0 mr-4 md:mr-14',
              index % 2 === 1
                ? 'h-[438px] aspect-[1/2.17]'
                : 'h-[438px] aspect-video hidden md:block',
              ( index === 0 || index === 3 ) && 'md:h-[550px]',
              ( index === 0 ) && 'md:translate-x-[257.83px]',
              ( index === 1 ) && 'md:translate-y-[100px] md:opacity-0',
            )}
            style={{
              zIndex : 5 - index,
            }}
          >
            <Image
              className="h-full object-contain object-center w-full"
              src={item}
              fill
              alt={`Image ${index}`}
              loading="lazy"
              placeholder={imageLoader}
            />
          </div>
        ) )}
        <div
          className={cn(
            'relative overflow-hidden rounded-xl border bg-dark border-dark-secondary shrink-0 mr-4 md:mr-14',
            'h-[438px] aspect-[1/2.17] md:hidden'
          )}
        >
          <Image
            className="h-full object-contain object-center w-full"
            src={'/images/cashflow-mobile.png'}
            fill
            alt={`Image Cashflow Mobile`}
            loading="lazy"
            placeholder={imageLoader}
          />
        </div>
      </div>
    </div>
  )
}

export default ScrolledImages
