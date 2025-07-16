import Image from 'next/image'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSignIn } from '@fortawesome/free-solid-svg-icons'
import NavigationLink from '../Buttons/NavigationLink'
import { useTranslations } from 'next-intl'

const CallToAction = () => {
  const t = useTranslations()
  
  return (
    <div className="flex flex-col justify-center items-center py-16 gap-7">
      <Link href={'/'}>
        <Image
          src="/logo-no-bg.svg"
          alt="Logo image"
          width={79}
          height={79}
          priority
        />
      </Link>
      <h1 className="text-[4rem] leading-[4.5rem] text-white text-center max-w-xl m-0">
        {t( 'home_cta' )}
      </h1>
      <NavigationLink
        href={'/login'}
        className="flex items-center gap-2 no-underline border border-white/25 hover:bg-dark-secondary py-2 px-4 text-base hover:shadow-2xl  transition-default rounded-lg"
        activeClass="opacity-100"
        aria-label="Signin"
      >
        <FontAwesomeIcon
          icon={faSignIn}
          className="text-orange mr-2"
          size="lg"
        />
        <span>{t( 'signin' )}</span>
      </NavigationLink>
      <p className='max-w-lg text-center m-0'>
        {t( 'home_description' )}
      </p>
    </div>
  )
}

export default CallToAction
