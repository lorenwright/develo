import * as React from "react";
import {useRef, useEffect, useState} from "react";
import * as d3 from "d3";
import {ScaleLinear} from "d3";
import {Settings} from "../../types/ChartTypes";

type Props = {
  settings: Settings,
  data: object[],
  xScale: ScaleLinear<any, any>,
  yScale: ScaleLinear<any, any>,
  yAttribute: string,
  animate: boolean,
  chartWidth: number,
  showLabel: boolean
}

const Line: React.FC<Props> = ({settings, data, xScale, yScale, yAttribute, animate = false, chartWidth, showLabel}) => {
  const [labelDims, setLabelDims] = useState([])
  const path = useRef<SVGPathElement>(null)

  useEffect(() => {
    // The line we want to draw
    const line = d3.line()
      .x((d:any) => xScale(d[settings.xAttribute]))
      .y((d:any) => yScale(d[yAttribute]))
      .curve(d3.curveLinear)

    // Add the line to the chart
    d3.select(path.current)
      .datum(data)
      .attr('stroke', settings.lineStroke)
      .attr('stroke-width', settings.lineStrokeWidth)
      .attr('fill', 'none')
      .attr('d',
        // @ts-ignore
        line
      )

    // If showLabel is set, then we need to set the dimensions of where the label will be displayed
    if (data && data[data.length - 1] && showLabel) {
      setLabelDims([
        // @ts-ignore
        xScale(data[data.length - 1][settings.xAttribute] - 10), yScale(data[data.length - 1][yAttribute])
      ])
    }
  }, [data, chartWidth, settings, xScale, yScale, showLabel, yAttribute])

  return (
    <g>
      <path ref={path} className={`${animate ? 'draw-line' : ''}`} />
      {showLabel && labelDims.length > 0 && (
        <text transform={`translate(${labelDims[0]}, ${labelDims[1]})`} fill={settings.lineStroke} fontSize={10}>{yAttribute}</text>
      )}
    </g>
  )
}

export default Line;