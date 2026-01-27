'use client'
import { faPuzzlePiece } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useRef } from 'react'
import BouncingText from '../BounchingText'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useTranslations } from 'next-intl'

gsap.registerPlugin( ScrollTrigger )

const FeaturedFeature = () => {
  const itemsRef = useRef<HTMLDivElement[] | null[]>( [] )
  const containerRef = useRef<HTMLDivElement | null>( null )
  const t = useTranslations( 'discover_features' )

  useEffect( () => {
    const ctx = gsap.context( () => {
      gsap.to( itemsRef.current, {
        y             : 0,
        opacity       : 1,
        ease          : 'power2.out',
        stagger       : 0.2,
        duration      : 0.75,
        delay         : 0.2,
        scrollTrigger : {
          trigger       : containerRef.current,
          start         : 'top 80%',
          toggleActions : 'play none none none',
        },
      } )
    } )

    return () => ctx.revert()
  }, [] )

  return (
    <div ref={containerRef}>
      <h2 className="m-0 text-center leading-[38px] md:text-4xl md:leading-[55px] max-w-xs md:max-w-sm mx-auto flex flex-col">
        <span>{t( 'line1' )}</span>
        <span>
          {t( 'line2.prefix' )}{' '}
          <span className="text-orange py-2 px-4 bg-orange/10 rounded-full w-fit overflow-hidden inline-flex items-center">
            <FontAwesomeIcon icon={faPuzzlePiece}
              className="mr-4"
            />
            <BouncingText text={t( 'line2.highlight' )} />
          </span>{' '}
          {t( 'line2.suffix' )}
        </span>
      </h2>
      <div className="flex flex-col md:grid md:grid-cols-2 gap-8 mt-12">
        <div
          ref={( el ) => ( itemsRef.current[0] = el )}
          className="bg-dark-secondary flex flex-col justify-between h-full rounded-lg border border-dark-secondary overflow-hidden opacity-0 translate-y-32"
        >
          <div className="p-6">
            <h2>{t( 'chart.title' )}</h2>
            <p className="text-white/80">
              {t( 'chart.description' )}
            </p>
          </div>
          <div className="relative h-64 w-full ml-6">
            <Image
              src="/images/transaction-summary.webp"
              alt="Transaction Summary"
              fill
              className="object-cover object-left-top rounded-tl-lg"
              sizes="(max-width: 768px) 100vw, 50vw"
              quality={70}
              loading="lazy"
            />
          </div>
        </div>
        <div ref={( el ) => ( itemsRef.current[1] = el )}
          className="bg-dark-secondary flex flex-col justify-between h-full rounded-lg border border-dark-secondary overflow-hidden opacity-0 translate-y-32"
        >
          <div className="p-6">
            <h2>{t( 'add_transaction.title' )}</h2>
            <p className="text-white/80">
              {t( 'add_transaction.description' )}
            </p>
          </div>
          <div className="relative h-64 w-full mr-6 -translate-x-6">
            <Image
              src="/images/add-transaction.webp"
              alt="Add Transaction"
              fill
              className="object-cover object-right-bottom rounded-tr-lg"
              sizes="(max-width: 768px) 100vw, 50vw"
              quality={70}
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default FeaturedFeature
