import fs from 'fs'

let siteDomain = 'www.ianfebisastrataruna.my.id'

// if env BRANCH_TYPE is "prod" create a permissive robots.txt that references sitemap.xml
if ( process.env.BRANCH_TYPE === "prod" ) {
  const robots = `User-agent: *
Disallow:
Sitemap: https://${siteDomain}/sitemap.xml
`
  fs.writeFileSync( '../public/robots.txt', robots, 'utf8' )
  // eslint-disable-next-line no-console
  console.log( 'Robots.txt created at ../public/robots.txt' )
} else {
  const robots = `User-agent: *
Disallow: /
`
  fs.writeFileSync( '../public/robots.txt', robots, 'utf8' )
  // eslint-disable-next-line no-console
  console.log( 'Robots.txt created at ../public/robots.txt' )
}
