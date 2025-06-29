'use client'

import React, { FunctionComponent, useEffect, useMemo, useRef } from 'react'
import {
  useAnimation,
  useInView,
  motion,
  easeOut,
} from 'framer-motion'

interface Props{
	textBg: string
}

const TextBackground: FunctionComponent<Props> = ( { textBg } ) => {

  // Split Text
  const textSplited = useMemo( ()=>{
    const splitBySpaces = textBg?.split( ' ' )
    if( splitBySpaces?.length ){
      return [splitBySpaces[0], textBg?.slice( splitBySpaces[0]?.length + 1 ) ]
    }else return [textBg]

  }, [textBg] )

  const textRef = useRef( null )
  const textView = useInView( textRef, {
    once : true,
  } )

  const textControl = useAnimation()

  useEffect( () => {
    if ( textView ) {
      textControl.start( 'visible' )
    }
  }, [textView] )

  return (
    <div
      ref={textRef}
      className="text-9xl font-bold  w-fit h-fit absolute inset-x-0 mx-auto inset-y-0 my-auto -translate-y-10 sm:-translate-y-24"
    >
      <motion.div
        variants={{
          hidden : {
            opacity : 0,
            y       : 75,
          },
          visible : {
            opacity : 1,
            y       : 0,
          },
        }}
        initial="hidden"
        animate={textControl}
        transition={{
          duration : 0.3,
          delay    : 0.3,
          ease     : easeOut,
        }}
        className="flex flex-col sm:flex-row sm:gap-8 text-center"
      >
        {textSplited?.length ?
          <>
            <h1 className="leading-none m-0">{textSplited[0]}</h1>
            <h1 className="text-orange leading-none">{textSplited[1]}</h1>
          </>
          :
          <h1 className="leading-none m-0">{textSplited[0]}</h1>

        }
				
      </motion.div>
    </div>
  )
}

export default TextBackground
