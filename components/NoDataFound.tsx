import { cn } from '@/lib/utils'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import React from 'react'

interface Props {
  size?: 'xs' | 'sm' | 'md' | 'lg'
}

const NoDataFound = ( { size = 'lg' }: Props ) => {
  const t = useTranslations()

  return (
    <div className="w-full flex-grow flex flex-col gap-6 items-center justify-center">
      <div
        className={cn( 'relative', [
          size === 'xs' && 'w-20 h-20',
          size === 'sm' && 'w-32 h-32',
          size === 'md' && 'w-48 h-48',
          size === 'lg' && 'w-60 h-60',
        ] )}
      >
        <Image
          src="/not-found.svg"
          fill
          sizes="auto"
          alt="Not found image"
          className="object-cover"
          priority
        />
      </div>
      <h2
        className={cn( [
          size === 'xs' && 'text-xs',
          size === 'sm' && 'text-sm',
          size === 'md' && 'text-base',
          size === 'lg' && 'text-lg',
        ] )}
      >
        {t( 'no_data_found' )}
      </h2>
    </div>
  )
}

export default NoDataFound
