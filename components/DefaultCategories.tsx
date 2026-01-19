'use client'

import { cn } from '@/lib/utils'
import React, { FunctionComponent } from 'react'
import { useTranslations } from 'next-intl'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

// Base icons you already had
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

// New icons for income categories
import {
  faCoins,
  faHandHoldingDollar,
  faPercent,
  faChartLine,
  faLaptopCode,
} from '@fortawesome/free-solid-svg-icons'

/** ----------------------------------------------------------------
 *  Seed data (serializable): keep icon as a string key
 *  so this can live in DB or JSON safely.
 *  ---------------------------------------------------------------- */
export const defaultCategories: {
  name: string
  type: 'expense' | 'income'
  icon: string
}[] = [
  // Expense
  { name : 'food', type : 'expense', icon : 'faUtensils' },
  { name : 'social-life', type : 'expense', icon : 'faPeopleGroup' },
  { name : 'apparel', type : 'expense', icon : 'faShirt' },
  { name : 'culture', type : 'expense', icon : 'faMasksTheater' },
  { name : 'beauty', type : 'expense', icon : 'faSprayCanSparkles' },
  { name : 'health', type : 'expense', icon : 'faBriefcaseMedical' },
  { name : 'education', type : 'expense', icon : 'faUserGraduate' },
  { name : 'gift', type : 'expense', icon : 'faGift' },
  { name : 'bill-subscription', type : 'expense', icon : 'faFileInvoice' },
  { name : 'house-hold', type : 'expense', icon : 'faHouse' },
  { name : 'transportation', type : 'expense', icon : 'faCar' },
  { name : 'other', type : 'expense', icon : 'faEllipsis' },

  // Income
  { name : 'work', type : 'income', icon : 'faBriefcase' },
  { name : 'freelance', type : 'income', icon : 'faLaptopCode' },
  { name : 'bonus', type : 'income', icon : 'faCoins' },
  { name : 'gift-income', type : 'income', icon : 'faHandHoldingDollar' },
  { name : 'interest', type : 'income', icon : 'faPercent' },
  { name : 'investment', type : 'income', icon : 'faChartLine' },
  { name : 'other', type : 'income', icon : 'faEllipsis' },
]

/** ----------------------------------------------------------------
 *  Runtime icon resolver: map string -> actual FA icon object
 *  ---------------------------------------------------------------- */
export const categoryIconMap: Record<string, IconProp> = {
  // Expense
  faUtensils,
  faPeopleGroup,
  faShirt,
  faMasksTheater,
  faSprayCanSparkles,
  faBriefcaseMedical,
  faUserGraduate,
  faGift,
  faFileInvoice,
  faHouse,
  faCar,
  faEllipsis,

  // Income
  faBriefcase,
  faLaptopCode,
  faCoins,
  faHandHoldingDollar,
  faPercent,
  faChartLine,
}

/** Small presentational wrapper */
type WrapperProps = {
  text: string
  icon?: IconProp
  center?: boolean
}

const Wrapper = ( { text, icon, center = false }: WrapperProps ) => (
  <div
    className={cn( [
      center &&
        'flex flex-col md:flex-row flex-wrap md:flex-nowrap gap-2 justify-center items-center w-fit',
      !center && 'flex gap-2 items-center w-fit',
      'shrink-0',
    ] )}
  >
    {!!icon && (
      <div className="w-4 h-4 flex items-center justify-center">
        <FontAwesomeIcon icon={icon}
          className="text-orange"
        />
      </div>
    )}
    <span className="m-0 text-inherit break-all line-clamp-1">{text}</span>
  </div>
)

interface Props {
  name: string
  center?: boolean
}

/** ----------------------------------------------------------------
 *  Main renderer: uses your existing switch with translations
 *  Keys follow your previous convention:
 *   - 'social_life', 'house_hold', 'bill_subscription', 'gift_income'
 *  ---------------------------------------------------------------- */
const DefaultCategories: FunctionComponent<Props> = ( {
  name,
  center = false,
} ) => {
  const t = useTranslations( 'mm_categories' )

  switch ( name ) {
  // Expense
  case 'food':
    return <Wrapper text={t( 'food' )}
      icon={faUtensils}
      center={center}
    />

  case 'social-life':
    return (
      <Wrapper text={t( 'social-life' )}
        icon={faPeopleGroup}
        center={center}
      />
    )

  case 'apparel':
    return <Wrapper text={t( 'apparel' )}
      icon={faShirt}
      center={center}
    />

  case 'culture':
    return (
      <Wrapper text={t( 'culture' )}
        icon={faMasksTheater}
        center={center}
      />
    )

  case 'beauty':
    return (
      <Wrapper text={t( 'beauty' )}
        icon={faSprayCanSparkles}
        center={center}
      />
    )

  case 'health':
    return (
      <Wrapper text={t( 'health' )}
        icon={faBriefcaseMedical}
        center={center}
      />
    )

  case 'education':
    return (
      <Wrapper text={t( 'education' )}
        icon={faUserGraduate}
        center={center}
      />
    )

  case 'gift':
    return <Wrapper text={t( 'gift' )}
      icon={faGift}
      center={center}
    />

  case 'bill-subscription':
    return (
      <Wrapper
        text={t( 'bill-subscription' )}
        icon={faFileInvoice}
        center={center}
      />
    )

  case 'house-hold':
    return <Wrapper text={t( 'house-hold' )}
      icon={faHouse}
      center={center}
    />

  case 'transportation':
    return <Wrapper text={t( 'transportation' )}
      icon={faCar}
      center={center}
    />

    // Income
  case 'work':
    return <Wrapper text={t( 'work' )}
      icon={faBriefcase}
      center={center}
    />

  case 'freelance':
    return (
      <Wrapper text={t( 'freelance' )}
        icon={faLaptopCode}
        center={center}
      />
    )

  case 'bonus':
    return <Wrapper text={t( 'bonus' )}
      icon={faCoins}
      center={center}
    />

  case 'gift-income':
    return (
      <Wrapper
        text={t( 'gift-income' )}
        icon={faHandHoldingDollar}
        center={center}
      />
    )

  case 'interest':
    return <Wrapper text={t( 'interest' )}
      icon={faPercent}
      center={center}
    />

  case 'investment':
    return (
      <Wrapper text={t( 'investment' )}
        icon={faChartLine}
        center={center}
      />
    )

  case 'other':
    return <Wrapper text={t( 'other' )}
      icon={faEllipsis}
      center={center}
    />

  default:
    // Fallback shows raw name with no lookup
    return <Wrapper text={name}
      center={center}
    />
  }
}

export default DefaultCategories
