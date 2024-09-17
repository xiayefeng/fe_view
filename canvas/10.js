import {Timing} from './9.js';
import {Animator} from '../common/lib/animator/index.js';

export class Animator {
  constructor({duration, iterations}) {
    this.timing = {duration, iterations};
  }

  animate(target, update) {
    let frameIndex = 0;
    const timing = new Timing(this.timing);

    return new Promise((resolve) => {
      function next() {
        if(update({target, frameIndex, timing}) !== false && !timing.isFinished) {
          requestAnimationFrame(next);
        } else {
          resolve(timing);
        }
        frameIndex++;
      }
      next();
    });
  }
}


export class Timing {
  constructor({duration, iterations = 1, easing = p => p} = {}) {
    this.startTime = Date.now();
    this.duration = duration;
    this.iterations = iterations;
    this.easing = easing;
  }

  get time() {
    return Date.now() - this.startTime;
  }

  get p() {
    const progress = Math.min(this.time / this.duration, this.iterations);
    return this.isFinished ? 1 : this.easing(progress % 1);
  }

  get isFinished() {
    return this.time / this.duration >= this.iterations;
  }
}



const block = document.querySelector('.block');
const animator = new Animator({duration: 3000, easing: p => p ** 2});
document.addEventListener('click', () => {
  animator.animate({el: block, start: 100, end: 400}, ({target: {el, start, end}, timing: {p}}) => {
    const left = start * (1 - p) + end * p;
    el.style.left = `${left}px`;
  });
});
