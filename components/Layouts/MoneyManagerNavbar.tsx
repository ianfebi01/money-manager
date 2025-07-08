'use client'
import { faDashboard, faWallet } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import Logout from '../Logout'
import NavigationLink from '@/components/Buttons/NavigationLink'
import LocaleSwitcher from './LocaleSwitcher'
import { useSession } from 'next-auth/react'
import Login from '../Login'

const MoneyManagerNavbar = () => {
  const { status } = useSession()

  return (
    <div className="flex items-center gap-8 h-16">
      {status === 'authenticated' && (
        <>
          <NavigationLink
            href={'/dashboard'}
            className="flex items-center gap-2 no-underline text-white opacity-50"
            activeClass="opacity-100"
          >
            <FontAwesomeIcon
              icon={faDashboard}
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
            <FontAwesomeIcon
              icon={faWallet}
              size="xl"
              className="text-orange"
            />
            <span className="p m-0">Cashflow</span>
          </NavigationLink>
          <div className="grow" />
          <LocaleSwitcher />
          <Logout />
        </>
      )}

      {status === 'unauthenticated' && (
        <>
          <div className='grow'/>
          <Login />
        </>
      )}
    </div>
  )
}

export default MoneyManagerNavbar
