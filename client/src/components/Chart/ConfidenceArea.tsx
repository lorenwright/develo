import * as React from "react";
import {useRef, useEffect} from "react";
import * as d3 from "d3";
import {ScaleLinear} from "d3";
import {Settings} from "../../types/ChartTypes";

type Props = {
  settings: Settings,
  rangeData: object[],
  xScale: ScaleLinear<any, any>,
  yScale: ScaleLinear<any, any>,
  chartWidth: number
}

const ConfidenceArea: React.FC<Props> = ({settings, rangeData, xScale, yScale, chartWidth}) => {

  const ref = useRef<SVGPathElement>(null)

  useEffect(() => {
    // The confidence area, determined by y0 (bottom y value) and y1 (top y value) for x
    const area = d3.area()
      .x((d:any) => xScale(d[settings.xAttribute]))
      .y0((d:any) => yScale(d[settings.yBottomAttribute]))
      .y1((d:any) => yScale(d[settings.yTopAttribute]))
      .curve(d3.curveLinear)

    // Add the confidence area to chart
    d3.select(ref.current)
      .datum(rangeData)
      .attr("fill", settings.confidenceAreaFill)
      .attr("stroke", settings.confidenceAreaStroke)
      .attr('d',
        // @ts-ignore
        area
      )
  }, [rangeData, chartWidth])

  return (
    <path ref={ref} />
  )
}

export default ConfidenceArea;