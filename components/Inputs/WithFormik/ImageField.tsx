'use client'
import { ChangeEvent, useRef } from 'react'
import { useField } from 'formik'
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import readAsBase64 from '@/lib/readAsBase63'
import { cn } from '@/lib/utils'

interface ImageFieldProps {
  name: string
  placeholder?: string
  loading?: boolean
  disabled?: boolean
}

const ImageField = ( { name, placeholder, loading, disabled }: ImageFieldProps ) => {
  const [field, meta, helpers] = useField( name )
  const imageRef = useRef<HTMLInputElement>( null )

  const handleImage = async ( e: ChangeEvent<HTMLInputElement> ) => {
    if ( !e?.target?.files ) return
    const base64 = await readAsBase64( e.target.files[0] )
    helpers.setValue( base64 )
    setTimeout( () => helpers.setTouched( true ) )
  }

  const clearImage = () => helpers.setValue( '' )

  return loading ? (
    <div className="bg-dark-secondary aspect-square w-60 flex items-center justify-center animate-pulse">
      Loading...
    </div>
  ) : (
    <>
      <input
        id={name}
        ref={imageRef}
        type="file"
        placeholder={placeholder}
        className="hidden"
        onChange={handleImage}
        disabled={disabled}
        accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml"
      />
      {field.value ? (
        <div className="aspect-square w-60 relative border border-dashed border-white-overlay hover:border-white transition-default">
          <div className="absolute z-20 right-4 top-4">
            <button
              type="button"
              className="text-white w-6 aspect-square border border-white-overlay-2 hover:border-white-overlay bg-dark-secondary rounded-full"
              onClick={clearImage}
              disabled={disabled}
            >
              <FontAwesomeIcon icon={faXmark} />
            </button>
          </div>
          <Image
            src={field.value as string}
            alt="Preview image"
            fill
            style={{ objectFit : 'contain' }}
            className="z-0"
          />
        </div>
      ) : (
        <button
          type="button"
          className={cn(
            'bg-dark-secondary aspect-square w-60 border border-dashed border-white/25',
            meta.touched && meta.error && 'focus:border-red-500 border-red-500'
          )}
          onClick={() => imageRef.current?.click()}
          disabled={disabled}
        >
          Select Image
        </button>
      )}
    </>
  )
}

export default ImageField