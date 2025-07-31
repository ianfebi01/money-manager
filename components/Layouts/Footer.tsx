'use client'
import LinkOpenNewTab from '@/components/Buttons/LinkOpenNewTab'
import InstagramIcon from '@/components/Icons/InstagramIcon'
import LinkedinIcon from '@/components/Icons/LinkedinIcon'
import CopyToClipboard from '@/components/Inputs/CopyToClipboard'
import { Link } from '@/i18n/navigation'
import Image from 'next/image'

const Footer = () => {
  return (
    <section
      id="footer"
      className="main__section h-fit bg-dark overflow-hidden"
    >
      <div className="main__container my-8 md:my-16 h-full">
        <div className="w-fit mx-auto mb-4">
          <Link href={'/'}
            className="flex items-center no-underline gap-2"
          >
            <Image
              src="/logo-no-bg.svg"
              alt="Logo image"
              width={33}
              height={24}
              priority
            />
            <span className="text-base m-0 font-medium text-white-overlay translate-y-1">
              Money Manager
            </span>
          </Link>
        </div>

        <div className="text-lg flex gap-4 text-center w-full justify-center items-center flex-wrap">
          <LinkOpenNewTab
            url={'https://www.instagram.com/ianfebi01/'}
            label={'Instagram'}
            className="text-md"
            icon={<InstagramIcon size={20} />}
          />
          •
          <LinkOpenNewTab
            url={'https://www.linkedin.com/in/ian-febi-sastrataruna-895598149/'}
            label={'LinkedIn'}
            className="text-md"
            icon={<LinkedinIcon size={20} />}
          />
          •
          <div className=" flex flex-row items-center gap-2">
            <CopyToClipboard
              copyText="ianfebi01@gmail.com"
              className="text-md"
            />
          </div>
        </div>
        <Link href={'/privacy-policy'}
          className="gap-2 flex justify-center text-base m-0 font-medium text-white/80 no-underline hover:text-white-overlay transition-default"
        >
          Privacy Policy
        </Link>
      </div>
    </section>
  )
}

export default Footer
