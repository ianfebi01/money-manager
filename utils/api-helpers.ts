export function formatDate( dateString: string ) {
  const date = new Date( dateString );
  const options: Intl.DateTimeFormatOptions = { year : 'numeric', month : 'long', day : 'numeric' };
  
  return date.toLocaleDateString( 'en-US', options );
}

// ADDS DELAY TO SIMULATE SLOW API REMOVE FOR PRODUCTION
export const delay = ( time: number ) => new Promise( ( resolve ) => setTimeout( () => resolve( 1 ), time ) );