import { faDashboard, faWallet } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import Logout from '../Logout'
import NavigationLink from '@/components/Buttons/NavigationLink'

const MoneyManagerNavbar = () => {
  return (
    <div className="flex items-center gap-8 h-16">
      <div className="grow" />
      <NavigationLink
        href={'/dashboard'}
        className="flex items-center gap-2 no-underline text-white opacity-50"
        activeClass="opacity-100"
      >
        <FontAwesomeIcon icon={faDashboard}
          className="text-orange"
          size="xl"
        />
        <span className="p m-0">Summary</span>
      </NavigationLink>
      <NavigationLink
        href={'/dashboard/cash-flow'}
        className="flex items-center gap-2 no-underline text-white opacity-50"
        activeClass="opacity-100"
      >
        <FontAwesomeIcon icon={faWallet}
          size="xl"
          className="text-orange"
        />
        <span className="p m-0">Cashflow</span>
      </NavigationLink>
      <div className="grow" />
      <Logout />
    </div>
  )
}

export default MoneyManagerNavbar
