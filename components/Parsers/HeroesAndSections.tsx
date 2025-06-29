import { ApiPagePage } from '@/types/generated/contentTypes'
import React, { useMemo } from 'react'
import Heroes from './Heroes'
import Sections from './Sections'

interface Props {
  page: ApiPagePage['attributes']
}

const HeroesAndSections = ( { page }: Props ) => {
  const heroes = useMemo( () => page?.banner, [page?.banner] )
  const sections = useMemo( () => page?.content, [page?.content] )

  return (
    <div>
      {heroes?.length > 0 && <Heroes banners={heroes} />}
      {sections?.length > 0 && (
        <Sections sections={sections}
          headingLevel={2}
        />
      )}
    </div>
  )
}

export default HeroesAndSections
