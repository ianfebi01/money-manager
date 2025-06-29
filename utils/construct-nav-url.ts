import { NavItemsNavItems } from "@/types/generated/components"
import { ApiPagePage } from "@/types/generated/contentTypes"

const constructNavUrl = ( navItem: NavItemsNavItems['attributes'] ) => {
  let url: string = ''
  if ( ( navItem?.page?.data as ApiPagePage )?.attributes?.slug ) {
    url = `/${( navItem?.page?.data as ApiPagePage )?.attributes?.slug}`
  } else {
    url = navItem?.url
  }
  if ( navItem?.pageAnchor ) {
    url = url + '#' + navItem.pageAnchor
  }
  
  return url
}

export default constructNavUrl
