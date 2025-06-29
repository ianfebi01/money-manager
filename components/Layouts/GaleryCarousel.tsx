'use client'
import React from 'react'

// Swiper components, modules and styles
import { Autoplay, Navigation, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import imageUrl from '@/utils/imageUrl'
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faChevronLeft,
  faChevronRight,
  faCircleChevronLeft,
  faCircleChevronRight,
} from '@fortawesome/free-solid-svg-icons'
import Markdown from '../Parsers/Markdown'
import imageLoader from '@/lib/constans/image-loader'
import { PluginUploadFile } from '@/types/generated/contentTypes'

interface Props {
  data: PluginUploadFile[]
}

const GaleryCarousel: React.FC<Props> = ( { data } ) => {
  return (
    <ul className="w-full !m-0 relative">
      <Swiper
        navigation={{
          prevEl : `.btn-prev`,
          nextEl : `.btn-next`,
        }}
        pagination={{
          clickable          : true,
          el                 : `.paginationEL`,
          dynamicBullets     : true,
          dynamicMainBullets : 1,
        }}
        autoHeight
        slidesPerView={1}
        centeredSlides
        centerInsufficientSlides
        lazyPreloadPrevNext={2}
        loop={false}
        mousewheel
        speed={500}
        simulateTouch
        threshold={1}
        modules={[Autoplay, Navigation, Pagination]}
      >
        {data.map( ( item, index: number ) => (
          <SwiperSlide key={index}>
            <div className="h-full flex flex-col">
              <div className="relative aspect-video  overflow-hidden mb-8 bg-white">
                <Image
                  alt={`Image ${index}`}
                  src={imageUrl( item, 'original' ) || ''}
                  fill
                  style={{
                    objectFit : 'contain',
                  }}
                  loading={index === 0 ? 'eager' : 'lazy'}
                  sizes="auto"
                  placeholder={imageLoader}
                  className="drop-shadow-2xl"
                />
              </div>
              {!!item?.attributes?.caption && (
                <div className="grow flex text-center w-full mx-auto max-w-3xl">
                  <Markdown content={item?.attributes?.caption} />
                </div>
              )}
            </div>
          </SwiperSlide>
        ) )}
      </Swiper>
      <div className="aspect-video absolute w-full top-0 hidden min-[1156px]:block">
        <button className="btn-prev absolute left-2 lg:left-4 inset-y-0 my-auto z-30 text-white/75 hover:text-white/90 transition-default disabled:opacity-0 h-fit drop-shadow-20-0.5">
          <FontAwesomeIcon icon={faCircleChevronLeft}
            size="2xl"
          />
        </button>
        <button className="btn-next absolute right-2 lg:right-4 inset-y-0 my-auto z-30 text-white/75 hover:text-white/90 transition-default disabled:opacity-0 h-fit drop-shadow-20-0.5">
          <FontAwesomeIcon icon={faCircleChevronRight}
            size="2xl"
          />
        </button>
      </div>
      <div className="aspect-video absolute w-full top-0">
        <div className="flex flex-row gap-2 items-center justify-center h-[44px] mx-auto inset-x-0 z-30 absolute top-full">
          <button className="btn-prev size-6 text-white/90 min-[1156px]:hidden">
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
          <div className="paginationEL leading-none !translate-x-0"></div>
          <button className="btn-next size-6 text-white/90 min-[1156px]:hidden">
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
        </div>
      </div>
    </ul>
  )
}

export default GaleryCarousel
