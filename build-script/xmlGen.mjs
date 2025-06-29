import { create } from "xmlbuilder2"
import fs from "fs"
import { fetchContent, locales, contentTypes } from "./fetchContent.mjs"

// Build the XML sitemap using xmlbuilder
const sitemap = create( {
  version  : "1.0",
  encoding : "UTF-8",
} )
  .ele( "urlset", { xmlns : "http://www.sitemaps.org/schemas/sitemap/0.9" } )

const promises = contentTypes.map( async ( contentType ) => {
  await Promise.all( locales.map( async ( locale ) => {
    const content = await fetchContent( contentType, locale, ["slug", "updatedAt"] )
    // Add each pieces of content to the XML
    content?.forEach( ( entry ) => {
      const { slug } = entry

      if ( slug === "home" ) return

      // Check if valid slug.
      if ( !( typeof slug === "string" && /^[؀-ۿ|a-z|0-9|-]+$/.test( slug ) ) ) {
        throw new Error( `Invalid slug: ${slug}` )
      }

      const path = `/${contentType.sitePath}/${slug}`.replace( /\/\//g, "/" )
      const url = `${locale.url}${path}`

      sitemap
        .ele( "url" )
        .ele( "loc" )
        .txt( url )
        .up()
        .ele( "lastmod" )
        .txt( entry.updatedAt?.slice( 0, 10 ) )
        .up()
        .ele( "changefreq" )
        .txt( "weekly" )
        .up()
        .ele( "priority" )
        .txt( "0.8" )
        .up()
    } )
  } ) )
} )

Promise.all( promises ).then( () => {
  // Output the XML sitemap to a file
  const sitemapXml = sitemap.end( { prettyPrint : true } )
  fs.writeFileSync( "../public/sitemap.xml", sitemapXml, "utf8" )
  // eslint-disable-next-line no-console
  console.log( "XML sitemap created at ../public/sitemap.xml" )
} )
