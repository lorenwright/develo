import * as renderer from "react-test-renderer";
import Chart from '../Chart';
import '@testing-library/jest-dom';
import React from "react";

describe('Chart', () => {
  it('renders correctly', () => {

    const patient = {
      sex: 1,
      weight: [
        {
          Agemos: 33,
          value: 12
        },
        {
          Agemos: 50,
          value: 20
        },
        {
          Agemos: 70,
          value: 25
        },
        {
          Agemos: 95,
          value: 29
        },
        {
          Agemos: 120,
          value: 47
        },
        {
          Agemos: 170,
          value: 70
        },
        {
          Agemos: 200,
          value: 78
        },
        {
          Agemos: 230,
          value: 90
        }
      ]
    }

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

    const component = renderer.create(
        <Chart settings={defaultSettings} rangeData={range} patientData={patient.weight} label="Weight for Age" />
    );

    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  })
})