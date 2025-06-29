'use client'
import React, { FunctionComponent, ReactNode } from 'react'
import Spinner from '../Icons/Spinner'
import { cn } from '@/lib/utils'

interface Props {
  disabled?: boolean | undefined
  children: ReactNode
  onClick?: ( e: React.MouseEvent<HTMLButtonElement, MouseEvent> ) => void
  type?: 'submit' | 'button' | 'reset'
  className?: string
  loading?: boolean
  variant?: 'primary' | 'secondary' | 'icon' | 'iconOnly' | 'link' | 'error'
  ariaLabel?: string
}

const Button2: FunctionComponent<Props> = ( props ) => {
  const {
    disabled,
    children,
    onClick,
    type = 'button',
    className,
    loading,
    variant = 'primary',
    ariaLabel
  } = props

  return (
    <button
      className={cn(
        'button',
        // variant
        [
          variant === 'primary' && ['button-primary'],
          variant === 'error' && ['button-error'],
          variant === 'secondary' && ['button-secondary'],
          variant === 'icon' && ['button-icon'],
          variant === 'iconOnly' && ['button-icon-only'],
          variant === 'link' && ['button-link'],
        ],
        disabled && 'button-disabled',
        className
      )}
      onClick={( e ) => ( onClick ? onClick( e ) : null )}
      type={type}
      disabled={disabled || loading}
      aria-label={ariaLabel}
    >
      {loading ? <Spinner /> : ''}

      {variant === 'iconOnly' && loading ? '' : children}
    </button>
  )
}

export default Button2
