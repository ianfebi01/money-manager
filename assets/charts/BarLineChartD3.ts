import { formatBigNumber } from "@/lib/utils"
import * as d3 from "d3"

interface ChartMargins {
  top: number
  right: number
  bottom: number
  left: number
}

const margin = <ChartMargins>( {
  top    : 30,
  right  : 0,
  bottom : 30,
  left   : 30,
} )

type Value = { x: string; y: number }

export interface ChartData {
  name: string
  values: Value[]
}

export interface ChartApiData {
  series: { name: string; data: number[] }[];
  categories: string[];
}

// Tailwind color palette from tailwind.config.ts
const tailwindColors = {
  orange            : '#F26B50',
  green             : '#4FAA84',
  dark              : '#222222',
  'dark-secondary'  : '#393939',
  white             : '#f1f1f1',
  'white-overlay'   : 'rgba(251, 251, 251, 0.40)',
  'white-overlay-2' : 'rgba(251, 251, 251, 0.20)',
}

const legendDotRadius = 6

export class BarLineChartD3 {
  container!: HTMLElement

  svg!: d3.Selection<SVGSVGElement, unknown, null, undefined>

  chart!: d3.Selection<SVGGElement, unknown, null, undefined>

  legend!: d3.Selection<SVGGElement, unknown, null, undefined>

  yAxisGroup!: d3.Selection<SVGGElement, unknown, null, undefined>

  xScale!: d3.ScaleBand<string>;

  yScale!: d3.ScaleLinear<number, number>;

  xAxis!: d3.Axis<string>;

  yAxis!: d3.Axis<d3.NumberValue>

  barWidth!: number

  colour!: d3.ScaleOrdinal<string, string, never>

  // Store previous line data for animation
  private prevLineData?: number[]

  constructor(
    element: HTMLElement | null,
    apiData: ChartApiData,
    palette?: string[],
  ) {
    if ( !element ) return;

    this.container = element;

    // Use provided palette or default to Tailwind colors
    const chartPalette = palette ?? [tailwindColors["white-overlay"], tailwindColors.green, tailwindColors.dark];
    this.colour = d3.scaleOrdinal( chartPalette );

    this.xScale = d3.scaleBand().padding( 0.2 );

    this.yScale = d3
      .scaleLinear()

    this.yAxis = d3
      .axisLeft( this.yScale )
      .tickSizeOuter( 0 )
      .tickSizeInner( 0 )
      .tickFormat( ( domainValue ) => formatBigNumber( Number( domainValue ) ) )

    this.xAxis = d3
      .axisBottom( this.xScale )
      .tickSizeOuter( 0 )
      .tickSizeInner( 0 )

    this.svg = d3
      .select( this.container )
      .append<SVGSVGElement>( "svg" )
      .attr( "width", "100%" )
      .attr( "height", "100%" )

    this.chart = this.svg
      .append<SVGGElement>( "g" )
      .attr( "class", "chart" )

    this.legend = this.svg
      .append<SVGGElement>( "g" )
      .attr( "class", "legend" )

    this.yAxisGroup = this.svg
      .append<SVGGElement>( "g" )
      .attr( "class", "y-axis" )

    this.update( apiData )
  }

