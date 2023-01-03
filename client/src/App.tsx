import React, {useEffect, useState} from 'react';
import './assets/css/App.css';
import Chart from "./components/Chart/Chart";
import {ChartData} from "./types/ChartTypes";

function App() {
  /**
   * The individual patient that we are displaying data for
   * @type {object}
   */
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
    ],
    height: [
      {
        Agemos: 33,
        value: 90
      },
      {
        Agemos: 50,
        value: 100
      },
      {
        Agemos: 70,
        value: 120
      },
      {
        Agemos: 95,
        value: 130
      },
      {
        Agemos: 120,
        value: 142
      },
      {
        Agemos: 170,
        value: 174
      },
      {
        Agemos: 200,
        value: 182
      },
      {
        Agemos: 230,
        value: 184
      }
    ],
    bmi: [
      {
        Agemos: 33,
        value: 15
      },
      {
        Agemos: 50,
        value: 14
      },
      {
        Agemos: 70,
        value: 18
      },
      {
        Agemos: 95,
        value: 20
      },
      {
        Agemos: 120,
        value: 21
      },
      {
        Agemos: 170,
        value: 23
      },
      {
        Agemos: 200,
        value: 24
      },
      {
        Agemos: 230,
        value: 30
      }
    ],
    head_circumference: []
  }

  /**
   * The default settings for the charts that will be displayed
   * @type {object}
   */
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

  const [chart1Data, setChart1Data] = useState([])
  const [chart1Settings, setChart1Settings] = useState(defaultSettings)
  const [chart2Data, setChart2Data] = useState([])
  const [chart2Settings, setChart2Settings] = useState(defaultSettings)
  const [chart3Data, setChart3Data] = useState([])
  const [chart3Settings, setChart3Settings] = useState(defaultSettings)

  /**
   * When the component mounts, fetch all the data for the charts
   */
  useEffect(() => {
    getChart1Data()
    getChart2Data()
    getChart3Data()
  }, [])

  /**
   * Fetch data from the API and get x and y min and max based on data
   * @param {string} filename - The filename to fetch data from
   * @returns {object} - return data, xMin, xMax, yMin, yMax
   */
  const fetchData = async (filename: string) => {
    const res = await fetch(`http://localhost:3001/production/get-data`, {
      method: 'post',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({
        file: filename
      })
    });
    let data = await res.json();
    // @ts-ignore
    data = data.filter((d: ChartData) => !isNaN(d.Agemos))
    const xMin = Math.min(...data.map((x: ChartData) => x.Agemos))
    const xMax = Math.max(...data.map((x: ChartData) => x.Agemos))
    const yMax = Math.max(...data.map((y: ChartData) => y.P97)) + 10
    const yMin = Math.min(...data.map((y: ChartData) => y.P3)) - 10

    return {
      data,
      xMin,
      xMax,
      yMin,
      yMax
    }
  }

  /**
   * Set Chart 1 settings & data
   */
  const getChart1Data = async () => {
    const res = await fetchData('weight-for-age');
    setChart1Settings({...chart1Settings, ...res})
    setChart1Data(res.data.filter((d: ChartData) => d.Sex === patient.sex.toString()))
  }

  /**
   * Set Chart 2 settings & data
   */
  const getChart2Data = async () => {
    const res = await fetchData('stature-for-age');
    setChart2Settings({...chart2Settings, ...res, confidenceAreaFill: '#d8b4fe', lineStroke: '#a855f7', height: 300})
    setChart2Data(res.data.filter((d: ChartData) => d.Sex === patient.sex.toString()))
  }

  /**
   * Set Chart 3 settings & data
   */
  const getChart3Data = async () => {
    const res = await fetchData('bmi-for-age');
    setChart3Settings({...chart3Settings, ...res, confidenceAreaFill: '#fed7aa', lineStroke: '#fb923c', height: 300})
    setChart3Data(res.data.filter((d: ChartData) => d.Sex === patient.sex.toString()))
  }

  return (
    <div className="App">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-4">
        <div className="col-span-1 lg:col-span-2">
          <Chart settings={chart1Settings} rangeData={chart1Data} patientData={patient.weight} label="Weight for Age" />
        </div>
        <div>
          <div className="mb-4">
            <Chart settings={chart2Settings} rangeData={chart2Data} patientData={patient.height} label="Stature for Age" />
          </div>
          <div>
            <Chart settings={chart3Settings} rangeData={chart3Data} patientData={patient.bmi} label="BMI for Age" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
