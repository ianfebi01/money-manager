'use client'
import React, { FunctionComponent, useEffect, useRef } from 'react'
import { useInView, motion, useAnimation, easeOut } from 'framer-motion'

interface Props{
	openToWork: boolean
}
const TextSide: FunctionComponent<Props> = ( { openToWork } ) => {
  const textRef = useRef( null )
  const textView = useInView( textRef, {
    once : true,
  } )

  const textControl = useAnimation()
  useEffect( () => {
    textControl.start( 'visible' )
  }, [textView] )
	
  return (
    <div
      ref={textRef}
      className="absolute inset-y-0 my-auto h-fit sm:translate-y-28 md:translate-y-8"
    >
      <motion.div
        variants={{
          hidden : {
            opacity : 0,
            y       : 45,
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
          delay    : 0.6,
          ease     : easeOut,
        }}
        className="  invisible  sm:visible flex w-full left-0 gap-2"
      >
        <div className="grow-[1] w-full shrink-[1] ">
          {openToWork &&
					<>
					  <h2 className="text-xl text-orange font-bold">Open to Work</h2>
					  <p className="text-xs font-medium">
								Get in touch for freelance project or fulltime oportunity.
					  </p>
					</>
          }
        </div>
        <div className="grow-[1] w-[275px] shrink-0" />
        <div className=" grow-[1] w-full srink-[1]  ">
          <h2 className="text-xl text-orange font-bold">
            			Front End Web Developer
          </h2>
          <p className="text-xs font-medium">
						Passionate about creating dynamic and intuitive user interfaces.
						Building seamless web experiences with React and Vue. Let&apos;s
						bring your ideas to life!
          </p>
        </div>
      </motion.div>
    </div>
  )
}

export default TextSide
