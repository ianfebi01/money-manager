import { Dialog, Transition } from '@headlessui/react'
import React, { Fragment, FunctionComponent, ReactNode } from 'react'
import Button from '@/components/Buttons/Button'
import { cn } from '@/lib/utils'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWarning } from '@fortawesome/free-solid-svg-icons'
import ClientPortal from '../Layouts/ClientPortal'
import { useTranslations } from 'next-intl'

interface Props {
  isOpen: boolean
  setIsOpen: ( value: boolean ) => void
  title: string
  desciption?: string
  children?: ReactNode
  onConfirm: () => void
  onCancel?: () => void
  confirmText?: string
  cancelText?: string
  loading?: boolean
  border?: boolean
  variant?: 'warning' | 'normal' | 'fullscreen'
}
const Modal: FunctionComponent<Props> = ( props ) => {
  const t = useTranslations()
  const {
    isOpen,
    setIsOpen,
    title,
    desciption,
    children,
    onConfirm,
    confirmText = 'Save',
    cancelText = t( 'cancel' ),
    onCancel,
    loading,
    border = true,
    variant = 'normal',
  } = props

  const handleCancel = () => {
    if ( onCancel !== undefined ) {
      onCancel()
    } else {
      setIsOpen( false )
    }
  }

  function closeModal() {
    setIsOpen( false )
  }

  return (
    <ClientPortal selector="myportal"
      show
    >
      <Transition appear
        show={isOpen}
        as={Fragment}
      >
        <Dialog as="div"
          className="relative z-50"
          onClose={closeModal}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed z-10 inset-y-0 my-auto inset-x-0 mx-auto w-full bg-dark/75  flex items-center justify-center" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto z-10">
            <div
              className={cn(
                'flex min-h-full items-center justify-center text-center',
                'py-4 px-4',
                [variant === 'fullscreen' && 'px-0 py-0']
              )}
            >
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-75 translate-y-40"
                enterTo="opacity-100 scale-100 translate-y-0"
                leave="ease-out duration-300"
                leaveFrom="opacity-100 scale-100 translate-y-0"
                leaveTo="opacity-0 scale-95 translate-y-40"
              >
                <Dialog.Panel
                  className={cn(
                    'inset-x-0 inset-y-0 m-auto max-w-2xl w-full max-h-[600px] flex flex-col bg-dark shadow-2xl border border-none rounded-lg overflow-hidden',
                    [variant === 'warning' && 'max-w-sm'],
                    [
                      variant === 'fullscreen' &&
                        'max-w-[unset] max-h-[unset] h-screen',
                    ]
                  )}
                >
                  {title && variant !== 'warning' ? (
                    <Dialog.Title
                      className={cn(
                        `px-4 pt-4 text-xl text-left max-w-7xl mx-auto w-full`,
                        [
                          !desciption && [
                            border && 'border-b-[1px] border-white/25 pb-4',
                          ],
                        ]
                      )}
                    >
                      {title}
                    </Dialog.Title>
                  ) : (
                    ''
                  )}
                  {desciption && variant !== 'warning' ? (
                    <Dialog.Description
                      className={cn( 'px-4 pb-4 max-w-7xl mx-auto w-full', [
                        border && 'border-b-[1px] border-white/25',
                      ] )}
                    >
                      {desciption}
                    </Dialog.Description>
                  ) : (
                    ''
                  )}
                  <div
                    className={cn(
                      'p-4 overflow-auto max-w-7xl mx-auto w-full',
                      [
                        border &&
                          variant !== 'warning' &&
                          'border-b-[1px] border-white/25',
                        !border && 'pb-0',
                        variant === 'warning' && 'pb-0',
                        variant === 'fullscreen' && 'grow',
                      ]
                    )}
                  >
                    {variant === 'warning' ? (
                      <div className="flex gap-4">
                        <div className="text-red-500 w-10 h-10 mt-1 flex items-center justify-center border border-red-500 rounded-full">
                          <FontAwesomeIcon icon={faWarning}
                            size="xl"
                          />
                        </div>
                        <div>
                          <h2 className="text-xl">{title}</h2>
                          <p>{desciption}</p>
                        </div>
                      </div>
                    ) : (
                      children
                    )}
                  </div>
                  <div
                    className={cn(
                      'p-4 flex justify-end gap-2 max-w-7xl mx-auto w-full'
                    )}
                  >
                    <Button
                      type="button"
                      onClick={handleCancel}
                      disabled={loading}
                    >
                      {cancelText}
                    </Button>

                    <Button
                      type="button"
                      className={cn(
                        variant !== 'warning' && 'bg-dark-secondary'
                      )}
                      variant={variant === 'warning' ? 'error' : 'primary'}
                      loading={loading}
                      disabled={loading}
                      onClick={() => onConfirm()}
                    >
                      {confirmText}
                    </Button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </ClientPortal>
  )
}

export default Modal
