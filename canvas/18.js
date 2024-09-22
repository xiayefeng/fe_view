function drawPolyline(context, points, {lineWidth = 1, lineJoin = 'miter', lineCap = 'butt'} = {}) {
  context.lineWidth = lineWidth;
  context.lineJoin = lineJoin;
  context.lineCap = lineCap;
  context.beginPath();
  context.moveTo(...points[0]);
  for(let i = 1; i < points.length; i++) {
    context.lineTo(...points[i]);
  }
  context.stroke();
}

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const points = [
  [100, 100],
  [100, 200],
  [200, 150],
  [300, 200],
  [300, 100],
];
ctx.strokeStyle = 'red';
drawPolyline(ctx, points, {lineWidth: 10});
ctx.strokeStyle = 'blue';
drawPolyline(ctx, points);

ctx.strokeStyle = 'red';
drawPolyline(ctx, points, {lineWidth: 10, lineCap: 'round', lineJoin: 'bevel'});

function drawPolyline(context, points, {lineWidth = 1, lineJoin = 'miter', lineCap = 'butt', miterLimit = 10} = {}) {
  context.lineWidth = lineWidth;
  context.lineJoin = lineJoin;
  context.lineCap = lineCap;
  context.miterLimit = miterLimit;
  context.beginPath();
  context.moveTo(...points[0]);
  for(let i = 1; i < points.length; i++) {
    context.lineTo(...points[i]);
  }
  context.stroke();
}

ctx.strokeStyle = 'red';
drawPolyline(ctx, points, {lineWidth: 10, lineCap: 'round', lineJoin: 'miter', miterLimit: 1.5});
