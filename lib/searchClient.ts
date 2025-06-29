import { instantMeiliSearch } from '@meilisearch/instant-meilisearch'

const meilisearch = {
  url : process.env.NEXT_PUBLIC_SEARCH_URL || '',
  key : 'f598c7625ca63ad729f64c8a64501dffbc49235d66a879c77a7638a660407676',
}

export const { searchClient } = instantMeiliSearch( meilisearch.url, meilisearch.key )
