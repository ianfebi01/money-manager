'use client' // Error components must be Client Components

import Button from '@/components/Buttons/Button'
import Image from 'next/image'

export default function Error( { reset }: { reset: () => void } ) {
  return (
    <html lang="en">
      <body>
        <div className="h-screen flex flex-col items-center justify-center relative">
          <div className="absolute container w-full h-full z-10">
            <Image
              src="/shape.svg"
              fill
              sizes="auto"
              alt="Error image"
              className="object-contain"
            />
          </div>
          <article className=" max-w-xl flex flex-col items-center justify-center text-center p-4 border rounded-lg border-none relative z-20">
            <div className="relative w-60 h-60">
              <Image
                src="/error.svg"
                fill
                sizes="auto"
                alt="Error image"
                className="object-cover"
                priority
              />
            </div>

            <h2 className="text-xl mb-4">Something went wrong!</h2>
            <Button
              onClick={
                // Attempt to recover by trying to re-render the segment
                () => reset()
              }
            >
              Try again
            </Button>
          </article>
        </div>
      </body>
    </html>
  )
}
