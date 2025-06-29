'use client'
import Image from 'next/image'
import React, { FunctionComponent, useEffect, useRef } from 'react'
import { useAnimation, useInView, motion, easeInOut } from 'framer-motion'

type Props = {
	image: string
}
const PersonImage: FunctionComponent<Props> = ( { image } ) => {
  const personImageRef = useRef( null )
  const personImageView = useInView( personImageRef, {
    once : false,
  } )
  const personImageControl = useAnimation()

  useEffect( () => {
    if ( personImageView === true ) {
      personImageControl.start( 'visible' )
    }
  }, [personImageView] )
	
  return (
    <div
      ref={personImageRef}
      className="absolute bottom-0 mx-auto inset-x-0 w-fit"
    >
      <motion.div
        variants={{
          hidden : {
            opacity : 0,
            y       : 391,
          },
          visible : {
            opacity : 1,
            y       : 0,
          },
        }}
        initial="hidden"
        animate={personImageControl}
        transition={{
          duration : 0.5,
          ease     : easeInOut,
        }}
        className='w-[261px] h-[391px] relative'

      >
        <Image src={image}
          alt="Profile image"
          fill
          priority
          className='relative'
          sizes='auto'
        />
      </motion.div>
    </div>
  )
}

export default PersonImage
