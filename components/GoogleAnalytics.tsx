import React from 'react'
import Script from 'next/script'

const GoogleAnalytics = () => {
  if ( process.env.NODE_ENV !== 'production' ) return null
  
  return (
    <>
      <Script
        strategy="lazyOnload"
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`}
      />

      <Script id=""
        strategy="lazyOnload"
      >
        {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}', {
              page_path: window.location.pathname,
              });
          `}
      </Script>
    </>
  )
}

export default GoogleAnalytics
