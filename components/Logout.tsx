'use client'
import { useRemoveUserData } from '@/lib/hooks/api/auth'
import { faSignOut } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'

const Logout = () => {
  const logout = useRemoveUserData()
  const onLogout = () => {
    logout()
  }

  return (
    <button className="flex items-center gap-2 no-underline"
      aria-label='Signout'
      onClick={onLogout}
    >
      <FontAwesomeIcon icon={faSignOut}
        className="text-orange"
        size="xl"
      />
    </button>
  )
}

export default Logout
