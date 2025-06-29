'use client'

import React, { useEffect, useRef, useState } from 'react'

interface MyPosYProps {
  myposy?: number
  winheight?: number
}

const SectionProvider = ( {
  children,
}: {
  children: React.ReactElement<MyPosYProps>[] | React.ReactElement<MyPosYProps>
} ) => {
  const [myPosY, setMyPosY] = useState<number>( 0 )
  const [winHeight, setWinHeight] = useState<number>( 0 )

  const sectionRef = useRef<HTMLDivElement>( null )

  useEffect( () => {
    // Add event listener when component mounts
    setWinHeight( window.innerHeight )
    window.addEventListener( 'scroll', handleScroll )

    // Cleanup function to remove event listener
    return () => {
      window.removeEventListener( 'scroll', handleScroll )
    }
  }, [] )

  function handleScroll() {
    if ( sectionRef.current ) {
      const { top } = sectionRef.current?.getBoundingClientRect() as DOMRect
      setMyPosY( top )
    }
  }

  return (
    <div ref={sectionRef}>
      {React.Children.map( children, ( child ) => {
        if ( React.isValidElement( child ) ) {
          return React.cloneElement( child, {
            myposy    : myPosY,
            winheight : winHeight,
          } ) // Passing myPosY to React child components
        }

        return child
      } )}
    </div>
  )
}

export default SectionProvider
