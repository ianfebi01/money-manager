import {
  BarLineChartD3 as BarLine,
  ChartApiData,
} from '@/assets/charts/BarLineChartD3'
import { useEffect, useRef, useState } from 'react'

interface Props {
  datas: ChartApiData
}
const BarLineChartD3 = ( { datas }: Props ) => {
  const chartContainer = useRef<HTMLDivElement>( null )

  const [chart, setChart] = useState<BarLine | null>( null )

  const palette = ['#f26b50', '#60a5fa']

  useEffect( () => {
    const chartData = datas

    if ( !chart && chartContainer ) {
      setChart( new BarLine( chartContainer.current, chartData, palette ) )
    } else {
      chart?.update( chartData )
    }

    const handleResize = new ResizeObserver( () => {
      chart?.update( chartData )
    } )

    if ( chartContainer.current ) {
      handleResize.observe( chartContainer.current )
    }

    return () => {
      if ( chartContainer.current ) {
        handleResize.unobserve( chartContainer.current )
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [] )

  useEffect( () => {
    if ( !chart ) return
    chart.update( datas )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [datas] )

  return (
    <div
      ref={chartContainer}
      className="chart-container relative flex-1 flex items-center pt-4 overflow-hidden"
    ></div>
  )
}

export default BarLineChartD3
