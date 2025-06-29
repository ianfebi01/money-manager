import { cn } from '@/lib/utils'
import Image from 'next/image'
import React from 'react';
import Markdown from './Parsers/Markdown'
import imageUrl from '@/utils/imageUrl'
import { PluginUploadFile } from '@/types/generated/contentTypes'
import imageLoader from '@/lib/constans/image-loader'

interface Button {
  url: string
  name: string
  newTab?: boolean
}

interface Props {
  image: { data: PluginUploadFile }
  fullWidthBgImage: boolean
  reverse: boolean
  bgColour: string
  fullWidth: boolean
  buttons: Button[]
  accordian?: Array<any>
  bodyCopy: string
  biggerColumn?: 'image' | 'content'
  buttonsVariation: 'primary' | 'secondary'
  scaling: 'cover' | 'contain'
}

const TextLeftImageRight: React.FC<Props> = ( {
  image,
  fullWidthBgImage,
  reverse,
  bgColour,
  fullWidth,
  buttons,
  accordian = [],
  bodyCopy,
  biggerColumn = '',
  buttonsVariation,
  scaling,
} ) => {

  return (
    <div className="relative overflow-x-clip">
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
          background : fullWidthBgImage ? `url(${imageUrl})` : '',
        }}
      >
        <div
          className={cn( 'flex items-center', {
            'md:basis-[calc(50%-1rem)]' :
              !fullWidthBgImage && !['image', 'content'].includes( biggerColumn ),
            'md:basis-[calc(40%-1rem)] xl:basis-[calc(40%+2rem)]' :
              !fullWidthBgImage && biggerColumn === 'image',
            'md:basis-[calc(60%-1rem)]' :
              !fullWidthBgImage && biggerColumn === 'content',
            'basis-full' : fullWidthBgImage,
            'lg:pr-8'    : !reverse,
            'lg:pl-8'    : reverse,
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
            {buttons?.length > 0 && (
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
            } )}
          >
            <div className="relative w-full h-full">
              <div className="aspect-square md:aspect-video lg:aspect-[1/0.7] lg:h-full lg:w-full overflow-hidden relative z-[1]">
                <Image
                  loading="lazy"
                  src={imageUrl( image.data, 'small' ) || ''}
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
                  src={imageUrl( image.data, 'xlarge' ) || ''}
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
