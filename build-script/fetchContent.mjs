import { $fetch } from 'ohmyfetch'

// const { NEXT_PUBLIC_STRAPI_API_URL } = process.env
// const BASE_URL = `${NEXT_PUBLIC_STRAPI_API_URL}/api`
const BASE_URL = `https://content.ianfebisastrataruna.my.id/api`

export let locales = [
  {
    code : 'en',
    url  : 'https://www.ianfebisastrataruna.my.id',
  },
]

export const fetchContent = async ( def, locale, fields = ['slug'] ) => {
  let allSlugs = []

  try {
    // Fetch the first page to get pagination details
    let url = `/${def.apiPath}?locale=${locale.code}&pagination[pageSize]=100`

    fields.forEach( ( field, index ) => {
      url += `&fields[${index}]=${field}`
    } )

    const initialResponse = await $fetch( url, {
      parseResponse : JSON.parse,
      baseURL       : BASE_URL,
    } )

    // Helper function to fetch a specific page
    const fetchPage = async ( page ) => {
      let url = `/${def.apiPath}?locale=${locale.code}&pagination[page]=${page}&pagination[pageSize]=100`

      fields.forEach( ( field, index ) => {
        url += `&fields[${index}]=${field}`
      } )

      const response = await $fetch( url, {
        parseResponse : JSON.parse,
        baseURL       : BASE_URL,
      } )

      return response.data.map( ( d ) => d.attributes )
    }

    // Fetch all pages based on the pageCount.
    const pageCount = initialResponse.meta.pagination.pageCount
    allSlugs = allSlugs.concat( await fetchPage( 1 ) ) // We already have the first page

    for ( let page = 2; page <= pageCount; page++ ) {
      const pageSlugs = await fetchPage( page )
      allSlugs = allSlugs.concat( pageSlugs )
    }

    return allSlugs
  } catch ( error ) {
    // eslint-disable-next-line no-console
    console.error( 'Failed to fetch content:', error )

    return ['']
  }
}

export const contentTypes = [
  {
    apiPath  : 'pages',
    sitePath : '',
  },
  {
    apiPath  : 'articles',
    sitePath : 'article',
  },
  {
    apiPath  : 'portofolios',
    sitePath : 'portofolio',
  },
]
