class Ball {
  pos = createVector(0, 0);
  r;
  fill = 0;
  offsetPos = createVector(0, 0);

  constructor(x, y, diameter, options) {
    this.pos.set(x, y);
    this.r = 0.5 * diameter;
    if (options?.fill) this.fill = options.fill;
  }

  isHovered(mouse) {
    const minDistSq = this.r ** 2;
    const fromThisToMouseVec = p5.Vector.sub(mouse, this.pos);
    const distSq = fromThisToMouseVec.magSq();
    return distSq < minDistSq;
  }

  onGrab(mouse) {
    this.offsetPos = p5.Vector.sub(this.pos, mouse);
  }

  onDrag(mouse) {
    this.pos = p5.Vector.add(mouse, this.offsetPos);
  }

  show(isHovered) {
    push();
    if (isHovered) {
      stroke(this.fill);
      noFill();
    } else {
      fill(this.fill);
      noStroke();
    }
    circle(this.pos.x, this.pos.y, this.r * 2);
    if (DEBUG) {
      fill('#FF0000');
      noStroke();
      circle(this.pos.x - this.offsetPos.x, this.pos.y - this.offsetPos.y, 10);
    }
    pop();
  }
}
