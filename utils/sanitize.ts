import sanitizeHtml from 'sanitize-html'

type AllowedTypes =
  | 'richtext'
  | 'gcal'
  | 'paragraph'
  | 'header'
  | 'list'
  | 'cell'
  | 'svgtext'
  | 'table'
  | 'code'

const sanitize = (
  text: string | Promise<string>,
  type?: AllowedTypes
): string => {
  const allowedTypes = [
    'richtext',
    'gcal',
    'paragraph',
    'header',
    'list',
    'cell',
    'svgtext',
    'table',
    'code'
  ]

  if ( type && !allowedTypes.includes( type ) ) {
    throw new Error(
      `Value error. Options for the 2nd param in sanitize() are ${allowedTypes.join(
        ', '
      )}`
    )
  }

  // If the text is a promise, resolve it first.
  if ( text instanceof Promise ) {
    text.then( ( resolvedText ) => {
      return sanitize( resolvedText, type )
    } )
  }
  const content = type === "gcal" ? String( text ).replace( "html-blob", "div" ) as string : text as string

  const formattingTags = [
    'a',
    'strong',
    'b',
    'em',
    'i',
    'u',
    'small',
    'span',
    'br',
    'wbr',
    'center',
    'code'
  ]
  const formattingAttrs = ['href', 'rel', 'target', 'title', 'class']

  const tableTags = ['table', 'thead', 'tbody', 'tr', 'th', 'td']
  const structuralTags = [
    'blockquote',
    'pre',
    'hr',
    'ul',
    'ol',
    'li',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'figure',
    'img',
    'p',
    ...tableTags,
  ]
  const structuralAttrs = ['src', 'width', 'height', 'alt']

  const svgTags = ['tspan']
  const svgAttrs = ['x', 'y']

  let allowedTags: string[] = []
  let allowedAttributes: { [key: string]: string[] } = {}

  switch ( type ) {
  case 'richtext':
  case 'gcal':
    allowedTags = [...formattingTags, ...structuralTags]
    allowedAttributes = { '*' : [...formattingAttrs, ...structuralAttrs] }
    break
  case 'paragraph':
  case 'header':
  case 'list':
  case 'cell':
    allowedTags = [...formattingTags]
    allowedAttributes = { '*' : [...formattingAttrs] }
    break
  case 'svgtext':
    allowedTags = [...svgTags]
    allowedAttributes = { '*' : [...svgAttrs] }
    break
  case 'table':
    allowedTags = [...tableTags]
    break
  default:
    allowedTags = []
    allowedAttributes = {}
    break
  }

  return sanitizeHtml( content, {
    allowedTags,
    allowedAttributes,
  } )
}

export default sanitize
