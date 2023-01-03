import Axis from "./Axis";
import * as React from "react";
import ConfidenceArea from "./ConfidenceArea";
import * as d3 from "d3";
import {useEffect, useMemo, useRef, useState} from "react";
import {Settings} from "../../types/ChartTypes";
import Line from "./Line";
import Plot from "./Plot";

type Props = {
  settings: Settings,
  rangeData: object[],
  patientData: object[],
  label: string
}
const Chart: React.FC<Props> = ({settings, rangeData, patientData, label}) => {

  const [chartWidth, setChartWidth] = useState(0)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    getChartWidth()
    window.addEventListener('resize', getChartWidth)
  }, [])

  /**
   * Get the width of the chart based off of parent container
   */
  const getChartWidth = () => {
    // @ts-ignore
    const newWidth = ref.current.clientWidth - 16 // 16 is for padding
    setChartWidth(newWidth);
  }

  /**
   * Set the xScale for d3 chart
   * @returns The xScale
   */
  const xScale = useMemo(() => {
    return d3.scaleLinear()
      .domain([settings.xMin, settings.xMax])
      .range([settings.marginLeft, chartWidth - settings.marginLeft])
  }, [settings, chartWidth])

  /**
   * Set the yScale for d3 chart
   * @returns The yScale
   */
  const yScale = useMemo(() => {
    return d3.scaleLinear()
      .domain([settings.yMax, settings.yMin])
      .range([settings.marginTop, settings.height - settings.marginBottom])
  }, [settings, chartWidth])

  return (
    <div className="bg-slate-700/25 rounded-xl p-4" ref={ref}>
      <h2 className="text-2xl text-sky-500 font-bold text-center">{label}</h2>
      <div className="flex items-center">
        <div className="w-3">
          <h4 className="text-xs text-sky-500 text-center -rotate-90">Measurement</h4>
        </div>
        <div>
          <svg className="" width={chartWidth} height={settings.height}>
            <Axis settings={settings} xScale={xScale} yScale={yScale} chartWidth={chartWidth} />
            <ConfidenceArea settings={settings} rangeData={rangeData} xScale={xScale} yScale={yScale} chartWidth={chartWidth} />
            {settings.percentileLines.map((line, idx) => (
                <Line key={idx} settings={settings} data={rangeData} xScale={xScale} yScale={yScale} yAttribute={line} animate={false} chartWidth={chartWidth} showLabel />
            ))}
            <Line settings={{...settings, lineStroke: 'black', lineStrokeWidth: '2'}} data={patientData} xScale={xScale} yScale={yScale} yAttribute="value" animate chartWidth={chartWidth} showLabel={false} />
            <Plot settings={{...settings}} data={patientData} xScale={xScale} yScale={yScale} yAttribute="value" chartWidth={chartWidth} />
          </svg>
          <h4 className="text-xs text-sky-500 text-center mt-1">Age (in months)</h4>
        </div>
      </div>
    </div>
  )
}

export default Chart;