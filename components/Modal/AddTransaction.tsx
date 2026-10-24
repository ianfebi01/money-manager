'use client'
import Button from '@/components/Buttons/Button'
import Spinner from '@/components/Icons/Spinner'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useTranslations } from 'next-intl'
import dynamic from 'next/dynamic'
import { useState } from 'react'

const AddTransactionModal = dynamic(
  () => import( './AddTransactionModal' ),
  {
    ssr     : false,
    loading : () => (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark/75">
        <Spinner classes="!h-10 !w-10" />
      </div>
    ),
  }
)

const AddTransaction = () => {
  const t = useTranslations()
  const [isOpen, setIsOpen] = useState<boolean>( false )
  const [hasOpened, setHasOpened] = useState<boolean>( false )

  const handleOpen = () => {
    setIsOpen( true )
    setHasOpened( true )
  }

  return (
    <div className="w-fit">
      <Button
        type="button"
        variant="secondary"
        className="gap-2 flex"
        onClick={handleOpen}
      >
        <FontAwesomeIcon icon={faPlus} />
        {t( 'add_transaction' )}
      </Button>
      {hasOpened && (
        <AddTransactionModal
          isOpen={isOpen}
          setIsOpen={setIsOpen}
        />
      )}
    </div>
  )
}

export default AddTransaction
