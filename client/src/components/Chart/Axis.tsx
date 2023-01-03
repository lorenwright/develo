import {useMemo} from "react";
import * as React from "react";
import {ScaleLinear} from "d3";
import {Settings} from "../../types/ChartTypes";

type Props = {
  settings: Settings,
  xScale: ScaleLinear<any, any>,
  yScale: ScaleLinear<any, any>,
  chartWidth: number
}

const Axis: React.FC<Props> = ({settings, xScale, yScale, chartWidth}) => {
  /**
   * Get the tick marks for x-axis
   * @returns The ticks for x-axis
   */
  const xTicks = useMemo(() => {
    return xScale.ticks()
      .map(value => ({
        value,
        xOffset: xScale(value)
      }))
  }, [settings, chartWidth])

  /**
   * Get the tick marks for y-axis
   * @returns The ticks for y-axis
   */
  const yTicks = useMemo(() => {
    return yScale.ticks()
      .map(value => ({
        value,
        yOffset: yScale(value)
      }))
  }, [settings, chartWidth])
  return (
    <>
      <g>
        <path
          d={`M ${settings.marginLeft} ${settings.height - settings.marginBottom} H ${chartWidth - settings.marginLeft}`}
          stroke="#fff"
        />

        {xTicks.map(({ value, xOffset }) => (
          <g
            key={value}
            transform={`translate(${xOffset}, ${settings.height - settings.marginBottom})`}
          >
            <line
              y2="6"
              stroke="#fff"
            />
            <text
              key={value}
              style={{
                fontSize: "10px",
                textAnchor: "middle",
                transform: `translateY(20px)`,
                fill: '#fff'
              }}
            >
              { value }
            </text>
          </g>
        ))}
      </g>

      <g>
        <path
          d={`M ${settings.marginLeft} ${settings.marginTop} V ${settings.height - settings.marginBottom}`}
          stroke="#fff"
        />

        {yTicks.map(({ value, yOffset }) => (
          <g
            key={value}
            transform={`translate(${settings.marginLeft - 6}, ${yOffset})`}
          >
            <line
              x2="6"
              stroke="#fff"
            />
            <text
              key={value}
              style={{
                fontSize: "10px",
                textAnchor: "end",
                transform: `translate(-3px, 3px)`,
                fill: '#fff'
              }}
            >
              { value }
            </text>
          </g>
        ))}
      </g>
    </>
  )
}

export default Axis