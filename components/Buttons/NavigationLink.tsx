'use client'

import { ComponentProps, ReactNode } from 'react'
import { Link, usePathname } from '@/i18n/navigation'
import { cn } from '@/lib/utils'

interface Props extends ComponentProps<typeof Link> {
  activeClass?: string
  children?: ReactNode
}
export default function NavigationLink( {
  href,
  activeClass,
  className,
  children,
  ...rest
}: Props ) {
  const pathname = usePathname()
  const isActive = pathname === href

  return (
    <Link
      aria-current={isActive ? 'page' : undefined}
      href={href}
      className={cn( [className, isActive && activeClass] )}
      {...rest}
    >
      {children}
    </Link>
  )
}
