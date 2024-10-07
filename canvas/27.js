const shapeTypes = [3, 4, 5, 6, -1];
const COUNT = 1000;
const TAU = Math.PI * 2;

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for(let i = 0; i < COUNT; i++) {
    const type = shapeTypes[Math.floor(Math.random() * shapeTypes.length)];
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    if(type > 0) {
      // 画正多边形
      const points = regularShape(x, y, 10, type);
      drawShape(ctx, points);
    } else {
      // 画圆
      ctx.beginPath();
      ctx.arc(x, y, 10, 0, TAU);
      ctx.stroke();
      ctx.fill();
    }
  }
  requestAnimationFrame(draw);
}


function createCache() {
  const ret = [];
  for(let i = 0; i < shapeTypes.length; i++) {
    // 创建离屏Canvas缓存图形
    const cacheCanvas = new OffscreenCanvas(20, 20);
    // 将图形绘制到离屏Canvas对象上
    const type = shapeTypes[i];
    const context = cacheCanvas.getContext('2d');
    context.fillStyle = 'red';
    context.strokeStyle = 'black';
    if(type > 0) {
      const points = regularShape(10, 10, 10, type);
      drawShape(context, points);
    } else {
      context.beginPath();
      context.arc(10, 10, 10, 0, TAU);
      context.stroke();
      context.fill();
    }
    ret.push(cacheCanvas);
  }
  // 将离屏Canvas数组（缓存对象）返回
  return ret;
}

const shapes = createCache();
// const COUNT = 1000;

function draw2() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for(let i = 0; i < COUNT; i++) {
    const shape = shapes[Math.floor(Math.random() * shapeTypes.length)];
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    ctx.drawImage(shape, x, y);
  }
  requestAnimationFrame(draw);
}

// 分层渲染 
function drawRandomTriangle(path, context) {
  const {width, height} = context.canvas;
  context.save();
  context.translate(Math.random() * width, Math.random() * height);
  context.fill(path);
  context.restore();
}

function drawBackground(context, count = 2000) {
  context.fillStyle = '#ed7';
  const d = 'M0,0L0,10L8.66, 5z';
  const p = new Path2D(d);
  for(let i = 0; i < count; i++) {
    drawRandomTriangle(p, context);
  }
}

function loadImage(src) {
  const img = new Image();
  img.crossOrigin = 'anonymous';
  return new Promise((resolve) => {
    img.onload = resolve(img);
    img.src = src;
  });
}

async function drawForeground(context) {
  const img = await loadImage('http://p3.qhimg.com/t015b85b72445154fe0.png');
  const {width, height} = context.canvas;
  function update(t) {
    context.clearRect(0, 0, width, height);
    context.save();
    context.translate(0, 0.5 * height);
    const p = (t % 3000) / 3000;
    const x = width * p;
    const y = 0.1 * height * Math.sin(3 * Math.PI * p);
    context.drawImage(img, x, y);
    context.restore();
    requestAnimationFrame(update);
  }
  update(0);
}

const bgcanvas = document.querySelector('#bg');
const fgcanvas = document.querySelector('#fg');
drawBackground(bgcanvas.getContext('2d'));
drawForeground(fgcanvas.getContext('2d'));
