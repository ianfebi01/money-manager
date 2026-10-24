'use client'
import Spinner from '@/components/Icons/Spinner'
import { ITransaction } from '@/types/api/transaction'
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

const EditTransactionModal = dynamic(
  () => import( './EditTransactionModal' ),
  {
    ssr     : false,
    loading : () => (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark/75">
        <Spinner classes="!h-10 !w-10" />
      </div>
    ),
  }
)

interface Props {
  isOpen: boolean
  setIsOpen: ( value: boolean ) => void
  initialValue?: ITransaction
}

const EditTransaction = ( props: Props ) => {
  const [hasOpened, setHasOpened] = useState( false )

  useEffect( () => {
    if ( props.isOpen ) {
      setHasOpened( true )
    }
  }, [props.isOpen] )

  if ( !hasOpened ) return null

  return <EditTransactionModal {...props} />
}

export default EditTransaction
