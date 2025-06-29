"use client"
import { cn } from '@/lib/utils';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { usePathname } from 'next/navigation';
import { useRouter } from 'nextjs-toploader/app';
import React, { FunctionComponent } from 'react'

interface Props{
    icon: IconProp
    text: string
    path: string
}
const ButtonSidebar: FunctionComponent<Props> = ( props ) => {
  const { icon, path, text } = props

  const router = useRouter()

  const pathname = usePathname()
	
  return (
    <button
      type="button"
      className={cn(
        'transition-all ease-in-out duration-500 w-full flex items-center p-2 text-base font-normal rounded-lg text-white hover:bg-dark border',
        'bg-none border-white/25 hover:border-transparent',
        [pathname.trim().split( '/' ).slice( 2 ).includes( path.trim().split( '/' ).slice( 2 ).join() ) && 'bg-dark border-transparent cursor-default' ],
        [pathname === path && 'bg-dark border-transparent cursor-default' ]
      )}
      disabled={pathname === path}
      onClick={() => router.push( path )}
    >
      <FontAwesomeIcon icon={icon}
        size="xs"
      />
      <p className="ml-3 line-clamp-1">{text}</p>
    </button>
  )
}

export default ButtonSidebar
