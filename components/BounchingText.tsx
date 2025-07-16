'use client'
import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin( ScrollTrigger )

const BouncingText = ( { text, y }: {text: string, y?: number} ) => {
  const containerRef = useRef( null )
  const charsRef = useRef<HTMLSpanElement[] | null[]>( [] )

  useEffect( () => {
    const ctx = gsap.context( () => {
      gsap.from(
        charsRef.current,
        {
          y             : y || charsRef.current?.[0]?.offsetHeight || 40,
          opacity       : 0,
          ease          : 'back.out(1)',
          stagger       : 0.03,
          duration      : 0.7,
          scrollTrigger : {
            trigger       : containerRef.current,
            start         : 'top 100%',
            toggleActions : 'play none none none',
          },
        }
      )
    }, containerRef )

    return () => ctx.revert()
  }, [] )

  return (
    <span
      ref={containerRef}
    >
      {text.split( '' ).map( ( char, i ) => (
        <span
          key={i}
          ref={( el ) => ( charsRef.current[i] = el )}
          className="inline-block"
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ) )}
    </span>
  )

}

export default BouncingText
