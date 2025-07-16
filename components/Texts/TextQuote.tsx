'use client'
import React, { FunctionComponent, useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin( ScrollTrigger )
interface Props {
  quote: string
}
const TextQuote: FunctionComponent<Props> = ( { quote } ) => {
  const textRef = useRef( null )
  const containerRef = useRef( null )

  useEffect( () => {
    const ctx = gsap.context( () => {
      gsap.to( textRef.current, {
        scale         : 1,
        opacity       : 1,
        ease          : 'back.out(1.5)',
        duration      : 0.5,
        scrollTrigger : {
          trigger       : containerRef.current,
          start         : 'top 100%',
          toggleActions : 'restart none none none',
        },
      } )
    } )

    return () => ctx.revert()
  }, [] )

  return (
    <div ref={containerRef}>
      <p
        ref={textRef}
        className="text-base md:text-2xl font-medium text-center opacity-0 scale-0"
      >
        {quote}
      </p>
    </div>
  )
}

export default TextQuote
