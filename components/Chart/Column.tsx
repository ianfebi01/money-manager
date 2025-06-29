'use client'

import formatCurency from '@/utils/format-curency'
import { ApexOptions } from 'apexcharts'
import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'

const ReactApexChart = dynamic( () => import( 'react-apexcharts' ), { ssr : false } )

interface Props {
  series: ApexAxisChartSeries
  categories: string[]
}

const ColumnChart = ( {
  series,
  categories,
}: Props ) => {
  const [chartSeries, setChartSeries] = useState<ApexAxisChartSeries>(
    series || []
  )
  const [chartOptions, setChartOptions] = useState<ApexOptions>( {
    theme : { mode : 'dark' },
    chart : {
      type       : 'bar',
      height     : 350,
      toolbar    : { show : false },
      background : 'transparent',
    },
    colors      : ['#F26B50', '#60a5fa'],
    plotOptions : {
      bar : {
        horizontal   : false,
        columnWidth  : '90%',
        borderRadius : 5,
      },
    },
    dataLabels : { enabled : false },
    stroke     : {
      show   : true,
      width  : 2,
      colors : ['transparent'],
    },
    legend : {
      labels : {
        colors : 'rgba(251, 251, 251, 0.40)',
      },
    },
    xaxis : {
      categories : categories,
      labels     : {
        style : {
          colors : 'rgba(251, 251, 251, 0.40)',
        },
      },
      axisBorder : { show : false },
      axisTicks  : { show : false },
    },
    yaxis : {
      labels : {
        style : {
          colors : 'rgba(251, 251, 251, 0.40)',
        },
        formatter : ( val ) => formatCurency( val, 'IDRK' ),
      },
    },
    fill    : { opacity : 1 },
    tooltip : {
      y : {
        formatter : ( val ) => formatCurency( val ),
      },
      style : {
        fontSize   : '12px',
        fontFamily : 'Inter, sans-serif',
      },
    },
    grid : {
      yaxis : { lines : { show : false } },
      xaxis : { lines : { show : false } },
    },
  } )

  // Update series & options reactively
  useEffect( () => {
    if ( categories?.length > 0 ) {
      setChartSeries(
        categories.length < 4
          ? ( series?.map( ( item ) => ( {
            name : item?.name,
            data : [...item?.data, '', ''],
          } ) ) as unknown as ApexAxisChartSeries )
          : series
      )
      setChartOptions( ( prev ) => ( {
        ...prev,
        xaxis : {
          ...prev.xaxis,
          categories :
            categories.length < 4 ? [...categories, '', ''] : categories,
        },
      } ) )
    }
  }, [series, categories] )

  return (
    <div>
      {categories?.length > 0 && (
        <ReactApexChart
          options={chartOptions}
          series={chartSeries}
          type="bar"
          height={280}
        />
      )}
    </div>
  )
}

export default ColumnChart
