import * as React from "react";
import {useRef} from "react";
import {ScaleLinear} from "d3";
import {Settings} from "../../types/ChartTypes";

type Props = {
  settings: Settings,
  data: object[],
  xScale: ScaleLinear<any, any>,
  yScale: ScaleLinear<any, any>,
  yAttribute: string,
  chartWidth: number
}

const Plot: React.FC<Props> = ({settings, data, xScale, yScale, yAttribute, chartWidth}) => {
  const ref = useRef<SVGGElement>(null)

  /**
   * The points that we should be rendering based off of x & y
   * @type {array} [x, y]
   */
  const points = data.map((d:any) => {
    return [d[settings.xAttribute], d[yAttribute]]
  })

  return (
    <g ref={ref}>
      {points.map((p:number[], idx) => (
        <circle key={idx} className="plot" cx={xScale(p[0])} cy={yScale(p[1])} r={6} fill={settings.lineStroke} stroke="#fff" />
      ))}
    </g>
  )
}

export default Plot;