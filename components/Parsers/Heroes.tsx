import componentResolver from '@/utils/component-resolver'

interface Props {
    banners: any
//   banners: Attribute.DynamicZone<
//     [
//       'banner-components.banner-standard',
//       'banner-components.carousel',
//       'banner-components.profile-banner'
//     ]
//   > &
//     Attribute.SetPluginOptions<{
//       i18n: {
//         localized: true
//       }
//     }> &
//     Attribute.SetMinMax<
//       {
//         max: 1
//       },
//       number
//     >
}

const Heroes = ( { banners }: Props ) => {
  return banners.map( ( banner: any, index: number ) => componentResolver( banner, index ) )
}

export default Heroes
