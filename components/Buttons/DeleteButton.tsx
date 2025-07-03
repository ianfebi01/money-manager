import React, { FunctionComponent } from 'react'
import Button from '@/components/Buttons/Button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'

type Props = {
  loading?: boolean
  disabled?: boolean
  onClick?: () => void
}
const DeleteButton: FunctionComponent<Props> = ( props ) => {
  const { loading = false, disabled = false, onClick } = props

  const handleOnClick = () =>{
    if ( onClick === undefined ) return
    onClick()
  }

  return (
    <Button
      type="button"
      loading={loading}
      disabled={disabled}
      variant="iconOnly"
      onClick={() => handleOnClick()}
    >
      <FontAwesomeIcon icon={faTrash}
        size="sm"
      />
    </Button>
  )
}

export default DeleteButton