  update( apiData: ChartApiData ) {
    const {
      xScale,
      yScale,
      xAxis,
      yAxis,
      yAxisGroup,
      container,
      svg,
      chart,
      legend,
      colour,
    } = this

    // Remove only bars and legend, not the line path
    chart.selectAll( '.bar1' ).remove();
    chart.selectAll( '.legend' ).remove();
    yAxisGroup.selectAll( '*' ).remove()

    // Dynamically adjust margin for small containers
    const rect = container.getBoundingClientRect()
    const isSmall = rect.width < 350
    const dynamicMargin = isSmall
      ? { top : 30, right : 0, bottom : 30, left : 25 }
      : margin

    const outerWidth = rect.width
    const outerHeight = rect.height

    const width = outerWidth - dynamicMargin.left - dynamicMargin.right
    const height = outerHeight - dynamicMargin.top - dynamicMargin.bottom

    this.chart
      .attr( "transform", `translate( ${dynamicMargin.left}, ${dynamicMargin.top} )` )

    // X axis: categories
    xScale.domain( apiData.categories ).range( [0, width] )

    // Y axis: min/max from all series
    const allValues = apiData.series.flatMap( s => s.data )
    const minValue = Math.min( ...allValues, 0 )
    const maxValue = Math.max( ...allValues, 0 )
    yScale
      .domain( [minValue, maxValue] )
      .range( [height - 10, 0] )

    yAxis
      .tickValues( [minValue, ( maxValue + minValue ) / 2, maxValue] )

    svg.attr(
      "viewBox",
      null
    )

    colour.domain( apiData.series.map( s => s.name ) )

    // Draw legend
    const legendItems = legend
      .selectAll( "g" )
      .data( apiData.series )
      .enter()
      .append( "g" )
      .attr( "transform", ( d, i ) => `translate(${( i * ( width < 350 ? 100 : 120 ) ) + 6}, ${legendDotRadius})` )

    legendItems
      .append( "circle" )
      .attr( "r", legendDotRadius )
      .attr( "fill", ( d ) => colour( d.name ) )

    legendItems
      .append( "text" )
      .attr( "x", legendDotRadius + 8 )
      .attr( "y", legendDotRadius - 2 )
      .text( ( d ) => d.name )
      .attr( "fill", tailwindColors["white"] )
      .attr( "font-weight", "600" )
      .attr( "font-size", width < 350 ? "0.75rem" : "0.875rem" )

    // Draw bars for first series
    const bar = chart
      .selectAll( ".bar1" )
      .data( apiData.categories )
      .enter()
      .append( "g" )
      .attr( "transform", d => `translate(${xScale( d ) || 0}, 0)` )
      .attr( "class", "bar1" )

    bar
      .append( "rect" )
      .attr( "y", yScale( 0 ) ) // Start at baseline
      .attr( "height", 0 )    // Start with height 0
      .attr( "width", xScale.bandwidth() )
      .attr( "fill", () => colour( apiData.series[0].name ) )
      .attr( "fill-opacity", ( d, i ) => ( apiData.series[0].data[i] > 0 ? 1 : 0.5 ) )
      .attr( "rx", "6" )
      .transition()
      .duration( 600 )
      .attr( "y", ( d, i ) => yScale( apiData.series[0].data[i] ) )
      .attr( "height", ( d, i ) => Math.abs( yScale( apiData.series[0].data[i] ) - yScale( 0 ) ) )

    // Draw or update line for second series
    const line = d3
      .line<number>()
      .x( ( d, i ) => ( xScale( apiData.categories[i] ) || 0 ) + xScale.bandwidth() / 2 )
      .y( ( d ) => yScale( d ) );

    let linePath = chart.select<SVGPathElement>( '.chart-line' );
    if ( linePath.empty() ) {
      linePath = chart
        .append( 'path' )
        .attr( 'class', 'chart-line' )
        .attr( 'fill', 'none' )
        .attr( 'stroke-width', 5 )
        .attr( 'stroke', () => colour( apiData.series[1].name ) );
    }
    // Directly update the line path without animation
    linePath.attr( 'd', line( apiData.series[1].data ) );

    // Draw x axis
    chart
      .append( "g" )
      .attr( "transform", `translate(0, ${height})` )
      .transition()
      .duration( 600 )
      .call( xAxis )
      .selection()
      .call( ( g ) => g.select( ".domain" ).remove() )
      .selectAll( "text" )
      .attr( "text-transform", "uppercase" )
      .attr( "font-weight", "500" )
      .attr( "font-size", width < 350 ? "8px" : "12px" )
      .attr( "fill", tailwindColors["white-overlay"] )

    // Draw y axis
    yAxisGroup
      .attr( "transform", `translate(${dynamicMargin.left}, ${dynamicMargin.top})` )
      .transition()
      .duration( 600 )
      .call( yAxis )
      .selection()
      .call( g => g.select( ".domain" ).remove() )
      .selectAll( "text" )
      .attr( "text-transform", "uppercase" )
      .attr( "font-weight", "500" )
      .attr( "font-size", width < 350 ? "8px" : "10px" )
      .attr( "fill", tailwindColors["white-overlay"] )
  }
}