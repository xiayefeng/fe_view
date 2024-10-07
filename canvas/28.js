ctx.filter = 'blur(5px)';

// 创建离屏的 Canvas
const ofc = new OffscreenCanvas(canvas.width, canvas.height);
const octx = ofc.getContext('2d');
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  octx.clearRect(0, 0, canvas.width, canvas.height);
  // 将图形不应用滤镜，绘制到离屏Canvas上
  for(let i = 0; i < COUNT; i++) {
    const shape = shapes[Math.floor(Math.random() * shapeTypes.length)];
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    octx.drawImage(shape, x, y);
  }
  // 再将离屏Canvas图像绘制到画布上，这一次绘制采用了滤镜
  ctx.drawImage(ofc, 0, 0);
  requestAnimationFrame(draw);
}

draw();
