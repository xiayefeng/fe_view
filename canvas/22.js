const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const WIDTH = canvas.width;
const HEIGHT = canvas.height;

function randomColor() {
  return `hsl(${Math.random() * 360}, 100%, 50%)`;
}

function drawCircle(context, radius) {
  const x = Math.random() * WIDTH;
  const y = Math.random() * HEIGHT;
  const fillColor = randomColor();
  context.fillStyle = fillColor;
  context.beginPath();
  context.arc(x, y, radius, 0, Math.PI * 2);
  context.fill();
}

function draw(context, count = 500, radius = 10) {
  for(let i = 0; i < count; i++) {
    drawCircle(context, radius);
  }
}

requestAnimationFrame(function update() {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
  draw(ctx);
  requestAnimationFrame(update);
});
