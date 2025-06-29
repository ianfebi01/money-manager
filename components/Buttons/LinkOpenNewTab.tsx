'use client'
import { ReactElement } from 'react'
import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'

interface Props {
  url: string
  label: string
  icon: ReactElement
  className?: string
}
const LinkOpenNewTab = ( { url, label, icon, className = '' }: Props ) => {
  return (
    <Link
      href={url}
      className={cn( ['button', 'button-link'], className )}
      rel="noopener noreferrer"
      target="_blank"
    >
      {icon}
      {label}
    </Link>
  )
}

export default LinkOpenNewTab
