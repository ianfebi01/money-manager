import sanitizeHtml from 'sanitize-html';

const truncate = ( content: string, length: number = 30 ): string => {
  const escapedContent = sanitizeHtml( content, { allowedTags : [] } );

  return `${escapedContent.split( " " ).slice( 0, length ).join( " " )}&hellip;`;
}

export default truncate;