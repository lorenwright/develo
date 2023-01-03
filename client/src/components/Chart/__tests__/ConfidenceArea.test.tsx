import * as renderer from "react-test-renderer";
import ConfidenceArea from '../ConfidenceArea';
import '@testing-library/jest-dom';
import React from "react";
import * as d3 from "d3";

describe('Confidence Area', () => {
  it('renders correctly', () => {

    const defaultSettings = {
      height: 700,
      marginLeft: 30,
      marginRight: 0,
      marginTop: 5,
      marginBottom: 20,
      yMax: 100,
      yMin: 0,
      xMin: 0,
      xMax: 100,
      confidenceAreaFill: '#bae6fd',
      confidenceAreaStroke: 'none',
      lineStroke: '#38bdf8',
      lineStrokeWidth: '2',
      yTopAttribute: 'P97',
      yBottomAttribute: 'P3',
      xAttribute: 'Agemos',
      percentileLines: ['P3', 'P25', 'P50', 'P75', 'P97']
    }

    const range = [
      {P3: 0, P25: 1, P50: 2, P75: 3, P97: 4},
      {P3: 3, P25: 25, P50: 50, P75: 75, P97: 97},
    ]

    const chartWidth = 500

    const xScale = d3.scaleLinear()
        .domain([defaultSettings.xMin, defaultSettings.xMax])
        .range([defaultSettings.marginLeft, chartWidth - defaultSettings.marginLeft])

    const yScale = d3.scaleLinear()
        .domain([defaultSettings.yMax, defaultSettings.yMin])
        .range([defaultSettings.marginTop, defaultSettings.height - defaultSettings.marginBottom])

    const component = renderer.create(
        <ConfidenceArea settings={defaultSettings} rangeData={range} xScale={xScale} yScale={yScale} chartWidth={chartWidth} />
    );

    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  })
})