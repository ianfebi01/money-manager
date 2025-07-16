'use client'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import React, { useEffect, useRef } from 'react'
import Markdown from './Parsers/Markdown'
import imageLoader from '@/lib/constans/image-loader'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin( ScrollTrigger )

interface Button {
  url: string
  name: string
  newTab?: boolean
}

interface Props {
  image: string
  fullWidthBgImage?: boolean
  reverse?: boolean
  bgColour?: string
  fullWidth?: boolean
  buttons?: Button[]
  accordian?: Array<any>
  bodyCopy: string
  biggerColumn?: 'image' | 'content'
  buttonsVariation?: 'primary' | 'secondary'
  scaling?: 'cover' | 'contain'
}

const TextLeftImageRight: React.FC<Props> = ( {
  image,
  fullWidthBgImage = false,
  reverse,
  bgColour,
  fullWidth,
  buttons,
  accordian = [],
  bodyCopy,
  biggerColumn = '',
  buttonsVariation,
  scaling = 'cover',
} ) => {
  const containerRef = useRef<HTMLDivElement | null>( null )
  const itemsRef = useRef<HTMLDivElement[] | null[]>( [] )

  useEffect( () => {
    const ctx = gsap.context( () => {
      const tl = gsap.timeline( {
        scrollTrigger : {
          trigger : containerRef.current,
          start   : 'top 100%',

          toggleActions : 'play none none none',
        },
      } )

      tl.to( itemsRef.current[0], {
        ease       : 'power2.out',
        translateX : 0,
        duration   : 1,
        opacity    : 1,
        delay      : 0.2,
      } )

      tl.to(
        itemsRef.current[1],
        {
          ease       : 'power2.out',
          translateX : 0,
          duration   : 1,
          opacity    : 1,
          delay      : 0.2,
        },
        '<'
      )
    } )

    return () => ctx.revert()
  }, [] )

  return (
    <div ref={containerRef}
      className="relative overflow-x-clip"
    >
      <div
        className={cn(
          'bg-cover bg-center bg-no-repeat flex flex-col lg:flex-row gap-8 min-h-[564.14px]',
          {
            relative                                : !fullWidth,
            'max-w-7xl mx-auto px-6 lg:px-8 w-full' : true,
            'lg:flex-row-reverse'                   : reverse,
          }
        )}
        style={{
          background : fullWidthBgImage ? `url(${image})` : '',
        }}
      >
        <div
          ref={( el ) => ( itemsRef.current[0] = el )}
          className={cn( 'flex items-center', {
            'md:basis-[calc(50%-1rem)]' :
              !fullWidthBgImage && !['image', 'content'].includes( biggerColumn ),
            'md:basis-[calc(40%-1rem)] xl:basis-[calc(40%+2rem)]' :
              !fullWidthBgImage && biggerColumn === 'image',
            'md:basis-[calc(60%-1rem)]' :
              !fullWidthBgImage && biggerColumn === 'content',
            'basis-full'      : fullWidthBgImage,
            'lg:pr-8'         : !reverse,
            'lg:pl-8'         : reverse,
            // Transition
            '-translate-x-16' : !reverse,
            'translate-x-16'  : reverse,
            'opacity-0'       : true,
          } )}
        >
          <div
            className={cn( 'mx-auto lg:mx-0', {
              'max-w-2xl py-10' : !fullWidthBgImage,
              'pb-10 pt-10 sm:pb-10 lg:pb-24 lg:pt-24 max-w-3xl' :
                fullWidthBgImage,
            } )}
          >
            <div className="body-copy">
              {/* Assuming you have a Markdown component */}
              <Markdown content={bodyCopy} />
            </div>
            {!!buttons && buttons?.length > 0 && (
              <div className="flex items-center gap-4 justify-center lg:justify-start mt-2 flex-wrap">
                {buttons.map( ( button, index ) => (
                  <a
                    key={index}
                    className={cn( {
                      'button-primary button-primary-blue-dark' :
                        buttonsVariation === 'primary' &&
                        bgColour !== 'blue-dark',
                      'button-primary button-primary-red' :
                        buttonsVariation === 'secondary' ||
                        bgColour === 'blue-dark',
                    } )}
                    href={button.url}
                    target={button.newTab ? '_blank' : undefined}
                    rel={button.newTab ? 'noopener noreferrer' : undefined}
                  >
                    <span className="arrow-button arrow-button-forward">
                      {button.name}
                    </span>
                  </a>
                ) )}
              </div>
            )}
          </div>
        </div>

        {!fullWidthBgImage && (
          <div
            ref={( el ) => ( itemsRef.current[1] = el )}
            className={cn( {
              'md:basis-[calc(50%-1rem)] lg:aspect-[1/0.7]' :
                !['image', 'content'].includes( biggerColumn ) && !fullWidth,
              'md:basis-[calc(60%-1rem)] xl:basis-[calc(60%-4rem)]' :
                biggerColumn === 'image' && !fullWidth,
              'md:basis-[calc(40%-1rem)]' :
                biggerColumn === 'content' && !fullWidth,
              'lg:absolute right-0 lg:w-[calc(58%)] xxl:w-[calc(55%)] h-full' :
                biggerColumn === 'image' && fullWidth,
              'lg:absolute right-0 lg:w-[calc(38%)] xxl:w-[calc(45%)]  h-full' :
                biggerColumn === 'content' && fullWidth,
              'flex flex-col gap-8' : accordian?.length,
              'max-h-[796px]'       : !accordian?.length,
              // Transition
              'translate-x-16'      : !reverse,
              '-translate-x-16'     : reverse,
              'opacity-0'           : true,
            } )}
          >
            <div className="relative w-full h-full">
              <div className="aspect-square md:aspect-video lg:aspect-[1/0.7] lg:h-full lg:w-full overflow-hidden relative z-[1]">
                <Image
                  loading="lazy"
                  src={image || ''}
                  alt="Image Content"
                  placeholder={imageLoader}
                  className={cn( {
                    'object-cover'                        : scaling === 'cover',
                    'object-contain'                      : scaling === 'contain',
                    'object-right'                        : !reverse && scaling === 'contain',
                    'object-left'                         : reverse && scaling === 'contain',
                    'aspect-auto h-full w-full md:hidden' : true,
                  } )}
                  fill
                />
                <Image
                  loading="lazy"
                  src={image || ''}
                  alt="Image Content"
                  placeholder={imageLoader}
                  className={cn( {
                    'object-cover'                             : scaling === 'cover',
                    'object-contain'                           : scaling === 'contain',
                    'object-right'                             : !reverse && scaling === 'contain',
                    'object-left'                              : reverse && scaling === 'contain',
                    'aspect-auto h-full w-ful hidden md:block' : true,
                  } )}
                  fill
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default TextLeftImageRight
