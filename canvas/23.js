function randomColor() {
  return `hsl(${Math.random() * 360}, 100%, 50%)`;
}

const root = document.querySelector('svg');
const COUNT = 500;
const WIDTH = 500;
const HEIGHT = 500;

function initCircles(count = COUNT) {
  for(let i = 0; i < count; i++) {
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    root.appendChild(circle);
  }
  return [...root.querySelectorAll('circle')];
}
const circles = initCircles();

function drawCircle(circle, radius = 10) {
  const x = Math.random() * WIDTH;
  const y = Math.random() * HEIGHT;
  const fillColor = randomColor();
  circle.setAttribute('cx', x);
  circle.setAttribute('cy', y);
  circle.setAttribute('r', radius);
  circle.setAttribute('fill', fillColor);
}

function draw() {
  for(let i = 0; i < COUNT; i++) {
    drawCircle(circles[i]);
  }
  requestAnimationFrame(draw);
}

draw();

