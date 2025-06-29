'use client'
import parseMd from '@/utils/parseMd'
import sanitize from '@/utils/sanitize'
import truncate from '@/utils/truncate'
import { useRef } from 'react';
import 'highlight.js/styles/atom-one-dark.css'

interface Props {
  content: string
  excerpt?: number
}

const Markdown = ( { content, excerpt }: Props ) => {
  const bodyCopyRef = useRef<HTMLDivElement>( null )

  return (
    <div ref={bodyCopyRef}
      className="body-copy w-full"
    >
      {!excerpt && !!content ? (
        <div
          dangerouslySetInnerHTML={{
            __html : sanitize( parseMd( content ), 'richtext' ),
          }}
        ></div>
      ) : !!content ? (
        <div
          dangerouslySetInnerHTML={{
            __html : truncate( sanitize( parseMd( content ), 'richtext' ), excerpt ),
          }}
        ></div>
      ) : (
        ''
      )}
    </div>
  )
}

export default Markdown
