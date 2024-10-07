const canvas = document.querySelector('canvas');

const worker = new Worker('./random_shapes_worker.js');
const ofc = canvas.transferControlToOffscreen();
worker.postMessage({
  canvas: ofc,
  type: 'init',
}, [ofc]);

function draw(ctx, shapes) {
  const canvas = ctx.canvas;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for(let i = 0; i < COUNT; i++) {
    const shape = shapes[Math.floor(Math.random() * shapeTypes.length)];
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    ctx.drawImage(shape, x, y);
  }
  requestAnimationFrame(draw.bind(null, ctx, shapes));
}

self.addEventListener('message', (evt) => {
  if(evt.data.type === 'init') {
    const canvas = evt.data.canvas;
    if(canvas) {
      const ctx = canvas.getContext('2d');
      const shapes = createCache();
      draw(ctx, shapes);
    }
  }
});
