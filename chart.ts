// import * as moment from 'moment';
import 'moment-timezone'

declare var Plotly: any;
declare var _: any;
declare var moment: any;

export const chartColour = {
  'PV Output': '#32CD32', //Lime green
  'Mini Grid Usage': '#388860', //Emerald Green
  'Grid': '#0000FF', //Blue
  'Battery Output': '#A020F0',  //Purple
  'Site Load': '#FFA500' //Orange
}

export const periods: Array<any> = [
  { value: 'L1H', label: 'Last hour' },
  { value: 'TD', label: 'Today' },
  { value: 'YD', label: 'Yesterday' },
  { value: 'L7D', label: 'Last 7 days' },
];

export const chartLayout = {
  full: {
    yaxis: { title: "Power Usage (W)" },       // set the y axis title
    yaxis2: {
      title: 'Power Usage (W)',
      overlaying: 'y',
      side: 'right'
    },
    xaxis: {
      title: `Time (${moment.tz.guess()} GMT${(moment().utcOffset() >= 0 ? '+' : '-') + moment().utcOffset() / 60})`,
      // title: `Time (UTC)`,
      showgrid: true,                  // remove the x-axis grid lines
      // tickformat: "%a %b %e %H:%M:%S %p %Y"              // customize the date format to "month, day"
    },
    margin: {                           // update the left, bottom, right, top margin
      l: 70, b: 70, r: 70, t: 0
    },
    // title: 'Power Usage',
    showlegend: true,
    legend: { "orientation": "h" }
  },
  lite: {
    yaxis: { title: "Power Usage (W)" },       // set the y axis title
    yaxis2: {
      title: 'Power Usage (W)',
      overlaying: 'y',
      side: 'right'
    },
    xaxis: {
      title: `Time (${moment.tz.guess()} GMT${(moment().utcOffset() >= 0 ? '+' : '-') + moment().utcOffset() / 60})`,
      // title: `Time (UTC)`,
      showgrid: true,                  // remove the x-axis grid lines
      // tickformat: "%a %b %e %H:%M:%S %p %Y"              // customize the date format to "month, day"
    },
    margin: {                           // update the left, bottom, right, top margin
      l: 60, b: 60, r: 70, t: 0
    },
    // title: 'Power Usage',
    showlegend: true,
    legend: { "orientation": "h" }
  }
}

export const chartOption = {
  full: {
    showLink: false,
    displaylogo: false,
    modeBarButtons: [['toImage', 'zoom2d', 'pan2d', 'zoomIn2d', 'zoomOut2d', 'autoScale2d', 'resetScale2d', 'hoverClosestCartesian', 'hoverCompareCartesian']],
    // modeBarButtonsToAdd: [{ name: 'test', click: (e) => { console.log(e) } }]
    // displayModeBar: true
  },
  lite: {
    showLink: false,
    displaylogo: false,
    modeBarButtons: [[]],
    // modeBarButtonsToAdd: [{ name: 'test', click: (e) => { console.log(e) } }]
    // displayModeBar: true
  }
}

function stackedArea(traces) {
  for (var i = 1; i < traces.length; i++) {
    for (var j = 0; j < (Math.min(traces[i]['y'].length, traces[i - 1]['y'].length)); j++) {
      traces[i]['y'][j] += traces[i - 1]['y'][j];
    }
  }
  return traces;
}

export function extendUsageChart(ele, prev_data, data, cb = null) {
  //max data length 721 for day
  //max data length 180 for last hour
  //max data length 503 for last 7 days

}

export function renderUsageChart(ele, data, layout = chartLayout.full, option = chartOption.full, cb = null) {
  // console.debug('START RENDERING CHART');

  if (data == null) return;

  (function () {
    var d3 = Plotly.d3;

    var WIDTH_IN_PERCENT_OF_PARENT = 100,
      HEIGHT_IN_PERCENT_OF_PARENT = 100;

    Plotly.purge(ele);

    var gd3 = d3.select(ele)
    gd3//.append('div')
      .style({
        width: WIDTH_IN_PERCENT_OF_PARENT + '%',
        'margin-left': (100 - WIDTH_IN_PERCENT_OF_PARENT) / 2 + '%',

        height: HEIGHT_IN_PERCENT_OF_PARENT + 'vh',
        'margin-top': (100 - HEIGHT_IN_PERCENT_OF_PARENT) / 2 + 'vh'
      });

    var gd = gd3.node();

    // console.log(data)


    // Plotly.d3.csv('https://raw.githubusercontent.com/plotly/datasets/master/wind_speed_laurel_nebraska.csv', function (rows) {
    // Plotly.d3.csv('http://localhost:3000/assets/mock-data/test1.csv', function (rows) {
    // Plotly.d3.csv.parse(data, function (rows) {

    let traces = [];
    let appliance = [];
    let dup = [];

    Object.keys(data).forEach(function (key, idx) {
      appliance.push({ value: key, label: key });
      let raw = data[key];
      let trace = {
        name: key,
        // type: 'scatter',                    // set the chart type
        mode: 'lines',                      // connect points with lines
        x: raw.map(function (row) {          // set the x-data
          return row['time'];
        }),
        y: raw.map(function (row) {          // set the y-data
          return row["usage"];
        }),
        line: {                             // set the width of the line.
          width: 2,
          shape: 'linear',
          color: chartColour[key]
        },
        // error_y: {
        //   array: raw.map(function (row) {    // set the height of the error bars
        //     return row['usage'];
        //   }),
        //   thickness: 0.5,                   // set the thickness of the error bars
        //   width: 0
        // }
      }

      if (key == 'PV Output')
        trace = Object.assign({ fill: 'tozeroy' }, trace);

      traces.push(trace)
      //create clone one just to get right y axis @_@
      let trace1 = Object.assign({ yaxis: 'y2', }, trace);
      traces.push(trace1)
      dup.push(idx * 2)
    });

    Plotly.newPlot(gd, traces, layout, option);
    // });

    window.onresize = function () {
      Plotly.Plots.resize(gd);
    };

    // gd.on('plotly_hover', function (data) {
    //   console.log(data)
    // })
    //   .on('plotly_unhover', function (data) {

    //   });

    //remove cloned traces
    Plotly.deleteTraces(gd, dup);

    if (cb) cb(appliance)

    // console.log(Plotly);

  })();


}