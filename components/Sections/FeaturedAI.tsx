'use client'

import { faWandMagicSparkles, faRotateRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useRef } from 'react'
import BouncingText from '../BounchingText'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useTranslations } from 'next-intl'

gsap.registerPlugin( ScrollTrigger )

const FeaturedAI = () => {
  const containerRef = useRef<HTMLDivElement | null>( null )
  const cardRef = useRef<HTMLDivElement | null>( null )
  const sparklesRef = useRef<HTMLDivElement[] | null[]>( [] )
  const t = useTranslations( 'featured_ai' )

  useEffect( () => {
    const ctx = gsap.context( () => {
      // Animate the main card
      gsap.to( cardRef.current, {
        y             : 0,
        opacity       : 1,
        ease          : 'power2.out',
        duration      : 0.75,
        delay         : 0.2,
        scrollTrigger : {
          trigger       : containerRef.current,
          start         : 'top 80%',
          toggleActions : 'play none none none',
        },
      } )

      // Animate floating sparkles
      sparklesRef.current.forEach( ( sparkle, index ) => {
        if ( sparkle ) {
          gsap.to( sparkle, {
            y        : -10,
            duration : 1.5 + index * 0.3,
            ease     : 'power1.inOut',
            repeat   : -1,
            yoyo     : true,
            delay    : index * 0.2,
          } )
        }
      } )
    } )

    return () => ctx.revert()
  }, [] )

  return (
    <div ref={containerRef}>
      <h2 className="m-0 text-center leading-[38px] md:text-4xl md:leading-[55px] max-w-xs md:max-w-xl mx-auto flex flex-col">
        <span>{t( 'line1' )}</span>
        <span>
          {t( 'line2.prefix' )}{' '}
          <span className="text-orange py-2 px-4 bg-orange/10 rounded-full w-fit overflow-hidden inline-flex items-center">
            <FontAwesomeIcon icon={faWandMagicSparkles}
              className="mr-4"
            />
            <BouncingText text={t( 'line2.highlight' )} />
          </span>{' '}
          {t( 'line2.suffix' )}
        </span>
      </h2>

      <div
        ref={cardRef}
        className="mt-12 relative opacity-0 translate-y-32"
      >
        {/* Floating sparkles decoration */}
        <div
          ref={( el ) => ( sparklesRef.current[0] = el )}
          className="absolute -top-4 left-[10%] text-orange/40 hidden md:block"
        >
          <FontAwesomeIcon icon={faWandMagicSparkles}
            className="w-6 h-6"
          />
        </div>
        <div
          ref={( el ) => ( sparklesRef.current[1] = el )}
          className="absolute -top-8 right-[15%] text-orange/30 hidden md:block"
        >
          <FontAwesomeIcon icon={faWandMagicSparkles}
            className="w-4 h-4"
          />
        </div>
        <div
          ref={( el ) => ( sparklesRef.current[2] = el )}
          className="absolute top-1/3 -right-4 text-orange/20 hidden md:block"
        >
          <FontAwesomeIcon icon={faWandMagicSparkles}
            className="w-5 h-5"
          />
        </div>

        {/* Main card */}
        <div className="bg-dark-secondary rounded-xl border border-white-overlay-2 overflow-hidden">
          {/* Header section */}
          <div className="p-6 md:p-8 border-b border-white-overlay-2">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-orange/10 flex items-center justify-center">
                <FontAwesomeIcon
                  icon={faWandMagicSparkles}
                  className="text-orange w-5 h-5"
                />
              </div>
              <div>
                <h3 className="text-xl md:text-2xl font-semibold text-white m-0">
                  {t( 'title' )}
                </h3>
                <p className="text-white/70 mt-2 text-base md:text-lg">
                  {t( 'description' )}
                </p>
              </div>
            </div>
          </div>

          {/* Feature highlights */}
          <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white-overlay-2">
            <div className="p-6 md:p-8">
              <div className="text-orange font-semibold text-sm uppercase tracking-wide mb-2">
                {t( 'feature1.label' )}
              </div>
              <p className="text-white/80 text-sm">
                {t( 'feature1.description' )}
              </p>
            </div>
            <div className="p-6 md:p-8">
              <div className="text-orange font-semibold text-sm uppercase tracking-wide mb-2">
                {t( 'feature2.label' )}
              </div>
              <p className="text-white/80 text-sm">
                {t( 'feature2.description' )}
              </p>
            </div>
            <div className="p-6 md:p-8">
              <div className="text-orange font-semibold text-sm uppercase tracking-wide mb-2">
                {t( 'feature3.label' )}
              </div>
              <p className="text-white/80 text-sm">
                {t( 'feature3.description' )}
              </p>
            </div>
          </div>

          {/* AI Insights Preview - Coded UI */}
          <div className="relative border-t border-white-overlay-2 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-t from-dark via-transparent to-transparent pointer-events-none z-10" />
            <div className="p-6 md:p-8 bg-dark/50">
              {/* Preview Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon
                    icon={faWandMagicSparkles}
                    className="text-orange w-4 h-4"
                  />
                  <span className="text-lg font-semibold text-white">
                    {t( 'preview.title' )}
                  </span>
                </div>
                <button className="text-sm text-white/60 flex items-center gap-1 cursor-default">
                  <FontAwesomeIcon icon={faRotateRight}
                    className="w-3 h-3"
                  />
                  {t( 'preview.regenerate' )}
                </button>
              </div>

              {/* Preview Content */}
              <div className="space-y-4">
                <div>
                  <h4 className="text-base font-semibold text-white mb-2">
                    {t( 'preview.summary_title' )}
                  </h4>
                  <p className="text-white/70 text-sm leading-relaxed">
                    {t( 'preview.summary_text_1' )}{' '}
                    <span className="text-orange font-medium">Rp 13.331.037</span>
                    {' '}{t( 'preview.summary_text_2' )}{' '}
                    <span className="text-orange font-medium">Rp 2.000.820</span>.
                    {' '}{t( 'preview.summary_text_3' )}{' '}
                    <span className="text-orange font-medium">Rp 11.330.217</span>.
                  </p>
                </div>

                <div>
                  <h4 className="text-base font-semibold text-white mb-2">
                    {t( 'preview.spending_title' )}
                  </h4>
                  <ul className="text-white/70 text-sm space-y-1">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-orange" />
                      <span className="text-white/80">{t( 'preview.category_household' )}:</span>
                      <span className="text-orange">Rp 330.783</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-orange/80" />
                      <span className="text-white/80">{t( 'preview.category_health' )}:</span>
                      <span className="text-orange">Rp 196.016</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-orange/60" />
                      <span className="text-white/80">{t( 'preview.category_beauty' )}:</span>
                      <span className="text-orange">Rp 176.386</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-orange/40" />
                      <span className="text-white/80">{t( 'preview.category_social' )}:</span>
                      <span className="text-orange">Rp 167.706</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FeaturedAI
