'use client'
import { useScroll, useTransform, motion } from 'framer-motion'
import { ReactNode, useRef } from 'react'

interface Props {
  children: ReactNode
  position?: 'top' | 'center' | 'end'
}
const ParalaxProvider = ( { children, position = 'top' }: Props ) => {
  const ref = useRef( null )
  const { scrollYProgress } = useScroll( {
    target : ref,
    offset :
      position === 'top'
        ? ['start start', 'end start']
        : position === 'end'
          ? ['end end', 'start end']
          : ['end end', 'start end'],
  } )

  const y = useTransform(
    scrollYProgress,
    position === 'top' ? [0, 1] : position === 'end' ? [1, 0] : [1, 0],
    position === 'top' ? [0, 50] : position === 'end' ? [-50, 0] : [-50, 0]
  )
  //   const scale = useTransform( scrollYProgress, [0, 1], ['100%', '105%'] )
  const opacity = useTransform( scrollYProgress, [0, 1], [1, 0.2] )

  return (
    <div className="overflow-hidden w-full"
      ref={ref}
    >
      <motion.div
        style={{
          x       : 0,
          y       : y,
          opacity : opacity,
        }}
      >
        {children}
      </motion.div>
    </div>
  )
}

export default ParalaxProvider
