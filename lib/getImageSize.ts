export type Size = 'xs' | 'sm' | 'md' | 'lg'

const getImageSize = ( url: string, size: Size ) => {
  if ( url.slice( -3 ) === 'svg' ) {
    return url
  } else return imageCompress( url, size )
}
const imageCompress = ( url: string, size: Size ) => {
  switch ( size ) {
  case 'xs':
    return newStr( url, 50 )
  case 'sm':
    return newStr( url, 200 )
  case 'md':
    return newStr( url, 300 )
  case 'lg':
    return newStr( url, 500 )
  default:
    return url
  }
}

const newStr = ( str: string, width: number ) => {
  const reg = /upload/

  return str.replace( reg, `upload/c_scale,w_${width}` )
}

export default getImageSize