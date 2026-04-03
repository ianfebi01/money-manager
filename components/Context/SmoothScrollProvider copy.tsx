'use client'

import React, { useEffect, useRef, useState } from 'react'
import 'lenis/dist/lenis.css'
import { ReactLenis, useLenis } from 'lenis/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin( ScrollTrigger )

export default function SmoothScrollProvider( {
  children,
}: {
  children: React.ReactNode
} ) {
  const lenisRef = useRef<any>( null )
  const [isMobile, setIsMobile] = useState( false )

  useEffect( () => {
    const checkMobile = () => setIsMobile( window.innerWidth < 768 )
    checkMobile()
    window.addEventListener( 'resize', checkMobile )
    
    return () => window.removeEventListener( 'resize', checkMobile )
  }, [] )

  useEffect( () => {
    function update( time: number ) {
      // gsap ticker gives time in seconds, let's multiply by 1000 to get ms.
      lenisRef.current?.lenis?.raf( time * 1000 )
    }

    gsap.ticker.add( update )
    gsap.ticker.lagSmoothing( 0 )

    return () => {
      gsap.ticker.remove( update )
    }
  }, [] )

  useLenis( ScrollTrigger.update )

  return (
    <ReactLenis
      root
      ref={lenisRef}
      autoRaf={false}
      options={{
        syncTouch          : true,
        touchMultiplier    : isMobile ? 1 : 1.2,
        wheelMultiplier    : 1,
        duration           : isMobile ? 1.4 : 1.2,
        easing             : ( t ) => Math.min( 1, 1.001 - Math.pow( 2, -10 * t ) ),
        orientation        : 'vertical',
        gestureOrientation : 'vertical',
        smoothWheel        : true,
      }}
    >
      {children}
    </ReactLenis>
  )
}
