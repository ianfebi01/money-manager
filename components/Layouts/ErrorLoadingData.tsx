import { cn } from '@/lib/utils'
import Image from 'next/image'

interface Props {
  size?: 'xs' | 'sm' | 'md' | 'lg'
}

const ErrorLoadingData = ( { size = 'lg' }: Props ) => {
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
          src="/error.svg"
          fill
          sizes="auto"
          alt="Not found image"
          className="object-cover"
          priority
        />
      </div>

      <h2
        className={cn( 'mb-4', [
          size === 'xs' && 'text-xs',
          size === 'sm' && 'text-sm',
          size === 'md' && 'text-base',
          size === 'lg' && 'text-lg',
        ] )}
      >
        Failed to load data...
      </h2>
    </div>
  )
}

export default ErrorLoadingData
