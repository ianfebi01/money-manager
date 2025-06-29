'use client'
import { cn } from '@/lib/utils'
import React, { FunctionComponent } from 'react'
import Spinner from '../Icons/Spinner'

interface Props {
  children: React.ReactNode
  variant?: 'link' | 'normal' | 'icon'
  onClick?: () => void
  className?: string
  theme?: 'dark' | 'light'
  loading?: boolean
  disabled?: boolean
}

const Button: FunctionComponent<Props> = ( props ) => {
  const {
    children,
    variant = 'normal',
    onClick = () => null,
    className,
    theme = 'dark',
    loading = false,
    disabled = false
  } = props

  return (
    <button
      className={cn(
        `transition-all duration-300 ease-linear filter hover:brightness-90 relative`,
        // VAriant
        [
          [theme === 'dark' && [
            variant === 'link' && 'bg-none text-white py-0 px-2.5',
            variant === 'normal' && 'py-2 px-2.5 bg-white-overlay text-white',
            variant === 'icon' && 'bg-white-overlay text-white w-8 aspect-square',
          ]],
          [theme === 'light' && [
            variant === 'link' && 'bg-none text-dark py-0 px-2.5',
            variant === 'normal' && 'bg-dark-secondary text-white py-2 px-2.5',
            variant === 'icon' && 'bg-dark-secondary text-white w-8 aspect-square',
          ]],

        ],
        className
      )}
      style={{
        borderRadius : 99999,
      }}
      disabled={loading || disabled}
      onClick={( e )=>{
        e.stopPropagation()
        onClick()
      }}
    >
      {loading ? <Spinner/> : ''}
			
      {variant === 'icon' && loading ? '' : children}
    </button>
  )
}

export default Button
