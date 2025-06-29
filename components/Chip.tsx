import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'

interface Props {
  label: string
  bg?: 'dark' | 'dark-secondary'
  className?: string
  link?: string
}
const Chip = ( { label, bg = 'dark', className, link }: Props ) => {
  return (
    <div
      className={cn( [
        'py-1 px-2 border border-none rounded-md w-fit',
        [bg === 'dark' && 'bg-dark'],
        [bg === 'dark-secondary' && 'bg-dark-secondary'],
        className,
      ] )}
    >
      <p className="text-sm-medium m-0">
        <span>{label}</span>
        {!!link && (
          <Link href={link}
            aria-label={label}
            rel='noopener noreferrer'
            target='_blank'
            className='text-orange hover:underline underline-offset-4'
          >
            {link}
          </Link>
        )}
      </p>
    </div>
  )
}

export default Chip
