// const { Chart, Line, Legend, Tooltip, Axis } = qcharts;
import { Chart, Line, Tooltip, Legend, Tooltip, Axis } from '@qcharts/core'
const chart = new Chart({
  container: '#app'
});
let clientRect={bottom:50};
chart.source(dataset, {
  row: 'category',
  value: 'temperature',
  text: 'date'
});

const line = new Line({clientRect});
const axisBottom = new Axis({clientRect}).style('grid', false);
axisBottom.attr('formatter', d => '');
const toolTip = new Tooltip({
  title: arr => {
    return arr.category
  }
});
const legend = new Legend();
const axisLeft = new Axis({ orient: 'left',clientRect }).style('axis', false).style('scale', false);

chart.append([line, axisBottom, axisLeft, toolTip, legend]);


const rawData = await (await fetch('beijing_2014.csv')).text();
const data = d3.csvParse(rawData).filter(d => new Date(d.Date).getMonth() < 3);
const dataset1 = data
  .map(d => {
    return {
      value: Number(d['Temperature(Celsius)(avg)']),
      date: d.Date,
      category: '平均气温'}
    });
const dataset2 = data
  .map(d => {
      return {
        value: Number(d['Humidity(%)(avg)']),
        date: d.Date,
        category: '平均湿度'}
      });

      chart.source([...dataset1, ...dataset2], {
        row: 'category',
        value: 'value',
        text: 'date'
      });
      