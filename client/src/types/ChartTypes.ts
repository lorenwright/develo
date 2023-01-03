export type Settings = {
  height: number,
  marginLeft: number,
  marginRight: number,
  marginTop: number,
  marginBottom: number,
  yMax: number,
  yMin: number,
  xMin: number,
  xMax: number,
  confidenceAreaFill: string
  confidenceAreaStroke: string,
  lineStroke: string,
  lineStrokeWidth: string,
  yTopAttribute: string,
  yBottomAttribute: string,
  xAttribute: string,
  percentileLines: string[]
}

export type ChartData = {
  Sex: string,
  Agemos: string,
  P3: string,
  P25: string,
  P50: string,
  P75: string,
  P97: string
}