'use client'
import formatCurency from '@/utils/format-curency'
import { ApexOptions } from 'apexcharts'
import { useTranslations } from 'next-intl'
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import { useAnimation, motion, easeInOut } from 'framer-motion'

const ReactApexChart = dynamic( () => import( 'react-apexcharts' ), { ssr : false } )

interface Props {
  series: number[]
  categories: string[]
}

const Doughnut = ( { series, categories }: Props ) => {
  const t = useTranslations( 'mm_categories' )
  const animationControl = useAnimation()

  function generateShades( hex: string, count: number ) {
    const lighten = ( col: string, amt: number ) => {
      let [r, g, b] = col.match( /\w\w/g )?.map( ( c ) => parseInt( c, 16 ) ) || [
        0, 0, 0,
      ]
      r = Math.min( 255, r + amt )
      g = Math.min( 255, g + amt )
      b = Math.min( 255, b + amt )

      return `#${[r, g, b]
        .map( ( c ) => c.toString( 16 ).padStart( 2, '0' ) )
        .join( '' )}`
    }

    const shades = []
    for ( let i = 0; i < count; i++ ) {
      shades.push( lighten( hex, i * 20 ) )
    }

    return shades
  }

  const coralShades = generateShades( '#F26B50', 10 )

  const [chartOptions, setChartOptions] = useState<ApexOptions>( {
    theme : { mode : 'dark' },
    chart : {
      type       : 'donut' as const,
      toolbar    : { show : false },
      background : 'transparent',
    },
    tooltip : {
      style : {
        fontSize : '12px',
      },
      y : {
        title : {
          formatter : function ( val, opts ) {
            return `${t( categories?.[opts.seriesIndex]?.replace( /-/g, '_' ) )}: `
          },
        },
        formatter : function ( value: number ) {
          return formatCurency( value, 'IDRK' )
        },
      },
    },
    stroke : {
      show : false,
    },
    states : {
      hover : {
        filter : { type : 'none' },
      },
      active : {
        allowMultipleDataPointsSelection : false,
        filter                           : { type : 'none' },
      },
    },
    legend : {
      show : false,
    },
    colors      : [...coralShades],
    plotOptions : {
      pie : {
        expandOnClick : false,
        donut         : {
          size   : '65%',
          labels : {
            show : false,
          },
        },
      },
    },
    dataLabels : {
      enabled : true,
      style   : {
        fontSize   : '12px',
        fontWeight : 400,
        colors     : ['#fff'],
      },
      dropShadow : {
        enabled : false,
      },
    },
  } )

  const [chartSeries, setChartSeries] = useState<number[]>( series || [] )

  // Update series & options reactively
  useEffect( () => {
    if ( series?.length > 0 ) {
      const generatedShades = generateShades( '#F26B50', series.length )
      setChartSeries( [...series] )
      setChartOptions( ( prev ) => ( {
        ...prev,
        xaxis : {
          ...prev.xaxis,
          categories :
            categories.length < 4 ? [...categories, '', ''] : categories,
        },
        colors : [...generatedShades],
      } ) )
    }
  }, [series, categories] )

  useEffect( () => {
    animationControl.start( 'visible' )
  }, [] )

  return (
    <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
      <div id="chart"
        className="h-[280px] w-[280px] ml-2"
      >
        <ReactApexChart
          options={chartOptions}
          series={chartSeries}
          type="donut"
          height={280}
          width={280}
        />
      </div>
      <div className="flex flex-col gap-4 my-auto mx-4 py-4 md:h-[280px] overflow-auto w-[calc(100%-2rem)] md:w-[unset] md:grow">
        {categories?.map( ( value, i ) => (
          <motion.div
            key={i}
            variants={{
              hidden : {
                opacity : 0,
                y       : 75,
              },
              visible : {
                opacity : 1,
                y       : 0,
              },
            }}
            initial="hidden"
            animate={animationControl}
            transition={{
              duration : 0.3,
              delay    : 0 + i / 20,
              ease     : easeInOut,
            }}
          >
            <div className="flex items-center gap-2 text-sm text-white-overlay">
              <span
                className="inline-block w-3 h-8 rounded-full"
                style={{ backgroundColor : chartOptions.colors?.[i] }}
              />
              {!!value && (
                <p className="m-0">
                  {`${t( value.replace( /-/g, '_' ) )}: `}
                  <span className="text-white">
                    {formatCurency( chartSeries[i], 'IDRK' )}
                  </span>
                </p>
              )}
            </div>
          </motion.div>
        ) )}
      </div>
    </div>
  )
}

export default Doughnut
