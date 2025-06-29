import { FunctionComponent } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons'
import { Link } from '@/i18n/navigation'
import { Url } from 'next/dist/shared/lib/router/router'

interface Props {
  text: string
  link?: Url
}
const Header: FunctionComponent<Props> = ( props ) => {
  const { text, link } = props

  return (
    <div className="flex flex-row items-center gap-4">
      {link ? (
        <Link
          className="gap-2 flex button button-primary max-md:border-white/25"
          href={link}
        >
          <FontAwesomeIcon icon={faChevronLeft}
            size="xl"
          />
        </Link>
      ) : (
        ''
      )}

      <h1 className="font-semibold m-0">{text}</h1>
    </div>
  )
}

export default Header
