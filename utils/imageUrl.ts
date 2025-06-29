import { PluginUploadFile } from '@/types/generated/contentTypes'

const imageUrl = (
  imageObj: PluginUploadFile,
  imageSize: 'thumbnail' | 'small' | 'medium' | 'large' | 'xlarge' | 'original' = 'original'
): string | undefined => {
  if (
    imageObj?.attributes?.mime === 'image/svg+xml' ||
    /^video/.test( imageObj?.attributes?.mime )
  ) {
    return `${imageObj?.attributes?.url}`
  }

  let scaledImage: { url: string } = { url : '' }

  switch ( imageSize ) {
  case 'thumbnail':
    scaledImage =
        imageObj?.attributes?.formats?.thumbnail ||
        imageObj?.attributes ||
        imageObj
    break
  case 'small':
    scaledImage =
        imageObj?.attributes?.formats?.small || imageObj?.attributes || imageObj
    break
  case 'medium':
    scaledImage =
        imageObj?.attributes?.formats?.medium || imageObj?.attributes || imageObj
    break
  case 'large':
    scaledImage =
        imageObj?.attributes?.formats?.large || imageObj?.attributes || imageObj
    break
  case 'xlarge':
    scaledImage =
        imageObj?.attributes?.formats?.xlarge || imageObj?.attributes || imageObj
    break
  default:
    scaledImage = imageObj?.attributes || imageObj || scaledImage
  }

  const { url } = scaledImage

  return url ? `${url}` : undefined
}

export default imageUrl
