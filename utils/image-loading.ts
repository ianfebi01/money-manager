const imageLoading = (): `data:image/${string}` => {
  const shimmer = () => `
<svg style="transform: scale(0.2);" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><radialGradient id="a8" cx=".66" fx=".66" cy=".3125" fy=".3125" gradientTransform="scale(1.5)"><stop offset="0" stop-color="#FFFFFF"></stop><stop offset=".3" stop-color="#FFFFFF" stop-opacity=".9"></stop><stop offset=".6" stop-color="#FFFFFF" stop-opacity=".6"></stop><stop offset=".8" stop-color="#FFFFFF" stop-opacity=".3"></stop><stop offset="1" stop-color="#FFFFFF" stop-opacity="0"></stop></radialGradient><circle transform-origin="center" fill="none" stroke="url(#a8)" stroke-width="15" stroke-linecap="round" stroke-dasharray="200 1000" stroke-dashoffset="0" cx="100" cy="100" r="70"><animateTransform type="rotate" attributeName="transform" calcMode="spline" dur="2" values="360;0" keyTimes="0;1" keySplines="0 0 1 1" repeatCount="indefinite"></animateTransform></circle><circle transform-origin="center" fill="none" opacity=".2" stroke="#FFFFFF" stroke-width="15" stroke-linecap="round" cx="100" cy="100" r="70"></circle></svg>`

  const toBase64 = ( str: string ) =>
    typeof window === 'undefined'
      ? Buffer.from( str ).toString( 'base64' )
      : window.btoa( str )

  return `data:image/svg+xml;base64,${toBase64( shimmer() )}`
}

export default imageLoading
