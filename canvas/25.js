const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

// 创建正多边形，返回顶点
function regularShape(x, y, r, edges = 3) {
  const points = [];
  const delta = 2 * Math.PI / edges;
  for(let i = 0; i < edges; i++) {
    const theta = i * delta;
    points.push([x + r * Math.sin(theta), y + r * Math.cos(theta)]);
  }
  return points;
}

// 根据顶点绘制图形
function drawShape(context, points) {
  context.fillStyle = 'red';
  context.strokeStyle = 'black';
  context.lineWidth = 2;
  context.beginPath();
  context.moveTo(...points[0]);
  for(let i = 1; i < points.length; i++) {
    context.lineTo(...points[i]);
  }
  context.closePath();
  context.stroke();
  context.fill();
}

// 多边形类型，包括正三角形、正四边形、正五边形、正六边形和正100边形
const shapeTypes = [3, 4, 5, 6, 100];
const COUNT = 1000;

// 执行绘制
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for(let i = 0; i < COUNT; i++) {
    const type = shapeTypes[Math.floor(Math.random() * shapeTypes.length)];
    const points = regularShape(Math.random() * canvas.width,
      Math.random() * canvas.height, 10, type);
    drawShape(ctx, points);
  }
  requestAnimationFrame(draw);
}

draw();

