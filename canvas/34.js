const rawData = await (await fetch('beijing_2014.csv')).text();
const data = d3.csvParse(rawData);
console.log(data);
const dataset = data
  .map(d => {
    return {
      temperature: Number(d['Temperature(Celsius)(avg)']),
      humdity: Number(d['Humidity(%)(avg)']),
      category: '平均气温与湿度'}
    });

const { Chart, Scatter, Legend, Tooltip, Axis } = qcharts;
const chart = new Chart({
  container: '#app'
});
let clientRect={bottom:50};
chart.source(dataset, {
  row: 'category',
  value: 'temperature',
  text: 'humdity'
});

const scatter = new Scatter({
  clientRect,
  showGuideLine: true,
});
const toolTip = new Tooltip({
  title: (data) => '温度与湿度：',
  formatter: (data) => {
    return `温度：${data.temperature}C  湿度：${data.humdity}% `
  }
});
const legend = new Legend();
const axisLeft = new Axis({ orient: 'left',clientRect }).style('axis', false).style('scale', false);
const axisBottom = new Axis();

chart.append([scatter, axisBottom, axisLeft, toolTip, legend]);


{
const dataset = data
  .map(d => {
    return {
      value: Number(d['Temperature(Celsius)(avg)']),
      tdp: Number(d['Dew Point(Celsius)(avg)']),
      category: '平均气温与露点'}
    });
const dataset2 = data
  .map(d => {
    return {
      value: Number(d['Humidity(%)(avg)']),
      tdp: Number(d['Dew Point(Celsius)(avg)']),
      category: '平均湿度与露点'}
    });
   
// ...
chart.source([...dataset, ...dataset2], {
  row: 'category',
  value: 'value',
  text: 'tdp'
});
}
