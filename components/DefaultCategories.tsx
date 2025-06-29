import { cn } from '@/lib/utils'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import {
  faBriefcase,
  faBriefcaseMedical,
  faCar,
  faEllipsis,
  faFileInvoice,
  faGift,
  faHouse,
  faMasksTheater,
  faPeopleGroup,
  faShirt,
  faSprayCanSparkles,
  faUserGraduate,
  faUtensils,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useTranslations } from 'next-intl'
import React, { FunctionComponent } from 'react'

type WrapperProps = {
  text: string
  icon?: IconProp
  center?: boolean
}

const Wrapper = ( { text, icon, center = false }: WrapperProps ) => (
  <div
    className={cn( [
      center &&
        'flex flex-wrap md:flex-nowrap gap-2 justify-center items-center w-fit',
      !center && 'flex gap-2 items-center w-fit',
    ] )}
  >
    {!!icon && (
      <div className="w-4 h-4 flex items-center justify-center">
        <FontAwesomeIcon icon={icon}
          className="text-orange"
        />
      </div>
    )}
    <p className="m-0 text-inherit break-all">{text}</p>
  </div>
)

interface Props {
  name: string
  center?: boolean
}

const DefaultCategories: FunctionComponent<Props> = ( { name, center = false } ) => {
  const t = useTranslations( 'mm_categories' )

  switch ( name ) {
  case 'food':
    return (
      <>
        <Wrapper text={t( 'food' )}
          icon={faUtensils}
          center={center}
        />
      </>
    )
  case 'social-life':
    return (
      <>
        <Wrapper text={t( 'social_life' )}
          icon={faPeopleGroup}
          center={center}
        />
      </>
    )
  case 'apparel':
    return (
      <>
        <Wrapper text={t( 'apparel' )}
          icon={faShirt}
          center={center}
        />
      </>
    )
  case 'culture':
    return (
      <>
        <Wrapper text={t( 'culture' )}
          icon={faMasksTheater}
          center={center}
        />
      </>
    )
  case 'beauty':
    return (
      <>
        <Wrapper text={t( 'beauty' )}
          icon={faSprayCanSparkles}
          center={center}
        />
      </>
    )
  case 'health':
    return (
      <>
        <Wrapper text={t( 'health' )}
          icon={faBriefcaseMedical}
          center={center}
        />
      </>
    )
  case 'education':
    return (
      <>
        <Wrapper text={t( 'education' )}
          icon={faUserGraduate}
          center={center}
        />
      </>
    )
  case 'gift':
    return (
      <>
        <Wrapper text={t( 'gift' )}
          icon={faGift}
          center={center}
        />
      </>
    )
  case 'house-hold':
    return (
      <>
        <Wrapper text={t( 'house_hold' )}
          icon={faHouse}
          center={center}
        />
      </>
    )
  case 'work':
    return (
      <>
        <Wrapper text={t( 'work' )}
          icon={faBriefcase}
          center={center}
        />
      </>
    )
  case 'bill-subscription':
    return (
      <>
        <Wrapper text={t( 'bill_subscription' )}
          icon={faFileInvoice}
          center={center}
        />
      </>
    )
  case 'transportation':
    return (
      <>
        <Wrapper text={t( 'transportation' )}
          icon={faCar}
          center={center}
        />
      </>
    )
  case 'other':
    return (
      <>
        <Wrapper text={t( 'other' )}
          icon={faEllipsis}
          center={center}
        />
      </>
    )
  default:
    return (
      <>
        <Wrapper text={name}
          center={center}
        />
      </>
    )
  }
}

export default DefaultCategories
