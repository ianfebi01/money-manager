'use client'
import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin( ScrollTrigger )

const BouncingText = ( { text }: {text: string} ) => {
  const containerRef = useRef( null )
  const charsRef = useRef<HTMLSpanElement[] | null[]>( [] )

  useEffect( () => {
    const ctx = gsap.context( () => {
      gsap.fromTo(
        charsRef.current,
        {
          y       : charsRef.current?.[0]?.offsetHeight || 40,
          opacity : 0,
        },
        {
          y             : 0,
          opacity       : 1,
          ease          : 'back.out(1)',
          stagger       : 0.05,
          duration      : 0.5,
          scrollTrigger : {
            trigger       : containerRef.current,
            start         : 'top 80%',
            toggleActions : 'play none none none'
          },
        }
      )
    }, containerRef )

    return () => ctx.revert()
  }, [] )

  return (
    <div
      ref={containerRef}
      className="flex flex-wrap"
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
    </div>
  )

}

export default BouncingText
