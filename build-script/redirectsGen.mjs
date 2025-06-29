import fs from "fs"
import { fetchContent, locales } from "./fetchContent.mjs"

const staticRedirects = [
  { source: "/recipes(/)?", destination: "/find-my-perfect-meal", permanent: true },
  { source: "/rice-recipes/brown-rice-recipes/(.*)", destination: "/find-my-perfect-meal", permanent: false },
  { source: "/rice-recipes/easy-rice-recipes/(.*)", destination: "/find-my-perfect-meal", permanent: false },
  { source: "/rice-recipes/healthy-rice-recipes/(.*)", destination: "/find-my-perfect-meal", permanent: false },
  { source: "/rice-recipes/rice-cooker-recipes/(.*)", destination: "/find-my-perfect-meal", permanent: false },

]

const contentTypes = [
  {
    apiPath  : "redirects",
    sitePath : "",
  },
]

const promises = contentTypes.map( async ( contentType ) => {
  const localisedContent = await Promise.all( locales.map( async ( locale ) => {
    const content = await fetchContent( contentType, locale, ["to", "from"] )

    return content.map( ( entry ) => {
      const { from, to } = entry
      let suffix = ""

      // Optional trailing slash if not a slug
      if ( !from.endsWith( ":slug" ) ) {
        suffix = "(/)?"
      }

      return {
        source      : from.replace( /\/$/, "" ) + suffix,
        destination : to,
        permanent   : false,
      }
    } )
  } ) )

  return localisedContent.flat()
} )

const sourcePattern = /^\/[a-zA-Z0-9-\/._=:%]+(\(\/\)\?)?$/
const destinationPattern = /^(\/[a-zA-Z0-9-\/._?=&:=%]*\*?|https?:\/\/[a-zA-Z0-9-\/._?=&:=%]+)\*?$/

Promise.all( promises ).then( ( dynamicRedirects ) => {

  const redirects = [...staticRedirects]

  dynamicRedirects.flat().map( ( redirect ) => {
    if ( !redirects.find( ( r ) => r.source === redirect.source ) ) {
      if ( !sourcePattern.test( redirect.source ) ) {
        console.error( `Invalid source: ${redirect.source}` )
      } else if ( !destinationPattern.test( redirect.destination ) ) {
        console.error( `Invalid destination: ${redirect.destination}` )
      } else {
        // Can't figure out how to have optional trailing slash on slug, so duplicating with slash
        if ( redirect.source.endsWith( ":slug" ) ) {
          redirects.push( {
            source      : redirect.source + "/",
            destination : redirect.destination,
            permanent   : redirect.permanent,
          } )
        }

        redirects.push( redirect )
      }
    }
  } )

  // read in ../vercel.headers.json and combine it with redirects for a final vercel.json file
  const vercelFile = JSON.parse( fs.readFileSync( "./vercel.headers.json", "utf8" ) )

  const headers = vercelFile.headers

  const combined = {
    headers,
    redirects,
  }

  const combinedJson = JSON.stringify( combined, null, 2 )

  fs.writeFileSync( "../vercel.json", combinedJson, "utf8" )

  console.log( "vercel.json file created" )
} )
