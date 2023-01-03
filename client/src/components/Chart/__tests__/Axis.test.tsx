import * as renderer from "react-test-renderer";
import Chart from '../Axis';
import '@testing-library/jest-dom';
import React from "react";
import Axis from "../Axis";
import * as d3 from "d3";

describe('Axis', () => {
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

    const chartWidth = 500

    const xScale = d3.scaleLinear()
        .domain([defaultSettings.xMin, defaultSettings.xMax])
        .range([defaultSettings.marginLeft, chartWidth - defaultSettings.marginLeft])

    const yScale = d3.scaleLinear()
        .domain([defaultSettings.yMax, defaultSettings.yMin])
        .range([defaultSettings.marginTop, defaultSettings.height - defaultSettings.marginBottom])

    const component = renderer.create(
        <Axis settings={defaultSettings} xScale={xScale} yScale={yScale} chartWidth={chartWidth} />
    );

    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  })
})