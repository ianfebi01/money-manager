'use client'
import toast from 'react-hot-toast'
import Button2 from '../Buttons/Button2'
import CopyIcon from '../Icons/CopyIcon'

type Props = {
  copyText: string
  className?: string
  size?: number
}
const CopyToClipboard = ( { copyText, className = '', size = 16 }: Props ) => {
  // This is the function we wrote earlier
  async function copyTextToClipboard( text: string ) {
    if ( 'clipboard' in navigator ) {
      return await navigator.clipboard.writeText( text )
    } else {
      return document.execCommand( 'copy', true, text )
    }
  }

  // onClick handler function for the copy button
  const handleCopyClick = () => {
    // Asynchronously call copyTextToClipboard
    copyTextToClipboard( copyText )
      .then( () => {
        toast.success( 'Successfully copy text!' )
      } )
      .catch( () => {} )
  }

  return (
    <div className="flex flex-row gap-2 items-center">
      <p className={className}>{copyText}</p>
      {/* Bind our handler function to the onClick button property */}
      <Button2 variant="iconOnly"
        ariaLabel='Copy to clipboard button'
        onClick={handleCopyClick}
      >
        <CopyIcon size={size} />
      </Button2>
    </div>
  )
}

export default CopyToClipboard
