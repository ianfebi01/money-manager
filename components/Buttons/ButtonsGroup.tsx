import React from 'react'
import { cn } from '@/lib/utils'
import { ArraysLinks } from '@/types/generated/components'
import { Link } from '@/i18n/navigation'

interface ButtonGroupProps {
  buttons?: ArraysLinks['attributes'][]
}

const ButtonGroup: React.FC<ButtonGroupProps> = ( { buttons = [] } ) => {
  if ( !buttons.length ) return null

  return (
    <div className="flex items-center gap-4 justify-center lg:justify-start mt-2 flex-wrap">
      {buttons.map( ( button, index ) => (
        <Link
          key={index}
          className={cn( 'button button-primary' )}
          href={button.link}
          target={button.newTab ? '_blank' : undefined}
          rel={button.newTab ? 'noopener noreferrer' : undefined}
        >
          {button.title}
        </Link>
      ) )}
    </div>
  )
}

export default ButtonGroup
