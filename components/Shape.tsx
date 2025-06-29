import { scalePow } from 'd3-scale'
import React from 'react'

const Shape = ( { myposy }: { myposy: number } ) => {
  const translate = scalePow().domain( [-2000, 2000] ).range( [-200, 200] )
  const rotate = scalePow().domain( [1000, -1000] ).range( [-0, 90] )

  return (
    <div>
      <div
        className="absolute w-10 h-10 bg-dark-secondary top-[80%] left-24"
        style={{
          transform : `translate(0, ${translate.exponent( 1 )(
            myposy
          )}px) rotate(${rotate( myposy ) + 25}deg)`,
        }}
      />
      <div
        className="absolute w-0 h-0 top-[10%] left-48 border-l-[20px] border-b-[30px] border-r-[20px] border-l-transparent border-r-transparent border-b-dark-secondary"
        style={{
          transform : `translate(0, ${translate.exponent( 1 )(
            myposy
          )}px) rotate(${rotate( myposy ) + 27}deg)`,
        }}
      />
      <div
        className="absolute w-0 h-0 top-[25%] left-[75%] border-l-[20px] border-b-[30px] border-r-[20px] border-l-transparent border-r-transparent border-b-dark-secondary"
        style={{
          transform : `translate(0, ${translate.exponent( 1 )(
            myposy
          )}px) rotate(${rotate( myposy ) + -37}deg)`,
        }}
      />
      <div
        className="absolute w-10 h-10 bg-dark-secondary inset-x-0 mx-auto -translate-x-28 top-[66%]"
        style={{
          transform : `translate(0, ${translate.exponent( 1 )(
            myposy
          )}px) rotate(${rotate( myposy ) + 17}deg) scale(0.75)`,
        }}
      />
      <div
        className="absolute w-10 h-10 bg-dark-secondary top-[85%] left-[90%]"
        style={{
          transform : `translate(0, ${translate.exponent( 1 )(
            myposy
          )}px) rotate(${rotate( myposy ) - 6}deg) scale(0.75)`,
        }}
      />
      <div
        className="absolute w-0 h-0 inset-x-0 mx-auto top-[60%]  border-l-[20px] border-b-[30px] border-r-[20px] border-l-transparent border-r-transparent border-b-dark-secondary"
        style={{
          transform : `translate(140px, ${translate.exponent( 1 )(
            myposy
          )}px) rotate(${rotate( myposy ) + 6}deg)`,
        }}
      />
    </div>
  )
}

export default Shape
