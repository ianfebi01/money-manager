import React, { FunctionComponent } from 'react'
import Button from '@/components/Buttons/Button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPen } from '@fortawesome/free-solid-svg-icons'

type Props = {
  loading?: boolean
  disabled?: boolean
  onClick?: () => void
}
const EditButton: FunctionComponent<Props> = ( props ) => {
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
      <FontAwesomeIcon icon={faPen}
        size="sm"
      />
    </Button>
  )
}

export default EditButton
