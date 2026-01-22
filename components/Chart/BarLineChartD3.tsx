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

  const palette = ['#60a5fa', '#f26b50']

  useEffect( () => {
    const chartData = datas

    if ( !chart && chartContainer ) {
      setChart( new BarLine( chartContainer.current, chartData, palette ) )
    } else {
      chart?.update( chartData )
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [] )

  useEffect( () => {
    if ( !chart ) return
    chart.update( datas )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [datas] )

  useEffect( () => {
    if ( !chart || !chartContainer.current ) return;

    const handleResize = () => {
      chart.update( datas );
    };

    const resizeObserver = new ResizeObserver( handleResize );
    resizeObserver.observe( chartContainer.current );

    return () => {
      resizeObserver.disconnect();
    };
  }, [ chart, datas ] );

  return (
    <div
      ref={chartContainer}
      className="chart-container relative flex-1 flex items-center pt-4 overflow-hidden"
    ></div>
  )
}

export default BarLineChartD3
