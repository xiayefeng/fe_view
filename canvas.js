const rc1 = rough.canvas(document.querySelector('canvas'));
const hillOpts1 = {roughness: 2.8, strokeWidth: 2, fill: 'blue'};
rc1.path('M76 256L176 156L276 256', hillOpts1);
rc1.path('M236 256L336 156L436 256', hillOpts1);
rc1.circle(256, 106, 105, {
  stroke: 'red',
  strokeWidth: 4,
  fill: 'rgba(255, 255, 0, 0.4)',
  fillStyle: 'solid',
});


const rc = rough.canvas(document.querySelector('canvas'));
const ctx = rc.ctx;
ctx.translate(256, 256);
ctx.scale(1, -1);

const hillOpts = {roughness: 2.8, strokeWidth: 2, fill: 'blue'};

rc.path('M-180 0L-80 100L20 0', hillOpts);
rc.path('M-20 0L80 100L180 0', hillOpts);

rc.circle(0, 150, 105, {
  stroke: 'red',
  strokeWidth: 4,
  fill: 'rgba(255,255, 0, 0.4)',
  fillStyle: 'solid',
});


ctx.translate(0, canvas.height);
ctx.scale(1, -1);
ctx.lineCap = 'round';


function drawBranch(context, v0, length, thickness, dir, bias) {
  // ...
  const v = new Vector2D(1, 0).rotate(dir).scale(length);
  const v1 = v0.copy().add(v);
 
  if(thickness > 2) {
    const left = dir + 0.2;
    drawBranch(context, v1, length * 0.9, thickness * 0.8, left, bias * 0.9);
    const right = dir - 0.2;
    drawBranch(context, v1, length * 0.9, thickness * 0.8, right, bias * 0.9);
  }
  if(thickness > 2) {
    const left = Math.PI / 4 + 0.5 * (dir + 0.2) + bias * (Math.random() - 0.5);
    drawBranch(context, v1, length * 0.9, thickness * 0.8, left, bias * 0.9);
    const right = Math.PI / 4 + 0.5 * (dir - 0.2) + bias * (Math.random() - 0.5);
    drawBranch(context, v1, length * 0.9, thickness * 0.8, right, bias * 0.9);
  }

  if(thickness < 5 && Math.random() < 0.3) {
    context.save();
    context.strokeStyle = '#c72c35';
    const th = Math.random() * 6 + 3;
    context.lineWidth = th;
    context.beginPath();
    context.moveTo(...v1);
    context.lineTo(v1.x, v1.y - 2);
    context.stroke();
    context.restore();
  }



}

class Vector2D {
  // ...  
  rotate(rad) {
    const c = Math.cos(rad),
      s = Math.sin(rad);
    const [x, y] = this;

    this.x = x * c + y * -s;
    this.y = x * s + y * c;

    return this;
  }
}

