import React from 'react'
import { Toaster } from 'react-hot-toast'

const Toast = () => {
  return (
    <Toaster
      toastOptions={{
        position  : 'top-right',
        className : 'bg-dark-secondary text-dark text-md',
        style     : {
          boxShadow  : '0px 4px 10px rgba(0, 0, 0, 0.1)',
          height     : '44px',
          background : '#393939',
          color      : '#fff',
        },
        success : {
          style : {
            background : '#393939',
            color      : '#fff',
          },
        },
        error : {
          style : {
            background : 'red',
            color      : '#fff',
          },
        },
      }}
    />
  )
}

export default Toast
