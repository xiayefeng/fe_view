const block = document.querySelector('.block');
const startAngle = 0;
const T = 2000;
let startTime = null;
function update() {
  startTime = startTime == null ? Date.now() : startTime;
  const p = (Date.now() - startTime) / T;
  const angle = startAngle + p * 360;
  block.style.transform = `rotate(${angle}deg)`;
  requestAnimationFrame(update);
}
update();


export class Timing {
  constructor({duration, iterations = 1} = {}) {
    this.startTime = Date.now();
    this.duration = duration;
    this.iterations = iterations;
  }

  get time() {
    return Date.now() - this.startTime;
  }

  get p() {
    const progress = Math.min(this.time / this.duration, this.iterations);
    return this.isFinished ? 1 : progress % 1;
  }

  get isFinished() {
    return this.time / this.duration >= this.iterations;
  }
}
