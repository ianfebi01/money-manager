'use client'

import { ReactNode } from 'react'
import { ReactLenis } from 'lenis/react'

// Smooths the browser's native scroll instead of translating a fixed container,
// so the document keeps its normal flow: the header stays clickable and the
// footer is laid out after the content from the first paint.
const SmoothScroll = ( { children }: { children: ReactNode } ) => {
  return (
    <ReactLenis
      root
      options={{ lerp : 0.1, smoothWheel : true }}
    >
      {children}
    </ReactLenis>
  )
}

export default SmoothScroll
