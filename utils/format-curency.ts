const formatCurency = ( value: number, currency = 'IDR' ) => {
  if ( currency === 'IDR' ) {
    return value.toLocaleString( 'id-ID', {
      style    : 'currency',
      currency : 'IDR',
    } )
  }
  if ( currency === 'IDRK' ) {
    const formatted = ( value / 1000 ).toLocaleString( 'id-ID', {
      minimumFractionDigits : 0,
      maximumFractionDigits : 1,
    } )

    return `Rp. ${formatted}K`
  }

  return value.toLocaleString( 'id-ID', {
    style    : 'currency',
    currency : 'IDR',
  } )
}

export default formatCurency
