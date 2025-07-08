'use client'
import { faSignIn } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import NavigationLink from './Buttons/NavigationLink'

const Login = () => {

  return (
    <NavigationLink
      href={'/login'}
      className="flex items-center gap-2 no-underline"
      activeClass="opacity-100"
      aria-label='Signin'
    >
      <FontAwesomeIcon icon={faSignIn}
        className="text-orange"
        size="xl"
      />
    </NavigationLink>
  )
}

export default Login
