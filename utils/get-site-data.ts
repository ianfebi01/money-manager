import { fetchAPI } from './fetch-api'

export async function getSiteData( lang: string ) {
  const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN

  const path = `/site`
  const urlParamsObject = {
    populate : {
      name : {
        populate : '*'
      },
      description : {
        populate : '*'
      },
      logo : {
        populate : '*'
      },
      favicon : {
        populate : '*'
      },
      socials : {
        populate : '*'
      },
      mainNavMenu : {
        populate : {
          navItems : {
            populate : '*'
          },
          navItem : {
            populate : '*'
          }
        }
      },
      footerNavMenu : {
        populate : '*'
      }
    },
    locale : lang,
  }
  const options = { headers : { Authorization : `Bearer ${token}` } }

  return await fetchAPI( path, urlParamsObject, options )
}
