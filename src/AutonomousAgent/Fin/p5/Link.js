class Link {
  constructor(x, y, d) {
    this.pos = createVector(x, y);
    this.r = 0.5 * d;
  }

  chain(other) {
    const toOtherVec = p5.Vector.sub(other.pos, this.pos);
    toOtherVec.setMag(this.r);
    other.move(this.pos.x + toOtherVec.x, this.pos.y + toOtherVec.y);
  }

  move(x, y) {
    this.pos.set(x, y);
  }

  show() {
    stroke(0);
    noFill();
    circle(this.pos.x, this.pos.y, this.r * 2);
    fill(0);
    circle(this.pos.x, this.pos.y, 4);
  }
}
