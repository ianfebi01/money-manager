'use client'
import React, { FunctionComponent, useEffect, useRef } from 'react'
import { motion, useAnimation, useInView } from 'framer-motion'

interface Props{
	quote: string
}
const TextQuote: FunctionComponent<Props> = ( { quote } ) => {
  const textRef = useRef( null )
  const isInView = useInView( textRef, {
    once : true,
  } )

  const textControll = useAnimation()

  useEffect( () => {
    if ( isInView ) {
      textControll.start( 'visible' )
    }
  }, [isInView] )

  return (
    <div ref={textRef}>
      <motion.p
        variants={{
          hidden : {
            opacity : 0,
            scale   : 0,
          },
          visible : {
            opacity : 1,
            scale   : 1,
          },
        }}
        initial="hidden"
        transition={{
          type   : 'spring',
          bounce : 0.5,
        }}
        animate={textControll}
        className="text-base md:text-2xl font-medium text-center"
      >
        {quote}
      </motion.p>
    </div>
  )
}

export default TextQuote
