import React from 'react'
import { Toaster } from 'react-hot-toast'

const Toast = () => {
  return (
    <Toaster
      toastOptions={{
        position  : 'top-right',
        className : 'bg-white text-dark text-md',
        style     : {
          boxShadow : '0px 4px 10px rgba(0, 0, 0, 0.1)',
          height    : '44px',
        },
      }}
    />
  )
}

export default Toast
